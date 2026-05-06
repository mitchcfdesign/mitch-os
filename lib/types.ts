export type RoomStatus = 'available' | 'in-progress' | 'partial' | 'blocked' | 'complete' | 'unknown'
export type BlockerType = 'owner' | 'trade' | 'inspection' | 'material' | 'unknown'
export type TaskStatus = 'not-started' | 'in-progress' | 'complete'

export interface Blocker {
  id: string
  type: BlockerType
  description: string
  owner: string
  affectedRoomIds: string[]
  daysActive: number
  assumption?: string
}

export interface Task {
  id: string
  description: string
  status: TaskStatus
  assignedTo: string[]
  estimatedHours: number
}

export interface Room {
  id: string
  name: string
  floor: number
  type: 'unit' | 'corridor' | 'stairwell' | 'common' | 'storefront' | 'unknown'
  bedrooms?: number
  bathrooms?: number
  hasKitchen?: boolean
  status: RoomStatus
  tasks: Task[]
  blockerIds: string[]
  notes?: string
  colSpan?: 1 | 2
}

export interface FloorData {
  number: number
  label: string
  use: string
  rooms: Room[]
}

export interface Carpenter {
  id: string
  name: string
  initials: string
}

export interface PlanTask {
  id: string
  carpenterIds: string[]
  roomId: string
  description: string
  days: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>
  status: TaskStatus
  estimatedHours: number
}

export interface WeeklyPlan {
  weekOf: string
  crewSize: number
  tasks: PlanTask[]
  gapWarning?: string
}

export interface Material {
  id: string
  name: string
  unit: string
  onHand: number
  weeklyNeed: number
  lowThreshold: number
  category: 'lumber' | 'hardware' | 'fasteners' | 'consumables'
}

export interface Project {
  id: string
  name: string
  gc: string
  address: string
  description: string
  floors: FloorData[]
  blockers: Blocker[]
  crew: Carpenter[]
  weeklyPlan: WeeklyPlan
  materials: Material[]
  updatedAt: string
}
