"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, Users, Eye, Download, Settings, LogOut } from "lucide-react"
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      // Dynamically import and check Supabase
      const { getSupabaseClient } = await import('@/lib/supabase')
      const supabase = getSupabaseClient()
      
      if (!supabase) {
        console.error('Supabase client not available')
        router.push('/auth/login')
        return
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        router.push('/auth/login')
        return
      }

      console.log('User ID:', user.id)
      setUser(user)

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
      } else if (profile) {
        setProfile(profile)
      }

      // Get user's cards (when implemented)
      // const { data: userCards } = await supabase
      //   .from('business_cards')
      //   .select('*')
      //   .eq('user_id', user.id)
      // setCards(userCards || [])

    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { getSupabaseClient } = await import('@/lib/supabase')
      const supabase = getSupabaseClient()
      if (supabase) {
        await supabase.auth.signOut()
      }
    } catch (error) {
      console.error('Sign out error:', error)
    }
    router.push('/')
  }

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const userInitials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Digital Business Cards</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className={getPlanBadgeColor(profile?.plan || 'free')}>
                {profile?.plan?.toUpperCase() || 'FREE'}
              </Badge>
              
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-sm">
                  <p className="font-medium text-gray-900">
                    {profile?.full_name || user?.email}
                  </p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back, {profile?.full_name || user?.email?.split('@')[0]}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your digital business cards and track their performance.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Cards</p>
                    <p className="text-2xl font-semibold text-gray-900">{cards.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Views</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Contacts</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Download className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Downloads</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Button 
                    className="w-full" 
                    onClick={() => router.push('/')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Card
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* My Cards Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">My Cards</h3>
              <Button onClick={() => router.push('/')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Card
              </Button>
            </div>

            {cards.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cards yet</h3>
                  <p className="text-gray-500 mb-4">
                    Create your first digital business card to get started.
                  </p>
                  <Button onClick={() => router.push('/')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Card
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Cards will be displayed here when implemented */}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}