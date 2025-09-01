export type CardCategory = 'business' | 'social' | 'meme' | 'fan' | 'art'

export interface CardCategoryConfig {
  id: CardCategory
  name: string
  description: string
  icon: string
  emoji: string
  themes: CardTheme[]
  features: string[]
  targetAudience: string
  colorScheme: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
}

export interface CardTheme {
  id: string
  name: string
  category: CardCategory
  preview: string
  backgroundColor: string
  backgroundGradient: string
  textColor: string
  accentColor: string
  fontFamily: string
  borderRadius: number
  shadowStyle: string
  templateLayout: 'minimal' | 'modern' | 'creative' | 'playful' | 'elegant'
}

export const CARD_CATEGORIES: Record<CardCategory, CardCategoryConfig> = {
  business: {
    id: 'business',
    name: 'Business Cards',
    description: 'Professional networking and business connections',
    icon: 'Briefcase',
    emoji: '💼',
    themes: [
      {
        id: 'professional-minimal',
        name: 'Professional Minimal',
        category: 'business',
        preview: '/themes/business-minimal.jpg',
        backgroundColor: '#1a1a1a',
        backgroundGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        textColor: '#ffffff',
        accentColor: '#ea580c',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: 28,
        shadowStyle: '0 8px 32px rgba(0, 0, 0, 0.3)',
        templateLayout: 'minimal'
      },
      {
        id: 'corporate-blue',
        name: 'Corporate Blue',
        category: 'business',
        preview: '/themes/business-corporate.jpg',
        backgroundColor: '#0f172a',
        backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        textColor: '#f8fafc',
        accentColor: '#3b82f6',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: 24,
        shadowStyle: '0 10px 40px rgba(59, 130, 246, 0.2)',
        templateLayout: 'modern'
      }
    ],
    features: ['QR Codes', 'Contact Info', 'Social Links', 'Logo Upload', 'Analytics'],
    targetAudience: 'Professionals, entrepreneurs, business owners',
    colorScheme: {
      primary: '#1a1a1a',
      secondary: '#2d2d2d',
      accent: '#ea580c',
      background: '#f8fafc',
      text: '#ffffff'
    }
  },

  social: {
    id: 'social',
    name: 'Social Media Cards',
    description: 'Platform-specific social media presence cards',
    icon: 'Share2',
    emoji: '📱',
    themes: [
      {
        id: 'linkedin-professional',
        name: 'LinkedIn Professional',
        category: 'social',
        preview: '/themes/linkedin-card.jpg',
        backgroundColor: '#0077b5',
        backgroundGradient: 'linear-gradient(135deg, #0077b5 0%, #004182 100%)',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        borderRadius: 12,
        shadowStyle: '0 4px 20px rgba(0, 119, 181, 0.3)',
        templateLayout: 'modern'
      },
      {
        id: 'instagram-gradient',
        name: 'Instagram Vibrant',
        category: 'social',
        preview: '/themes/instagram-card.jpg',
        backgroundColor: '#E1306C',
        backgroundGradient: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        borderRadius: 20,
        shadowStyle: '0 6px 25px rgba(225, 48, 108, 0.4)',
        templateLayout: 'creative'
      },
      {
        id: 'twitter-minimal',
        name: 'X/Twitter Clean',
        category: 'social',
        preview: '/themes/twitter-card.jpg',
        backgroundColor: '#000000',
        backgroundGradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        textColor: '#ffffff',
        accentColor: '#1d9bf0',
        fontFamily: 'TwitterChirp, system-ui, sans-serif',
        borderRadius: 16,
        shadowStyle: '0 4px 16px rgba(29, 155, 240, 0.2)',
        templateLayout: 'minimal'
      }
    ],
    features: ['Platform Themes', 'Social Links', 'Follower Count', 'Bio Optimization', 'Platform Analytics'],
    targetAudience: 'Content creators, influencers, social media managers',
    colorScheme: {
      primary: '#0077b5',
      secondary: '#E1306C',
      accent: '#1d9bf0',
      background: '#f8fafc',
      text: '#1a1a1a'
    }
  },

  meme: {
    id: 'meme',
    name: 'Meme Cards',
    description: 'Fun, humorous cards for entertainment and casual sharing',
    icon: 'Laugh',
    emoji: '😂',
    themes: [
      {
        id: 'classic-meme',
        name: 'Classic Meme',
        category: 'meme',
        preview: '/themes/classic-meme.jpg',
        backgroundColor: '#ffffff',
        backgroundGradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
        textColor: '#000000',
        accentColor: '#ff6b6b',
        fontFamily: 'Impact, Arial Black, sans-serif',
        borderRadius: 16,
        shadowStyle: '0 6px 24px rgba(255, 107, 107, 0.3)',
        templateLayout: 'playful'
      },
      {
        id: 'neon-vibes',
        name: 'Neon Vibes',
        category: 'meme',
        preview: '/themes/neon-meme.jpg',
        backgroundColor: '#0a0a0a',
        backgroundGradient: 'linear-gradient(135deg, #00f5ff 0%, #ff00ff 50%, #ffff00 100%)',
        textColor: '#ffffff',
        accentColor: '#00f5ff',
        fontFamily: 'Comic Sans MS, cursive',
        borderRadius: 20,
        shadowStyle: '0 0 30px rgba(0, 245, 255, 0.5)',
        templateLayout: 'creative'
      }
    ],
    features: ['Meme Templates', 'Text Overlays', 'Sticker Support', 'GIF Integration', 'Viral Sharing'],
    targetAudience: 'Meme creators, Gen Z, social media enthusiasts',
    colorScheme: {
      primary: '#ff6b6b',
      secondary: '#ffd93d',
      accent: '#00f5ff',
      background: '#ffffff',
      text: '#000000'
    }
  },

  fan: {
    id: 'fan',
    name: 'Fan Cards',
    description: 'Collectible cards for idols, fandoms, and personal collections',
    icon: 'Heart',
    emoji: '⭐',
    themes: [
      {
        id: 'kpop-holographic',
        name: 'K-Pop Holographic',
        category: 'fan',
        preview: '/themes/kpop-fan.jpg',
        backgroundColor: '#ff1744',
        backgroundGradient: 'linear-gradient(135deg, #ff1744 0%, #9c27b0 50%, #2196f3 100%)',
        textColor: '#ffffff',
        accentColor: '#ffd700',
        fontFamily: 'Noto Sans KR, system-ui, sans-serif',
        borderRadius: 24,
        shadowStyle: '0 8px 32px rgba(255, 23, 68, 0.4)',
        templateLayout: 'creative'
      },
      {
        id: 'anime-collector',
        name: 'Anime Collector',
        category: 'fan',
        preview: '/themes/anime-fan.jpg',
        backgroundColor: '#1a237e',
        backgroundGradient: 'linear-gradient(135deg, #1a237e 0%, #7b1fa2 100%)',
        textColor: '#ffffff',
        accentColor: '#ff4081',
        fontFamily: 'Noto Sans JP, system-ui, sans-serif',
        borderRadius: 20,
        shadowStyle: '0 10px 30px rgba(26, 35, 126, 0.5)',
        templateLayout: 'playful'
      },
      {
        id: 'sports-trading',
        name: 'Sports Trading Card',
        category: 'fan',
        preview: '/themes/sports-fan.jpg',
        backgroundColor: '#0d47a1',
        backgroundGradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
        textColor: '#ffffff',
        accentColor: '#ffc107',
        fontFamily: 'Roboto Condensed, system-ui, sans-serif',
        borderRadius: 12,
        shadowStyle: '0 6px 20px rgba(13, 71, 161, 0.4)',
        templateLayout: 'modern'
      }
    ],
    features: ['Photo Collections', 'Trading Card Layout', 'Holographic Effects', 'Rarity Levels', 'Collection Albums'],
    targetAudience: 'Fans, collectors, fandom communities',
    colorScheme: {
      primary: '#ff1744',
      secondary: '#9c27b0',
      accent: '#ffd700',
      background: '#f3e5f5',
      text: '#1a1a1a'
    }
  },

  art: {
    id: 'art',
    name: 'Art Cards',
    description: 'Museum-quality cards for artists and art enthusiasts',
    icon: 'Palette',
    emoji: '🎨',
    themes: [
      {
        id: 'museum-classic',
        name: 'Museum Classic',
        category: 'art',
        preview: '/themes/museum-art.jpg',
        backgroundColor: '#f5f5dc',
        backgroundGradient: 'linear-gradient(135deg, #f5f5dc 0%, #e6e6d4 100%)',
        textColor: '#2c1810',
        accentColor: '#8b4513',
        fontFamily: 'Playfair Display, Georgia, serif',
        borderRadius: 8,
        shadowStyle: '0 12px 40px rgba(44, 24, 16, 0.2)',
        templateLayout: 'elegant'
      },
      {
        id: 'contemporary-gallery',
        name: 'Contemporary Gallery',
        category: 'art',
        preview: '/themes/contemporary-art.jpg',
        backgroundColor: '#ffffff',
        backgroundGradient: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)',
        textColor: '#1a1a1a',
        accentColor: '#ff6b35',
        fontFamily: 'Montserrat, sans-serif',
        borderRadius: 16,
        shadowStyle: '0 8px 28px rgba(0, 0, 0, 0.1)',
        templateLayout: 'modern'
      },
      {
        id: 'renaissance-gold',
        name: 'Renaissance Gold',
        category: 'art',
        preview: '/themes/renaissance-art.jpg',
        backgroundColor: '#1a1a1a',
        backgroundGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        textColor: '#d4af37',
        accentColor: '#ffd700',
        fontFamily: 'Cormorant Garamond, serif',
        borderRadius: 12,
        shadowStyle: '0 10px 35px rgba(212, 175, 55, 0.3)',
        templateLayout: 'elegant'
      }
    ],
    features: ['Art Frames', 'Gallery Layout', 'Artist Bio', 'Portfolio Showcase', 'Exhibition Info'],
    targetAudience: 'Artists, galleries, art collectors, curators',
    colorScheme: {
      primary: '#f5f5dc',
      secondary: '#2c1810',
      accent: '#8b4513',
      background: '#ffffff',
      text: '#1a1a1a'
    }
  }
}

export const getAllCardCategories = (): CardCategoryConfig[] => {
  return Object.values(CARD_CATEGORIES)
}

export const getCategoryById = (id: CardCategory): CardCategoryConfig => {
  return CARD_CATEGORIES[id]
}

export const getThemesByCategory = (category: CardCategory): CardTheme[] => {
  return CARD_CATEGORIES[category].themes
}

export const getThemeById = (themeId: string): CardTheme | null => {
  for (const category of Object.values(CARD_CATEGORIES)) {
    const theme = category.themes.find(t => t.id === themeId)
    if (theme) return theme
  }
  return null
}