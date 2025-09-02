"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, Unlock, Eye, Download, ArrowLeft, ArrowRight, Sparkles, CheckCircle, Zap } from "lucide-react"
import QRCodeLib from "qrcode"

import type { UserData } from "@/components/business-card/types"
import { CategorySelector } from "@/components/category-selector"
import { getAllCardCategories, type CardCategory, getCategoryById } from "@/lib/card-categories"
import { LivePreview } from "@/components/business-card/live-preview"
import { CardPreview } from "@/components/business-card/card-preview"
import { OnboardingWelcome } from "@/components/business-card/onboarding-welcome"
import { IdentityForm } from "@/components/business-card/form-sections/identity-form"
import { SocialForm } from "@/components/business-card/form-sections/social-form"
import { CustomizationForm } from "@/components/business-card/form-sections/customization-form"
import { BackContentForm } from "@/components/business-card/form-sections/back-content-form"
import { CardHistoryPanel } from "@/components/business-card/card-history-panel"

const FORM_STEPS = [
  { id: "identity", title: "Identity", description: "Your basic info", component: IdentityForm, icon: "👤" },
  { id: "social", title: "Connect", description: "Social presence", component: SocialForm, icon: "🔗" },
  { id: "customization", title: "Style", description: "Make it yours", component: CustomizationForm, icon: "🎨" },
  { id: "back-content", title: "Showcase", description: "Portfolio & more", component: BackContentForm, icon: "⭐" },
]

