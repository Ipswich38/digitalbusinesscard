"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Linkedin, X, Instagram, Facebook, Music, CheckCircle, Globe } from "lucide-react"
import type { UserData } from "../types"

interface SocialFormProps {
  userData: UserData
  onInputChange: (field: keyof UserData, value: string | boolean) => void
}

export function SocialForm({ userData, onInputChange }: SocialFormProps) {
  const isFieldComplete = (value: string) => value.trim().length > 0

  const formatUrl = (url: string, platform: string) => {
    if (!url) return url

    // Remove protocol if present
    const cleanUrl = url.replace(/^https?:\/\//, "")

    // Add platform-specific formatting
    const platformDomains = {
      linkedin: "linkedin.com/in/",
      x: "x.com/",
      threads: "threads.net/@",
      instagram: "instagram.com/",
      facebook: "facebook.com/",
      tiktok: "tiktok.com/@",
    }

    const domain = platformDomains[platform as keyof typeof platformDomains]
    if (domain && !cleanUrl.includes(domain.split("/")[0])) {
      return `https://${domain}${cleanUrl}`
    }

    return `https://${cleanUrl}`
  }

  const handleUrlChange = (field: keyof UserData, value: string, platform: string) => {
    const formattedUrl = formatUrl(value, platform)
    onInputChange(field, formattedUrl)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Connect your social presence</h2>
        <p className="text-gray-400">Add your social media profiles to help people find you online</p>
      </div>

      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-1 rounded-full bg-purple-500/20 mt-0.5">
            <Globe className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <p className="text-purple-300 text-sm font-medium mb-1">Social media tips</p>
            <p className="text-purple-200/80 text-sm">
              Add your most professional profiles first. You can always add more later or choose which one to display on
              your QR card.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label htmlFor="linkedin" className="text-white flex items-center gap-3 text-sm font-medium">
            <div className="p-1.5 rounded-lg bg-blue-700/20">
              <Linkedin className="h-4 w-4 text-blue-500" />
            </div>
            LinkedIn Profile
            {isFieldComplete(userData.linkedin) && <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />}
          </Label>
          <Input
            id="linkedin"
            type="url"
            placeholder="linkedin.com/in/yourname"
            value={userData.linkedin}
            onChange={(e) => handleUrlChange("linkedin", e.target.value, "linkedin")}
            className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-12 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="x" className="text-white flex items-center gap-3 text-sm font-medium">
            <div className="p-1.5 rounded-lg bg-gray-600/20">
              <X className="h-4 w-4 text-gray-300" />
            </div>
            X (Twitter) Profile
            {isFieldComplete(userData.x) && <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />}
          </Label>
          <Input
            id="x"
            type="url"
            placeholder="x.com/yourhandle"
            value={userData.x}
            onChange={(e) => handleUrlChange("x", e.target.value, "x")}
            className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-12 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="instagram" className="text-white flex items-center gap-3 text-sm font-medium">
            <div className="p-1.5 rounded-lg bg-pink-500/20">
              <Instagram className="h-4 w-4 text-pink-400" />
            </div>
            Instagram Profile
            {isFieldComplete(userData.instagram) && <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />}
          </Label>
          <Input
            id="instagram"
            type="url"
            placeholder="instagram.com/yourhandle"
            value={userData.instagram}
            onChange={(e) => handleUrlChange("instagram", e.target.value, "instagram")}
            className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-12 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="threads" className="text-white flex items-center gap-3 text-sm font-medium">
            <div className="p-1.5 rounded-lg bg-purple-600/20">
              <Instagram className="h-4 w-4 text-purple-400" />
            </div>
            Threads Profile
            {isFieldComplete(userData.threads) && <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />}
          </Label>
          <Input
            id="threads"
            type="url"
            placeholder="threads.net/@yourhandle"
            value={userData.threads}
            onChange={(e) => handleUrlChange("threads", e.target.value, "threads")}
            className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-12 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="facebook" className="text-white flex items-center gap-3 text-sm font-medium">
            <div className="p-1.5 rounded-lg bg-blue-600/20">
              <Facebook className="h-4 w-4 text-blue-500" />
            </div>
            Facebook Profile
            {isFieldComplete(userData.facebook) && <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />}
          </Label>
          <Input
            id="facebook"
            type="url"
            placeholder="facebook.com/yourname"
            value={userData.facebook}
            onChange={(e) => handleUrlChange("facebook", e.target.value, "facebook")}
            className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-12 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="tiktok" className="text-white flex items-center gap-3 text-sm font-medium">
            <div className="p-1.5 rounded-lg bg-red-500/20">
              <Music className="h-4 w-4 text-red-400" />
            </div>
            TikTok Profile
            {isFieldComplete(userData.tiktok) && <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />}
          </Label>
          <Input
            id="tiktok"
            type="url"
            placeholder="tiktok.com/@yourhandle"
            value={userData.tiktok}
            onChange={(e) => handleUrlChange("tiktok", e.target.value, "tiktok")}
            className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-12 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
        </div>
      </div>
    </div>
  )
}
