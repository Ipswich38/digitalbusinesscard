import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { nanoid } from "nanoid"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const cards = await prisma.businessCard.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        analytics: {
          select: {
            views: true,
            qrScans: true,
            contactClicks: true,
            socialClicks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform the data to include analytics summary
    const cardsWithAnalytics = cards.map((card) => ({
      ...card,
      analytics: card.analytics.length > 0 ? {
        views: card.analytics.reduce((sum, a) => sum + a.views, 0),
        qrScans: card.analytics.reduce((sum, a) => sum + a.qrScans, 0),
        contactClicks: card.analytics.reduce((sum, a) => sum + a.contactClicks, 0),
        socialClicks: card.analytics.reduce((sum, a) => sum + a.socialClicks, 0),
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
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, data } = body

    if (!data) {
      return NextResponse.json(
        { error: "Card data is required" },
        { status: 400 }
      )
    }

    // Generate a unique slug
    const slug = nanoid(10)

    const card = await prisma.businessCard.create({
      data: {
        userId: session.user.id,
        title: title || `${data.firstName || "Untitled"}'s Card`,
        slug,
        data,
        isActive: true,
      },
    })

    return NextResponse.json({ card }, { status: 201 })
  } catch (error) {
    console.error("Error creating card:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}