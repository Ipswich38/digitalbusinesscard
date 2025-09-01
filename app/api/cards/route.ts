import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { nanoid } from "nanoid"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: cards, error } = await supabase
      .from('business_cards')
      .select(`
        *,
        analytics (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Transform the data to include analytics summary
    const cardsWithAnalytics = (cards || []).map((card: any) => ({
      ...card,
      analytics: card.analytics && card.analytics.length > 0 ? {
        views: card.analytics.reduce((sum: number, a: any) => sum + a.views, 0),
        qrScans: card.analytics.reduce((sum: number, a: any) => sum + a.qr_scans, 0),
        contactClicks: card.analytics.reduce((sum: number, a: any) => sum + a.contact_clicks, 0),
        socialClicks: card.analytics.reduce((sum: number, a: any) => sum + a.social_clicks, 0),
      } : {
        views: 0,
        qrScans: 0,
        contactClicks: 0,
        socialClicks: 0,
      },
    }))

    return NextResponse.json({ cards: cardsWithAnalytics })
  } catch (error) {
    console.error("Error fetching cards:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, data } = body

    if (!data) {
      return NextResponse.json({ error: 'Card data is required' }, { status: 400 })
    }

    // Check user's plan for card limits (freemium)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Error fetching user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check existing card count for free users
    if (userData.plan === 'free') {
      const { count } = await supabase
        .from('business_cards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (count && count >= 1) {
        return NextResponse.json({ 
          error: 'Free plan limited to 1 card. Upgrade to create more.' 
        }, { status: 403 })
      }
    }

    // Generate a unique slug
    const slug = nanoid(10)

    const { data: card, error } = await supabase
      .from('business_cards')
      .insert({
        user_id: user.id,
        title: title || `${data.firstName || "Untitled"}'s Card`,
        slug,
        data,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
    }

    return NextResponse.json({ card }, { status: 201 })
  } catch (error) {
    console.error("Error creating card:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}