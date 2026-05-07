'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  SquaresFour, HardHat, BookOpen, Target, CheckSquare,
  Path, Lightning, Brain, Sparkle, Circle, Clock,
  Warning, CheckCircle, ArrowUp,
} from '@phosphor-icons/react'

const NAV = [
  { label: 'Dashboard', icon: <SquaresFour size={18} weight="fill" /> },
  { label: 'Field', icon: <HardHat size={18} weight="fill" /> },
  { label: 'Ask', icon: <Lightning size={18} weight="fill" /> },
  { label: 'Goals', icon: <Target size={18} weight="fill" /> },
  { label: 'Tasks', icon: <CheckSquare size={18} weight="fill" /> },
  { label: 'Knowledge', icon: <BookOpen size={18} weight="fill" /> },
  { label: 'Journey', icon: <Path size={18} weight="fill" /> },
]

const GOALS = [
  { title: 'Launch Mitch OS v2', progress: 82, color: '#f97316' },
  { title: 'Royal Built payroll SaaS', progress: 41, color: '#fb923c' },
  { title: 'YouTube — first 10 videos', progress: 20, color: '#fdba74' },
]

const TASKS = [
  { title: 'Wire Field Status to live Supabase data', status: 'in_progress', priority: 'high' },
  { title: 'Review Codex changes from this morning', status: 'todo', priority: 'high' },
  { title: 'Record intro video for channel', status: 'todo', priority: 'medium' },
  { title: 'Push Richardson Electric proposal', status: 'blocked', priority: 'high' },
]

// accent: #f97316 (orange-500) — warm, premium, distinct from amber
const A = '#f97316'
const A2 = '#fb923c'
const A_DIM = 'rgba(249,115,22,0.18)'
const A_BORDER = 'rgba(249,115,22,0.28)'

function statusIcon(s: string) {
  if (s === 'done') return <CheckCircle size={12} weight="fill" style={{ color: A }} />
  if (s === 'in_progress') return <Clock size={12} weight="fill" style={{ color: A2 }} />
  if (s === 'blocked') return <Warning size={12} weight="fill" className="text-rose-400" />
  return <Circle size={12} style={{ color: 'rgba(120,113,108,0.6)' }} />
}

