'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera } from '@phosphor-icons/react'
import type { Project, Room } from '@/lib/types'
import { getFloorStatusSummary, statusConfig } from '@/lib/status-utils'
import RoomCard from './RoomCard'
import RoomDrawer from './RoomDrawer'

interface BuildingMapProps {
  project: Project
}

export default function BuildingMap({ project }: BuildingMapProps) {
  const [activeFloor, setActiveFloor] = useState(() => project.floors[0]?.number ?? 0)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  const floor = project.floors.find(f => f.number === activeFloor)

  const getAssignedInitials = (room: Room) => {
    const assignedIds = [...new Set(room.tasks.flatMap(t => t.assignedTo))]
    return assignedIds
      .map(id => project.crew.find(c => c.id === id)?.initials ?? '')
      .filter(Boolean)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/60 overflow-x-auto shrink-0">
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider shrink-0 mr-1">
          Floor
        </span>
        {project.floors.map((f) => {
          const summary = getFloorStatusSummary(f.rooms)
          const isActive = f.number === activeFloor
          const blockerCount = f.rooms.reduce((sum, r) => sum + r.blockerIds.length, 0)
          const hasActive = (summary['in-progress'] ?? 0) > 0

          return (
            <button
              key={f.number}
              onClick={() => setActiveFloor(f.number)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider shrink-0 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="floor-tab"
                  className="absolute inset-0 bg-amber-400 rounded-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? 'text-zinc-950 font-semibold' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {f.label}
              </span>
              {!isActive && hasActive && (
                <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
              {!isActive && blockerCount > 0 && !hasActive && (
                <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-rose-500" />
              )}
            </button>
          )
        })}
      </div>

      {floor && (
        <div className="px-4 py-2.5 border-b border-zinc-800/40 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-semibold text-zinc-300">{floor.use}</span>
            <span className="text-[10px] font-mono text-zinc-600 ml-3">{floor.rooms.length} zones</span>
          </div>
          <div className="flex items-center gap-3">
            {(() => {
              const summary = getFloorStatusSummary(floor.rooms)
              return Object.entries(summary)
                .filter(([, count]) => count > 0)
                .map(([status, count]) => (
                  <div key={status} className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[status as keyof typeof statusConfig].dotColor}`} />
                    <span className="text-[10px] font-mono text-zinc-600">{count}</span>
                  </div>
                ))
            })()}
            <button className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800/60 hover:bg-zinc-800 transition-colors border border-zinc-700/40">
              <Camera size={12} className="text-zinc-500" />
              <span className="text-[10px] font-mono text-zinc-500">Upload plan</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {floor ? (
          <motion.div
            key={activeFloor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-2.5"
          >
            {floor.rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                className={room.colSpan === 2 ? 'col-span-2' : 'col-span-1'}
              >
                <RoomCard
                  room={room}
                  assignedNames={getAssignedInitials(room)}
                  onClick={() => setSelectedRoom(room)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-48 text-zinc-600 text-sm font-mono">
            No floor data
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center gap-4 flex-wrap">
          {(Object.entries(statusConfig) as [keyof typeof statusConfig, typeof statusConfig[keyof typeof statusConfig]][]).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${cfg.dotColor}`} />
              <span className="text-[10px] font-mono text-zinc-600">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <RoomDrawer
        room={selectedRoom}
        blockers={project.blockers}
        crew={project.crew}
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  )
}
