import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    
    // Only allow admins or internal services to access metrics
    if (!session?.user?.email?.endsWith('@company.com') && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [
      totalUsers,
      totalCards,
      activeCards,
      totalViews,
      totalQRScans,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.businessCard.count(),
      prisma.businessCard.count({ where: { isActive: true } }),
      prisma.analytics.aggregate({ _sum: { views: true } }),
      prisma.analytics.aggregate({ _sum: { qrScans: true } }),
    ])

    // Get user signups by plan
    const usersByPlan = await prisma.user.groupBy({
      by: ['plan'],
      _count: {
        id: true,
      },
    })

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentActivity = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.businessCard.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
    ])

    const metrics = {
      timestamp: new Date().toISOString(),
      totals: {
        users: totalUsers,
        cards: totalCards,
        activeCards: activeCards,
        views: totalViews._sum.views || 0,
        qrScans: totalQRScans._sum.qrScans || 0,
      },
      usersByPlan: usersByPlan.reduce((acc, item) => {
        acc[item.plan.toLowerCase()] = item._count.id
        return acc
      }, {} as Record<string, number>),
      recentActivity: {
        newUsers: recentActivity[0],
        newCards: recentActivity[1],
      },
      system: {
        uptime: process.uptime(),
        memory: {
          used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
          total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        },
        nodeVersion: process.version,
      },
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Metrics error:", error)
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    )
  }
}