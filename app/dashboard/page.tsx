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

      // Get user's cards
      const { data: userCards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (cardsError) {
        console.error('Cards fetch error:', cardsError)
      } else {
        setCards(userCards || [])
      }

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

  const userInitials = user?.email?.charAt(0).toUpperCase() || 'U'

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
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-sm">
                  <p className="font-medium text-gray-900">{user?.email}</p>
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
              Welcome back, {user?.email?.split('@')[0]}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your saved digital business cards.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mb-8">
            <Card className="max-w-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Saved Cards</p>
                    <p className="text-2xl font-semibold text-gray-900">{cards.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <Button 
              className="bg-blue-600 hover:bg-blue-700" 
              onClick={() => router.push('/')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Card
            </Button>
          </div>

          {/* My Cards Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">My Saved Cards</h3>

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
                {cards.map((card: any) => (
                  <Card key={card.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-2">{card.title}</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Created {new Date(card.created_at).toLocaleDateString()}
                      </p>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(`/${card.slug}`, '_blank')}
                        >
                          View Card
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${card.slug}`)}
                        >
                          Copy Link
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}