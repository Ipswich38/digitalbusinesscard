"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, Calendar, MapPin, Eye, Heart, ExternalLink, Info, Award } from 'lucide-react'

// Optional animation wrapper
let motion: any
try {
  motion = require('framer-motion').motion
} catch {
  motion = {
    div: ({ children, whileHover, transition, ...props }: any) => <div {...props}>{children}</div>
  }
}

interface ArtCardData {
  artworkTitle: string
  artistName: string
  artistBio?: string
  artworkImage: string
  medium: string
  dimensions?: string
  yearCreated: string | number
  description: string
  style?: string
  gallery?: string
  location?: string
  price?: number
  isForSale?: boolean
  exhibitions?: Array<{
    name: string
    venue: string
    year: string
    description?: string
  }>
  awards?: string[]
  technique?: string
  inspiration?: string
  artistWebsite?: string
  galleryWebsite?: string
  socialLinks?: Array<{
    platform: string
    url: string
    handle: string
  }>
  provenance?: string[]
  condition?: 'excellent' | 'very good' | 'good' | 'fair' | 'poor'
  authenticity?: 'verified' | 'attributed' | 'school of' | 'after'
  category: 'painting' | 'sculpture' | 'photography' | 'digital' | 'mixed media' | 'installation' | 'other'
}

interface ArtCardProps {
  data: ArtCardData
  theme: {
    backgroundColor: string
    backgroundGradient: string
    textColor: string
    accentColor: string
    fontFamily: string
    borderRadius: number
    shadowStyle: string
  }
  onContactClick?: () => void
  onSocialClick?: (platform: string) => void
}

const categoryIcons = {
  painting: '🖼️',
  sculpture: '🗿',
  photography: '📷',
  digital: '💻',
  'mixed media': '🎨',
  installation: '🏗️',
  other: '✨'
}

const conditionColors = {
  excellent: '#10b981',
  'very good': '#3b82f6',
  good: '#f59e0b',
  fair: '#ef4444',
  poor: '#6b7280'
}

const authenticityBadges = {
  verified: { color: '#10b981', icon: '✅', label: 'Verified Authentic' },
  attributed: { color: '#3b82f6', icon: '📝', label: 'Attributed to Artist' },
  'school of': { color: '#f59e0b', icon: '🎓', label: 'School of Artist' },
  after: { color: '#6b7280', icon: '🔄', label: 'After Artist' }
}

