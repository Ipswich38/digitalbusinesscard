"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Laugh, Share, Heart, MessageCircle, Download, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface MemeCardData {
  title: string
  creator: string
  creatorAvatar?: string
  memeImage: string
  topText?: string
  bottomText?: string
  category: 'classic' | 'reaction' | 'wholesome' | 'dank' | 'trending' | 'custom'
  tags: string[]
  reactions: {
    likes: number
    laughs: number
    shares: number
    comments: number
  }
  description?: string
  website?: string
  socialLinks?: Array<{
    platform: string
    url: string
    username: string
  }>
  backgroundColor?: string
  textStyle?: {
    fontFamily: string
    fontSize: number
    strokeWidth: number
    strokeColor: string
    shadowEnabled: boolean
  }
  effects?: {
    glow: boolean
    rainbow: boolean
    shake: boolean
  }
}

interface MemeCardProps {
  data: MemeCardData
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

const categoryEmojis = {
  classic: '😂',
  reaction: '🤔',
  wholesome: '🥰',
  dank: '💀',
  trending: '🔥',
  custom: '✨'
}

const categoryColors = {
  classic: '#ff6b6b',
  reaction: '#4ecdc4',
  wholesome: '#45b7d1',
  dank: '#8b5cf6',
  trending: '#f59e0b',
  custom: '#10b981'
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function MemeCard({ data, theme, onContactClick, onSocialClick }: MemeCardProps) {
  const categoryColor = categoryColors[data.category]
  const categoryEmoji = categoryEmojis[data.category]
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data.title,
        text: `Check out this meme by ${data.creator}!`,
        url: window.location.href,
      })
    }
    onSocialClick?.('share')
  }

  const handleDownload = () => {
    // Implement meme download functionality
    onContactClick?.()
  }

  const cardStyle = {
    background: theme.backgroundGradient,
    boxShadow: theme.shadowStyle,
    borderRadius: theme.borderRadius,
    fontFamily: theme.fontFamily,
  }

  const memeTextStyle = data.textStyle ? {
    fontFamily: data.textStyle.fontFamily,
    fontSize: `${data.textStyle.fontSize}px`,
    WebkitTextStroke: `${data.textStyle.strokeWidth}px ${data.textStyle.strokeColor}`,
    textShadow: data.textStyle.shadowEnabled ? '2px 2px 0px rgba(0,0,0,0.8)' : 'none',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px'
  } : {
    fontFamily: 'Impact, Arial Black, sans-serif',
    fontSize: '24px',
    WebkitTextStroke: '2px black',
    textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px'
  }

  return (
    <motion.div 
      className="w-full max-w-md mx-auto overflow-hidden relative"
      style={cardStyle}
      whileHover={{ scale: 1.02 }}
      animate={data.effects?.shake ? { rotate: [0, 1, -1, 0] } : {}}
      transition={{ 
        duration: 0.2,
        rotate: { repeat: Infinity, duration: 0.1 }
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {data.creatorAvatar && (
              <img 
                src={data.creatorAvatar} 
                alt={data.creator}
                className="w-8 h-8 rounded-full border-2 border-white/50"
              />
            )}
            <div>
              <h3 className="font-bold text-white text-sm">{data.creator}</h3>
              <p className="text-white/75 text-xs">Meme Creator</p>
            </div>
          </div>
          
          <Badge 
            className="text-white border-white/30"
            style={{ backgroundColor: categoryColor }}
          >
            <span className="mr-1">{categoryEmoji}</span>
            {data.category}
          </Badge>
        </div>
      </div>

      {/* Meme Image with Text Overlay */}
      <div className="relative">
        <img 
          src={data.memeImage} 
          alt={data.title}
          className="w-full h-64 object-cover"
        />
        
        {/* Top Text */}
        {data.topText && (
          <div 
            className="absolute top-2 left-2 right-2 text-center text-white"
            style={memeTextStyle}
          >
            {data.topText}
          </div>
        )}
        
        {/* Bottom Text */}
        {data.bottomText && (
          <div 
            className="absolute bottom-2 left-2 right-2 text-center text-white"
            style={memeTextStyle}
          >
            {data.bottomText}
          </div>
        )}

        {/* Glow Effect */}
        {data.effects?.glow && (
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              background: `radial-gradient(circle, ${categoryColor}40 0%, transparent 70%)`
            }}
          />
        )}

        {/* Rainbow Effect */}
        {data.effects?.rainbow && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-yellow-500/20 via-green-500/20 via-blue-500/20 to-purple-500/20 animate-pulse" />
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4" style={{ color: theme.textColor }}>
        {/* Title */}
        <div>
          <h2 className="font-bold text-lg mb-1">{data.title}</h2>
          {data.description && (
            <p className="text-sm opacity-90">{data.description}</p>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag, index) => (
            <Badge 
              key={index}
              variant="outline" 
              className="text-xs bg-white/10 text-white border-white/20"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Reactions */}
        <div className="flex items-center justify-between py-2 border-t border-white/10">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span>{formatNumber(data.reactions.likes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Laugh className="w-4 h-4 text-yellow-500" />
              <span>{formatNumber(data.reactions.laughs)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span>{formatNumber(data.reactions.comments)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share className="w-4 h-4 text-green-500" />
              <span>{formatNumber(data.reactions.shares)}</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium opacity-90">Follow for more memes</h4>
            <div className="flex gap-2">
              {data.socialLinks.slice(0, 3).map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    window.open(link.url, '_blank')
                    onSocialClick?.(link.platform)
                  }}
                >
                  @{link.username}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleShare}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Share className="w-4 h-4 mr-2" />
            Share Meme
          </Button>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Website Link */}
        {data.website && (
          <Button 
            variant="ghost"
            className="w-full text-center opacity-75 hover:opacity-100"
            onClick={() => {
              window.open(data.website, '_blank')
              onContactClick?.()
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Visit {data.creator}'s Meme Gallery
          </Button>
        )}
      </div>
    </motion.div>
  )
}