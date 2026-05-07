'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, MagnifyingGlass, Graph, List, X, Tag } from '@phosphor-icons/react'
import dynamic from 'next/dynamic'

const KnowledgeGraph = dynamic(() => import('./KnowledgeGraph'), { ssr: false })

interface KBEntry {
  id: string
  title: string
  content: string
  node_type: string
  tags: string[]
  parent_node_id: string | null
  project: string | null
  created_at: string
}

const TYPE_COLORS: Record<string, string> = {
  note: 'text-zinc-400 bg-zinc-800 border-zinc-700',
  insight: 'text-amber-400 bg-amber-950/40 border-amber-900/40',
  resource: 'text-blue-400 bg-blue-950/40 border-blue-900/40',
  decision: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/40',
}

function EntryCard({ entry, onClick }: { entry: KBEntry; onClick: () => void }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="w-full text-left p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors space-y-2"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-zinc-200 leading-snug">{entry.title}</span>
        <span className={`shrink-0 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${TYPE_COLORS[entry.node_type] ?? TYPE_COLORS.note}`}>
          {entry.node_type}
        </span>
      </div>
      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{entry.content}</p>
      {entry.tags?.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {entry.tags.map(t => (
            <span key={t} className="text-[9px] font-mono text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5">{t}</span>
          ))}
        </div>
      )}
    </motion.button>
  )
}

function EntryDrawer({ entry, onClose }: { entry: KBEntry; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute inset-y-0 right-0 w-full md:w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col z-10"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 shrink-0">
        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${TYPE_COLORS[entry.node_type] ?? TYPE_COLORS.note}`}>
          {entry.node_type}
        </span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-800 transition-colors">
          <X size={14} className="text-zinc-500" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <h2 className="text-base font-semibold text-zinc-100 leading-snug">{entry.title}</h2>
        <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
        {entry.tags?.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Tags</span>
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map(t => (
                <span key={t} className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 border border-zinc-800 rounded-lg px-2 py-1">
                  <Tag size={9} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
        {entry.project && (
          <div className="text-[10px] font-mono text-zinc-600">Project: {entry.project}</div>
        )}
        <div className="text-[10px] font-mono text-zinc-700">
          {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </motion.div>
  )
}

export default function KnowledgePage() {
  const [entries, setEntries] = useState<KBEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'graph'>('list')
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selected, setSelected] = useState<KBEntry | null>(null)

  useEffect(() => {
    fetch('/api/knowledge')
      .then(r => r.json())
      .then(d => { setEntries(d.entries ?? []); setLoading(false) })
  }, [])

  const filtered = entries.filter(e => {
    const matchesType = typeFilter === 'all' || e.node_type === typeFilter
    const matchesQuery = !query || e.title.toLowerCase().includes(query.toLowerCase()) || e.content.toLowerCase().includes(query.toLowerCase())
    return matchesType && matchesQuery
  })

  const counts = {
    note: entries.filter(e => e.node_type === 'note').length,
    insight: entries.filter(e => e.node_type === 'insight').length,
    resource: entries.filter(e => e.node_type === 'resource').length,
    decision: entries.filter(e => e.node_type === 'decision').length,
  }

  return (
    <div className="relative h-full flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/60 shrink-0">
        <BookOpen size={16} className="text-amber-400" weight="fill" />
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex-1">Knowledge Base</span>
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <List size={13} />
          </button>
          <button
            onClick={() => setView('graph')}
            className={`p-1.5 rounded-md transition-colors ${view === 'graph' ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <Graph size={13} />
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4 max-w-2xl mx-auto">

            {/* Search */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-amber-400/40 transition-colors">
              <MagnifyingGlass size={13} className="text-zinc-600 shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search knowledge..."
                className="flex-1 bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')}>
                  <X size={12} className="text-zinc-600" />
                </button>
              )}
            </div>

            {/* Type filter + counts */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { key: 'all', label: `All (${entries.length})` },
                { key: 'note', label: `Notes (${counts.note})` },
                { key: 'insight', label: `Insights (${counts.insight})` },
                { key: 'resource', label: `Resources (${counts.resource})` },
                { key: 'decision', label: `Decisions (${counts.decision})` },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setTypeFilter(f.key)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors ${
                    typeFilter === f.key
                      ? 'bg-amber-400 text-zinc-950 font-semibold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Entries */}
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
              ))
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-xs text-zinc-600">No entries found.</p>
              </div>
            ) : filtered.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <EntryCard entry={entry} onClick={() => setSelected(entry)} />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 relative">
          <KnowledgeGraph
            entries={filtered}
            onNodeClick={id => {
              const entry = entries.find(e => e.id === id)
              if (entry) setSelected(entry)
            }}
          />
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            {[
              { type: 'note', color: 'bg-zinc-400', label: 'Note' },
              { type: 'insight', color: 'bg-amber-400', label: 'Insight' },
              { type: 'resource', color: 'bg-blue-400', label: 'Resource' },
              { type: 'decision', color: 'bg-emerald-400', label: 'Decision' },
            ].map(t => (
              <div key={t.type} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${t.color}`} />
                <span className="text-[9px] font-mono text-zinc-500">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Entry drawer */}
      <AnimatePresence>
        {selected && (
          <EntryDrawer entry={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
