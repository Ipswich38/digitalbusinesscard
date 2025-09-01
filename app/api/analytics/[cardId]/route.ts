import { NextRequest, NextResponse } from "next/server"
import { getCardAnalytics } from "@/lib/analytics"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { cardId } = params

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

    const analytics = await getCardAnalytics(cardId, session.user.id)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}