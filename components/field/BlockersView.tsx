'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Buildings } from '@phosphor-icons/react'
import type { Project, BlockerType } from '@/lib/types'
import { blockerTypeConfig } from '@/lib/status-utils'

const TYPE_LABELS: Record<BlockerType, string> = {
  owner: 'Owner Decisions',
  trade: 'Trades',
  inspection: 'Inspections',
  material: 'Materials',
  unknown: 'Unknown',
}

interface BlockersViewProps {
  project: Project
}

export default function BlockersView({ project }: BlockersViewProps) {
  const [resolvedIds, setResolvedIds] = useState<string[]>([])
  const [filter, setFilter] = useState<BlockerType | 'all'>('all')

  const blockerTypes: BlockerType[] = ['owner', 'trade', 'inspection', 'material', 'unknown']
  const activeBlockers = project.blockers.filter(b => !resolvedIds.includes(b.id))
  const filteredBlockers = filter === 'all'
    ? activeBlockers
    : activeBlockers.filter(b => b.type === filter)

  const grouped = blockerTypes.reduce((acc, type) => {
    const items = filteredBlockers.filter(b => b.type === type)
    if (items.length > 0) acc[type] = items
    return acc
  }, {} as Record<BlockerType, typeof activeBlockers>)

  const getRoomNames = (roomIds: string[]) => {
    const names: string[] = []
    for (const floor of project.floors) {
      for (const room of floor.rooms) {
        if (roomIds.includes(room.id)) names.push(room.name)
      }
    }
    return names
  }

  const resolve = (id: string) => {
    setResolvedIds(prev => [...prev, id])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-zinc-200">Active Blockers</h2>
          <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
            {activeBlockers.length} blocking · {resolvedIds.length} resolved this session
          </p>
        </div>
        {/* Filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider transition-colors shrink-0 ${
              filter === 'all'
                ? 'bg-amber-400 text-zinc-950 font-semibold'
                : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
            }`}
          >
            All
          </button>
          {blockerTypes.map(type => {
            const count = activeBlockers.filter(b => b.type === type).length
            if (count === 0) return null
            const cfg = blockerTypeConfig[type]
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider transition-colors shrink-0 ${
                  filter === type
                    ? `${cfg.bg} ${cfg.color} border border-current/20`
                    : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                }`}
              >
                {type} ({count})
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(grouped).map(([type, blockers]) => {
          const cfg = blockerTypeConfig[type as BlockerType]
          return (
            <div key={type}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className={`text-[10px] font-mono tracking-widest uppercase ${cfg.color}`}>
                  {TYPE_LABELS[type as BlockerType]}
                </h3>
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-[10px] font-mono text-zinc-600">{blockers.length}</span>
              </div>

              <div className="space-y-2">
                {blockers.map((blocker, i) => {
                  const affectedNames = getRoomNames(blocker.affectedRoomIds)

                  return (
                    <motion.div
                      key={blocker.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.04 }}
                      className={`p-4 rounded-lg border border-zinc-800 ${cfg.bg}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-zinc-200 leading-snug font-medium">
                            {blocker.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-mono text-zinc-500">
                              Owner: {blocker.owner}
                            </span>
                            <span className={`text-[10px] font-mono ${blocker.daysActive > 14 ? 'text-rose-400' : 'text-zinc-600'}`}>
                              {blocker.daysActive}d active
                            </span>
                          </div>

                          {blocker.assumption && (
                            <div className="mt-2 pt-2 border-t border-zinc-700/40">
                              <p className="text-[10px] text-zinc-500 italic leading-relaxed">
                                Assumption: {blocker.assumption}
                              </p>
                            </div>
                          )}

                          {affectedNames.length > 0 && (
                            <div className="mt-3 flex items-start gap-2">
                              <Buildings size={11} className="text-zinc-600 mt-0.5 shrink-0" />
                              <div className="flex flex-wrap gap-1">
                                {affectedNames.slice(0, 6).map(name => (
                                  <span key={name} className="text-[9px] font-mono text-zinc-600 bg-zinc-800/60 rounded px-1.5 py-0.5">
                                    {name}
                                  </span>
                                ))}
                                {affectedNames.length > 6 && (
                                  <span className="text-[9px] font-mono text-zinc-600">
                                    +{affectedNames.length - 6} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => resolve(blocker.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-900/40 hover:text-emerald-400 text-zinc-500 transition-colors shrink-0 border border-zinc-700/40 hover:border-emerald-800"
                        >
                          <CheckCircle size={13} />
                          <span className="text-[10px] font-mono">Resolve</span>
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {activeBlockers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CheckCircle size={32} className="text-emerald-600" weight="thin" />
            <p className="text-sm text-zinc-600">All blockers resolved</p>
            {resolvedIds.length > 0 && (
              <p className="text-[10px] font-mono text-zinc-700">{resolvedIds.length} resolved this session</p>
            )}
          </div>
        )}

        {activeBlockers.length > 0 && filteredBlockers.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-zinc-600">No {filter} blockers active</p>
          </div>
        )}
      </div>
    </div>
  )
}