export function ArtCard({ data, theme, onContactClick, onSocialClick }: ArtCardProps) {
  const categoryEmoji = categoryIcons[data.category]
  const conditionColor = conditionColors[data.condition || 'good']
  const authenticityInfo = authenticityBadges[data.authenticity || 'verified']
  
  const handleGalleryVisit = () => {
    if (data.galleryWebsite) {
      window.open(data.galleryWebsite, '_blank')
      onSocialClick?.('gallery')
    }
  }

  const handleArtistWebsite = () => {
    if (data.artistWebsite) {
      window.open(data.artistWebsite, '_blank')
      onSocialClick?.('artist')
    }
  }

  const handleInquiry = () => {
    onContactClick?.()
  }

  const cardStyle = {
    background: theme.backgroundGradient,
    boxShadow: `${theme.shadowStyle}, inset 0 1px 0 rgba(255,255,255,0.1)`,
    borderRadius: theme.borderRadius,
    fontFamily: theme.fontFamily,
    border: '1px solid rgba(139, 92, 246, 0.2)'
  }

  return (
    <motion.div 
      className="w-full max-w-md mx-auto overflow-hidden relative"
      style={cardStyle}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* Museum-style Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-50/5 to-amber-100/5 border-b border-amber-200/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              className="border-amber-400/50 text-amber-300 bg-amber-500/10"
            >
              <span className="mr-1">{categoryEmoji}</span>
              {data.category.charAt(0).toUpperCase() + data.category.slice(1)}
            </Badge>
            
            {data.authenticity && (
              <Badge 
                className="text-white text-xs"
                style={{ backgroundColor: authenticityInfo.color }}
              >
                <span className="mr-1">{authenticityInfo.icon}</span>
                {authenticityInfo.label}
              </Badge>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-xs opacity-75" style={{ color: theme.textColor }}>
              {typeof data.yearCreated === 'number' ? data.yearCreated : data.yearCreated}
            </div>
          </div>
        </div>
      </div>

      {/* Artwork Image with Museum Frame Effect */}
      <div className="relative p-4 bg-gradient-to-b from-amber-50/5 to-transparent">
        <div className="relative border-4 border-amber-200/20 shadow-2xl">
          <img 
            src={data.artworkImage} 
            alt={data.artworkTitle}
            className="w-full h-56 object-cover"
            style={{
              filter: 'contrast(1.05) saturate(1.1)'
            }}
          />
          
          {/* Museum Lighting Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />
        </div>
        
        {/* Price Tag */}
        {data.isForSale && data.price && (
          <div className="absolute top-6 right-6">
            <Badge className="bg-emerald-500 text-white font-semibold">
              ${data.price.toLocaleString()}
            </Badge>
          </div>
        )}
      </div>

      {/* Artwork Information */}
      <div className="px-4 py-4 space-y-4" style={{ color: theme.textColor }}>
        {/* Title and Artist */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-serif font-bold leading-tight">
            "{data.artworkTitle}"
          </h2>
          <p className="text-lg font-serif opacity-90">
            by {data.artistName}
          </p>
          
          {/* Medium and Dimensions */}
          <div className="text-sm opacity-75 space-y-1">
            <div>{data.medium}</div>
            {data.dimensions && <div>{data.dimensions}</div>}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/5 p-3 rounded-lg border-l-4 border-amber-400/50">
          <p className="text-sm leading-relaxed opacity-90">
            {data.description}
          </p>
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {data.style && (
            <div>
              <span className="opacity-75">Style:</span>
              <div className="font-medium">{data.style}</div>
            </div>
          )}
          
          {data.technique && (
            <div>
              <span className="opacity-75">Technique:</span>
              <div className="font-medium">{data.technique}</div>
            </div>
          )}
          
          {data.condition && (
            <div>
              <span className="opacity-75">Condition:</span>
              <div className="font-medium flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: conditionColor }}
                />
                {data.condition.charAt(0).toUpperCase() + data.condition.slice(1)}
              </div>
            </div>
          )}
          
          {data.location && (
            <div>
              <span className="opacity-75 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Location:
              </span>
              <div className="font-medium">{data.location}</div>
            </div>
          )}
        </div>

        {/* Gallery Information */}
        {data.gallery && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Exhibition
            </h4>
            <div className="text-sm bg-white/5 p-3 rounded-lg">
              <div className="font-medium">{data.gallery}</div>
              {data.location && (
                <div className="opacity-75 text-xs mt-1">{data.location}</div>
              )}
            </div>
          </div>
        )}

        {/* Exhibitions History */}
        {data.exhibitions && data.exhibitions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Exhibition History
            </h4>
            <div className="space-y-2">
              {data.exhibitions.slice(0, 2).map((exhibition, index) => (
                <div key={index} className="text-xs bg-white/5 p-2 rounded">
                  <div className="font-medium">{exhibition.name}</div>
                  <div className="opacity-75">{exhibition.venue} ({exhibition.year})</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {data.awards && data.awards.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Recognition
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.awards.slice(0, 3).map((award, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-xs border-amber-400/50 text-amber-300"
                >
                  🏆 {award}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Inspiration */}
        {data.inspiration && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium opacity-90">Artist's Note</h4>
            <p className="text-sm opacity-80 italic bg-gradient-to-r from-purple-500/10 to-transparent p-3 rounded-lg border-l-2 border-purple-400/50">
              "{data.inspiration}"
            </p>
          </div>
        )}

        {/* Social Links */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium opacity-90">Follow the Artist</h4>
            <div className="flex gap-2">
              {data.socialLinks.slice(0, 3).map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs border-white/30 hover:bg-white/10"
                  onClick={() => {
                    window.open(link.url, '_blank')
                    onSocialClick?.(link.platform)
                  }}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {link.handle}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-white/10">
          {data.isForSale ? (
            <Button 
              onClick={handleInquiry}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              <Heart className="w-4 h-4 mr-2" />
              Inquire to Purchase
            </Button>
          ) : (
            <Button 
              onClick={handleInquiry}
              variant="outline"
              className="flex-1 border-amber-400/50 text-amber-300 hover:bg-amber-500/10"
            >
              <Info className="w-4 h-4 mr-2" />
              More Information
            </Button>
          )}
          
          {(data.artistWebsite || data.galleryWebsite) && (
            <Button 
              onClick={data.artistWebsite ? handleArtistWebsite : handleGalleryVisit}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Provenance */}
        {data.provenance && data.provenance.length > 0 && (
          <div className="pt-2 border-t border-white/5">
            <div className="text-xs opacity-50 text-center">
              Provenance: {data.provenance.slice(0, 2).join(' → ')}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}