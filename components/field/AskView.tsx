'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperPlaneTilt, Microphone, Spinner } from '@phosphor-icons/react'
import type { Project } from '@/lib/types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const QUICK_ACTIONS = [
  'What can my crew do this week?',
  'Fire code for rated corridor walls',
  'Step-by-step: ceiling ledger on sloped floor',
  'Header size for 6ft opening, bearing wall',
  'Fire blocking requirements in stud bays',
]

const SAMPLE_RESPONSES: Record<string, string> = {
  'What can my crew do this week?':
    "Based on current project state, here's what's unblocked on Floor 4:\n\n" +
    "- Units 4F and 4G - ceiling framing (ready once 4A is done)\n" +
    "- North Corridor - fire blocking + backing for door hardware\n" +
    "- East Stairwell - fire blocking at penetrations\n" +
    "- 4B punch-out once Ricky and Cole finish partitions\n\n" +
    "Units 4C and 4D remain blocked on concrete repair. That's about 3 days of ceiling work for 4 carpenters sitting idle. Recommend pushing the GC for a concrete sub schedule today.",
  'Fire code for rated corridor walls':
    "IBC Section 708 - Fire Partitions:\n\n" +
    "- Assembly: 2x4 wood studs at 16\" OC, 5/8\" Type X gypsum both sides (UL L501 or similar)\n" +
    "- Fire blocking required every 10 LF horizontal and at all floor/ceiling lines per IBC 718\n" +
    "- Penetrations: all pipe, conduit, and duct penetrations require listed firestop assemblies\n" +
    "- No butt joints in the gypsum - stagger by minimum 24\"\n\n" +
    "Verify with your local AHJ before treating that as the final assembly requirement for this project.",
}

interface AskViewProps {
  project: Project
}

export default function AskView({ project }: AskViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `I know ${project.name}. ${project.floors.length} floors, ${project.crew.length} carpenters, ${project.blockers.length} active blockers. Ask me anything - code questions, step-by-steps, or what your crew should do next.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const msgCounter = useRef(0)

  const nextId = () => `msg-${++msgCounter.current}`
  const projectSummary = `${project.name} has ${project.floors.length} floors, ${project.crew.length} crew members, and ${project.blockers.length} active blockers.`

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || loading) return

    const userMsg: Message = { id: nextId(), role: 'user', content }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 900 + Math.random() * 600))

    const response =
      SAMPLE_RESPONSES[content] ??
      `${projectSummary}\n\nI don't have a real project-aware code engine wired in yet, so treat this as a generic pointer, not a verified project answer. Start with the applicable code section, then confirm the exact assembly, occupancy, and local amendments with the GC, architect, or AHJ before acting.\n\nWant me to walk through a specific detail?`

    const assistantMsg: Message = { id: nextId(), role: 'assistant', content: response }
    setMessages(prev => [...prev, assistantMsg])
    setLoading(false)
  }, [loading, projectSummary])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-amber-400 text-zinc-950 font-medium rounded-br-sm'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl rounded-bl-sm px-4 py-3">
              <Spinner size={14} className="text-zinc-500 animate-spin" />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action}
              onClick={() => sendMessage(action)}
              className="shrink-0 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 hover:border-amber-400/40 hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 pb-4 pt-2 border-t border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-amber-400/40 transition-colors">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Ask a code question or what to do next..."
            className="flex-1 bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 outline-none font-sans"
          />
          <button
            className="p-1 rounded-lg hover:bg-zinc-800 transition-colors"
            title="Voice input"
          >
            <Microphone size={16} className="text-zinc-600 hover:text-zinc-400 transition-colors" />
          </button>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="p-1 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-30"
          >
            <PaperPlaneTilt size={16} className="text-amber-400" weight="fill" />
          </button>
        </div>
      </div>
    </div>
  )
}
