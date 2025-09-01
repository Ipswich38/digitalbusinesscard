import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateEmailSignature, generateTextSignature } from "@/lib/email/signature-generator"
import type { EmailSignatureOptions } from "@/lib/email/signature-generator"

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
    const { cardId, format = "html", options = {} } = body

    if (!cardId) {
      return NextResponse.json(
        { error: "Card ID is required" },
        { status: 400 }
      )
    }

    // Get the business card
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

    const userData = card.data as any
    const cardUrl = `${process.env.NEXTAUTH_URL || "https://digitalbusinesscard.com"}/card/${card.slug}`

    // Default signature options
    const signatureOptions: EmailSignatureOptions = {
      includePhoto: true,
      includeSocial: true,
      includeQR: false,
      layout: "horizontal",
      colorScheme: "light",
      fontSize: "medium",
      ...options,
    }

    let signature: string

    if (format === "text") {
      signature = generateTextSignature(userData, cardUrl)
    } else {
      // Generate QR code URL if needed
      let qrCodeUrl: string | undefined
      if (signatureOptions.includeQR) {
        // You would generate the QR code here - for now, we'll use a placeholder
        qrCodeUrl = `${process.env.NEXTAUTH_URL || "https://digitalbusinesscard.com"}/api/qr/${card.slug}`
      }

      signature = generateEmailSignature(userData, signatureOptions, cardUrl, qrCodeUrl)
    }

    return NextResponse.json({
      signature,
      cardUrl,
      format,
    })
  } catch (error) {
    console.error("Email signature generation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}