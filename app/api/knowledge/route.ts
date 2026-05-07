import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSameOrigin } from '@/lib/route-auth'

export async function GET(req: Request) {
  const unauthorized = requireSameOrigin(req)
  if (unauthorized) return unauthorized

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  let query = supabase
    .from('knowledge')
    .select('id, title, content, node_type, tags, parent_node_id, project, created_at')
    .order('created_at', { ascending: false })

  if (q) query = query.ilike('title', `%${q}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entries: data ?? [] })
}

export async function POST(req: Request) {
  const unauthorized = requireSameOrigin(req)
  if (unauthorized) return unauthorized

  const { title, content, node_type, tags, parent_node_id, project } = await req.json()
  if (!title || !content) return NextResponse.json({ error: 'title and content required' }, { status: 400 })

  const validTypes = ['note', 'insight', 'resource', 'decision']
  const type = validTypes.includes(node_type) ? node_type : 'note'

  const { data, error } = await supabase
    .from('knowledge')
    .insert({ title, content, node_type: type, tags: tags ?? [], parent_node_id, project })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entry: data }, { status: 201 })
}
