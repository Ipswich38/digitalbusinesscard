"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { getAllCardCategories, type CardCategory } from '@/lib/card-categories'
import { BusinessCard } from '@/components/business-card'
import type { UserData } from '@/components/business-card/types'

// Template data for each category
const TEMPLATE_DATA: Record<CardCategory, UserData[]> = {
  business: [
    {
      firstName: "Sarah Johnson",
      title: "Marketing Director",
      mobile: "+1 (555) 123-4567",
      email: "sarah@company.com",
      company: "Digital Solutions Inc",
      linkedin: "https://linkedin.com/in/sarah-johnson",
      x: "",
      threads: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      customFields: [],
      logo: "",
      backgroundColor: "#1C1B1F",
      textColor: "#E6E1E5",
      showMobile: true,
      showEmail: true,
      selectedSocial: "linkedin",
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
        portfolio: { enabled: false, projects: [], analytics: { enabled: false, trackViews: false, trackClicks: false, showMetrics: false }, displayOptions: { layout: "grid", showTechStack: false, showMetrics: false, showClientName: false, sortBy: "date" } },
        testimonials: { enabled: false, items: [] },
        services: { enabled: false, items: [] },
        additionalInfo: { enabled: false, bio: "", achievements: [], certifications: [], skills: [], experience: [] }
      },
      analytics: { enabled: false, cardViews: 234, qrScans: 45, contactClicks: 12, socialClicks: 18, lastViewed: new Date().toISOString(), popularSections: { contact: 67, portfolio: 34, social: 23 } }
    },
    {
      firstName: "Alex Chen",
      title: "Software Engineer",
      mobile: "+1 (555) 987-6543",
      email: "alex@techcorp.com",
      company: "TechCorp",
      linkedin: "https://linkedin.com/in/alex-chen",
      x: "https://x.com/alexchen",
      threads: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      customFields: [],
      logo: "",
      backgroundColor: "#0F172A",
      textColor: "#F1F5F9",
      showMobile: true,
      showEmail: true,
      selectedSocial: "linkedin",
      logoShape: "auto",
      backgroundGradient: "from-blue-900 to-purple-900",
      useGradient: true,
      fontPair: "Tech Sans",
      animatedBackground: false,
      animatedBackgroundType: "",
      cardStyle: "modern",
      cornerRadius: "sharp",
      cardSide: "front",
      backContent: {
        portfolio: { enabled: false, projects: [], analytics: { enabled: false, trackViews: false, trackClicks: false, showMetrics: false }, displayOptions: { layout: "grid", showTechStack: false, showMetrics: false, showClientName: false, sortBy: "date" } },
        testimonials: { enabled: false, items: [] },
        services: { enabled: false, items: [] },
        additionalInfo: { enabled: false, bio: "", achievements: [], certifications: [], skills: [], experience: [] }
      },
      analytics: { enabled: false, cardViews: 156, qrScans: 28, contactClicks: 8, socialClicks: 15, lastViewed: new Date().toISOString(), popularSections: { contact: 45, portfolio: 28, social: 19 } }
    }
  ],
  social: [
    {
      firstName: "Luna Vibes",
      title: "Content Creator",
      mobile: "+1 (555) 111-2222",
      email: "luna@creator.com",
      company: "Independent",
      linkedin: "",
      x: "https://x.com/lunavibes",
      threads: "https://threads.net/lunavibes",
      facebook: "",
      instagram: "https://instagram.com/lunavibes",
      tiktok: "https://tiktok.com/@lunavibes",
      customFields: [],
      logo: "",
      backgroundColor: "#EC4899",
      textColor: "#FFFFFF",
      showMobile: false,
      showEmail: false,
      selectedSocial: "instagram",
      logoShape: "circle",
      backgroundGradient: "from-pink-500 to-purple-600",
      useGradient: true,
      fontPair: "Playful",
      animatedBackground: true,
      animatedBackgroundType: "gradient",
      cardStyle: "creative",
      cornerRadius: "rounded",
      cardSide: "front",
      backContent: {
        portfolio: { enabled: false, projects: [], analytics: { enabled: false, trackViews: false, trackClicks: false, showMetrics: false }, displayOptions: { layout: "grid", showTechStack: false, showMetrics: false, showClientName: false, sortBy: "date" } },
        testimonials: { enabled: false, items: [] },
        services: { enabled: false, items: [] },
        additionalInfo: { enabled: false, bio: "", achievements: [], certifications: [], skills: [], experience: [] }
      },
      analytics: { enabled: false, cardViews: 892, qrScans: 134, contactClicks: 45, socialClicks: 267, lastViewed: new Date().toISOString(), popularSections: { contact: 123, portfolio: 89, social: 178 } }
    }
  ],
  meme: [
    {
      firstName: "Meme Lord",
      title: "Professional Shitposter",
      mobile: "+1 (555) 420-6969",
      email: "memes@internet.com",
      company: "The Internet",
      linkedin: "",
      x: "https://x.com/memelord",
      threads: "",
      facebook: "",
      instagram: "https://instagram.com/memelord",
      tiktok: "https://tiktok.com/@memelord",
      customFields: [],
      logo: "",
      backgroundColor: "#22C55E",
      textColor: "#FFFFFF",
      showMobile: false,
      showEmail: true,
      selectedSocial: "x",
      logoShape: "auto",
      backgroundGradient: "from-green-400 to-blue-500",
      useGradient: true,
      fontPair: "Fun",
      animatedBackground: true,
      animatedBackgroundType: "particles",
      cardStyle: "playful",
      cornerRadius: "rounded",
      cardSide: "front",
      backContent: {
        portfolio: { enabled: false, projects: [], analytics: { enabled: false, trackViews: false, trackClicks: false, showMetrics: false }, displayOptions: { layout: "grid", showTechStack: false, showMetrics: false, showClientName: false, sortBy: "date" } },
        testimonials: { enabled: false, items: [] },
        services: { enabled: false, items: [] },
        additionalInfo: { enabled: false, bio: "", achievements: [], certifications: [], skills: [], experience: [] }
      },
      analytics: { enabled: false, cardViews: 1337, qrScans: 420, contactClicks: 69, socialClicks: 888, lastViewed: new Date().toISOString(), popularSections: { contact: 200, portfolio: 150, social: 300 } }
    }
  ],
  fan: [
    {
      firstName: "Taylor Swift",
      title: "Swiftie Forever",
      mobile: "+1 (555) 989-1989",
      email: "swiftie@fanclub.com",
      company: "Swiftie Nation",
      linkedin: "",
      x: "https://x.com/swiftie",
      threads: "",
      facebook: "",
      instagram: "https://instagram.com/swiftie",
      tiktok: "https://tiktok.com/@swiftie",
      customFields: [],
      logo: "",
      backgroundColor: "#7C3AED",
      textColor: "#FFFFFF",
      showMobile: false,
      showEmail: true,
      selectedSocial: "instagram",
      logoShape: "heart",
      backgroundGradient: "from-purple-600 to-pink-600",
      useGradient: true,
      fontPair: "Elegant",
      animatedBackground: true,
      animatedBackgroundType: "sparkles",
      cardStyle: "fan",
      cornerRadius: "rounded",
      cardSide: "front",
      backContent: {
        portfolio: { enabled: false, projects: [], analytics: { enabled: false, trackViews: false, trackClicks: false, showMetrics: false }, displayOptions: { layout: "grid", showTechStack: false, showMetrics: false, showClientName: false, sortBy: "date" } },
        testimonials: { enabled: false, items: [] },
        services: { enabled: false, items: [] },
        additionalInfo: { enabled: false, bio: "", achievements: [], certifications: [], skills: [], experience: [] }
      },
      analytics: { enabled: false, cardViews: 2024, qrScans: 131, contactClicks: 55, socialClicks: 189, lastViewed: new Date().toISOString(), popularSections: { contact: 167, portfolio: 89, social: 234 } }
    }
  ],
  art: [
    {
      firstName: "Maya Artist",
      title: "Digital Artist",
      mobile: "+1 (555) 333-7777",
      email: "maya@artworld.com",
      company: "Creative Studio",
      linkedin: "https://linkedin.com/in/maya-artist",
      x: "",
      threads: "",
      facebook: "",
      instagram: "https://instagram.com/mayaartist",
      tiktok: "",
      customFields: [],
      logo: "",
      backgroundColor: "#F59E0B",
      textColor: "#1F2937",
      showMobile: true,
      showEmail: true,
      selectedSocial: "instagram",
      logoShape: "auto",
      backgroundGradient: "from-amber-400 to-orange-500",
      useGradient: true,
      fontPair: "Artistic",
      animatedBackground: false,
      animatedBackgroundType: "",
      cardStyle: "artistic",
      cornerRadius: "rounded",
      cardSide: "front",
      backContent: {
        portfolio: { enabled: false, projects: [], analytics: { enabled: false, trackViews: false, trackClicks: false, showMetrics: false }, displayOptions: { layout: "grid", showTechStack: false, showMetrics: false, showClientName: false, sortBy: "date" } },
        testimonials: { enabled: false, items: [] },
        services: { enabled: false, items: [] },
        additionalInfo: { enabled: false, bio: "", achievements: [], certifications: [], skills: [], experience: [] }
      },
      analytics: { enabled: false, cardViews: 445, qrScans: 67, contactClicks: 23, socialClicks: 78, lastViewed: new Date().toISOString(), popularSections: { contact: 89, portfolio: 156, social: 67 } }
    }
  ]
}

