"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Users, Heart, MessageCircle, Share, Verified } from 'lucide-react'
import { motion } from 'framer-motion'

interface SocialMediaCardData {
  platform: 'linkedin' | 'instagram' | 'twitter' | 'tiktok' | 'youtube' | 'facebook'
  username: string
  displayName: string
  bio: string
  avatar: string
  coverImage?: string
  followers: number
  following: number
  posts: number
  verified?: boolean
  profileUrl: string
  recentPosts?: Array<{
    id: string
    content: string
    image?: string
    likes: number
    comments: number
    shares: number
  }>
  highlights?: string[]
  customFields?: Array<{
    label: string
    value: string
    url?: string
  }>
}

interface SocialMediaCardProps {
  data: SocialMediaCardData
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

const platformConfigs = {
  linkedin: {
    name: 'LinkedIn',
    color: '#0077b5',
    icon: '💼',
    gradientColors: ['#0077b5', '#004182'],
    textPattern: 'Professional networking'
  },
  instagram: {
    name: 'Instagram',
    color: '#E1306C',
    icon: '📷',
    gradientColors: ['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888'],
    textPattern: 'Visual storytelling'
  },
  twitter: {
    name: 'X (Twitter)',
    color: '#1d9bf0',
    icon: '🐦',
    gradientColors: ['#000000', '#1a1a1a'],
    textPattern: 'Real-time updates'
  },
  tiktok: {
    name: 'TikTok',
    color: '#ff0050',
    icon: '🎵',
    gradientColors: ['#ff0050', '#000000'],
    textPattern: 'Short-form videos'
  },
  youtube: {
    name: 'YouTube',
    color: '#ff0000',
    icon: '🎥',
    gradientColors: ['#ff0000', '#cc0000'],
    textPattern: 'Video content'
  },
  facebook: {
    name: 'Facebook',
    color: '#1877f2',
    icon: '👥',
    gradientColors: ['#1877f2', '#0d47a1'],
    textPattern: 'Social connections'
  }
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function SocialMediaCard({ data, theme, onContactClick, onSocialClick }: SocialMediaCardProps) {
  const platformConfig = platformConfigs[data.platform]
  
  const handleProfileClick = () => {
    window.open(data.profileUrl, '_blank')
    onSocialClick?.(data.platform)
  }

  const cardStyle = {
    background: theme.backgroundGradient,
    boxShadow: theme.shadowStyle,
    borderRadius: theme.borderRadius,
    fontFamily: theme.fontFamily,
  }

  return (
    <motion.div 
      className="w-full max-w-md mx-auto overflow-hidden relative"
      style={cardStyle}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Cover Image / Header */}
      <div 
        className="relative h-24 bg-gradient-to-r"
        style={{ 
          background: `linear-gradient(135deg, ${platformConfig.gradientColors.join(', ')})` 
        }}
      >
        {data.coverImage && (
          <img 
            src={data.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-80"
          />
        )}
        
        {/* Platform Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/20">
            <span className="mr-1">{platformConfig.icon}</span>
            {platformConfig.name}
          </Badge>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-6 py-4 space-y-4" style={{ color: theme.textColor }}>
        {/* Avatar and Basic Info */}
        <div className="flex items-start space-x-4 -mt-8 relative z-10">
          <div className="relative">
            <img 
              src={data.avatar} 
              alt={data.displayName}
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-white"
            />
            {data.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Verified className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 mt-2">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{data.displayName}</h2>
            </div>
            <p className="text-sm opacity-75">@{data.username}</p>
            
            {/* Stats */}
            <div className="flex gap-4 mt-3 text-sm">
              <div className="text-center">
                <div className="font-bold">{formatNumber(data.posts)}</div>
                <div className="opacity-75 text-xs">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{formatNumber(data.followers)}</div>
                <div className="opacity-75 text-xs">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{formatNumber(data.following)}</div>
                <div className="opacity-75 text-xs">Following</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <p className="text-sm leading-relaxed opacity-90">{data.bio}</p>
          
          {/* Highlights */}
          {data.highlights && data.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.highlights.map((highlight, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="text-xs bg-white/10 text-white border-white/20"
                >
                  {highlight}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Recent Posts Preview */}
        {data.recentPosts && data.recentPosts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium opacity-90">Recent Activity</h4>
            <div className="space-y-2">
              {data.recentPosts.slice(0, 2).map((post) => (
                <div key={post.id} className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm opacity-90 mb-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs opacity-75">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {formatNumber(post.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {formatNumber(post.comments)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share className="w-3 h-3" />
                      {formatNumber(post.shares)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Fields */}
        {data.customFields && data.customFields.length > 0 && (
          <div className="space-y-2">
            {data.customFields.map((field, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm opacity-75">{field.label}</span>
                {field.url ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 text-xs"
                    onClick={() => window.open(field.url, '_blank')}
                  >
                    {field.value}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                ) : (
                  <span className="text-sm font-medium">{field.value}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <Button 
            onClick={handleProfileClick}
            className="w-full"
            style={{ 
              backgroundColor: platformConfig.color,
              color: 'white'
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Follow on {platformConfig.name}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}