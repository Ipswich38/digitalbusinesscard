import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const card = await prisma.businessCard.findUnique({
      where: { id },
      include: {
        analytics: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ card })
  } catch (error) {
    console.error("Error fetching card:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()

    // Verify the card belongs to the user
    const existingCard = await prisma.businessCard.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingCard) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      )
    }

    const card = await prisma.businessCard.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ card })
  } catch (error) {
    console.error("Error updating card:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = params

    // Verify the card belongs to the user
    const existingCard = await prisma.businessCard.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingCard) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      )
    }

    await prisma.businessCard.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting card:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}