'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, PaperPlaneTilt, Spinner, CheckCircle, Plus,
  ArrowClockwise, Lightning, Users, Sword,
} from '@phosphor-icons/react'

type ModelMode = 'claude' | 'gpt' | 'gemini' | 'council' | 'debate'

interface CouncilCard {
  model: string
  text: string
}

interface DebateResult {
  claude: string
  gpt: string
  gemini: string
  synthesis: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  commands?: ExecutedCommand[]
  council?: CouncilCard[]
  debate?: DebateResult
  id: string
}

interface ExecutedCommand {
  action: string
  result: Record<string, unknown> | null
}

const ACTION_LABELS: Record<string, string> = {
  add_task: 'Task added',
  update_task_status: 'Task updated',
  update_goal_progress: 'Goal progress updated',
  add_capture: 'Capture saved',
}

const MODEL_LABELS: Record<string, string> = {
  claude: 'Claude',
  gpt: 'GPT-4o',
  gemini: 'Gemini',
}

const MODEL_COLORS: Record<string, string> = {
  claude: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  gpt: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  gemini: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
}

function CommandBadge({ cmd }: { cmd: ExecutedCommand }) {
  const label = ACTION_LABELS[cmd.action] ?? cmd.action
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-emerald-900/40 bg-emerald-950/40 px-2.5 py-1 text-[10px] font-mono text-emerald-400">
      <CheckCircle size={10} weight="fill" />
      {label}
    </div>
  )
}

