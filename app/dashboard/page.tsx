"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Eye, Share, BarChart3, Settings, Mail } from "lucide-react"
import { CardsList } from "@/components/dashboard/cards-list"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"
import { SignatureGenerator } from "@/components/email/signature-generator"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

interface BusinessCard {
  id: string
  title: string
  slug: string
  isActive: boolean
  data: any
  createdAt: string
  updatedAt: string
  analytics: {
    views: number
    qrScans: number
    contactClicks: number
    socialClicks: number
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [cards, setCards] = useState<BusinessCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin")
    }
  }, [status])

  useEffect(() => {
    if (session?.user) {
      fetchCards()
    }
  }, [session])

  const fetchCards = async () => {
    try {
      const response = await fetch("/api/cards")
      if (!response.ok) throw new Error("Failed to fetch cards")
      const data = await response.json()
      setCards(data.cards || [])
      if (data.cards?.length > 0 && !selectedCardId) {
        setSelectedCardId(data.cards[0].id)
      }
    } catch (error) {
      console.error("Error fetching cards:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCard = () => {
    // Navigate to the main card creation page
    window.location.href = "/"
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Welcome back, {session.user.name || session.user.email}
            </p>
          </div>
          <Button 
            onClick={handleCreateCard}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Card
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Cards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{cards.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {cards.reduce((sum, card) => sum + (card.analytics?.views || 0), 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                QR Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {cards.reduce((sum, card) => sum + (card.analytics?.qrScans || 0), 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Contact Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {cards.reduce((sum, card) => sum + (card.analytics?.contactClicks || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="cards" className="space-y-6">
          <TabsList className="bg-gray-800/50 border-gray-700">
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              My Cards
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Signatures
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <CardsList 
              cards={cards} 
              onCardSelect={setSelectedCardId}
              onCardUpdate={fetchCards}
            />
          </TabsContent>

          <TabsContent value="analytics">
            {selectedCardId ? (
              <AnalyticsDashboard cardId={selectedCardId} />
            ) : (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">Select a card to view analytics</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="email">
            {selectedCardId ? (
              <SignatureGenerator cardId={selectedCardId} />
            ) : (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">Select a card to generate email signatures</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Name</label>
                  <div className="text-white">{session.user.name || "Not set"}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <div className="text-white">{session.user.email}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Plan</label>
                  <div className="text-white">Free Plan</div>
                </div>
                <Button variant="outline" className="mt-4">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}