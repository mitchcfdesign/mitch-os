'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Circle, CheckCircle, PauseCircle, CaretDown, CaretUp } from '@phosphor-icons/react'

interface Goal {
  id: string
  title: string
  progress: number
  status: string
  target_date: string | null
  color: string
  phase: string | null
  created_at: string
}

const STATUS_ORDER = ['active', 'paused', 'complete']

function statusIcon(s: string) {
  if (s === 'complete') return <CheckCircle size={16} weight="fill" className="text-emerald-400" />
  if (s === 'paused') return <PauseCircle size={16} weight="fill" className="text-zinc-500" />
  return <Circle size={16} weight="fill" className="text-amber-400" />
}

function statusLabel(s: string) {
  if (s === 'complete') return 'text-emerald-400'
  if (s === 'paused') return 'text-zinc-500'
  return 'text-amber-400'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function GoalCard({ goal, onProgressChange }: {
  goal: Goal
  onProgressChange: (id: string, progress: number) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [localProgress, setLocalProgress] = useState(goal.progress)
  const [saving, setSaving] = useState(false)

  const saveProgress = async (val: number) => {
    setSaving(true)
    await fetch('/api/goals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: goal.id, progress: val }),
    })
    setSaving(false)
    onProgressChange(goal.id, val)
  }

  return (
    <motion.div
      layout
      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full p-5 flex items-start gap-4 text-left"
      >
        <div className="mt-0.5 shrink-0">{statusIcon(goal.status)}</div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-semibold text-zinc-100 leading-snug">{goal.title}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] font-mono uppercase ${statusLabel(goal.status)}`}>
                {goal.status}
              </span>
              {expanded
                ? <CaretUp size={12} className="text-zinc-600" />
                : <CaretDown size={12} className="text-zinc-600" />
              }
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${localProgress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: goal.color ?? '#f59e0b' }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-600">
                {goal.phase ? `Phase ${goal.phase}` : ''}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">{localProgress}%</span>
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-zinc-800/60 px-5 pb-5 pt-4 space-y-4"
          >
            {goal.target_date && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-600 font-mono">Target</span>
                <span className="text-zinc-400 font-mono">{formatDate(goal.target_date)}</span>
              </div>
            )}

            {/* Progress slider */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Update Progress</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={localProgress}
                  onChange={e => setLocalProgress(Number(e.target.value))}
                  onMouseUp={() => saveProgress(localProgress)}
                  onTouchEnd={() => saveProgress(localProgress)}
                  className="flex-1 accent-amber-400"
                />
                <span className="text-xs font-mono text-zinc-400 w-8 text-right">{localProgress}%</span>
              </div>
              {saving && <span className="text-[10px] font-mono text-zinc-600">Saving…</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetch('/api/goals')
      .then(r => r.json())
      .then(d => {
        setGoals(d.goals ?? [])
        setLoading(false)
      })
  }, [])

  const handleProgressChange = (id: string, progress: number) => {
    setGoals(gs => gs.map(g => g.id === id ? { ...g, progress } : g))
  }

  const filtered = filter === 'all'
    ? [...goals].sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))
    : goals.filter(g => g.status === filter)

  const activeCount = goals.filter(g => g.status === 'active').length
  const avgProgress = goals.length
    ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
    : 0

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Target size={18} className="text-amber-400" weight="fill" />
          <h1 className="text-base font-semibold text-zinc-100">Goals</h1>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
            <p className="text-xl font-mono font-bold text-zinc-100">{activeCount}</p>
            <p className="text-[10px] font-mono text-zinc-600 mt-0.5">Active</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
            <p className="text-xl font-mono font-bold text-amber-400">{avgProgress}%</p>
            <p className="text-[10px] font-mono text-zinc-600 mt-0.5">Avg Progress</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
            <p className="text-xl font-mono font-bold text-emerald-400">
              {goals.filter(g => g.status === 'complete').length}
            </p>
            <p className="text-[10px] font-mono text-zinc-600 mt-0.5">Complete</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5">
          {['all', 'active', 'paused', 'complete'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors ${
                filter === f
                  ? 'bg-amber-400 text-zinc-950 font-semibold'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Goal list */}
        <div className="space-y-3">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-xs text-zinc-600">No goals in this category yet.</p>
            </div>
          ) : filtered.map((goal, i) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <GoalCard goal={goal} onProgressChange={handleProgressChange} />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}