interface TemplateCarouselProps {
  onTemplateSelect: (category: CardCategory, templateData: UserData) => void
}

export function TemplateCarousel({ onTemplateSelect }: TemplateCarouselProps) {
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>('business')
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0)
  const categories = getAllCardCategories()
  const currentTemplates = TEMPLATE_DATA[selectedCategory] || []

  const nextTemplate = () => {
    setCurrentTemplateIndex((prev) => 
      prev >= currentTemplates.length - 1 ? 0 : prev + 1
    )
  }

  const prevTemplate = () => {
    setCurrentTemplateIndex((prev) => 
      prev <= 0 ? currentTemplates.length - 1 : prev - 1
    )
  }

  const handleCategoryChange = (category: CardCategory) => {
    setSelectedCategory(category)
    setCurrentTemplateIndex(0)
  }

  const handleUseTemplate = () => {
    if (currentTemplates[currentTemplateIndex]) {
      onTemplateSelect(selectedCategory, currentTemplates[currentTemplateIndex])
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Choose Your Template
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Start with a professionally designed template and make it your own. 
          Swipe through categories and templates to find your perfect style.
        </p>
      </div>

      {/* Category Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`
              px-6 py-3 rounded-full transition-all duration-200
              ${selectedCategory === category.id 
                ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg" 
                : "bg-transparent border-gray-600 text-gray-300 hover:border-orange-500 hover:text-orange-400"
              }
            `}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>

      {/* Template Carousel */}
      <div className="relative">
        {currentTemplates.length > 0 && (
          <>
            {/* Navigation Buttons */}
            <Button
              onClick={prevTemplate}
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
              disabled={currentTemplates.length <= 1}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              onClick={nextTemplate}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
              disabled={currentTemplates.length <= 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Template Display */}
            <div className="flex justify-center items-center min-h-[600px]">
              <div className="w-full max-w-md">
                <Card className="bg-transparent border-gray-700 shadow-2xl">
                  <CardContent className="p-6">
                    <BusinessCard 
                      data={currentTemplates[currentTemplateIndex]}
                      onContactClick={() => {}}
                      onSocialClick={() => {}}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Template Info */}
            <div className="text-center mt-6">
              <p className="text-gray-400 mb-4">
                Template {currentTemplateIndex + 1} of {currentTemplates.length}
              </p>
              
              <Button
                onClick={handleUseTemplate}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <Sparkles className="h-5 w-5" />
                Use This Template
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Touch/Swipe Instructions */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>← Swipe or use arrows to browse templates →</p>
      </div>
    </div>
  )
}