"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, Unlock, Eye, Download, ArrowLeft, ArrowRight, Sparkles, CheckCircle, Zap, CreditCard } from "lucide-react"
import QRCodeLib from "qrcode"

import type { UserData } from "@/components/business-card/types"
import { type CardCategory } from "@/lib/card-categories"
import { TemplateCarousel } from "@/components/template-carousel"
import { LivePreview } from "@/components/business-card/live-preview"
import { CardPreview } from "@/components/business-card/card-preview"
import { OnboardingWelcome } from "@/components/business-card/onboarding-welcome"
import { IdentityForm } from "@/components/business-card/form-sections/identity-form"
import { SocialForm } from "@/components/business-card/form-sections/social-form"
import { CustomizationForm } from "@/components/business-card/form-sections/customization-form"
import { BackContentForm } from "@/components/business-card/form-sections/back-content-form"

const FORM_STEPS = [
  { id: "identity", title: "Identity", description: "Your basic info", component: IdentityForm, icon: "👤" },
  { id: "social", title: "Connect", description: "Social presence", component: SocialForm, icon: "🔗" },
  { id: "customization", title: "Style", description: "Make it yours", component: CustomizationForm, icon: "🎨" },
  { id: "back-content", title: "Showcase", description: "Portfolio & more", component: BackContentForm, icon: "⭐" },
]

type AppState = "welcome" | "templates" | "editing" | "preview"

