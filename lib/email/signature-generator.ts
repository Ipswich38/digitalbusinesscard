import type { UserData } from "@/components/business-card/types"

export interface EmailSignatureOptions {
  includePhoto: boolean
  includeSocial: boolean
  includeQR: boolean
  layout: "horizontal" | "vertical"
  colorScheme: "light" | "dark" | "brand"
  fontSize: "small" | "medium" | "large"
}

export function generateEmailSignature(
  userData: UserData,
  options: EmailSignatureOptions,
  cardUrl: string,
  qrCodeUrl?: string
): string {
  const {
    includePhoto,
    includeSocial,
    includeQR,
    layout,
    colorScheme,
    fontSize,
  } = options

  const colors = getColorScheme(colorScheme, userData)
  const fontSizeValue = getFontSize(fontSize)

  const socialLinks = getSocialLinks(userData)

  const signature = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: ${fontSizeValue}px; color: ${colors.text};">
  <tr>
    ${includePhoto && userData.logo ? generatePhotoColumn(userData.logo, layout) : ""}
    <td style="vertical-align: top; ${layout === "horizontal" && includePhoto ? "padding-left: 20px;" : ""}">
      <table cellpadding="0" cellspacing="0" border="0">
        ${generateContactInfo(userData, colors)}
        ${includeSocial && socialLinks.length > 0 ? generateSocialLinks(socialLinks, colors) : ""}
        ${includeQR && qrCodeUrl ? generateQRCode(qrCodeUrl, cardUrl) : ""}
      </table>
    </td>
  </tr>
</table>

<!-- Digital Business Card CTA -->
<p style="font-size: 11px; color: #666; margin-top: 15px;">
  📱 <a href="${cardUrl}" style="color: ${colors.accent}; text-decoration: none;">View my interactive business card</a> | 
  Created with <a href="${process.env.NEXTAUTH_URL || "https://digitalbusinesscard.com"}" style="color: ${colors.accent}; text-decoration: none;">Digital Business Card Pro</a>
</p>`

  return signature.trim()
}

function getColorScheme(scheme: string, userData: UserData) {
  switch (scheme) {
    case "dark":
      return {
        text: "#ffffff",
        accent: "#ea580c",
        secondary: "#94a3b8",
        background: "#1f2937",
      }
    case "light":
      return {
        text: "#1f2937",
        accent: "#ea580c",
        secondary: "#64748b",
        background: "#ffffff",
      }
    case "brand":
      return {
        text: userData.textColor || "#1f2937",
        accent: "#ea580c",
        secondary: "#64748b",
        background: userData.backgroundColor || "#ffffff",
      }
    default:
      return {
        text: "#1f2937",
        accent: "#ea580c",
        secondary: "#64748b",
        background: "#ffffff",
      }
  }
}

function getFontSize(size: string): number {
  switch (size) {
    case "small":
      return 12
    case "medium":
      return 14
    case "large":
      return 16
    default:
      return 14
  }
}

function generatePhotoColumn(logoUrl: string, layout: string): string {
  const size = layout === "horizontal" ? "80" : "60"
  return `
    <td style="vertical-align: top; ${layout === "vertical" ? "text-align: center; padding-bottom: 10px;" : ""}">
      <img src="${logoUrl}" alt="Profile" style="width: ${size}px; height: ${size}px; border-radius: 50%; object-fit: cover;" />
    </td>`
}

function generateContactInfo(userData: UserData, colors: any): string {
  return `
    <tr>
      <td style="padding-bottom: 5px;">
        <strong style="color: ${colors.text}; font-size: 16px;">${userData.firstName}</strong>
        ${userData.title ? `<br><span style="color: ${colors.secondary};">${userData.title}</span>` : ""}
        ${userData.company ? `<br><span style="color: ${colors.secondary};">${userData.company}</span>` : ""}
      </td>
    </tr>
    <tr>
      <td style="padding-top: 8px; border-top: 1px solid ${colors.secondary};">
        ${userData.email ? `<div style="margin-bottom: 3px;"><a href="mailto:${userData.email}" style="color: ${colors.text}; text-decoration: none;">📧 ${userData.email}</a></div>` : ""}
        ${userData.mobile ? `<div style="margin-bottom: 3px;"><a href="tel:${userData.mobile}" style="color: ${colors.text}; text-decoration: none;">📱 ${userData.mobile}</a></div>` : ""}
      </td>
    </tr>`
}

function generateSocialLinks(socialLinks: Array<{ platform: string; url: string; icon: string }>, colors: any): string {
  const links = socialLinks
    .map(
      (social) =>
        `<a href="${social.url}" style="color: ${colors.accent}; text-decoration: none; margin-right: 10px;">${social.icon}</a>`
    )
    .join("")

  return `
    <tr>
      <td style="padding-top: 10px;">
        ${links}
      </td>
    </tr>`
}

function generateQRCode(qrCodeUrl: string, cardUrl: string): string {
  return `
    <tr>
      <td style="padding-top: 15px;">
        <a href="${cardUrl}">
          <img src="${qrCodeUrl}" alt="QR Code" style="width: 60px; height: 60px;" />
        </a>
        <br>
        <span style="font-size: 10px; color: #666;">Scan for digital card</span>
      </td>
    </tr>`
}

function getSocialLinks(userData: UserData): Array<{ platform: string; url: string; icon: string }> {
  const links = []

  if (userData.linkedin) {
    links.push({ platform: "LinkedIn", url: userData.linkedin, icon: "💼" })
  }
  if (userData.x) {
    links.push({ platform: "X", url: userData.x, icon: "🐦" })
  }
  if (userData.instagram) {
    links.push({ platform: "Instagram", url: userData.instagram, icon: "📷" })
  }
  if (userData.facebook) {
    links.push({ platform: "Facebook", url: userData.facebook, icon: "👥" })
  }

  return links
}

export function generateTextSignature(userData: UserData, cardUrl: string): string {
  let signature = `\n\n---\n${userData.firstName}`
  
  if (userData.title) signature += `\n${userData.title}`
  if (userData.company) signature += `\n${userData.company}`
  if (userData.email) signature += `\n📧 ${userData.email}`
  if (userData.mobile) signature += `\n📱 ${userData.mobile}`
  
  signature += `\n\n📱 View my digital business card: ${cardUrl}`
  
  return signature
}