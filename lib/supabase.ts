import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create the client only if environment variables are present
let supabase: any = null

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    supabase = null
  }
}

// Export the client (can be null)
export { supabase }

// Export a function to safely get the client
export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase environment variables not configured')
    return null
  }
  return supabase
}

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey && supabase)
}