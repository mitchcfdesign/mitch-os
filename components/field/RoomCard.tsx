import {
  Bed,
  Shower,
  ForkKnife,
  ArrowsHorizontal,
  Stairs,
  Storefront,
  Question,
  Warning,
} from '@phosphor-icons/react'
import type { Room } from '@/lib/types'
import { statusConfig } from '@/lib/status-utils'

interface RoomCardProps {
  room: Room
  assignedNames: string[]
  onClick: () => void
}

export default function RoomCard({ room, assignedNames, onClick }: RoomCardProps) {
  const cfg = statusConfig[room.status]
  const isBlocked = room.status === 'blocked'
  const isUnknown = room.status === 'unknown'
  const isComplete = room.status === 'complete'
  const isInProgress = room.status === 'in-progress'

  const colSpanClass = room.colSpan === 2 ? 'col-span-2' : 'col-span-1'

  const completedTasks = room.tasks.filter(t => t.status === 'complete').length
  const totalTasks = room.tasks.length
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <button
      onClick={onClick}
      className={`
        ${colSpanClass}
        relative flex flex-col gap-2 p-3 rounded-lg border border-zinc-800 border-l-2 ${cfg.border}
        ${cfg.bg} text-left transition-all duration-150
        hover:border-zinc-700 hover:brightness-110 active:scale-[0.98]
        ${isComplete ? 'opacity-60' : ''}
        ${isUnknown ? 'border-dashed border-zinc-700' : ''}
      `}
    >
      {/* Top row: status dot + name */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex-shrink-0">
            <div className={`w-2 h-2 rounded-full ${cfg.dotColor}`} />
            {isInProgress && (
              <div className={`absolute inset-0 rounded-full ${cfg.dotColor} animate-ping opacity-60`} />
            )}
          </div>
          <span className="text-xs font-semibold text-zinc-200 truncate leading-tight">
            {room.name}
          </span>
        </div>
        {room.blockerIds.length > 0 && !isUnknown && (
          <Warning size={12} className="text-rose-400 flex-shrink-0 mt-0.5" weight="fill" />
        )}
      </div>

      {/* Room type icons */}
      <div className="flex items-center gap-2 flex-wrap">
        {room.type === 'unit' && (
          <>
            {(room.bedrooms ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <Bed size={11} className="text-zinc-500" />
                <span className="text-[10px] font-mono text-zinc-500">{room.bedrooms}</span>
              </div>
            )}
            {(room.bathrooms ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <Shower size={11} className="text-zinc-500" />
                <span className="text-[10px] font-mono text-zinc-500">{room.bathrooms}</span>
              </div>
            )}
            {room.hasKitchen && <ForkKnife size={11} className="text-zinc-500" />}
          </>
        )}
        {room.type === 'corridor' && <ArrowsHorizontal size={11} className="text-zinc-500" />}
        {room.type === 'stairwell' && <Stairs size={11} className="text-zinc-500" />}
        {room.type === 'storefront' && <Storefront size={11} className="text-zinc-500" />}
        {room.type === 'unknown' && <Question size={11} className="text-zinc-600" />}
      </div>

      {/* Status label */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-mono tracking-wider uppercase ${cfg.color}`}>
          {cfg.label}
        </span>
        {isBlocked && (
          <span className="text-[9px] font-mono text-zinc-600">
            {room.blockerIds.length} blocker{room.blockerIds.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Progress bar (when tasks exist and not unknown/complete) */}
      {totalTasks > 0 && !isUnknown && (
        <div className="w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isComplete ? 'bg-zinc-600' :
              isBlocked ? 'bg-rose-800' :
              isInProgress ? 'bg-amber-500' :
              'bg-emerald-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Assigned carpenters */}
      {assignedNames.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {assignedNames.map((initials) => (
            <span
              key={initials}
              className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20"
            >
              {initials}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
