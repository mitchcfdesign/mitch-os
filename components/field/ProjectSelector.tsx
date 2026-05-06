'use client'

import { motion } from 'framer-motion'
import { Plus, Warning, Users, Buildings, CaretRight } from '@phosphor-icons/react'
import type { Project } from '@/lib/types'
import { getFloorStatusSummary } from '@/lib/status-utils'

interface ProjectSelectorProps {
  projects: Project[]
  onSelect: (project: Project) => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getOverallStatus(project: Project) {
  const allRooms = project.floors.flatMap(f => f.rooms)
  const summary = getFloorStatusSummary(allRooms)
  const total = allRooms.length
  const complete = summary['complete'] ?? 0
  const inProgress = summary['in-progress'] ?? 0
  const blocked = summary['blocked'] ?? 0
  return { total, complete, inProgress, blocked, pct: total > 0 ? Math.round((complete / total) * 100) : 0 }
}

export default function ProjectSelector({ projects, onSelect }: ProjectSelectorProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-zinc-800/60 shrink-0">
        <h2 className="text-sm font-semibold text-zinc-100 tracking-tight">Projects</h2>
        <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Royal Construction</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {projects.map((project, i) => {
          const { total, complete, inProgress, pct } = getOverallStatus(project)

          return (
            <motion.button
              key={project.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onSelect(project)}
              className="w-full text-left p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900 transition-all active:scale-[0.99] group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-100 truncate">{project.name}</h3>
                    {inProgress > 0 && (
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-amber-400">active</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{project.address}</p>
                </div>
                <CaretRight
                  size={14}
                  className="text-zinc-600 group-hover:text-amber-400 transition-colors shrink-0 mt-0.5"
                />
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <Buildings size={12} className="text-zinc-600" />
                  <span className="text-[10px] font-mono text-zinc-500">
                    {project.floors.length} floors
                  </span>
                </div>
                {project.crew.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-zinc-600" />
                    <span className="text-[10px] font-mono text-zinc-500">
                      {project.crew.length} crew
                    </span>
                  </div>
                )}
                {project.blockers.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Warning size={12} className="text-rose-500" weight="fill" />
                    <span className="text-[10px] font-mono text-rose-400">
                      {project.blockers.length} blocker{project.blockers.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                <span className="text-[10px] font-mono text-zinc-600 ml-auto">
                  {formatDate(project.updatedAt)}
                </span>
              </div>

              {/* Progress bar */}
              {total > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
                      {complete}/{total} zones complete
                    </span>
                    <span className="text-[9px] font-mono text-zinc-600">{pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.button>
          )
        })}

        {/* New project button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: projects.length * 0.06 + 0.1 }}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-zinc-800 text-zinc-600 hover:border-amber-400/40 hover:text-amber-400 transition-colors"
        >
          <Plus size={14} />
          <span className="text-xs font-mono">New Project</span>
        </motion.button>
      </div>
    </div>
  )
}
