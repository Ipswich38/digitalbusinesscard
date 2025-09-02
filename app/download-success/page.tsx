"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Download, Home } from 'lucide-react'

function DownloadSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const sessionId = searchParams.get('session_id')
  const isDemo = searchParams.get('demo') === 'true'

  useEffect(() => {
    if (sessionId) {
      // In a real implementation, verify payment with your payment processor
      // and then allow download
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    } else {
      setError('Invalid session')
      setIsLoading(false)
    }
  }, [sessionId])

  const handleDownload = () => {
    if (isDemo) {
      alert('Demo mode: In production, this would download your purchased card')
      return
    }
    
    // In production, this would:
    // 1. Verify the payment was successful
    // 2. Generate/retrieve the card image
    // 3. Trigger download
    
    // For now, redirect to home
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Processing your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <Card className="max-w-md w-full bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button
              onClick={() => router.push('/')}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-400">
              Thank you for your purchase. Your digital business card is ready for download.
            </p>
          </div>

          {isDemo && (
            <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm">
                <strong>Demo Mode:</strong> This is a demonstration. In production, payment processing would be integrated with Stripe, PayPal, or similar.
              </p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <Button
              onClick={handleDownload}
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Your Card
            </Button>

            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:border-gray-500"
            >
              <Home className="h-4 w-4 mr-2" />
              Create Another Card
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Receipt will be sent to your email</p>
            <p>Need help? Contact support@yourdomain.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DownloadSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <DownloadSuccessContent />
    </Suspense>
  )
}