import type { RoomStatus, BlockerType } from './types'

export const statusConfig: Record<RoomStatus, {
  label: string
  color: string
  bg: string
  border: string
  dotColor: string
  pulse: boolean
}> = {
  available: {
    label: 'Available',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-l-emerald-500',
    dotColor: 'bg-emerald-400',
    pulse: false,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-l-amber-400',
    dotColor: 'bg-amber-400',
    pulse: true,
  },
  partial: {
    label: 'Partial',
    color: 'text-sky-400',
    bg: 'bg-sky-950/40',
    border: 'border-l-sky-500',
    dotColor: 'bg-sky-400',
    pulse: false,
  },
  blocked: {
    label: 'Blocked',
    color: 'text-rose-400',
    bg: 'bg-rose-950/40',
    border: 'border-l-rose-500',
    dotColor: 'bg-rose-500',
    pulse: false,
  },
  complete: {
    label: 'Complete',
    color: 'text-zinc-500',
    bg: 'bg-zinc-900/60',
    border: 'border-l-zinc-700',
    dotColor: 'bg-zinc-600',
    pulse: false,
  },
  unknown: {
    label: 'No Plans',
    color: 'text-zinc-500',
    bg: 'bg-zinc-900/40',
    border: 'border-l-zinc-700',
    dotColor: 'bg-zinc-700',
    pulse: false,
  },
}

export const blockerTypeConfig: Record<BlockerType, {
  label: string
  color: string
  bg: string
}> = {
  owner: { label: 'Owner Decision', color: 'text-violet-400', bg: 'bg-violet-950/60' },
  trade: { label: 'Trade', color: 'text-orange-400', bg: 'bg-orange-950/60' },
  inspection: { label: 'Inspection', color: 'text-sky-400', bg: 'bg-sky-950/60' },
  material: { label: 'Material', color: 'text-yellow-400', bg: 'bg-yellow-950/60' },
  unknown: { label: 'Unknown', color: 'text-zinc-400', bg: 'bg-zinc-800/60' },
}

export function getFloorStatusSummary(rooms: { status: RoomStatus }[]) {
  const counts = rooms.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {} as Record<RoomStatus, number>)
  return counts
}

export function getBlockerCount(rooms: { blockerIds: string[] }[]) {
  return rooms.reduce((sum, r) => sum + r.blockerIds.length, 0)
}
