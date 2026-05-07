import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSameOrigin } from '@/lib/route-auth'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = requireSameOrigin(req)
  if (authError) return authError

  const { id } = await params

  const { error } = await supabase
    .from('blockers')
    .update({ resolved: true, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
