'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, X, PaperPlaneTilt, Spinner } from '@phosphor-icons/react'

const CATEGORIES = [
  'Idea', 'Reflection', 'Philosophy', 'Learning', 'Task',
  'Goal Update', 'Resource', 'Contact', 'Project', 'Update', 'Work',
]

export default function BrainDump() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [category, setCategory] = useState('Idea')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async () => {
    if (!text.trim() || loading) return
    setLoading(true)

    await fetch('/api/brain/raw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: category, content: text.trim(), source: 'brain-dump' }),
    })

    setLoading(false)
    setSent(true)
    setText('')
    setTimeout(() => {
      setSent(false)
      setOpen(false)
    }, 1200)
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-6 z-40 w-12 h-12 rounded-full bg-amber-400 shadow-lg shadow-amber-400/20 flex items-center justify-center"
      >
        <Brain size={20} weight="fill" className="text-zinc-950" />
      </motion.button>

      {/* Capture sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-zinc-950/80 z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 36 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 rounded-t-2xl p-5 space-y-4 md:max-w-lg md:left-1/2 md:-translate-x-1/2 md:rounded-2xl md:bottom-12 md:border md:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Brain Dump</span>
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-zinc-800 transition-colors">
                  <X size={16} className="text-zinc-500" />
                </button>
              </div>

              <textarea
                autoFocus
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && e.metaKey && submit()}
                placeholder="What's on your mind..."
                rows={4}
                className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none resize-none focus:border-amber-400/40 transition-colors"
              />

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-mono transition-colors ${
                      category === cat
                        ? 'bg-amber-400 text-zinc-950 font-semibold'
                        : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300 border border-zinc-700/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={submit}
                disabled={!text.trim() || loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 text-zinc-950 text-sm font-semibold disabled:opacity-40 transition-opacity"
              >
                {loading ? (
                  <Spinner size={16} className="animate-spin" />
                ) : sent ? (
                  'Captured'
                ) : (
                  <>
                    <PaperPlaneTilt size={16} weight="fill" />
                    Capture
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
