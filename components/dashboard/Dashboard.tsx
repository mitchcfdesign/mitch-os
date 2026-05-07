'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Target, CheckSquare, Lightning, Brain, HardHat,
  Warning, Sparkle, Circle, Clock, CheckCircle,
} from '@phosphor-icons/react'

interface Goal {
  id: string
  title: string
  progress: number
  status: string
  target_date: string | null
  color: string
  phase: string | null
}

interface Task {
  id: string
  title: string
  status: string
  priority: string
  category: string | null
  due_date: string | null
}

interface Capture {
  id: string
  type: string
  content: string
  source: string
  created_at: string
}

function taskIcon(status: string) {
  if (status === 'done') return <CheckCircle size={12} className="text-emerald-400" weight="fill" />
  if (status === 'in_progress') return <Clock size={12} className="text-amber-400" weight="fill" />
  if (status === 'blocked') return <Warning size={12} className="text-rose-400" weight="fill" />
  return <Circle size={12} className="text-zinc-600" />
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [captures, setCaptures] = useState<Capture[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => {
        setGoals(d.goals ?? [])
        setTasks(d.tasks ?? [])
        setCaptures(d.recentCaptures ?? [])
        setLoading(false)
      })
  }, [])

  const todoCount = tasks.filter(t => t.status === 'todo').length
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length
  const blockedCount = tasks.filter(t => t.status === 'blocked').length

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      {/* Desktop bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-[1400px] mx-auto">

        {/* Daily Huddle — wide */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="md:col-span-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="text-lg font-semibold text-zinc-100 mt-0.5">{greeting()}, Mitch</h1>
            </div>
            <Lightning size={20} className="text-amber-400" weight="fill" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-800/60 rounded-xl p-3 text-center">
              <p className="text-2xl font-mono font-bold text-zinc-100">{todoCount}</p>
              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">To Do</p>
            </div>
            <div className="bg-amber-950/40 border border-amber-900/40 rounded-xl p-3 text-center">
              <p className="text-2xl font-mono font-bold text-amber-400">{inProgressCount}</p>
              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">In Progress</p>
            </div>
            <div className={`rounded-xl p-3 text-center ${blockedCount > 0 ? 'bg-rose-950/40 border border-rose-900/40' : 'bg-zinc-800/60'}`}>
              <p className={`text-2xl font-mono font-bold ${blockedCount > 0 ? 'text-rose-400' : 'text-zinc-100'}`}>{blockedCount}</p>
              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Blocked</p>
            </div>
          </div>

          {/* Top open tasks */}
          <div className="space-y-2">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-zinc-800/60 rounded-lg animate-pulse" />
              ))
            ) : tasks.slice(0, 4).map(task => (
              <div key={task.id} className="flex items-center gap-2.5 py-1.5">
                {taskIcon(task.status)}
                <span className="text-xs text-zinc-300 flex-1 truncate">{task.title}</span>
                {task.priority === 'high' && (
                  <span className="text-[9px] font-mono text-rose-400 border border-rose-900/40 rounded px-1.5 py-0.5">high</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* For You */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Sparkle size={14} className="text-amber-400" weight="fill" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">For You</span>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/40">
              <p className="text-xs text-zinc-300 leading-relaxed">
                You have {inProgressCount} task{inProgressCount !== 1 ? 's' : ''} in progress. Focus mode is one tap away.
              </p>
            </div>
            {goals.length > 0 && (
              <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/40">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  "{goals[0]?.title}" is at {goals[0]?.progress ?? 0}% — add a task to move it forward.
                </p>
              </div>
            )}
            {captures.length > 0 && (
              <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/40">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {captures.length} recent capture{captures.length !== 1 ? 's' : ''} waiting to be organized.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Field Status */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="md:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <HardHat size={14} className="text-amber-400" weight="fill" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Field</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-zinc-200">Madison Block</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-mono text-amber-400">active</span>
            </div>
            <div className="pt-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-600">Floors</span>
                <span className="text-[10px] font-mono text-zinc-400">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-600">Crew</span>
                <span className="text-[10px] font-mono text-zinc-400">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-rose-500">Blockers</span>
                <span className="text-[10px] font-mono text-rose-400">4</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="md:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Target size={14} className="text-amber-400" weight="fill" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Goals</span>
          </div>
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 bg-zinc-800 rounded animate-pulse w-3/4" />
                <div className="h-1.5 bg-zinc-800 rounded-full animate-pulse" />
              </div>
            ))
          ) : goals.map((goal, i) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-300 truncate flex-1">{goal.title}</span>
                <span className="text-[10px] font-mono text-zinc-600 ml-2">{goal.progress}%</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: goal.color ?? '#f59e0b' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tasks summary */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <CheckSquare size={14} className="text-amber-400" weight="fill" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Tasks</span>
          </div>
          <div className="space-y-2">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-7 bg-zinc-800/60 rounded-lg animate-pulse" />
              ))
            ) : tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center gap-2 py-1 border-b border-zinc-800/60 last:border-0">
                {taskIcon(task.status)}
                <span className="text-xs text-zinc-400 flex-1 truncate">{task.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent captures */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="md:col-span-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-amber-400" weight="fill" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Recent Captures</span>
          </div>
          {loading ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className="h-14 bg-zinc-800/60 rounded-xl animate-pulse" />
            ))
          ) : captures.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-xs text-zinc-600">No captures yet — tap the brain button to add one.</p>
            </div>
          ) : captures.map((cap, i) => (
            <motion.div
              key={cap.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/40 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider">{cap.type}</span>
                <span className="text-[9px] font-mono text-zinc-600">{formatDate(cap.created_at)}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{cap.content}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Knowledge graph placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="md:col-span-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 min-h-[180px]"
        >
          <Brain size={28} className="text-zinc-700" weight="duotone" />
          <p className="text-xs font-mono text-zinc-600">Knowledge graph — Phase 6</p>
          <p className="text-[10px] text-zinc-700 text-center max-w-[200px]">
            Force-directed node graph of everything you know comes here.
          </p>
        </motion.div>

      </div>
    </div>
  )
}
