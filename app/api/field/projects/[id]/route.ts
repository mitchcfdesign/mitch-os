import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSameOrigin } from '@/lib/route-auth'
import { buildProject } from '../route'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = requireSameOrigin(req)
  if (authError) return authError

  const { id } = await params

  const [{ data: proj, error: pErr }, { data: rooms, error: rErr }, { data: blockers, error: bErr }] =
    await Promise.all([
      supabase.from('projects').select('*').eq('id', id).single(),
      supabase.from('rooms').select('*').eq('project_id', id),
      supabase.from('blockers').select('*').eq('project_id', id).eq('resolved', false),
    ])

  if (pErr) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  if (rErr || bErr) return NextResponse.json({ error: rErr?.message ?? bErr?.message }, { status: 500 })

  return NextResponse.json({ project: buildProject(proj as never, (rooms ?? []) as never, (blockers ?? []) as never) })
}
