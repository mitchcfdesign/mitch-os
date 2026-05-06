import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.BRAIN_API_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { type, content, source, metadata } = body

  if (!type || !content || !source) {
    return NextResponse.json(
      { error: 'Missing required fields: type, content, source' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('raw_captures')
    .insert({ type, content, source, metadata: metadata ?? null })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 })
}
