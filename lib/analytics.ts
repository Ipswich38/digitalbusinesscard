import { prisma } from "@/lib/prisma"

export interface AnalyticsData {
  views: number
  qrScans: number
  contactClicks: number
  socialClicks: number
  uniqueVisitors: number
  deviceBreakdown: Record<string, number>
  geoData: Record<string, number>
  referrerData: Record<string, number>
}

export async function trackCardView(
  cardId: string,
  userId: string,
  userAgent?: string,
  country?: string,
  referrer?: string
) {
  try {
    // Get or create analytics record
    let analytics = await prisma.analytics.findFirst({
      where: { cardId, userId }
    })

    if (!analytics) {
      analytics = await prisma.analytics.create({
        data: {
          cardId,
          userId,
          views: 1,
          deviceBreakdown: getUserAgent(userAgent),
          geoData: getCountryData(country),
          referrerData: getReferrerData(referrer),
        }
      })
    } else {
      // Update analytics
      const deviceData = { ...analytics.deviceBreakdown as object, ...getUserAgent(userAgent) }
      const geoDataUpdate = { ...analytics.geoData as object, ...getCountryData(country) }
      const referrerDataUpdate = { ...analytics.referrerData as object, ...getReferrerData(referrer) }

      await prisma.analytics.update({
        where: { id: analytics.id },
        data: {
          views: analytics.views + 1,
          deviceBreakdown: deviceData,
          geoData: geoDataUpdate,
          referrerData: referrerDataUpdate,
          updatedAt: new Date(),
        }
      })
    }

    return analytics
  } catch (error) {
    console.error("Error tracking card view:", error)
    throw error
  }
}

export async function trackQRScan(cardId: string, userId: string) {
  try {
    await prisma.analytics.upsert({
      where: {
        cardId_userId: { cardId, userId }
      },
      update: {
        qrScans: { increment: 1 },
        updatedAt: new Date(),
      },
      create: {
        cardId,
        userId,
        qrScans: 1,
      }
    })
  } catch (error) {
    console.error("Error tracking QR scan:", error)
    throw error
  }
}

export async function trackContactClick(cardId: string, userId: string, clickType: string) {
  try {
    await prisma.analytics.upsert({
      where: {
        cardId_userId: { cardId, userId }
      },
      update: {
        contactClicks: { increment: 1 },
        updatedAt: new Date(),
      },
      create: {
        cardId,
        userId,
        contactClicks: 1,
      }
    })
  } catch (error) {
    console.error("Error tracking contact click:", error)
    throw error
  }
}

export async function trackSocialClick(cardId: string, userId: string, platform: string) {
  try {
    await prisma.analytics.upsert({
      where: {
        cardId_userId: { cardId, userId }
      },
      update: {
        socialClicks: { increment: 1 },
        updatedAt: new Date(),
      },
      create: {
        cardId,
        userId,
        socialClicks: 1,
      }
    })
  } catch (error) {
    console.error("Error tracking social click:", error)
    throw error
  }
}

export async function getCardAnalytics(cardId: string, userId: string): Promise<AnalyticsData | null> {
  try {
    const analytics = await prisma.analytics.findFirst({
      where: { cardId, userId }
    })

    if (!analytics) return null

    return {
      views: analytics.views,
      qrScans: analytics.qrScans,
      contactClicks: analytics.contactClicks,
      socialClicks: analytics.socialClicks,
      uniqueVisitors: analytics.uniqueVisitors,
      deviceBreakdown: analytics.deviceBreakdown as Record<string, number>,
      geoData: analytics.geoData as Record<string, number>,
      referrerData: analytics.referrerData as Record<string, number>,
    }
  } catch (error) {
    console.error("Error getting card analytics:", error)
    return null
  }
}

function getUserAgent(userAgent?: string): Record<string, number> {
  if (!userAgent) return {}
  
  let device = "Unknown"
  if (userAgent.includes("Mobile")) device = "Mobile"
  else if (userAgent.includes("Tablet")) device = "Tablet"
  else device = "Desktop"
  
  return { [device]: 1 }
}

function getCountryData(country?: string): Record<string, number> {
  if (!country) return {}
  return { [country]: 1 }
}

function getReferrerData(referrer?: string): Record<string, number> {
  if (!referrer) return {}
  
  try {
    const url = new URL(referrer)
    const domain = url.hostname
    return { [domain]: 1 }
  } catch {
    return { "Direct": 1 }
  }
}