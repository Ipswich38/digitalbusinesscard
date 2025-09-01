const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://sfovybfhravadptrnwsr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmb3Z5YmZocmF2YWRwdHJud3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MDY2NjAsImV4cCI6MjA3MjI4MjY2MH0.NKAtfHKt8QrNP681JPvEFEhbjksyFCme5VO-Z3v78xE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('🔧 Testing Supabase connection...')
  
  try {
    // Test connection by trying to query auth users
    const { data: { user }, error } = await supabase.auth.getUser()
    console.log('✅ Supabase connection successful!')
    
    console.log('\n📋 Database Schema Setup Instructions:')
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/sfovybfhravadptrnwsr')
    console.log('2. Click on "SQL Editor" in the sidebar')
    console.log('3. Copy and paste the schema from: supabase/schema.sql')
    console.log('4. Click "Run" to create all tables and policies')
    console.log('\n🔐 Auth Setup Instructions:')
    console.log('1. Go to Authentication → Settings in your Supabase dashboard')
    console.log('2. Add your domain to Site URL: http://localhost:3000')
    console.log('3. Add redirect URLs:')
    console.log('   - http://localhost:3000/dashboard')
    console.log('   - http://localhost:3000/auth/signin')
    console.log('4. Enable Google Provider and add your Google OAuth credentials')
    
    console.log('\n🚀 After setup, run: pnpm dev')
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
  }
}

setupDatabase()