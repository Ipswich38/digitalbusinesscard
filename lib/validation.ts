import { z } from "zod"

// User data validation schema
export const userDataSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().max(50).optional(),
  title: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  email: z.string().email("Invalid email address").optional(),
  mobile: z.string().max(20).optional(),
  website: z.string().url("Invalid website URL").optional(),
  
  // Social media links
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  x: z.string().url("Invalid X/Twitter URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  tiktok: z.string().url("Invalid TikTok URL").optional().or(z.literal("")),
  threads: z.string().url("Invalid Threads URL").optional().or(z.literal("")),
  
  // Design settings
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").optional(),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").optional(),
  useGradient: z.boolean().optional(),
  backgroundGradient: z.string().optional(),
  
  // Display preferences
  showEmail: z.boolean().optional(),
  showMobile: z.boolean().optional(),
  selectedSocial: z.string().optional(),
  
  // Logo and branding
  logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  logoShape: z.enum(["auto", "round", "square"]).optional(),
  
  // Styling
  fontPair: z.string().optional(),
  cardStyle: z.enum(["glassmorphic", "solid", "outlined"]).optional(),
  cornerRadius: z.enum(["rounded", "sharp", "extra-rounded"]).optional(),
  animatedBackground: z.boolean().optional(),
  animatedBackgroundType: z.string().optional(),
  
  // Custom fields
  customFields: z.array(z.object({
    id: z.string(),
    label: z.string().max(50),
    value: z.string().max(200),
  })).optional(),
})

// Business card creation schema
export const createCardSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  data: userDataSchema,
  isActive: z.boolean().optional().default(true),
})

// Analytics event schema
export const analyticsEventSchema = z.object({
  cardId: z.string().cuid("Invalid card ID"),
  userId: z.string().cuid("Invalid user ID"),
  eventType: z.enum(["view", "qr_scan", "contact_click", "social_click"]),
  platform: z.string().optional(),
  clickType: z.string().optional(),
})

// Email signature options schema
export const emailSignatureOptionsSchema = z.object({
  includePhoto: z.boolean().default(true),
  includeSocial: z.boolean().default(true),
  includeQR: z.boolean().default(false),
  layout: z.enum(["horizontal", "vertical"]).default("horizontal"),
  colorScheme: z.enum(["light", "dark", "brand"]).default("light"),
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
})

// Webhook data schema
export const webhookDataSchema = z.object({
  cardId: z.string().cuid("Invalid card ID"),
  contactData: userDataSchema,
  integrationTypes: z.array(z.string()).optional().default([]),
})

// Environment validation
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url("Invalid database URL"),
  NEXTAUTH_SECRET: z.string().min(32, "NextAuth secret must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url("Invalid NextAuth URL"),
  
  // Optional OAuth providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
  
  // Optional external services
  HUBSPOT_API_KEY: z.string().optional(),
  ZAPIER_WEBHOOK_URL: z.string().url("Invalid Zapier webhook URL").optional(),
  
  // Feature flags
  ENABLE_ANALYTICS: z.string().transform(val => val === "true").optional().default(false),
  ENABLE_CRM_INTEGRATION: z.string().transform(val => val === "true").optional().default(false),
  ENABLE_EMAIL_SIGNATURES: z.string().transform(val => val === "true").optional().default(false),
})

export type UserData = z.infer<typeof userDataSchema>
export type CreateCardData = z.infer<typeof createCardSchema>
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>
export type EmailSignatureOptions = z.infer<typeof emailSignatureOptionsSchema>
export type WebhookData = z.infer<typeof webhookDataSchema>
export type EnvConfig = z.infer<typeof envSchema>

// Validation helper functions
export function validateUserData(data: unknown): UserData {
  return userDataSchema.parse(data)
}

export function validateCreateCard(data: unknown): CreateCardData {
  return createCardSchema.parse(data)
}

export function validateAnalyticsEvent(data: unknown): AnalyticsEvent {
  return analyticsEventSchema.parse(data)
}

export function validateEmailSignatureOptions(data: unknown): EmailSignatureOptions {
  return emailSignatureOptionsSchema.parse(data)
}

export function validateWebhookData(data: unknown): WebhookData {
  return webhookDataSchema.parse(data)
}

export function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error("Environment validation failed:", error)
    process.exit(1)
  }
}