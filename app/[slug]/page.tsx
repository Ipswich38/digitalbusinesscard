"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { BusinessCard } from '@/components/business-card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Share, QrCode } from 'lucide-react'
import Link from 'next/link'

interface CardData {
  id: string
  title: string
  slug: string
  is_active: boolean
  data: any
  created_at: string
  updated_at: string
}

export default function PublicCardPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [card, setCard] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchCard()
      trackView()
    }
  }, [slug])

  const fetchCard = async () => {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('business_cards')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setCard(data)
      }
    } catch (error) {
      console.error('Error fetching card:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const trackView = async () => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          action: 'view',
        }),
      })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  const trackClick = async (action: string) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          action,
        }),
      })
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: card?.title || 'Digital Business Card',
          text: `Check out ${card?.data?.firstName || 'this'}'s digital business card`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // Could add a toast notification here
    }
    
    trackClick('share')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (notFound || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Card Not Found</h1>
          <p className="text-gray-400 mb-6">This digital business card doesn't exist or has been deactivated.</p>
          <Link href="/">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header with Share Button */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <Button 
            onClick={shareCard}
            variant="ghost" 
            className="text-gray-400 hover:text-white"
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Business Card */}
        <div className="mb-8">
          <BusinessCard 
            data={card.data} 
            onContactClick={() => trackClick('contact')}
            onSocialClick={() => trackClick('social')}
          />
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Create your own digital business card
          </p>
          <Link href="/auth/signup">
            <Button className="bg-orange-600 hover:bg-orange-700 w-full">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}