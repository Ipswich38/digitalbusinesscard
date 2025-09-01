export interface CustomField {
  id: string
  label: string
  value: string
}

export interface UserData {
  firstName: string
  title: string
  mobile: string
  email: string
  company: string
  facebook: string
  instagram: string
  tiktok: string
  linkedin: string
  x: string
  threads: string
  customFields: CustomField[]
  logo: string
  backgroundColor: string
  textColor: string
  showMobile: boolean
  showEmail: boolean
  selectedSocial: string
  logoShape: "auto" | "round" | "square"
  backgroundGradient: string
  useGradient: boolean
  fontPair: string
  animatedBackground: boolean
  animatedBackgroundType: string
  cardStyle: "glassmorphic" | "solid" | "outlined"
  cornerRadius: "rounded" | "sharp" | "extra-rounded"
  cardSide: "front" | "back"
  backContent: {
    portfolio: {
      enabled: boolean
      projects: Array<{
        id: string
        title: string
        description: string
        image?: string
        url?: string
        category: string
        tags: string[]
        featured: boolean
        completionDate: string
        clientName?: string
        techStack: string[]
        metrics?: {
          views?: number
          clicks?: number
          conversions?: number
          engagement?: number
        }
      }>
      analytics: {
        enabled: boolean
        trackViews: boolean
        trackClicks: boolean
        showMetrics: boolean
      }
      displayOptions: {
        layout: "grid" | "list" | "carousel"
        showTechStack: boolean
        showMetrics: boolean
        showClientName: boolean
        sortBy: "date" | "featured" | "category"
      }
    }
    testimonials: {
      enabled: boolean
      items: Array<{
        id: string
        text: string
        author: string
        role?: string
        rating?: number
        date?: string
        verified?: boolean
      }>
    }
    services: {
      enabled: boolean
      items: Array<{
        id: string
        title: string
        description: string
        icon?: string
        price?: string
        duration?: string
        popular?: boolean
      }>
    }
    additionalInfo: {
      enabled: boolean
      bio: string
      achievements: string[]
      certifications: string[]
      skills: Array<{
        id: string
        name: string
        level: number
        category: string
      }>
      experience: Array<{
        id: string
        company: string
        role: string
        duration: string
        description: string
      }>
    }
  }
  analytics: {
    enabled: boolean
    cardViews: number
    qrScans: number
    contactClicks: number
    socialClicks: number
    lastViewed?: string
    popularSections: Record<string, number>
  }
}

export interface ColorPreset {
  bg: string
  text: string
  name: string
}

export interface GradientPreset {
  gradient: string
  name: string
}

export interface SocialOption {
  value: string
  label: string
  url: string
}

export interface ThemePreset {
  name: string
  colors: { bg: string; text: string }
  gradient: string
  useGradient: boolean
  description: string
  category: string
}

export interface FontPair {
  name: string
  heading: string
  body: string
  description: string
  category: string
}

export interface AnimatedBackground {
  name: string
  gradient: string
  animation: string
  description: string
}
