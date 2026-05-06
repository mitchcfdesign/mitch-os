'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Warning,
  CheckCircle,
  Circle,
  Clock,
  Note,
} from '@phosphor-icons/react'
import type { Room, Blocker, Carpenter } from '@/lib/types'
import { statusConfig, blockerTypeConfig } from '@/lib/status-utils'

type StatusCfg = {
  label: string
  color: string
  bg: string
  border: string
  dotColor: string
  pulse: boolean
}

interface RoomDrawerProps {
  room: Room | null
  blockers: Blocker[]
  crew: Carpenter[]
  onClose: () => void
}

const taskStatusIcon = (status: string) => {
  if (status === 'complete') return <CheckCircle size={14} className="text-emerald-400" weight="fill" />
  if (status === 'in-progress') return <Clock size={14} className="text-amber-400" weight="fill" />
  return <Circle size={14} className="text-zinc-600" />
}

export default function RoomDrawer({ room, blockers, crew, onClose }: RoomDrawerProps) {
  const activeBlockers = blockers.filter(b => room?.blockerIds.includes(b.id))
  const assignedCrew = crew.filter(c =>
    room?.tasks.some(t => t.assignedTo.includes(c.id))
  )
  const cfg = room ? statusConfig[room.status] : null

  return (
    <AnimatePresence>
      {room && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/80 z-40 md:hidden"
          />

          {/* Drawer — slides up on mobile, fixed panel on desktop */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-zinc-900 border-t border-zinc-800 rounded-t-2xl max-h-[80dvh] overflow-y-auto"
          >
            <DrawerContent room={room} cfg={cfg} activeBlockers={activeBlockers} assignedCrew={assignedCrew} onClose={onClose} />
          </motion.div>

          {/* Desktop side panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="hidden md:block fixed top-0 right-0 bottom-0 w-80 z-50 bg-zinc-900 border-l border-zinc-800 overflow-y-auto"
          >
            <DrawerContent room={room} cfg={cfg} activeBlockers={activeBlockers} assignedCrew={assignedCrew} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function DrawerContent({
  room,
  cfg,
  activeBlockers,
  assignedCrew,
  onClose,
}: {
  room: Room
  cfg: StatusCfg | null
  activeBlockers: Blocker[]
  assignedCrew: Carpenter[]
  onClose: () => void
}) {
  return (
    <div className="p-4 space-y-5">
      {/* Handle + header */}
      <div className="flex items-center justify-between md:pt-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${cfg?.dotColor ?? 'bg-zinc-600'}`} />
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">{room.name}</h2>
            {cfg && (
              <span className={`text-[10px] font-mono tracking-wider uppercase ${cfg.color}`}>
                {cfg.label}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X size={16} className="text-zinc-500" />
        </button>
      </div>

      {/* Notes */}
      {room.notes && (
        <div className="flex gap-2 p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/40">
          <Note size={14} className="text-zinc-500 mt-0.5 shrink-0" />
          <p className="text-xs text-zinc-400 leading-relaxed">{room.notes}</p>
        </div>
      )}

      {/* Active blockers */}
      {activeBlockers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">
            Active Blockers
          </h3>
          {activeBlockers.map((blocker) => {
            const bCfg = blockerTypeConfig[blocker.type]
            return (
              <div key={blocker.id} className={`p-3 rounded-lg border border-zinc-700/40 ${bCfg.bg}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono tracking-wider uppercase ${bCfg.color}`}>
                    {bCfg.label}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-600">
                    {blocker.daysActive}d
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{blocker.description}</p>
                <p className="text-[10px] text-zinc-500 mt-1">Owner: {blocker.owner}</p>
                {blocker.assumption && (
                  <p className="text-[10px] text-zinc-500 mt-2 italic border-t border-zinc-700/40 pt-2">
                    Assumption: {blocker.assumption}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Tasks */}
      {room.tasks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">
            Tasks
          </h3>
          {room.tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-2.5 py-2 border-b border-zinc-800 last:border-0">
              <div className="mt-0.5">{taskStatusIcon(task.status)}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-snug ${task.status === 'complete' ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>
                  {task.description}
                </p>
                {task.estimatedHours > 0 && (
                  <span className="text-[10px] font-mono text-zinc-600">{task.estimatedHours}h est.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assigned crew */}
      {assignedCrew.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">
            Assigned
          </h3>
          {assignedCrew.map((carpenter) => (
            <div key={carpenter.id} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <span className="text-[10px] font-mono text-amber-400">{carpenter.initials}</span>
              </div>
              <span className="text-xs text-zinc-300">{carpenter.name}</span>
            </div>
          ))}
        </div>
      )}

      {activeBlockers.length === 0 && room.tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <Warning size={20} className="text-zinc-700" />
          <p className="text-xs text-zinc-600">No tasks or blockers recorded</p>
        </div>
      )}
    </div>
  )
}
