'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckSquare, Circle, Clock, Warning, CheckCircle,
  Plus, X, ArrowUp, ArrowRight, ArrowDown,
} from '@phosphor-icons/react'

interface Task {
  id: string
  title: string
  status: string
  priority: string
  category: string | null
  due_date: string | null
  created_at: string
}

const STATUS_COLS = [
  { key: 'todo', label: 'To Do', color: 'text-zinc-400' },
  { key: 'in_progress', label: 'In Progress', color: 'text-amber-400' },
  { key: 'blocked', label: 'Blocked', color: 'text-rose-400' },
  { key: 'done', label: 'Done', color: 'text-emerald-400' },
]

function taskStatusIcon(status: string) {
  if (status === 'done') return <CheckCircle size={14} weight="fill" className="text-emerald-400" />
  if (status === 'in_progress') return <Clock size={14} weight="fill" className="text-amber-400" />
  if (status === 'blocked') return <Warning size={14} weight="fill" className="text-rose-400" />
  return <Circle size={14} className="text-zinc-600" />
}

function priorityIcon(p: string) {
  if (p === 'high') return <ArrowUp size={11} className="text-rose-400" />
  if (p === 'low') return <ArrowDown size={11} className="text-zinc-600" />
  return <ArrowRight size={11} className="text-zinc-600" />
}

function TaskRow({ task, onStatusChange, onDelete }: {
  task: Task
  onStatusChange: (id: string, status: string) => void
  onDelete: (id: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const statuses = ['todo', 'in_progress', 'blocked', 'done']

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-zinc-800/40 group transition-colors"
    >
      {/* Status toggle */}
      <div className="relative shrink-0">
        <button onClick={() => setMenuOpen(o => !o)} className="flex items-center">
          {taskStatusIcon(task.status)}
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="absolute left-0 top-6 z-20 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl p-1 min-w-[120px]"
            >
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => { onStatusChange(task.id, s); setMenuOpen(false) }}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-mono transition-colors hover:bg-zinc-700 ${
                    task.status === s ? 'text-amber-400' : 'text-zinc-400'
                  }`}
                >
                  {taskStatusIcon(s)}
                  {s.replace('_', ' ')}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className={`flex-1 text-xs truncate ${task.status === 'done' ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>
        {task.title}
      </span>

      <div className="flex items-center gap-2 shrink-0">
        {priorityIcon(task.priority)}
        {task.category && (
          <span className="text-[9px] font-mono text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5 hidden sm:block">
            {task.category}
          </span>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-zinc-700"
        >
          <X size={11} className="text-zinc-600" />
        </button>
      </div>
    </motion.div>
  )
}

function AddTaskRow({ onAdd }: { onAdd: (title: string) => void }) {
  const [active, setActive] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = () => {
    if (!value.trim()) { setActive(false); return }
    onAdd(value.trim())
    setValue('')
    setActive(false)
  }

  useEffect(() => {
    if (active) inputRef.current?.focus()
  }, [active])

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-xs text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/40 transition-colors w-full"
      >
        <Plus size={14} />
        Add task
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
      <Plus size={14} className="text-amber-400 shrink-0" />
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') { setActive(false); setValue('') }
        }}
        onBlur={submit}
        placeholder="Task title..."
        className="flex-1 bg-transparent text-xs text-zinc-200 placeholder:text-zinc-600 outline-none"
      />
    </div>
  )
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(d => { setTasks(d.tasks ?? []); setLoading(false) })
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status } : t))
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
  }

  const handleDelete = async (id: string) => {
    setTasks(ts => ts.filter(t => t.id !== id))
    // soft delete via status or just remove — for now remove from UI only
  }

  const handleAdd = async (title: string) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    const d = await res.json()
    if (d.task) setTasks(ts => [d.task, ...ts])
  }

  const counts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    done: tasks.filter(t => t.status === 'done').length,
  }

  const displayed = activeFilter === 'all' ? tasks : tasks.filter(t => t.status === activeFilter)

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <CheckSquare size={18} className="text-amber-400" weight="fill" />
          <h1 className="text-base font-semibold text-zinc-100">Tasks</h1>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-4 gap-2">
          {STATUS_COLS.map(col => (
            <button
              key={col.key}
              onClick={() => setActiveFilter(activeFilter === col.key ? 'all' : col.key)}
              className={`bg-zinc-900 border rounded-xl p-3 text-center transition-colors ${
                activeFilter === col.key ? 'border-amber-400/40' : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <p className={`text-lg font-mono font-bold ${col.color}`}>
                {counts[col.key as keyof typeof counts]}
              </p>
              <p className="text-[9px] font-mono text-zinc-600 mt-0.5 leading-tight">{col.label}</p>
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800/60">

          {/* Priority filters */}
          <div className="flex items-center gap-1.5 p-3">
            {['all', 'high', 'medium', 'low'].map(p => (
              <span key={p} className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider px-2 py-1 rounded-lg border border-zinc-800">
                {p}
              </span>
            ))}
          </div>

          <div className="p-2">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-9 bg-zinc-800/60 rounded-xl mb-1.5 animate-pulse" />
              ))
            ) : (
              <AnimatePresence>
                {displayed.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            )}
            <AddTaskRow onAdd={handleAdd} />
          </div>
        </div>

      </div>
    </div>
  )
}
