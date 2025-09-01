"use client"

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<any>({})
  const [supabaseStatus, setSupabaseStatus] = useState<string>('checking...')

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV,
    })

    // Test Supabase connection
    try {
      const { createClient } = require('@/lib/supabase')
      const supabase = createClient()
      
      supabase.auth.getSession()
        .then(() => {
          setSupabaseStatus('Connected successfully')
        })
        .catch((error: any) => {
          setSupabaseStatus(`Error: ${error.message}`)
        })
    } catch (error: any) {
      setSupabaseStatus(`Client creation error: ${error.message}`)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Debug Information</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Environment Variables</h2>
          <pre className="text-green-400 font-mono text-sm">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Supabase Connection</h2>
          <p className="text-white">{supabaseStatus}</p>
        </div>
      </div>
    </div>
  )
}