import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendContactToZapier } from "@/lib/integrations/zapier"
import { syncContactToHubSpot } from "@/lib/integrations/hubspot"

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
    const { cardId, contactData, integrationTypes = [] } = body

    if (!cardId || !contactData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify the card belongs to the user
    const card = await prisma.businessCard.findFirst({
      where: {
        id: cardId,
        userId: session.user.id,
      },
    })

    if (!card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      )
    }

    const results: Record<string, boolean> = {}

    // Send to configured integrations
    if (integrationTypes.includes("zapier") || integrationTypes.length === 0) {
      results.zapier = await sendContactToZapier(contactData, cardId)
    }

    if (integrationTypes.includes("hubspot") || integrationTypes.length === 0) {
      results.hubspot = await syncContactToHubSpot(contactData)
    }

    // Log the integration attempt
    await prisma.integration.updateMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      data: {
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("Integration webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}