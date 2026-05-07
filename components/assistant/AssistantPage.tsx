'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, PaperPlaneTilt, Spinner, CheckCircle, Plus,
  ArrowClockwise, Lightning,
} from '@phosphor-icons/react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  commands?: ExecutedCommand[]
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

function CommandBadge({ cmd }: { cmd: ExecutedCommand }) {
  const label = ACTION_LABELS[cmd.action] ?? cmd.action
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 rounded-lg px-2.5 py-1">
      <CheckCircle size={10} weight="fill" />
      {label}
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}
    >
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <Brain size={12} weight="fill" className="text-zinc-950" />
        </div>
      )}
      <div className={`max-w-[80%] space-y-2`}>
        <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
          isUser
            ? 'bg-amber-400 text-zinc-950 font-medium rounded-br-sm'
            : 'bg-zinc-800 text-zinc-200 border border-zinc-700/60 rounded-bl-sm'
        }`}>
          {msg.content}
        </div>
        {msg.commands && msg.commands.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-1">
            {msg.commands.map((cmd, i) => (
              <CommandBadge key={i} cmd={cmd} />
            ))}
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

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = { role: 'user', content, id: Date.now().toString() }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
      }),
    })

    const data = await res.json()
    const assistantMsg: Message = {
      role: 'assistant',
      content: data.text ?? 'Something went wrong.',
      commands: data.commands ?? [],
      id: (Date.now() + 1).toString(),
    }
    setMessages(ms => [...ms, assistantMsg])
    setLoading(false)
  }

  const clear = () => setMessages([])

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <Lightning size={16} className="text-amber-400" weight="fill" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Assistant</span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clear}
            className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <ArrowClockwise size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full gap-6"
          >
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
              <Brain size={24} className="text-amber-400" weight="duotone" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-zinc-300 font-medium">What do you need?</p>
              <p className="text-xs text-zinc-600">Ask anything. I can update goals, add tasks, capture ideas.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-left transition-colors"
                >
                  <Plus size={11} className="text-amber-400 shrink-0" />
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
            <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
              <Brain size={12} weight="fill" className="text-zinc-950" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-zinc-800 border border-zinc-700/60">
              <Spinner size={14} className="text-amber-400 animate-spin" />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 shrink-0 border-t border-zinc-800/60">
        <div className="flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 focus-within:border-amber-400/40 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
            }}
            placeholder="Ask or instruct..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none resize-none max-h-32"
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
            className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center shrink-0 disabled:opacity-30 transition-opacity"
          >
            <PaperPlaneTilt size={14} weight="fill" className="text-zinc-950" />
          </button>
        </div>
        <p className="text-[9px] font-mono text-zinc-700 text-center mt-2">Enter to send · Shift+Enter for new line</p>
      </div>

    </div>
  )
}
