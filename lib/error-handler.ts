import { NextResponse } from "next/server"
import { logger } from "./logger"

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database error") {
    super(message, 500)
  }
}

export function handleApiError(error: unknown): NextResponse {
  logger.error('API Error occurred', error instanceof Error ? error : new Error(String(error)))

  // Known application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        statusCode: error.statusCode,
      },
      { status: error.statusCode }
    )
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any
    
    switch (prismaError.code) {
      case 'P2002':
        return NextResponse.json(
          { error: "Resource already exists", statusCode: 409 },
          { status: 409 }
        )
      case 'P2025':
        return NextResponse.json(
          { error: "Resource not found", statusCode: 404 },
          { status: 404 }
        )
      case 'P2003':
        return NextResponse.json(
          { error: "Foreign key constraint failed", statusCode: 400 },
          { status: 400 }
        )
      default:
        return NextResponse.json(
          { error: "Database error", statusCode: 500 },
          { status: 500 }
        )
    }
  }

  // Network/fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return NextResponse.json(
      { error: "External service unavailable", statusCode: 503 },
      { status: 503 }
    )
  }

  // Generic error
  return NextResponse.json(
    {
      error: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : String(error))
        : "Internal server error",
      statusCode: 500,
    },
    { status: 500 }
  )
}

export function asyncHandler(
  fn: (req: Request, context?: any) => Promise<NextResponse>
) {
  return async (req: Request, context?: any): Promise<NextResponse> => {
    try {
      return await fn(req, context)
    } catch (error) {
      return handleApiError(error)
    }
  }
}