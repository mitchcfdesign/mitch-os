'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Path, Trophy, Lightbulb, BookOpen, Heart, Warning,
  Plus, X, Sparkle, Spinner, CaretDown, CaretUp,
} from '@phosphor-icons/react'

interface JourneyLog {
  id: string
  title: string
  content: string
  log_type: string
  goal_id: string | null
  related_task_id: string | null
  created_at: string
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; colors: string }> = {
  milestone: {
    label: 'Milestone',
    icon: <Trophy size={13} weight="fill" />,
    colors: 'text-amber-400 bg-amber-950/40 border-amber-900/40',
  },
  win: {
    label: 'Win',
    icon: <Heart size={13} weight="fill" />,
    colors: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/40',
  },
  lesson: {
    label: 'Lesson',
    icon: <BookOpen size={13} weight="fill" />,
    colors: 'text-blue-400 bg-blue-950/40 border-blue-900/40',
  },
  reflection: {
    label: 'Reflection',
    icon: <Lightbulb size={13} weight="fill" />,
    colors: 'text-violet-400 bg-violet-950/40 border-violet-900/40',
  },
  setback: {
    label: 'Setback',
    icon: <Warning size={13} weight="fill" />,
    colors: 'text-rose-400 bg-rose-950/40 border-rose-900/40',
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function TypeBadge({ type }: { type: string }) {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.reflection
  return (
    <span className={`flex items-center gap-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded-lg border ${cfg.colors}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

function LogCard({ log }: { log: JourneyLog }) {
  const [expanded, setExpanded] = useState(false)
  const [angles, setAngles] = useState<string | null>(null)
  const [loadingAngles, setLoadingAngles] = useState(false)

  const generateAngles = async () => {
    if (angles) { setExpanded(true); return }
    setLoadingAngles(true)
    setExpanded(true)
    const res = await fetch('/api/journey/angle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: log.title, content: log.content, log_type: log.log_type }),
    })
    const d = await res.json()
    setAngles(d.angles ?? 'Could not generate angles.')
    setLoadingAngles(false)
  }

  return (
    <motion.div layout className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <TypeBadge type={log.log_type} />
            <h3 className="text-sm font-semibold text-zinc-100 leading-snug mt-1.5">{log.title}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{log.content}</p>
          </div>
          <span className="text-[9px] font-mono text-zinc-700 shrink-0 mt-0.5">{formatDate(log.created_at)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generateAngles}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-[10px] font-mono text-amber-400 hover:bg-amber-400/20 transition-colors"
          >
            <Sparkle size={10} weight="fill" />
            Content angles
          </button>
          {angles && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {expanded ? <CaretUp size={13} /> : <CaretDown size={13} />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-zinc-800/60 px-4 pb-4 pt-3"
          >
            {loadingAngles ? (
              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <Spinner size={12} className="animate-spin text-amber-400" />
                Generating angles...
              </div>
            ) : (
              <div className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono">
                {angles}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function AddLogSheet({ onAdd, onClose }: {
  onAdd: (log: JourneyLog) => void
  onClose: () => void
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [logType, setLogType] = useState('milestone')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!title.trim() || !content.trim() || saving) return
    setSaving(true)
    const res = await fetch('/api/journey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), content: content.trim(), log_type: logType }),
    })
    const d = await res.json()
    if (d.log) { onAdd(d.log); onClose() }
    setSaving(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">New Entry</span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-800 transition-colors">
            <X size={16} className="text-zinc-500" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setLogType(key)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono transition-colors border ${
                logType === key ? cfg.colors : 'bg-zinc-800 text-zinc-500 border-zinc-700/60 hover:text-zinc-300'
              }`}
            >
              {cfg.icon}
              {cfg.label}
            </button>
          ))}
        </div>

        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title..."
          className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-amber-400/40 transition-colors"
        />

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && e.metaKey && submit()}
          placeholder="What happened? What did you learn?"
          rows={4}
          className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none resize-none focus:border-amber-400/40 transition-colors"
        />

        <button
          onClick={submit}
          disabled={!title.trim() || !content.trim() || saving}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 text-zinc-950 text-sm font-semibold disabled:opacity-40 transition-opacity"
        >
          {saving ? <Spinner size={16} className="animate-spin" /> : 'Save Entry'}
        </button>
      </motion.div>
    </>
  )
}

export default function JourneyPage() {
  const [logs, setLogs] = useState<JourneyLog[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('all')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetch('/api/journey')
      .then(r => r.json())
      .then(d => { setLogs(d.logs ?? []); setLoading(false) })
  }, [])

  const filtered = typeFilter === 'all' ? logs : logs.filter(l => l.log_type === typeFilter)

  const counts = Object.keys(TYPE_CONFIG).reduce((acc, t) => ({
    ...acc, [t]: logs.filter(l => l.log_type === t).length,
  }), {} as Record<string, number>)

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Path size={18} className="text-amber-400" weight="fill" />
            <h1 className="text-base font-semibold text-zinc-100">Journey</h1>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 text-zinc-950 text-xs font-semibold"
          >
            <Plus size={13} weight="bold" />
            Add entry
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <div key={key} className={`rounded-xl p-2.5 text-center border ${cfg.colors}`}>
              <p className="text-lg font-mono font-bold">{counts[key] ?? 0}</p>
              <div className="flex justify-center mt-0.5">{cfg.icon}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-colors ${
              typeFilter === 'all'
                ? 'bg-amber-400 text-zinc-950 font-semibold'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            All ({logs.length})
          </button>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-colors ${
                typeFilter === key
                  ? 'bg-amber-400 text-zinc-950 font-semibold'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Path size={28} className="text-zinc-800 mx-auto" weight="duotone" />
              <p className="text-xs text-zinc-600">No entries yet — add your first milestone, win, or reflection.</p>
            </div>
          ) : filtered.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <LogCard log={log} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {adding && (
          <AddLogSheet
            onAdd={log => setLogs(ls => [log, ...ls])}
            onClose={() => setAdding(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
