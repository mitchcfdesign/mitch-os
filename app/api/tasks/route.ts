import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')

  let query = supabase
    .from('tasks')
    .select('id, title, status, priority, category, due_date, created_at')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (priority) query = query.eq('priority', priority)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tasks: data ?? [] })
}

export async function PATCH(req: Request) {
  const { id, status, priority, title } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const updates: Record<string, unknown> = {}
  if (status !== undefined) updates.status = status
  if (priority !== undefined) updates.priority = priority
  if (title !== undefined) updates.title = title

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ task: data })
}

export async function POST(req: Request) {
  const { title, priority, category, due_date } = await req.json()
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })

  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, priority: priority ?? 'medium', category, due_date, status: 'todo' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ task: data }, { status: 201 })
}