function ModelBadge({ model }: { model: string }) {
  const colors = MODEL_COLORS[model] ?? 'text-zinc-400 border-zinc-700 bg-zinc-800'
  return (
    <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider border ${colors}`}>
      {MODEL_LABELS[model] ?? model}
    </span>
  )
}

function CouncilResponse({ cards }: { cards: CouncilCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map(card => (
        <div key={card.model} className="rounded-xl border border-zinc-700/60 bg-zinc-800 p-3 space-y-2">
          <ModelBadge model={card.model} />
          <p className="text-xs leading-relaxed text-zinc-200">{card.text}</p>
        </div>
      ))}
    </div>
  )
}

function DebateResponse({ debate }: { debate: DebateResult }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {(['claude', 'gpt', 'gemini'] as const).map(m => (
          <div key={m} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 space-y-1.5">
            <ModelBadge model={m} />
            <p className="text-[11px] leading-relaxed text-zinc-400">{debate[m]}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 space-y-1.5">
        <span className="text-[9px] font-mono uppercase tracking-wider text-amber-400">Synthesis</span>
        <p className="text-xs leading-relaxed text-zinc-200">{debate.synthesis}</p>
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  if (msg.council) {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-2">
          <Users size={13} className="text-zinc-500" />
          <span className="text-[10px] font-mono text-zinc-500">Council</span>
        </div>
        <CouncilResponse cards={msg.council} />
      </motion.div>
    )
  }
  if (msg.debate) {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-2">
          <Sword size={13} className="text-zinc-500" />
          <span className="text-[10px] font-mono text-zinc-500">Debate</span>
        </div>
        <DebateResponse debate={msg.debate} />
        {msg.commands && msg.commands.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {msg.commands.map((cmd, i) => <CommandBadge key={i} cmd={cmd} />)}
          </div>
        )}
      </motion.div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}
    >
      {!isUser && (
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400">
          <Brain size={12} weight="fill" className="text-zinc-950" />
        </div>
      )}
      <div className="max-w-[80%] space-y-2">
        <div
          className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
            isUser
              ? 'rounded-br-sm bg-amber-400 font-medium text-zinc-950'
              : 'rounded-bl-sm border border-zinc-700/60 bg-zinc-800 text-zinc-200'
          }`}
        >
          {msg.content}
        </div>
        {msg.commands && msg.commands.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-1">
            {msg.commands.map((cmd, i) => <CommandBadge key={i} cmd={cmd} />)}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const SUGGESTIONS = [
  'What should I focus on today?',
  'Add a task to review Madison Block blockers',
  'What goals need attention?',
  'Capture: need to follow up with the concrete supplier',
]

const MODEL_MODES: { id: ModelMode; label: string; icon?: React.ReactNode }[] = [
  { id: 'claude', label: 'Claude' },
  { id: 'gpt', label: 'GPT-4o' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'council', label: 'Council' },
  { id: 'debate', label: 'Debate' },
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState<ModelMode>('claude')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const nextMessageId = useRef(0)

  const allocateMessageId = () => {
    nextMessageId.current += 1
    return nextMessageId.current.toString()
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = { role: 'user', content, id: allocateMessageId() }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
        model,
      }),
    })

    const data = await res.json()

    let assistantMsg: Message
    if (data.council) {
      assistantMsg = {
        role: 'assistant',
        content: '',
        council: data.council,
        commands: data.commands ?? [],
        id: allocateMessageId(),
      }
    } else if (data.debate) {
      assistantMsg = {
        role: 'assistant',
        content: '',
        debate: data.debate,
        commands: data.commands ?? [],
        id: allocateMessageId(),
      }
    } else {
      assistantMsg = {
        role: 'assistant',
        content: data.text ?? 'Something went wrong.',
        commands: data.commands ?? [],
        id: allocateMessageId(),
      }
    }

    setMessages(ms => [...ms, assistantMsg])
    setLoading(false)
  }

  const clear = () => setMessages([])

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-zinc-800/60 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lightning size={16} className="text-amber-400" weight="fill" />
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Assistant</span>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clear}
              className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 transition-colors hover:text-zinc-400"
            >
              <ArrowClockwise size={12} />
              Clear
            </button>
          )}
        </div>

        {/* Model selector */}
        <div className="mt-3 flex gap-1 overflow-x-auto">
          {MODEL_MODES.map(({ id, label }) => {
            const isActive = model === id
            const isCouncil = id === 'council'
            const isDebate = id === 'debate'
            return (
              <button
                key={id}
                onClick={() => setModel(id)}
                className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-mono tracking-wider transition-colors ${
                  isActive
                    ? isDebate
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : isCouncil
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                      : 'bg-amber-400 text-zinc-950 font-semibold'
                    : 'border border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {isCouncil && <Users size={10} />}
                {isDebate && <Sword size={10} />}
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full flex-col items-center justify-center gap-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10">
              <Brain size={24} className="text-amber-400" weight="duotone" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium text-zinc-300">What do you need?</p>
              <p className="text-xs text-zinc-600">Ask anything. I can update goals, add tasks, capture ideas.</p>
            </div>
            <div className="grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-left transition-colors hover:border-zinc-700"
                >
                  <Plus size={11} className="shrink-0 text-amber-400" />
                  <span className="text-[11px] text-zinc-400">{s}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
          </AnimatePresence>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400">
              <Brain size={12} weight="fill" className="text-zinc-950" />
            </div>
            <div className="rounded-2xl rounded-bl-sm border border-zinc-700/60 bg-zinc-800 px-4 py-3">
              <Spinner size={14} className="animate-spin text-amber-400" />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-zinc-800/60 px-4 pb-4 pt-2">
        <div className="flex items-end gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 transition-colors focus-within:border-amber-400/40">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Ask or instruct..."
            rows={1}
            className="max-h-32 flex-1 resize-none bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
            style={{ height: 'auto' }}
            onInput={e => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = `${el.scrollHeight}px`
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 transition-opacity disabled:opacity-30"
          >
            <PaperPlaneTilt size={14} weight="fill" className="text-zinc-950" />
          </button>
        </div>
        <p className="mt-2 text-center text-[9px] font-mono text-zinc-700">Enter to send | Shift+Enter for new line</p>
      </div>
    </div>
  )
}
