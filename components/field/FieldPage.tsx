'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Buildings,
  CalendarBlank,
  Warning,
  ChatCircle,
  Package,
  ArrowLeft,
} from '@phosphor-icons/react'
import { allProjects } from '@/lib/demo-data'
import type { Project } from '@/lib/types'
import ProjectSelector from './ProjectSelector'
import BuildingMap from './BuildingMap'
import WeeklyPlan from './WeeklyPlan'
import BlockersView from './BlockersView'
import AskView from './AskView'
import MaterialsView from './MaterialsView'

const TABS = [
  { id: 'building', label: 'Building', Icon: Buildings },
  { id: 'plan', label: 'Plan', Icon: CalendarBlank },
  { id: 'blockers', label: 'Blockers', Icon: Warning },
  { id: 'ask', label: 'Ask', Icon: ChatCircle },
  { id: 'materials', label: 'Materials', Icon: Package },
] as const

type TabId = (typeof TABS)[number]['id']

export default function FieldPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('building')

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
    setActiveTab('building')
  }

  const handleBack = () => {
    setSelectedProject(null)
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
            className="flex-1 overflow-hidden"
          >
            <ProjectSelector projects={allProjects} onSelect={handleSelectProject} />
          </motion.div>
        ) : (
          <motion.div
            key={selectedProject.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Project Header */}
            <div className="px-4 py-3 border-b border-zinc-800/60 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBack}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <ArrowLeft size={14} className="text-zinc-500" />
                  </button>
                  <div>
                    <h1 className="text-sm font-semibold text-zinc-100 tracking-tight leading-none">
                      {selectedProject.name}
                    </h1>
                    <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">{selectedProject.gc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedProject.crew.length > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-xs font-mono text-zinc-400">
                        {selectedProject.crew.length} crew
                      </span>
                    </div>
                  )}
                  {selectedProject.blockers.length > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-900/40">
                      <Warning size={12} className="text-rose-400" weight="fill" />
                      <span className="text-xs font-mono text-rose-400">
                        {selectedProject.blockers.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop: Sidebar + Content / Mobile: Content + Bottom Nav */}
            <div className="flex flex-1 overflow-hidden">
              {/* Desktop Sidebar */}
              <nav className="hidden md:flex flex-col w-16 border-r border-zinc-800/60 bg-zinc-950 shrink-0 py-4 gap-1 items-center">
                {TABS.map(({ id, label, Icon }) => {
                  const isActive = activeTab === id
                  const showBadge = id === 'blockers' && selectedProject.blockers.length > 0
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className="relative flex flex-col items-center gap-1 w-12 py-2.5 rounded-lg transition-colors group"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-pill"
                          className="absolute inset-0 bg-zinc-800 rounded-lg"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative">
                        <Icon
                          size={20}
                          weight={isActive ? 'fill' : 'regular'}
                          className={isActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300 transition-colors'}
                        />
                        {showBadge && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-[8px] font-mono text-white flex items-center justify-center">
                            {selectedProject.blockers.length}
                          </span>
                        )}
                      </span>
                      <span className={`relative text-[9px] font-mono tracking-wider uppercase ${isActive ? 'text-amber-400' : 'text-zinc-600 group-hover:text-zinc-400 transition-colors'}`}>
                        {label}
                      </span>
                    </button>
                  )
                })}
              </nav>

              {/* Main Content */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="h-full overflow-y-auto"
                  >
                    {activeTab === 'building' && <BuildingMap project={selectedProject} />}
                    {activeTab === 'plan' && <WeeklyPlan project={selectedProject} />}
                    {activeTab === 'blockers' && <BlockersView project={selectedProject} />}
                    {activeTab === 'ask' && <AskView project={selectedProject} />}
                    {activeTab === 'materials' && <MaterialsView project={selectedProject} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden flex border-t border-zinc-800/60 bg-zinc-950 shrink-0">
              {TABS.map(({ id, label, Icon }) => {
                const isActive = activeTab === id
                const showBadge = id === 'blockers' && selectedProject.blockers.length > 0
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className="relative flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors"
                  >
                    <span className="relative">
                      <Icon
                        size={22}
                        weight={isActive ? 'fill' : 'regular'}
                        className={isActive ? 'text-amber-400' : 'text-zinc-600'}
                      />
                      {showBadge && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-[8px] font-mono text-white flex items-center justify-center">
                          {selectedProject.blockers.length}
                        </span>
                      )}
                    </span>
                    <span className={`text-[9px] font-mono tracking-wider uppercase ${isActive ? 'text-amber-400' : 'text-zinc-600'}`}>
                      {label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="bottom-nav-indicator"
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-400 rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
