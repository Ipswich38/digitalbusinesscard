interface HubSpotContact {
  properties: {
    email: string
    firstname?: string
    lastname?: string
    phone?: string
    company?: string
    jobtitle?: string
    linkedin_url?: string
    twitter_url?: string
    website?: string
  }
}

export class HubSpotIntegration {
  private apiKey: string
  private baseUrl = "https://api.hubapi.com"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async createContact(contactData: any): Promise<boolean> {
    try {
      const hubspotContact: HubSpotContact = {
        properties: {
          email: contactData.email,
          firstname: contactData.firstName,
          lastname: contactData.lastName || "",
          phone: contactData.mobile,
          company: contactData.company,
          jobtitle: contactData.title,
          linkedin_url: contactData.linkedin,
          twitter_url: contactData.x,
        },
      }

      const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(hubspotContact),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("HubSpot API error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("HubSpot integration error:", error)
      return false
    }
  }

  async updateContact(email: string, contactData: any): Promise<boolean> {
    try {
      // First, search for the contact by email
      const searchResponse = await fetch(
        `${this.baseUrl}/crm/v3/objects/contacts/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            filterGroups: [
              {
                filters: [
                  {
                    propertyName: "email",
                    operator: "EQ",
                    value: email,
                  },
                ],
              },
            ],
          }),
        }
      )

      const searchResult = await searchResponse.json()

      if (searchResult.results && searchResult.results.length > 0) {
        const contactId = searchResult.results[0].id

        const hubspotContact: HubSpotContact = {
          properties: {
            email: contactData.email,
            firstname: contactData.firstName,
            lastname: contactData.lastName || "",
            phone: contactData.mobile,
            company: contactData.company,
            jobtitle: contactData.title,
            linkedin_url: contactData.linkedin,
            twitter_url: contactData.x,
          },
        }

        const updateResponse = await fetch(
          `${this.baseUrl}/crm/v3/objects/contacts/${contactId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(hubspotContact),
          }
        )

        return updateResponse.ok
      } else {
        // Contact doesn't exist, create new one
        return await this.createContact(contactData)
      }
    } catch (error) {
      console.error("HubSpot update error:", error)
      return false
    }
  }
}

export async function syncContactToHubSpot(userData: any): Promise<boolean> {
  const apiKey = process.env.HUBSPOT_API_KEY

  if (!apiKey) {
    console.warn("HubSpot API key not configured")
    return false
  }

  const hubspot = new HubSpotIntegration(apiKey)
  return await hubspot.createContact(userData)
}