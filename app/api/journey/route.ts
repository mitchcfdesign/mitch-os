import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSameOrigin } from '@/lib/route-auth'

export async function GET(req: Request) {
  const unauthorized = requireSameOrigin(req)
  if (unauthorized) return unauthorized

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  let query = supabase
    .from('journey_logs')
    .select('id, title, content, log_type, goal_id, related_task_id, created_at')
    .order('created_at', { ascending: false })

  if (type) query = query.eq('log_type', type)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ logs: data ?? [] })
}

export async function POST(req: Request) {
  const unauthorized = requireSameOrigin(req)
  if (unauthorized) return unauthorized

  const { title, content, log_type, goal_id, related_task_id } = await req.json()
  if (!title || !content) return NextResponse.json({ error: 'title and content required' }, { status: 400 })

  const valid = ['milestone', 'win', 'lesson', 'reflection', 'setback']
  const type = valid.includes(log_type) ? log_type : 'reflection'

  const { data, error } = await supabase
    .from('journey_logs')
    .insert({ title, content, log_type: type, goal_id, related_task_id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ log: data }, { status: 201 })
}