export default function DemoPage() {
  const [active, setActive] = useState('Dashboard')

  return (
    <div
      className="flex min-h-[100dvh]"
      style={{ background: 'linear-gradient(150deg, #0e0b08 0%, #110e0a 55%, #0f0c0b 100%)' }}
    >
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-52 shrink-0 py-6 px-3 gap-1"
        style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="px-3 mb-5">
          <span className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'rgba(168,162,158,0.35)' }}>
            Mitch OS
          </span>
        </div>
        {NAV.map(({ label, icon }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-200"
            style={{
              color: active === label ? '#fafaf9' : 'rgba(168,162,158,0.45)',
              background: active === label
                ? 'rgba(249,115,22,0.1)'
                : 'transparent',
              border: active === label ? `1px solid ${A_BORDER}` : '1px solid transparent',
              boxShadow: active === label ? 'inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
            }}
          >
            <span style={{ color: active === label ? A : 'rgba(120,113,108,0.5)' }}>{icon}</span>
            <span className="uppercase">{label}</span>
            {active === label && (
              <motion.div
                layoutId="glow"
                className="absolute left-0 inset-y-0 w-0.5 rounded-full"
                style={{ background: `linear-gradient(to bottom, ${A}, ${A2})` }}
              />
            )}
          </button>
        ))}
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-5 md:p-7">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Daily Huddle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="md:col-span-8 rounded-2xl p-5 space-y-4"
            style={{
              background: 'rgba(20,16,12,0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 32px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest"
                  style={{ color: 'rgba(168,162,158,0.4)' }}>
                  Wednesday, May 7, 2026
                </p>
                <h1 className="text-lg font-semibold mt-0.5" style={{ color: '#fafaf9' }}>
                  Good morning, Mitch
                </h1>
              </div>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${A}, ${A2})`,
                  boxShadow: `0 0 16px rgba(249,115,22,0.35)`,
                }}>
                <Lightning size={15} weight="fill" className="text-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'To Do', value: 5, bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', color: '#e7e5e4' },
                { label: 'In Progress', value: 3, bg: A_DIM, border: A_BORDER, color: A },
                { label: 'Blocked', value: 1, bg: 'rgba(244,63,94,0.07)', border: 'rgba(244,63,94,0.18)', color: '#fb7185' },
              ].map(({ label, value, bg, border, color }) => (
                <div key={label} className="rounded-xl p-3 text-center"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <p className="text-2xl font-mono font-bold" style={{ color }}>{value}</p>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: 'rgba(168,162,158,0.5)' }}>{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              {TASKS.slice(0, 3).map(task => (
                <div key={task.title} className="flex items-center gap-2.5 py-1.5">
                  {statusIcon(task.status)}
                  <span className="text-xs flex-1 truncate" style={{ color: 'rgba(231,229,228,0.8)' }}>
                    {task.title}
                  </span>
                  {task.priority === 'high' && (
                    <div className="flex items-center gap-1 rounded-md px-1.5 py-0.5"
                      style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.18)' }}>
                      <ArrowUp size={9} className="text-rose-400" />
                      <span className="text-[9px] font-mono text-rose-400">high</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* For You */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 rounded-2xl p-5 space-y-3"
            style={{
              background: 'rgba(18,14,10,0.8)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkle size={13} weight="fill" style={{ color: A }} />
              <span className="text-[10px] font-mono uppercase tracking-widest"
                style={{ color: 'rgba(168,162,158,0.45)' }}>For You</span>
            </div>
            {[
              '3 tasks in progress. You have momentum.',
              '"Launch Mitch OS v2" is at 82% — one push and it\'s done.',
              '2 recent captures waiting to be organized.',
            ].map((text, i) => (
              <div key={i} className="p-3 rounded-xl text-xs leading-relaxed"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  color: 'rgba(214,211,209,0.75)',
                }}>
                {text}
              </div>
            ))}
          </motion.div>

          {/* Goals */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="md:col-span-5 rounded-2xl p-5 space-y-4"
            style={{
              background: 'rgba(18,14,10,0.8)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <div className="flex items-center gap-2">
              <Target size={13} weight="fill" style={{ color: A }} />
              <span className="text-[10px] font-mono uppercase tracking-widest"
                style={{ color: 'rgba(168,162,158,0.45)' }}>Goals</span>
            </div>
            {GOALS.map((goal, i) => (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs flex-1 truncate" style={{ color: 'rgba(231,229,228,0.85)' }}>
                    {goal.title}
                  </span>
                  <span className="text-[10px] font-mono ml-2" style={{ color: 'rgba(168,162,158,0.4)' }}>
                    {goal.progress}%
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.06 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${goal.color}99, ${goal.color})` }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="md:col-span-4 rounded-2xl p-5 space-y-2"
            style={{
              background: 'rgba(18,14,10,0.8)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare size={13} weight="fill" style={{ color: A }} />
              <span className="text-[10px] font-mono uppercase tracking-widest"
                style={{ color: 'rgba(168,162,158,0.45)' }}>Tasks</span>
            </div>
            {TASKS.map(task => (
              <div key={task.title} className="flex items-center gap-2 py-1.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.035)' }}>
                {statusIcon(task.status)}
                <span className="text-xs flex-1 truncate"
                  style={{ color: task.status === 'done' ? 'rgba(120,113,108,0.4)' : 'rgba(214,211,209,0.7)' }}>
                  {task.title}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Captures */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center"
            style={{
              background: `linear-gradient(135deg, rgba(249,115,22,0.07), rgba(251,146,60,0.04))`,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${A_BORDER}`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 40px rgba(249,115,22,0.05)`,
            }}
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, rgba(249,115,22,0.22), rgba(251,146,60,0.14))`,
                border: `1px solid ${A_BORDER}`,
              }}>
              <Brain size={18} weight="duotone" style={{ color: A }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#fafaf9' }}>2 captures</p>
              <p className="text-[10px] font-mono mt-0.5" style={{ color: 'rgba(168,162,158,0.4)' }}>
                waiting to organize
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Brain button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${A}, ${A2})`,
          boxShadow: `0 0 24px rgba(249,115,22,0.45), 0 4px 16px rgba(0,0,0,0.4)`,
        }}
      >
        <Brain size={20} weight="fill" className="text-white" />
      </motion.button>
    </div>
  )
}
