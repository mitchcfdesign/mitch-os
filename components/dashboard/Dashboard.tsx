'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Target, CheckSquare, Lightning, Brain, HardHat,
  Warning, Sparkle, Circle, Clock, CheckCircle, CalendarBlank,
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

interface ScheduleItem {
  id: string
  content: string
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
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => {
        setGoals(d.goals ?? [])
        setTasks(d.tasks ?? [])
        setCaptures(d.recentCaptures ?? [])
        setSchedule(d.schedule ?? [])
        setLoading(false)
      })
  }, [])

  const todoCount = tasks.filter(t => t.status === 'todo').length
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length
  const blockedCount = tasks.filter(t => t.status === 'blocked').length

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 md:grid-cols-12">

        {/* Daily Huddle */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 md:col-span-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="mt-0.5 text-lg font-semibold text-zinc-100">{greeting()}, Mitch</h1>
            </div>
            <Lightning size={20} className="text-amber-400" weight="fill" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-zinc-800/60 p-3 text-center">
              <p className="text-2xl font-mono font-bold text-zinc-100">{todoCount}</p>
              <p className="mt-0.5 text-[10px] font-mono text-zinc-500">To Do</p>
            </div>
            <div className="rounded-xl border border-amber-900/40 bg-amber-950/40 p-3 text-center">
              <p className="text-2xl font-mono font-bold text-amber-400">{inProgressCount}</p>
              <p className="mt-0.5 text-[10px] font-mono text-zinc-500">In Progress</p>
            </div>
            <div className={`rounded-xl p-3 text-center ${blockedCount > 0 ? 'border border-rose-900/40 bg-rose-950/40' : 'bg-zinc-800/60'}`}>
              <p className={`text-2xl font-mono font-bold ${blockedCount > 0 ? 'text-rose-400' : 'text-zinc-100'}`}>{blockedCount}</p>
              <p className="mt-0.5 text-[10px] font-mono text-zinc-500">Blocked</p>
            </div>
          </div>

          <div className="space-y-2">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded-lg bg-zinc-800/60" />
              ))
            ) : tasks.slice(0, 4).map(task => (
              <div key={task.id} className="flex items-center gap-2.5 py-1.5">
                {taskIcon(task.status)}
                <span className="flex-1 truncate text-xs text-zinc-300">{task.title}</span>
                {task.priority === 'high' && (
                  <span className="rounded border border-rose-900/40 px-1.5 py-0.5 text-[9px] font-mono text-rose-400">high</span>
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
          className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 md:col-span-4"
        >
          <div className="flex items-center gap-2">
            <Sparkle size={14} className="text-amber-400" weight="fill" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">For You</span>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-zinc-700/40 bg-zinc-800/60 p-3">
              <p className="text-xs leading-relaxed text-zinc-300">
                You have {inProgressCount} task{inProgressCount !== 1 ? 's' : ''} in progress. Focus mode is one tap away.
              </p>
            </div>
            {goals.length > 0 && (
              <div className="rounded-xl border border-zinc-700/40 bg-zinc-800/60 p-3">
                <p className="text-xs leading-relaxed text-zinc-300">
                  &ldquo;{goals[0]?.title}&rdquo; is at {goals[0]?.progress ?? 0}% and needs a next action.
                </p>
              </div>
            )}
            {captures.length > 0 && (
              <div className="rounded-xl border border-zinc-700/40 bg-zinc-800/60 p-3">
                <p className="text-xs leading-relaxed text-zinc-300">
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
          className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 md:col-span-3"
        >
          <div className="flex items-center gap-2">
            <HardHat size={14} className="text-amber-400" weight="fill" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Field</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-zinc-200">Madison Block</p>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              <span className="text-[10px] font-mono text-amber-400">active</span>
            </div>
            <div className="space-y-1.5 pt-1">
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
          className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 md:col-span-5"
        >
          <div className="flex items-center gap-2">
            <Target size={14} className="text-amber-400" weight="fill" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Goals</span>
          </div>
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-800" />
                <div className="h-1.5 animate-pulse rounded-full bg-zinc-800" />
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
                <span className="flex-1 truncate text-xs text-zinc-300">{goal.title}</span>
                <span className="ml-2 text-[10px] font-mono text-zinc-600">{goal.progress}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
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

        {/* Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 md:col-span-4"
        >
          <div className="flex items-center gap-2">
            <CheckSquare size={14} className="text-amber-400" weight="fill" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Tasks</span>
          </div>
          <div className="space-y-2">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="mb-1.5 h-7 animate-pulse rounded-lg bg-zinc-800/60" />
              ))
            ) : tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center gap-2 border-b border-zinc-800/60 py-1 last:border-0">
                {taskIcon(task.status)}
                <span className="flex-1 truncate text-xs text-zinc-400">{task.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Captures */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 md:col-span-6"
        >
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-amber-400" weight="fill" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Recent Captures</span>
          </div>
          {loading ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-zinc-800/60" />
            ))
          ) : captures.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-xs text-zinc-600">No captures yet. Tap the brain button to add one.</p>
            </div>
          ) : captures.map((cap, i) => (
            <motion.div
              key={cap.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="space-y-1 rounded-xl border border-zinc-700/40 bg-zinc-800/40 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-wider text-amber-400">{cap.type}</span>
                <span className="text-[9px] font-mono text-zinc-600">{formatDate(cap.created_at)}</span>
              </div>
              <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">{cap.content}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 md:col-span-6"
        >
          <div className="flex items-center gap-2">
            <CalendarBlank size={14} className="text-amber-400" weight="fill" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Schedule</span>
          </div>
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-zinc-800/60" />
            ))
          ) : schedule.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <CalendarBlank size={24} className="text-zinc-700" weight="duotone" />
              <p className="text-xs text-zinc-600">No schedule events yet.</p>
              <p className="text-[10px] text-zinc-700 text-center max-w-[200px]">
                Lindy will populate this when calendar events are captured.
              </p>
            </div>
          ) : schedule.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 + i * 0.04 }}
              className="flex items-start gap-3 border-b border-zinc-800/60 py-2 last:border-0"
            >
              <span className="mt-0.5 text-[9px] font-mono text-zinc-600 shrink-0">{formatDate(item.created_at)}</span>
              <p className="text-xs text-zinc-400 leading-snug line-clamp-2">{item.content}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
