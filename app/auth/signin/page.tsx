"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [clientError, setClientError] = useState('')
  const router = useRouter()
  
  // Try to create Supabase client with error handling
  let supabase: any = null
  try {
    supabase = createClient()
  } catch (err: any) {
    if (!clientError) {
      setClientError(err.message)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase) {
      setError('Authentication service is not available. Please check configuration.')
      return
    }
    
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Success! Redirecting to dashboard...')
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    }
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setError('Authentication service is not available. Please check configuration.')
      return
    }
    
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <div className="flex items-center justify-center mb-8">
          <Link
            href="/"
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Sign In to Your Account
            </CardTitle>
            <p className="text-gray-400">
              Access your digital business cards
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
            >
              <Mail className="h-4 w-4 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Messages */}
            {(error || clientError) && (
              <Alert className="border-red-600 bg-red-900/20">
                <AlertDescription className="text-red-400">
                  {error || clientError}
                  {clientError && (
                    <div className="mt-2 text-xs text-gray-500">
                      This usually means environment variables are not configured properly.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="border-green-600 bg-green-900/20">
                <AlertDescription className="text-green-400">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-orange-400 hover:text-orange-300">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}