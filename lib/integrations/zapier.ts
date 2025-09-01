export interface ZapierWebhookData {
  firstName: string
  lastName?: string
  email: string
  phone?: string
  company?: string
  title?: string
  socialLinks?: Record<string, string>
  customFields?: Record<string, string>
  cardUrl: string
  timestamp: string
}

export async function sendToZapier(
  webhookUrl: string,
  contactData: ZapierWebhookData
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    })

    return response.ok
  } catch (error) {
    console.error("Zapier webhook error:", error)
    return false
  }
}

export async function sendContactToZapier(userData: any, cardId: string) {
  const webhookUrl = process.env.ZAPIER_WEBHOOK_URL
  
  if (!webhookUrl) {
    console.warn("Zapier webhook URL not configured")
    return false
  }

  const zapierData: ZapierWebhookData = {
    firstName: userData.firstName,
    lastName: userData.lastName || "",
    email: userData.email,
    phone: userData.mobile,
    company: userData.company,
    title: userData.title,
    socialLinks: {
      linkedin: userData.linkedin,
      x: userData.x,
      instagram: userData.instagram,
      facebook: userData.facebook,
      tiktok: userData.tiktok,
      threads: userData.threads,
    },
    cardUrl: `${process.env.NEXTAUTH_URL}/card/${cardId}`,
    timestamp: new Date().toISOString(),
  }

  return await sendToZapier(webhookUrl, zapierData)
}