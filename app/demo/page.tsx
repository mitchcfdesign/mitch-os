'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SquaresFour, HardHat, BookOpen, Target, CheckSquare,
  Path, Lightning, Brain, Sparkle, Circle, Clock,
  Warning, CheckCircle, ArrowUp,
} from '@phosphor-icons/react'

const NAV = [
  { label: 'Dashboard', icon: <SquaresFour size={16} weight="fill" /> },
  { label: 'Field', icon: <HardHat size={16} weight="fill" /> },
  { label: 'Ask', icon: <Lightning size={16} weight="fill" /> },
  { label: 'Goals', icon: <Target size={16} weight="fill" /> },
  { label: 'Tasks', icon: <CheckSquare size={16} weight="fill" /> },
  { label: 'Knowledge', icon: <BookOpen size={16} weight="fill" /> },
  { label: 'Journey', icon: <Path size={16} weight="fill" /> },
]

const GOALS = [
  { title: 'Launch Mitch OS v2', progress: 82 },
  { title: 'Royal Built payroll SaaS', progress: 41 },
  { title: 'YouTube — first 10 videos', progress: 20 },
]

const TASKS = [
  { title: 'Wire Field Status to live Supabase data', status: 'in_progress', priority: 'high' },
  { title: 'Review Codex changes from this morning', status: 'todo', priority: 'high' },
  { title: 'Record intro video for channel', status: 'todo', priority: 'medium' },
  { title: 'Push Richardson Electric proposal', status: 'blocked', priority: 'high' },
]

function statusIcon(s: string) {
  if (s === 'done') return <CheckCircle size={14} weight="fill" style={{ color: 'rgba(255,255,255,0.9)' }} />
  if (s === 'in_progress') return <Clock size={14} weight="fill" style={{ color: '#f97316' }} />
  if (s === 'blocked') return <Warning size={14} weight="fill" style={{ color: 'rgba(255,255,255,0.35)' }} />
  return <Circle size={14} style={{ color: 'rgba(255,255,255,0.18)' }} />
}

export default function DemoPage() {
  const [active, setActive] = useState('Dashboard')

  return (
    <div className="flex min-h-[100dvh]" style={{ background: '#080808' }}>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 py-8 px-4">
        <div className="px-2 mb-8">
          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Mitch OS
          </span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className="relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150"
              style={{
                color: active === label ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.38)',
                background: active === label ? 'rgba(255,255,255,0.08)' : 'transparent',
                fontWeight: active === label ? 500 : 400,
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto py-10 px-8">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Wednesday, May 7
            </p>
            <h1 className="text-3xl font-semibold tracking-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>
              Good morning, Mitch.
            </h1>
          </motion.div>

          {/* Stats row — no boxes, just numbers */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="flex gap-10"
          >
            {[
              { label: 'To do', value: '5', muted: false },
              { label: 'In progress', value: '3', accent: true },
              { label: 'Blocked', value: '1', muted: true },
            ].map(({ label, value, accent, muted }) => (
              <div key={label}>
                <p className="text-4xl font-semibold tracking-tight"
                  style={{ color: accent ? '#f97316' : muted ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.9)' }}>
                  {value}
                </p>
                <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Tasks */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <p className="text-xs font-medium mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Tasks
            </p>
            <div className="space-y-px">
              {TASKS.map((task, i) => (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.04 }}
                  className="flex items-center gap-3 py-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {statusIcon(task.status)}
                  <span
                    className="flex-1 text-sm"
                    style={{
                      color: task.status === 'done'
                        ? 'rgba(255,255,255,0.22)'
                        : task.status === 'blocked'
                        ? 'rgba(255,255,255,0.4)'
                        : 'rgba(255,255,255,0.82)',
                      textDecoration: task.status === 'done' ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </span>
                  {task.priority === 'high' && task.status !== 'done' && (
                    <ArrowUp size={11} style={{ color: 'rgba(255,255,255,0.22)' }} />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Goals */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
          >
            <p className="text-xs font-medium mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Goals
            </p>
            <div className="space-y-5">
              {GOALS.map((goal, i) => (
                <motion.div
                  key={goal.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      {goal.title}
                    </span>
                    <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.28)' }}>
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="h-px w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 0.9, delay: 0.3 + i * 0.06, ease: [0.25, 1, 0.5, 1] }}
                      className="h-full rounded-full"
                      style={{ background: goal.progress > 70 ? '#f97316' : 'rgba(255,255,255,0.45)' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* For You */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkle size={12} weight="fill" style={{ color: 'rgba(255,255,255,0.3)' }} />
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>For you</p>
            </div>
            <div className="space-y-2">
              {[
                '3 tasks in progress. You have momentum.',
                '"Launch Mitch OS v2" is at 82% — one push and it\'s done.',
                '2 recent captures waiting to be organized.',
              ].map((text, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {text}
                </p>
              ))}
            </div>
          </motion.section>

        </div>
      </main>

      {/* Brain button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: '#f97316',
          boxShadow: '0 4px 24px rgba(249,115,22,0.3), 0 1px 4px rgba(0,0,0,0.4)',
        }}
      >
        <Brain size={20} weight="fill" className="text-white" />
      </motion.button>
    </div>
  )
}
