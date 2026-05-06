'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Warning } from '@phosphor-icons/react'
import type { Project, Material } from '@/lib/types'

const CATEGORY_LABELS = {
  lumber: 'Lumber',
  hardware: 'Hardware',
  fasteners: 'Fasteners',
  consumables: 'Consumables',
} as const

type Tab = 'on-hand' | 'this-week'

interface MaterialsViewProps {
  project: Project
}

export default function MaterialsView({ project }: MaterialsViewProps) {
  const [tab, setTab] = useState<Tab>('on-hand')
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(project.materials.map(m => [m.id, m.onHand]))
  )

  const adjust = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }))
  }

  const categories = ['lumber', 'hardware', 'fasteners', 'consumables'] as const

  const isLow = (m: Material) => {
    const qty = quantities[m.id] ?? m.onHand
    return m.lowThreshold > 0 && qty <= m.lowThreshold
  }

  const isCritical = (m: Material) => {
    const qty = quantities[m.id] ?? m.onHand
    return m.weeklyNeed > 0 && qty < m.weeklyNeed * 0.5
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab header */}
      <div className="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          {(['on-hand', 'this-week'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase rounded-md transition-colors ${
                tab === t ? 'text-zinc-950 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab === t && (
                <motion.div
                  layoutId="materials-tab"
                  className="absolute inset-0 bg-amber-400 rounded-md"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t === 'on-hand' ? 'On Hand' : "This Week's Need"}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {project.materials.filter(m => isLow(m)).length > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-950/60 border border-amber-900/40">
              <Warning size={11} className="text-amber-400" weight="fill" />
              <span className="text-[10px] font-mono text-amber-400">
                {project.materials.filter(m => isLow(m)).length} low
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {categories.map(category => {
          const items = project.materials.filter(m => m.category === category)
          if (items.length === 0) return null

          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">
                  {CATEGORY_LABELS[category]}
                </h3>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              <div className="space-y-1">
                {items.map((material, i) => {
                  const qty = quantities[material.id] ?? material.onHand
                  const low = isLow(material)
                  const critical = isCritical(material)

                  return (
                    <motion.div
                      key={material.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-center gap-3 py-2.5 px-3 rounded-lg border transition-colors ${
                        critical
                          ? 'border-rose-900/40 bg-rose-950/30'
                          : low
                          ? 'border-amber-900/40 bg-amber-950/20'
                          : 'border-zinc-800/60 bg-zinc-900/40'
                      }`}
                    >
                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-300">{material.name}</span>
                          {critical && <Warning size={11} className="text-rose-400" weight="fill" />}
                          {low && !critical && <Warning size={11} className="text-amber-400" weight="fill" />}
                        </div>
                        {tab === 'this-week' && material.weeklyNeed > 0 && (
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  qty >= material.weeklyNeed ? 'bg-emerald-600' :
                                  qty >= material.weeklyNeed * 0.5 ? 'bg-amber-500' :
                                  'bg-rose-600'
                                }`}
                                style={{ width: `${Math.min(100, (qty / material.weeklyNeed) * 100)}%` }}
                              />
                            </div>
                            <span className="text-[9px] font-mono text-zinc-600 shrink-0">
                              need {material.weeklyNeed} {material.unit}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quantity controls */}
                      {tab === 'on-hand' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjust(material.id, -1)}
                            className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors active:scale-95"
                          >
                            <Minus size={10} className="text-zinc-400" />
                          </button>
                          <span className={`text-sm font-mono w-10 text-center ${
                            critical ? 'text-rose-400' : low ? 'text-amber-400' : 'text-zinc-200'
                          }`}>
                            {qty}
                          </span>
                          <button
                            onClick={() => adjust(material.id, 1)}
                            className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors active:scale-95"
                          >
                            <Plus size={10} className="text-zinc-400" />
                          </button>
                          <span className="text-[10px] font-mono text-zinc-600 w-8">{material.unit}</span>
                        </div>
                      )}

                      {tab === 'this-week' && (
                        <div className="text-right shrink-0">
                          <span className={`text-sm font-mono ${
                            qty >= (material.weeklyNeed || 0) ? 'text-emerald-400' :
                            qty >= (material.weeklyNeed || 0) * 0.5 ? 'text-amber-400' :
                            'text-rose-400'
                          }`}>
                            {qty}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-600 ml-1">{material.unit}</span>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
