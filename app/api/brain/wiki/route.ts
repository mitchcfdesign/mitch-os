import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSameOriginOrBrainToken } from '@/lib/route-auth'

export async function GET(req: Request) {
  const unauthorized = requireSameOriginOrBrainToken(req)
  if (unauthorized) return unauthorized

  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')

  let builder = supabase
    .from('knowledge')
    .select('id, title, content, node_type, tags, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (query) {
    builder = builder.ilike('content', `%${query}%`)
  }

  const { data, error } = await builder

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ entries: data })
}

export async function POST(req: Request) {
  const unauthorized = requireSameOriginOrBrainToken(req)
  if (unauthorized) return unauthorized

  const { title, content, node_type, tags, project } = await req.json()
  if (!title || !content) return NextResponse.json({ error: 'title and content required' }, { status: 400 })

  const valid = ['note', 'insight', 'resource', 'decision']
  const type = valid.includes(node_type) ? node_type : 'note'

  const { data, error } = await supabase
    .from('knowledge')
    .insert({ title, content, node_type: type, tags: tags ?? [], project })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entry: data }, { status: 201 })
}
