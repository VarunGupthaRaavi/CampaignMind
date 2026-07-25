import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://jqqthrmlwgwydsrtyomv.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXRocm1sd2d3eWRzcnR5b212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjgxOTYsImV4cCI6MjEwMDU0NDE5Nn0.1npvOz9btcxvYLFocI4jONxOhqAGW7up-iIIY443o2o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
