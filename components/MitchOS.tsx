'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FieldPage from './field/FieldPage'

type Mode = 'field' | 'business'

export default function MitchOS() {
  const [mode, setMode] = useState<Mode>('field')

  return (
    <div className="flex flex-col min-h-[100dvh] bg-zinc-950">
      {/* Mode Toggle Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 shrink-0">
        <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
          Mitch OS
        </span>
        <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          {(['field', 'business'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="relative px-4 py-1.5 text-xs font-mono tracking-wider uppercase rounded-md transition-colors"
            >
              {mode === m && (
                <motion.div
                  layoutId="mode-pill"
                  className="absolute inset-0 bg-amber-400 rounded-md"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${mode === m ? 'text-zinc-950 font-semibold' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {m}
              </span>
            </button>
          ))}
        </div>
        <div className="w-16" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === 'field' ? (
            <motion.div
              key="field"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              <FieldPage />
            </motion.div>
          ) : (
            <motion.div
              key="business"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-center space-y-3">
                <div className="text-zinc-700 font-mono text-sm tracking-widest uppercase">Business</div>
                <div className="text-zinc-600 text-sm">Coming soon</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
