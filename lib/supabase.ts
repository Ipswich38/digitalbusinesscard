import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    console.error('Missing Supabase environment variables:', { url: !!url, key: !!key })
    throw new Error('Missing Supabase configuration. Please check your environment variables.')
  }
  
  return createBrowserClient(url, key)
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          plan: 'free' | 'pro' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      business_cards: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          is_active: boolean
          data: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug: string
          is_active?: boolean
          data: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          slug?: string
          is_active?: boolean
          data?: any
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          card_id: string
          user_id: string
          views: number
          qr_scans: number
          contact_clicks: number
          social_clicks: number
          unique_visitors: number
          device_breakdown: any
          geo_data: any
          referrer_data: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          card_id: string
          user_id: string
          views?: number
          qr_scans?: number
          contact_clicks?: number
          social_clicks?: number
          unique_visitors?: number
          device_breakdown?: any
          geo_data?: any
          referrer_data?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          user_id?: string
          views?: number
          qr_scans?: number
          contact_clicks?: number
          social_clicks?: number
          unique_visitors?: number
          device_breakdown?: any
          geo_data?: any
          referrer_data?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}