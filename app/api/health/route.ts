import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

export async function GET() {
  const healthCheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "digital-business-card-pro",
    version: process.env.npm_package_version || "unknown",
    environment: process.env.NODE_ENV,
    checks: {
      database: "checking",
      memory: "checking",
    },
    uptime: process.uptime(),
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
  }

  try {
    // Database health check
    await prisma.$queryRaw`SELECT 1`
    healthCheck.checks.database = "healthy"
    logger.debug("Database health check passed")
  } catch (error) {
    healthCheck.status = "error"
    healthCheck.checks.database = "unhealthy"
    logger.error("Database health check failed", error as Error)
  }

  // Memory health check
  const memoryUsagePercent = (healthCheck.memory.used / healthCheck.memory.total) * 100
  if (memoryUsagePercent > 90) {
    healthCheck.status = "warning"
    healthCheck.checks.memory = "warning"
  } else {
    healthCheck.checks.memory = "healthy"
  }

  const status = healthCheck.status === "ok" ? 200 : healthCheck.status === "warning" ? 200 : 503

  return NextResponse.json(healthCheck, { status })
}