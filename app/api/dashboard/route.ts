import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const [goalsRes, tasksRes, capturesRes] = await Promise.all([
    supabase
      .from('goals')
      .select('id, title, progress, status, target_date, color, phase')
      .eq('status', 'active')
      .order('created_at', { ascending: true }),

    supabase
      .from('tasks')
      .select('id, title, status, priority, category, due_date')
      .neq('status', 'done')
      .order('created_at', { ascending: false })
      .limit(10),

    supabase
      .from('raw_captures')
      .select('id, type, content, source, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return NextResponse.json({
    goals: goalsRes.data ?? [],
    tasks: tasksRes.data ?? [],
    recentCaptures: capturesRes.data ?? [],
  })
}
