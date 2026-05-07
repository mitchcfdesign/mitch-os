'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SquaresFour, HardHat, BookOpen, Target, CheckSquare, Path, Lightning,
} from '@phosphor-icons/react'
import FieldPage from './field/FieldPage'
import Dashboard from './dashboard/Dashboard'
import GoalsPage from './goals/GoalsPage'
import TasksPage from './tasks/TasksPage'
import AssistantPage from './assistant/AssistantPage'
import KnowledgePage from './knowledge/KnowledgePage'
import BrainDump from './ui/BrainDump'

type Mode = 'dashboard' | 'field' | 'assistant' | 'knowledge' | 'goals' | 'tasks' | 'journey'

const NAV_ITEMS: { mode: Mode; label: string; icon: React.ReactNode }[] = [
  { mode: 'dashboard', label: 'Dashboard', icon: <SquaresFour size={20} weight="fill" /> },
  { mode: 'field', label: 'Field', icon: <HardHat size={20} weight="fill" /> },
  { mode: 'assistant', label: 'Ask', icon: <Lightning size={20} weight="fill" /> },
  { mode: 'goals', label: 'Goals', icon: <Target size={20} weight="fill" /> },
  { mode: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} weight="fill" /> },
  { mode: 'knowledge', label: 'Knowledge', icon: <BookOpen size={20} weight="fill" /> },
  { mode: 'journey', label: 'Journey', icon: <Path size={20} weight="fill" /> },
]

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-2">
        <div className="text-zinc-700 font-mono text-sm tracking-widest uppercase">{label}</div>
        <div className="text-zinc-600 text-xs">Phase coming soon</div>
      </div>
    </div>
  )
}

export default function MitchOS() {
  const [mode, setMode] = useState<Mode>('dashboard')

  return (
    <div className="flex min-h-[100dvh] bg-zinc-950">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-zinc-800/60 py-5 px-3 gap-1">
        <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase px-3 mb-3">
          Mitch OS
        </span>
        {NAV_ITEMS.map(({ mode: m, label, icon }) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-colors ${
              mode === m
                ? 'text-zinc-950'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            {mode === m && (
              <motion.div
                layoutId="sidebar-pill"
                className="absolute inset-0 bg-amber-400 rounded-xl"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{icon}</span>
            <span className="relative z-10 uppercase">{label}</span>
          </button>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center px-4 py-3 border-b border-zinc-800/60 shrink-0">
          <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase flex-1">
            Mitch OS
          </span>
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
            {NAV_ITEMS.find(n => n.mode === mode)?.label}
          </span>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="h-full"
            >
              {mode === 'dashboard' && <Dashboard />}
              {mode === 'field' && <FieldPage />}
              {mode === 'assistant' && <AssistantPage />}
              {mode === 'goals' && <GoalsPage />}
              {mode === 'tasks' && <TasksPage />}
              {mode === 'knowledge' && <KnowledgePage />}
              {mode === 'journey' && <Placeholder label="Journey" />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex items-center border-t border-zinc-800/60 bg-zinc-950 shrink-0 pb-safe">
          {NAV_ITEMS.map(({ mode: m, label, icon }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                mode === m ? 'text-amber-400' : 'text-zinc-600'
              }`}
            >
              {icon}
              <span className="text-[9px] font-mono uppercase tracking-wider">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Brain Dump — always visible */}
      <BrainDump />
    </div>
  )
}
