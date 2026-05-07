import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '@/lib/supabase'
import { requireSameOrigin } from '@/lib/route-auth'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const geminiClient = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '')

async function getContext() {
  const [goalsRes, tasksRes, capturesRes] = await Promise.all([
    supabase.from('goals').select('id, title, progress, status').eq('status', 'active'),
    supabase.from('tasks').select('id, title, status, priority').neq('status', 'done').limit(20),
    supabase.from('raw_captures').select('type, content').order('created_at', { ascending: false }).limit(5),
  ])
  return {
    goals: goalsRes.data ?? [],
    tasks: tasksRes.data ?? [],
    recentCaptures: capturesRes.data ?? [],
  }
}

async function executeCommand(cmd: { action: string; payload: Record<string, unknown> }) {
  switch (cmd.action) {
    case 'add_task': {
      const { data } = await supabase
        .from('tasks')
        .insert({ title: cmd.payload.title, priority: cmd.payload.priority ?? 'medium', status: 'todo' })
        .select()
        .single()
      return { action: 'add_task', result: data }
    }
    case 'update_task_status': {
      const { data } = await supabase
        .from('tasks')
        .update({ status: cmd.payload.status })
        .eq('id', cmd.payload.id)
        .select()
        .single()
      return { action: 'update_task_status', result: data }
    }
    case 'update_goal_progress': {
      const { data } = await supabase
        .from('goals')
        .update({ progress: cmd.payload.progress })
        .eq('id', cmd.payload.id)
        .select()
        .single()
      return { action: 'update_goal_progress', result: data }
    }
    case 'add_capture': {
      const { data } = await supabase
        .from('raw_captures')
        .insert({ type: cmd.payload.type ?? 'Idea', content: cmd.payload.content, source: 'assistant' })
        .select()
        .single()
      return { action: 'add_capture', result: data }
    }
    default:
      return null
  }
}

const BASE_SYSTEM = `You are Mitch's personal OS assistant — direct, concise, and action-oriented. You have full access to his goals, tasks, and recent captures.

When the user asks you to take an action (add a task, update progress, mark something done, capture a thought), respond with:
1. A short natural language confirmation
2. A JSON block at the END of your response in this exact format:

<commands>
[
  {"action": "add_task", "payload": {"title": "...", "priority": "high|medium|low"}},
  {"action": "update_task_status", "payload": {"id": "...", "status": "todo|in_progress|blocked|done"}},
  {"action": "update_goal_progress", "payload": {"id": "...", "progress": 75}},
  {"action": "add_capture", "payload": {"type": "Idea", "content": "..."}}
]
</commands>

Only include the <commands> block when you are actually taking an action. For questions or analysis, just respond naturally.

Keep responses tight. No fluff, no unnecessary hedging. You know Mitch's context — use it.`

function buildSystemWithContext(ctx: Awaited<ReturnType<typeof getContext>>) {
  const contextBlock = `Current context:
Goals (active): ${ctx.goals.map(g => `[${g.id}] ${g.title} — ${g.progress}%`).join(', ') || 'none'}
Tasks (open): ${ctx.tasks.map(t => `[${t.id}] ${t.title} (${t.status}, ${t.priority})`).join(', ') || 'none'}
Recent captures: ${ctx.recentCaptures.map(c => `${c.type}: ${c.content.slice(0, 60)}`).join(' | ') || 'none'}`
  return `${BASE_SYSTEM}\n\n${contextBlock}`
}

type ChatMessage = { role: 'user' | 'assistant'; content: string }

async function callClaude(system: string, messages: ChatMessage[]): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  })
  return response.content[0].type === 'text' ? response.content[0].text : ''
}

async function callGPT(system: string, messages: ChatMessage[]): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: system },
      ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ],
  })
  return response.choices[0]?.message?.content ?? ''
}

