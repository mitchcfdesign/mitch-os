'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Warning, CheckCircle, Circle, Clock, CaretLeft, CaretRight } from '@phosphor-icons/react'
import type { Project, PlanTask } from '@/lib/types'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

interface WeeklyPlanProps {
  project: Project
}

function formatWeekOf(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getTaskStatusIcon(status: PlanTask['status']) {
  if (status === 'complete') return <CheckCircle size={14} className="text-emerald-400" weight="fill" />
  if (status === 'in-progress') return <Clock size={14} className="text-amber-400" weight="fill" />
  return <Circle size={14} className="text-zinc-600" />
}

export default function WeeklyPlan({ project }: WeeklyPlanProps) {
  const { weeklyPlan, crew, floors } = project
  const [crewSize, setCrewSize] = useState(weeklyPlan.crewSize)

  const getRoomName = (roomId: string) => {
    for (const floor of floors) {
      const room = floor.rooms.find(r => r.id === roomId)
      if (room) return room.name
    }
    return roomId
  }

  const getCarpenterNames = (ids: string[]) =>
    ids.map(id => crew.find(c => c.id === id)?.name ?? id)

  return (
    <div className="flex flex-col h-full">
      {/* Week header */}
      <div className="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button className="p-1 rounded hover:bg-zinc-800 transition-colors">
            <CaretLeft size={14} className="text-zinc-500" />
          </button>
          <div>
            <div className="text-xs font-semibold text-zinc-200">
              Week of {formatWeekOf(weeklyPlan.weekOf)}
            </div>
            <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
              Current week — F4 punchout phase
            </div>
          </div>
          <button className="p-1 rounded hover:bg-zinc-800 transition-colors">
            <CaretRight size={14} className="text-zinc-500" />
          </button>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Crew</span>
          <button
            onClick={() => setCrewSize(Math.max(1, crewSize - 1))}
            className="text-zinc-500 hover:text-zinc-300 font-mono text-sm leading-none"
          >−</button>
          <span className="text-sm font-mono text-amber-400 w-4 text-center">{crewSize}</span>
          <button
            onClick={() => setCrewSize(crewSize + 1)}
            className="text-zinc-500 hover:text-zinc-300 font-mono text-sm leading-none"
          >+</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Gap warning */}
        {weeklyPlan.gapWarning && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 p-3 rounded-lg bg-amber-950/40 border border-amber-900/40"
          >
            <Warning size={14} className="text-amber-400 shrink-0 mt-0.5" weight="fill" />
            <p className="text-xs text-amber-300/80 leading-relaxed">{weeklyPlan.gapWarning}</p>
          </motion.div>
        )}

        {/* Day grid header */}
        <div className="hidden md:grid grid-cols-[200px_1fr] gap-3">
          <div />
          <div className="grid grid-cols-5 gap-1">
            {DAYS.map(day => (
              <div key={day} className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider text-center">
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          {weeklyPlan.tasks.map((task, i) => {
            const names = getCarpenterNames(task.carpenterIds)
            const roomName = getRoomName(task.roomId)

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 overflow-hidden"
              >
                <div className="md:grid md:grid-cols-[200px_1fr] gap-0">
                  {/* Task info */}
                  <div className="flex items-start gap-2.5 p-3 border-b md:border-b-0 md:border-r border-zinc-800">
                    <div className="mt-0.5">{getTaskStatusIcon(task.status)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-300 leading-snug">{task.description}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-mono text-amber-400/70 border border-amber-400/20 rounded px-1 py-0.5">
                          {roomName}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-600">{task.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                        {names.map(name => (
                          <span key={name} className="text-[9px] font-mono text-zinc-500 bg-zinc-800 rounded px-1.5 py-0.5">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Day pills */}
                  <div className="grid grid-cols-5 gap-1 p-3 items-center">
                    {DAYS.map(day => {
                      const isScheduled = task.days.includes(day)
                      return (
                        <div
                          key={day}
                          className={`rounded h-7 flex items-center justify-center text-[10px] font-mono transition-colors ${
                            isScheduled
                              ? task.status === 'complete'
                                ? 'bg-emerald-900/40 text-emerald-600'
                                : task.status === 'in-progress'
                                ? 'bg-amber-900/50 text-amber-400'
                                : 'bg-zinc-800 text-zinc-400'
                              : 'bg-transparent text-zinc-700'
                          }`}
                        >
                          <span className="md:hidden">{day}</span>
                          {isScheduled && <span className="hidden md:block">•</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Total hours */}
        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-600">
            Total estimated this week
          </span>
          <span className="text-xs font-mono text-zinc-400">
            {weeklyPlan.tasks.reduce((sum, t) => sum + t.estimatedHours, 0)}h /{' '}
            {crewSize * 40}h available ({crewSize} crew × 40h)
          </span>
        </div>
      </div>
    </div>
  )
}
