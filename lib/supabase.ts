import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client — uses service_role key, bypasses RLS
// Never import this in client components
export const supabase = createClient(supabaseUrl, supabaseServiceKey)
