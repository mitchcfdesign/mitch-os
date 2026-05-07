import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSameOrigin } from '@/lib/route-auth'
import type { Project, FloorData, Room, Blocker } from '@/lib/types'

type DbProject = {
  id: string; name: string; gc: string; address: string; description: string
  crew: Project['crew']; floors_meta: { number: number; label: string; use: string }[]
  weekly_plan: Project['weeklyPlan']; materials: Project['materials']; updated_at: string
}
type DbRoom = {
  id: string; project_id: string; name: string; floor: number; type: string; status: string
  bedrooms: number | null; bathrooms: number | null; has_kitchen: boolean | null
  tasks: Room['tasks']; blocker_ids: string[]; notes: string | null; col_span: number | null
}
type DbBlocker = {
  id: string; project_id: string; type: string; description: string; owner: string
  affected_room_ids: string[]; days_active: number; assumption: string | null
}

export function buildProject(p: DbProject, rooms: DbRoom[], blockers: DbBlocker[]): Project {
  const floorMap = new Map<number, Room[]>()
  for (const r of rooms) {
    if (!floorMap.has(r.floor)) floorMap.set(r.floor, [])
    floorMap.get(r.floor)!.push({
      id: r.id, name: r.name, floor: r.floor,
      type: r.type as Room['type'], status: r.status as Room['status'],
      tasks: r.tasks, blockerIds: r.blocker_ids,
      notes: r.notes ?? undefined, colSpan: (r.col_span as Room['colSpan']) ?? undefined,
      bedrooms: r.bedrooms ?? undefined, bathrooms: r.bathrooms ?? undefined,
      hasKitchen: r.has_kitchen ?? undefined,
    })
  }
  const floors: FloorData[] = p.floors_meta.map(fm => ({
    number: fm.number, label: fm.label, use: fm.use,
    rooms: floorMap.get(fm.number) ?? [],
  }))
  return {
    id: p.id, name: p.name, gc: p.gc, address: p.address, description: p.description,
    crew: p.crew, floors,
    blockers: blockers.map(b => ({
      id: b.id, type: b.type as Blocker['type'], description: b.description,
      owner: b.owner, affectedRoomIds: b.affected_room_ids,
      daysActive: b.days_active, assumption: b.assumption ?? undefined,
    })),
    weeklyPlan: p.weekly_plan,
    materials: p.materials,
    updatedAt: p.updated_at,
  }
}

export async function GET(req: Request) {
  const authError = requireSameOrigin(req)
  if (authError) return authError

  const [{ data: projects, error: pErr }, { data: rooms, error: rErr }, { data: blockers, error: bErr }] =
    await Promise.all([
      supabase.from('projects').select('*').order('updated_at', { ascending: false }),
      supabase.from('rooms').select('*'),
      supabase.from('blockers').select('*').eq('resolved', false),
    ])

  if (pErr || rErr || bErr) {
    return NextResponse.json({ error: pErr?.message ?? rErr?.message ?? bErr?.message }, { status: 500 })
  }

  const result = (projects ?? []).map(p =>
    buildProject(
      p as unknown as DbProject,
      (rooms ?? []).filter(r => r.project_id === p.id) as unknown as DbRoom[],
      (blockers ?? []).filter(b => b.project_id === p.id) as unknown as DbBlocker[],
    )
  )

  return NextResponse.json({ projects: result })
}
