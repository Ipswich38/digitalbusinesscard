"use client"

import React from 'react'
import { Phone, Mail, Linkedin, User, ExternalLink, MapPin, Calendar, Globe, Twitter, Instagram, Facebook, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BusinessCardData {
  firstName: string
  lastName?: string
  title?: string
  company?: string
  email?: string
  mobile?: string
  linkedin?: string
  website?: string
  address?: string
  bio?: string
  logo?: string
  backgroundColor?: string
  backgroundGradient?: string
  useGradient?: boolean
  textColor?: string
  customFields?: Array<{
    id: string
    label: string
    value: string
    type: 'text' | 'email' | 'phone' | 'url'
  }>
  socialMedia?: {
    twitter?: string
    instagram?: string
    facebook?: string
    youtube?: string
  }
}

interface BusinessCardProps {
  data: BusinessCardData
  onContactClick?: () => void
  onSocialClick?: (platform: string) => void
}

export function BusinessCard({ data, onContactClick, onSocialClick }: BusinessCardProps) {
  const cardStyle = {
    background: data.useGradient ? data.backgroundGradient : data.backgroundColor,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 16px rgba(0, 0, 0, 0.2)",
  }

  const handleContactClick = (type: string, value: string) => {
    onContactClick?.()
    
    switch (type) {
      case 'email':
        window.open(`mailto:${value}`, '_blank')
        break
      case 'phone':
        window.open(`tel:${value}`, '_blank')
        break
      case 'linkedin':
        window.open(value, '_blank')
        onSocialClick?.('linkedin')
        break
      case 'website':
        window.open(value, '_blank')
        onSocialClick?.('website')
        break
      default:
        break
    }
  }

  const handleSocialClick = (platform: string, url: string) => {
    window.open(url, '_blank')
    onSocialClick?.(platform)
  }

  return (
    <div 
      className="w-full max-w-md mx-auto rounded-3xl overflow-hidden relative"
      style={cardStyle}
    >
      {/* Main Card Content */}
      <div className="px-8 py-12 space-y-8">
        {/* Logo */}
        {data.logo && (
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm shadow-lg">
              <img
                src={data.logo}
                alt="Logo"
                className="w-20 h-20 object-contain rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 
            className="text-4xl font-serif font-light tracking-tight" 
            style={{ color: data.textColor }}
          >
            {data.firstName} {data.lastName || ''}
          </h1>
          {data.title && (
            <p
              className="text-lg font-normal opacity-80"
              style={{ fontFamily: "Avenir, system-ui, sans-serif", color: data.textColor }}
            >
              {data.title}
            </p>
          )}
          {data.company && (
            <p
              className="text-base font-light opacity-70"
              style={{ fontFamily: "Avenir, system-ui, sans-serif", color: data.textColor }}
            >
              {data.company}
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          {data.mobile && (
            <Button
              variant="ghost"
              className="w-full justify-start p-4 h-auto bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-2xl"
              onClick={() => handleContactClick('phone', data.mobile!)}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="p-2 rounded-xl bg-blue-500/20">
                  <Phone className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs opacity-60" style={{ color: data.textColor }}>
                    Mobile
                  </p>
                  <p className="text-sm font-medium" style={{ color: data.textColor }}>
                    {data.mobile}
                  </p>
                </div>
              </div>
            </Button>
          )}

          {data.email && (
            <Button
              variant="ghost"
              className="w-full justify-start p-4 h-auto bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-2xl"
              onClick={() => handleContactClick('email', data.email!)}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="p-2 rounded-xl bg-cyan-500/20">
                  <Mail className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs opacity-60" style={{ color: data.textColor }}>
                    Email
                  </p>
                  <p className="text-sm font-medium" style={{ color: data.textColor }}>
                    {data.email}
                  </p>
                </div>
              </div>
            </Button>
          )}

          {data.linkedin && (
            <Button
              variant="ghost"
              className="w-full justify-start p-4 h-auto bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-2xl"
              onClick={() => handleContactClick('linkedin', data.linkedin!)}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="p-2 rounded-xl bg-blue-700/20">
                  <Linkedin className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="text-xs opacity-60" style={{ color: data.textColor }}>
                    LinkedIn
                  </p>
                  <p className="text-sm font-medium" style={{ color: data.textColor }}>
                    {data.linkedin.replace("https://", "").replace("http://", "")}
                  </p>
                </div>
              </div>
            </Button>
          )}

          {data.website && (
            <Button
              variant="ghost"
              className="w-full justify-start p-4 h-auto bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-2xl"
              onClick={() => handleContactClick('website', data.website!)}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="p-2 rounded-xl bg-green-500/20">
                  <Globe className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs opacity-60" style={{ color: data.textColor }}>
                    Website
                  </p>
                  <p className="text-sm font-medium" style={{ color: data.textColor }}>
                    {data.website.replace("https://", "").replace("http://", "")}
                  </p>
                </div>
              </div>
            </Button>
          )}

          {data.address && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-red-500/20">
                <MapPin className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs opacity-60" style={{ color: data.textColor }}>
                  Address
                </p>
                <p className="text-sm font-medium" style={{ color: data.textColor }}>
                  {data.address}
                </p>
              </div>
            </div>
          )}

          {/* Custom Fields */}
          {data.customFields?.map((field) =>
            field.value.trim() ? (
              <div key={field.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                <div className="p-2 rounded-xl bg-orange-500/20">
                  <User className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs opacity-60" style={{ color: data.textColor }}>
                    {field.label}
                  </p>
                  <p className="text-sm font-medium" style={{ color: data.textColor }}>
                    {field.value}
                  </p>
                </div>
              </div>
            ) : null
          )}
        </div>

        {/* Bio */}
        {data.bio && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold" style={{ color: data.textColor }}>
              About
            </h3>
            <p className="text-sm opacity-80 leading-relaxed" style={{ color: data.textColor }}>
              {data.bio}
            </p>
          </div>
        )}

        {/* Social Media */}
        {data.socialMedia && Object.keys(data.socialMedia).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: data.textColor }}>
              Connect
            </h3>
            <div className="flex gap-3 justify-center">
              {data.socialMedia.twitter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl"
                  onClick={() => handleSocialClick('twitter', data.socialMedia!.twitter!)}
                >
                  <Twitter className="h-5 w-5" style={{ color: data.textColor }} />
                </Button>
              )}
              {data.socialMedia.instagram && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl"
                  onClick={() => handleSocialClick('instagram', data.socialMedia!.instagram!)}
                >
                  <Instagram className="h-5 w-5" style={{ color: data.textColor }} />
                </Button>
              )}
              {data.socialMedia.facebook && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl"
                  onClick={() => handleSocialClick('facebook', data.socialMedia!.facebook!)}
                >
                  <Facebook className="h-5 w-5" style={{ color: data.textColor }} />
                </Button>
              )}
              {data.socialMedia.youtube && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl"
                  onClick={() => handleSocialClick('youtube', data.socialMedia!.youtube!)}
                >
                  <Youtube className="h-5 w-5" style={{ color: data.textColor }} />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}