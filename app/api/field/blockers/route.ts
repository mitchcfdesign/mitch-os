import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSameOrigin } from '@/lib/route-auth'

export async function POST(req: Request) {
  const authError = requireSameOrigin(req)
  if (authError) return authError

  const body = await req.json()
  const { id, project_id, type, description, owner, affected_room_ids, days_active, assumption } = body

  if (!id || !project_id || !type || !description || !owner) {
    return NextResponse.json({ error: 'Missing required fields: id, project_id, type, description, owner' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('blockers')
    .insert({
      id, project_id, type, description, owner,
      affected_room_ids: affected_room_ids ?? [],
      days_active: days_active ?? 0,
      assumption: assumption ?? null,
      resolved: false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ blocker: data }, { status: 201 })
}
