import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Get user from session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, data } = body

    // Generate unique slug
    const { data: slugResult, error: slugError } = await supabase
      .rpc('generate_unique_slug', { base_title: title || 'card' })

    if (slugError) {
      console.error('Slug generation error:', slugError)
      return NextResponse.json({ error: 'Failed to generate card URL' }, { status: 500 })
    }

    // Save card
    const { data: card, error: insertError } = await supabase
      .from('cards')
      .insert([
        {
          user_id: user.id,
          title: title || 'My Card',
          slug: slugResult,
          data: data
        }
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Card insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save card' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      card: card,
      url: `${request.nextUrl.origin}/${card.slug}`
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Get user from session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's cards
    const { data: cards, error: cardsError } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (cardsError) {
      console.error('Cards fetch error:', cardsError)
      return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
    }

    return NextResponse.json({ cards: cards || [] })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}