export default function DigitalBusinessCard() {
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>('business')
  const [showCategorySelector, setShowCategorySelector] = useState(true)
  const [isLocked, setIsLocked] = useState(true)
  const [unlockCode, setUnlockCode] = useState("")
  const [currentView, setCurrentView] = useState<"qr" | "business">("qr")
  const [currentStep, setCurrentStep] = useState(0)
  const [showWelcome, setShowWelcome] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false)
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
        analytics: {
          enabled: false,
          trackViews: false,
          trackClicks: false,
          showMetrics: false,
        },
        displayOptions: {
          layout: "grid",
          showTechStack: false,
          showMetrics: false,
          showClientName: false,
          sortBy: "date",
        },
      },
      testimonials: {
        enabled: false,
        items: [],
      },
      services: {
        enabled: false,
        items: [],
      },
      additionalInfo: {
        enabled: false,
        bio: "",
        achievements: [],
        certifications: [],
        skills: [],
        experience: [],
      },
    },
    analytics: {
      enabled: false,
      cardViews: Math.floor(Math.random() * 1000) + 100,
      qrScans: Math.floor(Math.random() * 500) + 50,
      contactClicks: Math.floor(Math.random() * 200) + 20,
      socialClicks: Math.floor(Math.random() * 300) + 30,
      lastViewed: new Date().toISOString(),
      popularSections: {
        contact: Math.floor(Math.random() * 100) + 50,
        portfolio: Math.floor(Math.random() * 80) + 30,
        social: Math.floor(Math.random() * 60) + 20,
      },
    },
  })
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [hasData, setHasData] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const [showLivePreview, setShowLivePreview] = useState(false)

  useEffect(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setUnlockCode(code)
  }, [])

  // QR code generation - this creates a preview QR for demo purposes
  useEffect(() => {
    if (hasData || (userData.firstName.trim() && userData.mobile.trim())) {
      const demoSlug = `${userData.firstName.toLowerCase().replace(/\s+/g, '-')}-demo`
      const businessCardUrl = `${window.location.origin}/${demoSlug}`
      QRCodeLib.toDataURL(businessCardUrl, {
        color: {
          dark: "#ea580c",
          light: "#ffffff",
        },
        width: 200,
        margin: 2,
        errorCorrectionLevel: "M",
      }).then(setQrCodeUrl)
    }
  }, [userData, hasData])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const view = urlParams.get("view")
    const data = urlParams.get("data")
    const id = urlParams.get("id")

    if (view === "business") {
      try {
        let parsedData
        if (data) {
          parsedData = JSON.parse(decodeURIComponent(data))
        } else if (id) {
          const storedData = localStorage.getItem(`card_${id}`)
          if (storedData) {
            parsedData = JSON.parse(storedData)
          } else {
            console.error("Business card data not found")
            return
          }
        }
        if (parsedData) {
          setUserData(parsedData)
          setCurrentView("business")
          setHasData(true)
          setIsLocked(true)
          setShowWelcome(false)
        }
      } catch (error) {
        console.error("Error parsing business card data:", error)
      }
    }
  }, [])

  const handleStartOnboarding = () => {
    setShowWelcome(false)
    setShowCategorySelector(true)
  }

  const handleCategorySelect = (category: CardCategory) => {
    setSelectedCategory(category)
    setShowCategorySelector(false)
    setIsLocked(false) 
    setShowLivePreview(true)
    
    // Apply category-specific defaults
    const categoryConfig = getCategoryById(category)
    const defaultTheme = categoryConfig.themes[0]
    
    if (defaultTheme) {
      setUserData(prev => ({
        ...prev,
        backgroundColor: defaultTheme.backgroundColor,
        backgroundGradient: defaultTheme.backgroundGradient,
        textColor: defaultTheme.textColor,
        useGradient: true
      }))
    }
  }

  const handleUnlock = () => {
    setIsLocked(false)
    setShowLivePreview(true)
  }

  const handleSave = async () => {
    if (userData.firstName.trim() && userData.mobile.trim()) {
      // Check if user is authenticated - redirect to signup if not
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          // Redirect to signup if not authenticated
          if (confirm('Sign up to save your card and get a permanent URL with QR code. Continue to create account?')) {
            window.location.href = '/auth/sign-up'
            return
          }
        } else {
          // User is authenticated - save card (implement card saving later)
          alert('Card saving functionality will be implemented with database integration.')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Fallback to signup flow
        if (confirm('Sign up to save your card and get a permanent URL with QR code. Continue to create account?')) {
          window.location.href = '/auth/sign-up'
          return
        }
      }

      setHasData(true)
      setIsLocked(true)
      setShowLivePreview(false)
      setShowSuccess(true)

      const createConfetti = (delay: number) => {
        setTimeout(() => {
          const confetti = document.createElement("div")
          confetti.innerHTML = "🎉"
          confetti.style.position = "fixed"
          confetti.style.top = "50%"
          confetti.style.left = "50%"
          confetti.style.fontSize = "3rem"
          confetti.style.zIndex = "9999"
          confetti.style.pointerEvents = "none"
          confetti.style.animation = "confetti 2s ease-out forwards"
          document.body.appendChild(confetti)

          setTimeout(() => {
            document.body.removeChild(confetti)
          }, 2000)
        }, delay)
      }

      createConfetti(0)
      createConfetti(300)
      createConfetti(600)

      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const handleInputChange = (field: keyof UserData, value: string | boolean | any) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const getSocialMediaOptions = () => {
    const options = []
    if (userData.linkedin) options.push({ value: "linkedin", label: "LinkedIn", url: userData.linkedin })
    if (userData.x) options.push({ value: "x", label: "X (Twitter)", url: userData.x })
    if (userData.threads) options.push({ value: "threads", label: "Threads", url: userData.threads })
    if (userData.facebook) options.push({ value: "facebook", label: "Facebook", url: userData.facebook })
    if (userData.instagram) options.push({ value: "instagram", label: "Instagram", url: userData.instagram })
    if (userData.tiktok) options.push({ value: "tiktok", label: "TikTok", url: userData.tiktok })
    return options
  }

  const getSelectedSocialUrl = () => {
    const socialOptions = getSocialMediaOptions()
    const selected = socialOptions.find((option) => option.value === userData.selectedSocial)
    return selected?.url || ""
  }

  const toggleView = () => {
    setCurrentView(currentView === "qr" ? "business" : "qr")
  }

  const downloadAsPNG = async () => {
    if (!cardRef.current || !hasData) return

    try {
      const html2canvas = (await import("html2canvas")).default

      const originalElement = cardRef.current
      const clone = originalElement.cloneNode(true) as HTMLElement

      const applyComputedStyles = (original: Element, cloned: Element) => {
        const computedStyle = window.getComputedStyle(original)
        const clonedElement = cloned as HTMLElement

        for (let i = 0; i < computedStyle.length; i++) {
          const property = computedStyle[i]
          let value = computedStyle.getPropertyValue(property)

          // Convert OKLCH colors to RGB for html2canvas compatibility
          if (value.includes("oklch") || value.includes("oklab")) {
            // Create a temporary element to get the computed RGB value
            const tempDiv = document.createElement("div")
            tempDiv.style.color = value
            document.body.appendChild(tempDiv)
            const rgbValue = window.getComputedStyle(tempDiv).color
            document.body.removeChild(tempDiv)
            value = rgbValue
          }

          clonedElement.style.setProperty(property, value)
        }

        for (let i = 0; i < original.children.length; i++) {
          applyComputedStyles(original.children[i], cloned.children[i])
        }
      }

      clone.style.position = "absolute"
      clone.style.left = "-9999px"
      clone.style.top = "-9999px"
      document.body.appendChild(clone)

      applyComputedStyles(originalElement, clone)

      const canvas = await html2canvas(clone, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: originalElement.offsetWidth,
        height: originalElement.offsetHeight,
      })

      document.body.removeChild(clone)

      const link = document.createElement("a")
      link.download = `${userData.firstName.toLowerCase()}-business-card.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Error generating PNG:", error)
    }
  }

  const nextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    if (currentStep === 0) {
      return userData.firstName.trim() && userData.mobile.trim()
    }
    return true
  }

  const handleFlipCard = () => {
    setUserData((prev) => ({
      ...prev,
      cardSide: prev.cardSide === "front" ? "back" : "front",
    }))
  }

  const handleLoadCard = (loadedUserData: UserData) => {
    setUserData(loadedUserData)
    setHasData(true)
    setIsHistoryPanelOpen(false)
    if (isLocked) {
      setCurrentView("business")
    }
  }

  const toggleHistoryPanel = () => {
    setIsHistoryPanelOpen(!isHistoryPanelOpen)
  }

  if (showWelcome) {
    return <OnboardingWelcome onStart={handleStartOnboarding} />
  }

  if (showCategorySelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" style={{ paddingTop: !user ? '70px' : '0' }}>
        {/* Sign Up CTA for non-authenticated users */}
        {!user && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-3 text-center">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <span className="text-sm font-medium">
                Create your account to save and share your digital cards permanently
              </span>
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white border-white/30 hover:bg-white/10 text-xs"
                  onClick={() => window.location.href = '/auth/login'}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="bg-white text-orange-600 hover:bg-gray-100 text-xs font-semibold"
                  onClick={() => window.location.href = '/auth/sign-up'}
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-12">
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      </div>
    )
  }

  const CurrentFormComponent = FORM_STEPS[currentStep].component

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative">
        {/* Sign Up CTA for non-authenticated users */}
        {!user && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-3 text-center">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <span className="text-sm font-medium">
                Create your account to save and share your digital business card permanently
              </span>
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white border-white/30 hover:bg-white/10 text-xs"
                  onClick={() => window.location.href = '/auth/login'}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="bg-white text-orange-600 hover:bg-gray-100 text-xs font-semibold"
                  onClick={() => window.location.href = '/auth/sign-up'}
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        )}
      <CardHistoryPanel
        isOpen={isHistoryPanelOpen}
        onToggle={toggleHistoryPanel}
        currentUserData={userData}
        onLoadCard={handleLoadCard}
      />

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-2xl p-8 text-center space-y-4 animate-bounce">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
            <h3 className="text-2xl font-bold text-white">Card Created Successfully!</h3>
            <p className="text-gray-300">Your digital business card is ready to share</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(0) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out;
        }
      `}</style>

      {showLivePreview && !isLocked ? (
        <div className="flex min-h-screen" style={{ paddingTop: !user ? '70px' : '0' }}>
          <div className="w-96 p-6 border-r border-gray-700/50 bg-gray-900/50 backdrop-blur-sm animate-slide-in-left">
            <div className="mb-4">
              <h2 className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-400" />
                Live Preview
              </h2>
              <p className="text-gray-400 text-sm">Watch the magic happen in real-time</p>
            </div>
            <LivePreview
              userData={userData}
              currentView={currentView}
              qrCodeUrl={qrCodeUrl}
              hasData={hasData || Boolean(userData.firstName.trim() && userData.mobile.trim())}
              getSocialMediaOptions={getSocialMediaOptions}
              getSelectedSocialUrl={getSelectedSocialUrl}
              onFlipCard={handleFlipCard}
            />

            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleView}
                className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 transition-all duration-200 hover:scale-105"
              >
                <Eye className="h-4 w-4 mr-2" />
                {currentView === "qr" ? "Business View" : "QR View"}
              </Button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto animate-slide-in-right">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-white text-3xl font-bold">
                    {currentStep === 0 && "Let's start with the basics"}
                    {currentStep === 1 && "Connect your social world"}
                    {currentStep === 2 && "Make it uniquely yours"}
                    {currentStep === 3 && "Showcase your best work"}
                  </h1>
                  <div className="text-gray-400 text-sm">
                    Step {currentStep + 1} of {FORM_STEPS.length}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex gap-2 mb-3">
                    {FORM_STEPS.map((step, index) => (
                      <div
                        key={step.id}
                        className={`flex-1 h-3 rounded-full transition-all duration-500 ${
                          index < currentStep || completedSteps.includes(index)
                            ? "bg-green-500"
                            : index === currentStep
                              ? "bg-orange-500"
                              : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs">
                    {FORM_STEPS.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-1">
                        <span className="text-lg">{step.icon}</span>
                        <span
                          className={
                            index <= currentStep || completedSteps.includes(index)
                              ? "text-orange-400 font-medium"
                              : "text-gray-400"
                          }
                        >
                          {step.title}
                        </span>
                        {completedSteps.includes(index) && <CheckCircle className="h-3 w-3 text-green-400 ml-1" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 transition-all duration-300 hover:border-gray-600/50">
                <CurrentFormComponent
                  userData={userData}
                  onInputChange={handleInputChange}
                  getSocialMediaOptions={getSocialMediaOptions}
                />

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 disabled:opacity-50 transition-all duration-200 hover:scale-105"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === FORM_STEPS.length - 1 ? (
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      disabled={!canProceed()}
                    >
                      <Sparkles className="h-4 w-4" />
                      Complete Your Card!
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 transition-all duration-200 hover:scale-105"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-6 min-h-screen" style={{ paddingTop: !user ? '100px' : '24px' }}>
          <div className="w-full max-w-sm">
            <Card
              ref={cardRef as React.RefObject<HTMLDivElement>}
              className="border-0 rounded-[28px] shadow-2xl overflow-hidden relative backdrop-blur-sm transition-all duration-300 hover:scale-105"
              style={{
                background: userData.useGradient ? userData.backgroundGradient : userData.backgroundColor,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 16px rgba(0, 0, 0, 0.2)",
              }}
            >
              <CardContent className="p-0">
                <CardPreview
                  userData={userData}
                  currentView={currentView}
                  qrCodeUrl={qrCodeUrl}
                  hasData={hasData}
                  cardRef={cardRef}
                  getSocialMediaOptions={getSocialMediaOptions}
                  getSelectedSocialUrl={getSelectedSocialUrl}
                  onFlipCard={handleFlipCard}
                />
              </CardContent>

              <div className="absolute bottom-6 right-6 flex gap-3">
                {hasData && userData.firstName && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleView}
                    className="text-gray-400 hover:text-white hover:bg-white/10 p-3 h-10 w-10 rounded-full backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-110"
                    title={currentView === "qr" ? "View Business Card" : "View QR Card"}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {hasData && userData.firstName && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadAsPNG}
                    className="text-gray-400 hover:text-white hover:bg-white/10 p-3 h-10 w-10 rounded-full backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-110"
                    title="Download as PNG"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isLocked ? handleUnlock : () => setIsLocked(true)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 p-3 h-10 w-10 rounded-full backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-110"
                >
                  {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
    </AuthRedirect>
  )
}
