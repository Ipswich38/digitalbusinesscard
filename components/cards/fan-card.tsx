"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Heart, Calendar, Award, Music, Tv, Trophy, Sparkles, ExternalLink } from 'lucide-react'

// Optional animation wrapper
let motion: any
try {
  motion = require('framer-motion').motion
} catch {
  motion = {
    div: ({ children, whileHover, animate, transition, ...props }: any) => <div {...props}>{children}</div>
  }
}

interface FanCardData {
  subject: string // The idol/person/character being featured
  fanName: string // The fan's name
  fanAvatar?: string
  subjectImage: string
  subjectType: 'kpop' | 'anime' | 'sports' | 'celebrity' | 'fictional' | 'other'
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythical'
  cardNumber?: string
  stats?: {
    popularity: number
    talent: number
    charisma: number
    influence: number
  }
  favoriteQuote?: string
  achievements: string[]
  collectionInfo: {
    series: string
    season?: string
    setNumber?: string
  }
  personalNote?: string
  tradingValue?: number
  dateCollected: string
  socialLinks?: Array<{
    platform: string
    url: string
    handle: string
  }>
  holographic?: boolean
  animated?: boolean
  signature?: boolean
}

interface FanCardProps {
  data: FanCardData
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

const subjectTypeIcons = {
  kpop: Music,
  anime: Sparkles,
  sports: Trophy,
  celebrity: Star,
  fictional: Tv,
  other: Heart
}

const rarityConfig = {
  common: { 
    color: '#94a3b8', 
    emoji: '⚪', 
    glow: 'rgba(148, 163, 184, 0.3)',
    name: 'Common'
  },
  rare: { 
    color: '#3b82f6', 
    emoji: '🔵', 
    glow: 'rgba(59, 130, 246, 0.4)',
    name: 'Rare'
  },
  epic: { 
    color: '#8b5cf6', 
    emoji: '🟣', 
    glow: 'rgba(139, 92, 246, 0.5)',
    name: 'Epic'
  },
  legendary: { 
    color: '#f59e0b', 
    emoji: '🟡', 
    glow: 'rgba(245, 158, 11, 0.6)',
    name: 'Legendary'
  },
  mythical: { 
    color: '#ef4444', 
    emoji: '🔴', 
    glow: 'rgba(239, 68, 68, 0.7)',
    name: 'Mythical'
  }
}

export function FanCard({ data, theme, onContactClick, onSocialClick }: FanCardProps) {
  const SubjectIcon = subjectTypeIcons[data.subjectType]
  const rarity = rarityConfig[data.rarity]
  
  const handleTrade = () => {
    onContactClick?.()
  }

  const handleSocialClick = (platform: string, url: string) => {
    window.open(url, '_blank')
    onSocialClick?.(platform)
  }

  const cardStyle = {
    background: data.holographic 
      ? `linear-gradient(135deg, ${theme.backgroundGradient}, rgba(255,255,255,0.1))`
      : theme.backgroundGradient,
    boxShadow: `${theme.shadowStyle}, 0 0 20px ${rarity.glow}`,
    borderRadius: theme.borderRadius,
    fontFamily: theme.fontFamily,
  }

  return (
    <motion.div 
      className="w-full max-w-md mx-auto overflow-hidden relative border-2"
      style={{
        ...cardStyle,
        borderColor: rarity.color,
      }}
      whileHover={{ 
        scale: 1.02,
        rotateY: data.holographic ? 5 : 0
      }}
      animate={data.animated ? {
        background: [
          theme.backgroundGradient,
          `linear-gradient(135deg, ${rarity.color}20, ${theme.backgroundGradient})`,
          theme.backgroundGradient
        ]
      } : {}}
      transition={{ 
        duration: 0.3,
        background: { repeat: Infinity, duration: 2 }
      }}
    >
      {/* Holographic Effect Overlay */}
      {data.holographic && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" 
             style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)' }} />
      )}

      {/* Header with Rarity and Card Number */}
      <div className="relative px-4 py-3 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              className="text-white font-bold"
              style={{ backgroundColor: rarity.color }}
            >
              <span className="mr-1">{rarity.emoji}</span>
              {rarity.name}
            </Badge>
            {data.signature && (
              <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                ✨ Signed
              </Badge>
            )}
          </div>
          
          {data.cardNumber && (
            <div className="text-white/75 text-sm font-mono">
              #{data.cardNumber}
            </div>
          )}
        </div>
      </div>

      {/* Main Image */}
      <div className="relative">
        <img 
          src={data.subjectImage} 
          alt={data.subject}
          className="w-full h-64 object-cover"
        />
        
        {/* Subject Type Icon */}
        <div className="absolute top-3 left-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
            style={{ backgroundColor: rarity.color + '80' }}
          >
            <SubjectIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Trading Value */}
        {data.tradingValue && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500/80 text-white">
              💎 {data.tradingValue}pts
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4" style={{ color: theme.textColor }}>
        {/* Subject Info */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">{data.subject}</h2>
          <p className="text-sm opacity-75">
            {data.collectionInfo.series}
            {data.collectionInfo.season && ` - ${data.collectionInfo.season}`}
          </p>
        </div>

        {/* Stats */}
        {data.stats && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium opacity-90">Stats</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(data.stats).map(([stat, value]) => (
                <div key={stat} className="flex justify-between items-center">
                  <span className="capitalize opacity-75">{stat}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                          width: `${value}%`,
                          backgroundColor: rarity.color
                        }}
                      />
                    </div>
                    <span className="font-bold">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorite Quote */}
        {data.favoriteQuote && (
          <div className="text-center p-3 bg-white/5 rounded-lg border-l-4" style={{ borderLeftColor: rarity.color }}>
            <p className="text-sm italic opacity-90">"{data.favoriteQuote}"</p>
          </div>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </h4>
            <div className="space-y-1">
              {data.achievements.slice(0, 3).map((achievement, index) => (
                <div key={index} className="text-xs opacity-75 flex items-start gap-2">
                  <span className="text-yellow-400">🏆</span>
                  {achievement}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Note */}
        {data.personalNote && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Fan Note
            </h4>
            <p className="text-sm opacity-80 bg-white/5 p-3 rounded-lg">
              {data.personalNote}
            </p>
          </div>
        )}

        {/* Collection Info */}
        <div className="flex items-center justify-between text-xs opacity-75 pt-2 border-t border-white/10">
          <span>Collected: {new Date(data.dateCollected).toLocaleDateString()}</span>
          <span>by {data.fanName}</span>
        </div>

        {/* Social Links */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium opacity-90">Follow {data.subject}</h4>
            <div className="flex gap-2">
              {data.socialLinks.slice(0, 3).map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs border-white/30 hover:bg-white/10"
                  onClick={() => handleSocialClick(link.platform, link.url)}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {link.handle}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleTrade}
            className="flex-1"
            style={{ 
              backgroundColor: rarity.color,
              color: 'white'
            }}
          >
            <Trophy className="w-4 h-4 mr-2" />
            Trade Card
          </Button>
          
          {data.fanAvatar && (
            <Button 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => onContactClick?.()}
            >
              <img src={data.fanAvatar} alt={data.fanName} className="w-4 h-4 rounded-full" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}