export default function OnePageDigitalCard() {
  const [appState, setAppState] = useState<AppState>("welcome")
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>('business')
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    title: "",
    mobile: "",
    email: "",
    company: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    linkedin: "",
    x: "",
    threads: "",
    customFields: [],
    logo: "",
    backgroundColor: "#1C1B1F",
    textColor: "#E6E1E5",
    showMobile: false,
    showEmail: false,
    selectedSocial: "none",
    logoShape: "auto",
    backgroundGradient: "",
    useGradient: false,
    fontPair: "Modern Serif",
    animatedBackground: false,
    animatedBackgroundType: "",
    cardStyle: "glassmorphic",
    cornerRadius: "rounded",
    cardSide: "front",
    backContent: {
      portfolio: {
        enabled: false,
        projects: [],
        analytics: { enabled: false, trackViews: false, trackClicks: false, showMetrics: false },
        displayOptions: { layout: "grid", showTechStack: false, showMetrics: false, showClientName: false, sortBy: "date" },
      },
      testimonials: { enabled: false, items: [] },
      services: { enabled: false, items: [] },
      additionalInfo: { enabled: false, bio: "", achievements: [], certifications: [], skills: [], experience: [] },
    },
    analytics: {
      enabled: false,
      cardViews: Math.floor(Math.random() * 1000) + 100,
      qrScans: Math.floor(Math.random() * 500) + 50,
      contactClicks: Math.floor(Math.random() * 200) + 20,
      socialClicks: Math.floor(Math.random() * 300) + 30,
      lastViewed: new Date().toISOString(),
      popularSections: { contact: Math.floor(Math.random() * 100) + 50, portfolio: Math.floor(Math.random() * 80) + 30, social: Math.floor(Math.random() * 60) + 20 },
    },
  })
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [currentView, setCurrentView] = useState<"qr" | "business">("qr")
  const cardRef = useRef<HTMLDivElement>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // QR code generation
  useEffect(() => {
    if (userData.firstName.trim()) {
      const demoSlug = `${userData.firstName.toLowerCase().replace(/\s+/g, '-')}-demo`
      const businessCardUrl = `${window.location.origin}/${demoSlug}`
      QRCodeLib.toDataURL(businessCardUrl, {
        color: { dark: "#ea580c", light: "#ffffff" },
        width: 200,
        margin: 2,
        errorCorrectionLevel: "M",
      }).then(setQrCodeUrl)
    }
  }, [userData])

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { getSupabaseClient } = await import('@/lib/supabase')
        const supabase = getSupabaseClient()
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser()
          setIsAuthenticated(!!user)
        }
      } catch (error) {
        console.log('Auth check failed:', error)
      }
    }
    checkAuth()
  }, [])

  const handleTemplateSelect = (category: CardCategory, templateData: UserData) => {
    setSelectedCategory(category)
    setUserData(templateData)
    setAppState("editing")
    setCurrentStep(0)
  }

  const handleInputChange = (field: keyof UserData, value: string | boolean | any) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    if (currentStep === 0) return userData.firstName.trim() && userData.title.trim()
    return true
  }

  const nextStep = () => {
    if (canProceed() && currentStep < FORM_STEPS.length - 1) {
      setCompletedSteps([...new Set([...completedSteps, currentStep])])
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    setAppState("preview")
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleSaveToAccount = async () => {
    if (!isAuthenticated) {
      if (confirm('Create a free account to save your card permanently and get analytics. Continue?')) {
        window.location.href = '/auth/sign-up'
      }
      return
    }

    // Save to database for authenticated users
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${userData.firstName}'s Card`,
          data: userData,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Card saved! Share it at: ${result.url}`)
      } else {
        throw new Error('Failed to save card')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save card. Please try again.')
    }
  }

  const handlePayPerUse = async () => {
    try {
      const response = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardData: userData,
          userEmail: userData.email || null,
        }),
      })

      const { url, sessionId, message } = await response.json()
      
      if (url) {
        window.location.href = url
      } else {
        console.log('Payment demo:', message)
        // For demo purposes, go directly to success page
        window.location.href = `/download-success?session_id=${sessionId}&demo=true`
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment processing failed. Please try again.')
    }
  }

  const downloadAsPNG = async () => {
    if (!cardRef.current) return

    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(cardRef.current)
      const link = document.createElement("a")
      link.download = `${userData.firstName || 'digital-card'}-business-card.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const toggleView = () => {
    setCurrentView(currentView === "qr" ? "business" : "qr")
  }

  // Render different states
  const renderWelcome = () => (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Create Your
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent block">
              Digital Card
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Professional digital business cards in minutes. No design skills needed. 
            Choose a template, customize, and share instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Choose Template</h3>
            <p className="text-gray-400">Pick from professional templates</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Customize</h3>
            <p className="text-gray-400">Make it uniquely yours</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Share</h3>
            <p className="text-gray-400">Download or save to account</p>
          </div>
        </div>

        <Button
          onClick={() => setAppState("templates")}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-4 text-lg rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          Get Started Free
        </Button>
      </div>
    </div>
  )

  const renderTemplates = () => (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <TemplateCarousel onTemplateSelect={handleTemplateSelect} />
        
        <div className="text-center mt-8">
          <Button
            onClick={() => setAppState("welcome")}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )

  const renderEditing = () => {
    const CurrentStepComponent = FORM_STEPS[currentStep]?.component

    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Progress Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <Button
                  onClick={() => setAppState("templates")}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Choose Different Template
                </Button>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Customize Your {selectedCategory} Card
                  </h2>
                  <p className="text-gray-400">
                    Step {currentStep + 1} of {FORM_STEPS.length}: {FORM_STEPS[currentStep]?.title}
                  </p>
                </div>
                
                <div className="w-20"></div>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-center space-x-4 mb-8">
                {FORM_STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                      ${index === currentStep 
                        ? "bg-orange-600 text-white shadow-lg" 
                        : completedSteps.includes(index)
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300"
                      }
                    `}>
                      {completedSteps.includes(index) ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < FORM_STEPS.length - 1 && (
                      <div className={`
                        w-16 h-1 mx-2 rounded transition-all duration-200
                        ${completedSteps.includes(index) ? "bg-green-600" : "bg-gray-700"}
                      `} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                        <span className="text-2xl">{FORM_STEPS[currentStep]?.icon}</span>
                        {FORM_STEPS[currentStep]?.title}
                      </h3>
                      <p className="text-gray-400">{FORM_STEPS[currentStep]?.description}</p>
                    </div>

                    {CurrentStepComponent && (
                      <CurrentStepComponent
                        userData={userData}
                        onInputChange={handleInputChange}
                        selectedCategory={selectedCategory}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white"
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === FORM_STEPS.length - 1 ? (
                    <Button
                      onClick={handleFinish}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      disabled={!canProceed()}
                    >
                      <Sparkles className="h-4 w-4" />
                      Finish Card
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Live Preview */}
              <div className="sticky top-8">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">Live Preview</h3>
                      <Button
                        onClick={toggleView}
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:border-gray-500"
                      >
                        {currentView === "qr" ? "Show QR" : "Show Card"}
                      </Button>
                    </div>

                    <div ref={cardRef}>
                      {currentView === "business" ? (
                        <LivePreview
                          userData={userData}
                          qrCodeUrl={qrCodeUrl}
                          onInputChange={handleInputChange}
                        />
                      ) : (
                        <CardPreview
                          userData={userData}
                          qrCodeUrl={qrCodeUrl}
                          onInputChange={handleInputChange}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPreview = () => (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              {showSuccess && <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />}
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Your Card is Ready! 🎉
            </h1>
            <p className="text-gray-300 text-lg">
              Your professional digital card is complete. Choose how you'd like to use it:
            </p>
          </div>

          {/* Preview Card */}
          <div className="mb-12">
            <Card className="max-w-md mx-auto bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div ref={cardRef}>
                  <LivePreview
                    userData={userData}
                    qrCodeUrl={qrCodeUrl}
                    onInputChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Free Account Option */}
            <Card className="bg-gray-800/50 border-gray-700 hover:border-orange-500 transition-all duration-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Unlock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Save to Free Account</h3>
                <p className="text-gray-400 mb-6">
                  • Permanent URL & QR code<br/>
                  • Access from any device<br/>
                  • Simple analytics<br/>
                  • Unlimited edits
                </p>
                <Button
                  onClick={handleSaveToAccount}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isAuthenticated ? 'Save to Account' : 'Create Free Account'}
                </Button>
              </CardContent>
            </Card>

            {/* Pay-per-use Option */}
            <Card className="bg-gray-800/50 border-gray-700 hover:border-orange-500 transition-all duration-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Download Now</h3>
                <p className="text-gray-400 mb-6">
                  • Instant PNG download<br/>
                  • No account needed<br/>
                  • Print ready<br/>
                  • One-time payment: $2.99
                </p>
                <Button
                  onClick={handlePayPerUse}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Pay & Download
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Back to Edit */}
          <Button
            onClick={() => setAppState("editing")}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Make Changes
          </Button>
        </div>
      </div>
    </div>
  )


  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Auth Banner */}
      {!isAuthenticated && appState !== "welcome" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-2 text-center text-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span>Create a free account to save cards permanently</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10 text-xs"
                onClick={() => window.location.href = '/auth/login'}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-white text-orange-600 hover:bg-gray-100 text-xs"
                onClick={() => window.location.href = '/auth/sign-up'}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={!isAuthenticated && appState !== "welcome" ? "pt-12" : ""}>
        {appState === "welcome" && renderWelcome()}
        {appState === "templates" && renderTemplates()}
        {appState === "editing" && renderEditing()}
        {appState === "preview" && renderPreview()}
      </div>
    </div>
  )
}