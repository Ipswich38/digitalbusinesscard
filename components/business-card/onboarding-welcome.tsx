"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Zap, Share2, ArrowRight, Star, Users, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface OnboardingWelcomeProps {
  onStart: () => void
}

export function OnboardingWelcome({ onStart }: OnboardingWelcomeProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const features = [
    "Professional networking made simple",
    "Stand out with stunning designs",
    "Share instantly with QR codes",
    "Track your card's performance",
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div
        className={`max-w-4xl mx-auto text-center space-y-12 relative z-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 backdrop-blur-sm animate-bounce">
            <Sparkles className="h-5 w-5 text-orange-400 animate-spin" />
            <span className="text-orange-300 font-medium">Welcome to the future of networking</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 text-balance leading-tight">
            Your digital business card
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-gradient">
              that works harder
            </span>
          </h1>

          <div className="h-8 flex items-center justify-center">
            <p className="text-2xl text-gray-300 text-balance transition-all duration-500 transform">
              {features[currentFeature]}
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>10,000+ professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>2 min setup</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 my-16">
          {[
            {
              icon: Zap,
              color: "blue",
              title: "Lightning Fast Setup",
              description: "Get your professional card ready in under 2 minutes with our intuitive builder",
              delay: "delay-100",
            },
            {
              icon: Sparkles,
              color: "purple",
              title: "Live Magic Preview",
              description: "Watch your card transform in real-time as you customize every detail",
              delay: "delay-200",
            },
            {
              icon: Share2,
              color: "green",
              title: "Share Everywhere",
              description: "QR codes, direct links, or beautiful PNG downloads - your choice",
              delay: "delay-300",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className={`bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${feature.delay} animate-fade-in-up group`}
            >
              <CardContent className="p-8 text-center space-y-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-${feature.color}-500/20 flex items-center justify-center mx-auto group-hover:bg-${feature.color}-500/30 transition-colors duration-300`}
                >
                  <feature.icon
                    className={`h-8 w-8 text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`}
                  />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Button
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Create Your Card Now
              <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>

          <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Free to create
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
              No signup required
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
              Share instantly
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
