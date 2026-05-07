import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { allProjects } from '@/lib/demo-data'
import { requireSameOriginOrBrainToken } from '@/lib/route-auth'

export async function POST(req: Request) {
  const authError = requireSameOriginOrBrainToken(req)
  if (authError) return authError

  for (const project of allProjects) {
    const { error: pErr } = await supabase.from('projects').upsert({
      id: project.id,
      name: project.name,
      gc: project.gc,
      address: project.address,
      description: project.description,
      crew: project.crew,
      floors_meta: project.floors.map(f => ({ number: f.number, label: f.label, use: f.use })),
      weekly_plan: project.weeklyPlan,
      materials: project.materials,
      updated_at: project.updatedAt,
    })
    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 })

    if (project.blockers.length > 0) {
      const { error: bErr } = await supabase.from('blockers').upsert(
        project.blockers.map(b => ({
          id: b.id,
          project_id: project.id,
          type: b.type,
          description: b.description,
          owner: b.owner,
          affected_room_ids: b.affectedRoomIds,
          days_active: b.daysActive,
          assumption: b.assumption ?? null,
          resolved: false,
        }))
      )
      if (bErr) return NextResponse.json({ error: bErr.message }, { status: 500 })
    }

    const rooms = project.floors.flatMap(f => f.rooms)
    if (rooms.length > 0) {
      const { error: rErr } = await supabase.from('rooms').upsert(
        rooms.map(r => ({
          id: r.id,
          project_id: project.id,
          name: r.name,
          floor: r.floor,
          type: r.type,
          status: r.status,
          bedrooms: r.bedrooms ?? null,
          bathrooms: r.bathrooms ?? null,
          has_kitchen: r.hasKitchen ?? null,
          tasks: r.tasks,
          blocker_ids: r.blockerIds,
          notes: r.notes ?? null,
          col_span: r.colSpan ?? null,
        }))
      )
      if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, seeded: allProjects.length })
}
