import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.BRAIN_API_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
