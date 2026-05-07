import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

const SYSTEM_PROMPT = `You are Mitch's personal OS assistant — direct, concise, and action-oriented. You have full access to his goals, tasks, and recent captures.

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

export async function POST(req: Request) {
  const { messages } = await req.json()
  if (!messages?.length) return NextResponse.json({ error: 'messages required' }, { status: 400 })

  const ctx = await getContext()

  const contextBlock = `Current context:
Goals (active): ${ctx.goals.map(g => `[${g.id}] ${g.title} — ${g.progress}%`).join(', ') || 'none'}
Tasks (open): ${ctx.tasks.map(t => `[${t.id}] ${t.title} (${t.status}, ${t.priority})`).join(', ') || 'none'}
Recent captures: ${ctx.recentCaptures.map(c => `${c.type}: ${c.content.slice(0, 60)}`).join(' | ') || 'none'}`

  const systemWithContext = `${SYSTEM_PROMPT}\n\n${contextBlock}`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemWithContext,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''

  // Parse and execute commands
  const commandMatch = raw.match(/<commands>([\s\S]*?)<\/commands>/)
  const text = raw.replace(/<commands>[\s\S]*?<\/commands>/, '').trim()

  const executedCommands: unknown[] = []
  if (commandMatch) {
    try {
      const cmds = JSON.parse(commandMatch[1].trim())
      for (const cmd of cmds) {
        const result = await executeCommand(cmd)
        if (result) executedCommands.push(result)
      }
    } catch {
      // malformed JSON — ignore commands, still return text
    }
  }

  return NextResponse.json({ text, commands: executedCommands })
}
