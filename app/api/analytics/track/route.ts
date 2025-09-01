import { NextRequest, NextResponse } from "next/server"
import { trackCardView, trackQRScan, trackContactClick, trackSocialClick } from "@/lib/analytics"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cardId, userId, eventType, platform, clickType } = body

    if (!cardId || !userId || !eventType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const headersList = headers()
    const userAgent = headersList.get("user-agent") || undefined
    const country = headersList.get("cf-ipcountry") || undefined // Cloudflare header
    const referrer = headersList.get("referer") || undefined

    switch (eventType) {
      case "view":
        await trackCardView(cardId, userId, userAgent, country, referrer)
        break
      case "qr_scan":
        await trackQRScan(cardId, userId)
        break
      case "contact_click":
        await trackContactClick(cardId, userId, clickType || "unknown")
        break
      case "social_click":
        await trackSocialClick(cardId, userId, platform || "unknown")
        break
      default:
        return NextResponse.json(
          { error: "Invalid event type" },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}