async function callGemini(system: string, messages: ChatMessage[]): Promise<string> {
  const model = geminiClient.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  const lastMessage = messages[messages.length - 1]?.content ?? ''
  const chat = model.startChat({
    systemInstruction: system,
    history,
  })
  const result = await chat.sendMessage(lastMessage)
  return result.response.text()
}

function parseAndStripCommands(raw: string): { text: string; cmds: Array<{ action: string; payload: Record<string, unknown> }> } {
  const commandMatch = raw.match(/<commands>([\s\S]*?)<\/commands>/)
  const text = raw.replace(/<commands>[\s\S]*?<\/commands>/, '').trim()
  if (!commandMatch) return { text, cmds: [] }
  try {
    return { text, cmds: JSON.parse(commandMatch[1].trim()) }
  } catch {
    return { text, cmds: [] }
  }
}

export async function POST(req: Request) {
  const unauthorized = requireSameOrigin(req)
  if (unauthorized) return unauthorized

  const { messages, model = 'claude' } = await req.json() as { messages: ChatMessage[]; model?: string }
  if (!messages?.length) return NextResponse.json({ error: 'messages required' }, { status: 400 })

  const ctx = await getContext()
  const system = buildSystemWithContext(ctx)

  // Single model modes
  if (model === 'claude' || model === 'gpt' || model === 'gemini') {
    const caller = model === 'claude' ? callClaude : model === 'gpt' ? callGPT : callGemini
    const raw = await caller(system, messages)
    const { text, cmds } = parseAndStripCommands(raw)
    const executedCommands: unknown[] = []
    for (const cmd of cmds) {
      const result = await executeCommand(cmd)
      if (result) executedCommands.push(result)
    }
    return NextResponse.json({ text, commands: executedCommands, model })
  }

  // Council mode — all three in parallel
  if (model === 'council') {
    const [claudeRaw, gptRaw, geminiRaw] = await Promise.all([
      callClaude(system, messages).catch(() => 'Claude unavailable.'),
      callGPT(system, messages).catch(() => 'GPT unavailable.'),
      callGemini(system, messages).catch(() => 'Gemini unavailable.'),
    ])
    return NextResponse.json({
      council: [
        { model: 'claude', text: parseAndStripCommands(claudeRaw).text },
        { model: 'gpt', text: parseAndStripCommands(gptRaw).text },
        { model: 'gemini', text: parseAndStripCommands(geminiRaw).text },
      ],
      commands: [],
    })
  }

  // Debate mode — Claude leads, GPT+Gemini react, Claude synthesizes
  if (model === 'debate') {
    const claudeInitial = await callClaude(system, messages).catch(() => 'Claude unavailable.')
    const { text: claudeText } = parseAndStripCommands(claudeInitial)

    const debateSystem = `${system}\n\nClaude just responded to the same prompt with:\n"${claudeText}"\n\nChallenge, critique, or add what Claude missed. Be direct and specific.`

    const [gptReaction, geminiReaction] = await Promise.all([
      callGPT(debateSystem, messages).catch(() => 'GPT unavailable.'),
      callGemini(debateSystem, messages).catch(() => 'Gemini unavailable.'),
    ])

    const synthesisMessages: ChatMessage[] = [
      ...messages,
      {
        role: 'assistant',
        content: `Your initial response: ${claudeText}\n\nGPT-4o challenged: ${gptReaction}\n\nGemini challenged: ${geminiReaction}\n\nNow synthesize a final answer incorporating the strongest points from all three.`,
      },
    ]
    const synthRaw = await callClaude(system, synthesisMessages).catch(() => claudeText)
    const { text: finalText, cmds } = parseAndStripCommands(synthRaw)

    const executedCommands: unknown[] = []
    for (const cmd of cmds) {
      const result = await executeCommand(cmd)
      if (result) executedCommands.push(result)
    }

    return NextResponse.json({
      debate: {
        claude: claudeText,
        gpt: gptReaction,
        gemini: geminiReaction,
        synthesis: finalText,
      },
      commands: executedCommands,
    })
  }

  return NextResponse.json({ error: 'unknown model' }, { status: 400 })
}
