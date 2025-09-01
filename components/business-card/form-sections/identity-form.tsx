"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Building, Phone, Mail, CheckCircle } from "lucide-react"
import type { UserData } from "../types"

interface IdentityFormProps {
  userData: UserData
  onInputChange: (field: keyof UserData, value: string | boolean) => void
}

export function IdentityForm({ userData, onInputChange }: IdentityFormProps) {
  const handleEmailChange = (email: string) => {
    onInputChange("email", email)

    // Smart autofill: detect domain from email and suggest company
    if (email.includes("@") && !userData.company) {
      const domain = email.split("@")[1]
      if (
        domain &&
        domain !== "gmail.com" &&
        domain !== "yahoo.com" &&
        domain !== "hotmail.com" &&
        domain !== "outlook.com"
      ) {
        const companyName = domain.split(".")[0]
        const capitalizedCompany = companyName.charAt(0).toUpperCase() + companyName.slice(1)
        onInputChange("company", capitalizedCompany)
      }
    }
  }

  const isFieldComplete = (value: string) => value.trim().length > 0

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Let's start with the basics</h2>
        <p className="text-gray-400">Tell us who you are and how to reach you</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-1 rounded-full bg-blue-500/20 mt-0.5">
            <CheckCircle className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-blue-300 text-sm font-medium mb-1">Quick tip</p>
            <p className="text-blue-200/80 text-sm">
              Only your <strong>first name</strong> and <strong>mobile number</strong> are required. Everything else is
              optional and can help make your card more complete.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label htmlFor="firstName" className="text-white flex items-center gap-3 text-sm font-medium">
            <div className="p-1.5 rounded-lg bg-green-500/20">
              <User className="h-4 w-4 text-green-400" />
            </div>
            First Name <span className="text-red-400">*</span>
            {isFieldComplete(userData.firstName) && <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />}
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={userData.firstName}
            onChange={(e) => onInputChange("firstName", e.target.value)}
            className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-12 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="title" className="text-white flex items-center gap-3 text-sm font-medium">
            <div className="p-1.5 rounded-lg bg-purple-500/20">
              <Building className="h-4 w-4 text-purple-400" />
            </div>
            Title / Position
            {isFieldComplete(userData.title) && <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />}
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="e.g. Marketing Manager at Acme Inc."
            value={userData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-12 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="mobile" className="text-white flex items-center gap-3 text-sm font-medium">
            <div className="p-1.5 rounded-lg bg-blue-500/20">
              <Phone className="h-4 w-4 text-blue-400" />
            </div>
            Mobile Number <span className="text-red-400">*</span>
            {isFieldComplete(userData.mobile) && <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />}
          </Label>
          <Input
            id="mobile"
            type="tel"
            placeholder="Enter your mobile number"
            value={userData.mobile}
            onChange={(e) => onInputChange("mobile", e.target.value)}
            className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-12 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-white flex items-center gap-3 text-sm font-medium">
            <div className="p-1.5 rounded-lg bg-cyan-500/20">
              <Mail className="h-4 w-4 text-cyan-400" />
            </div>
            Email
            {isFieldComplete(userData.email) && <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={userData.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-12 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="company" className="text-white flex items-center gap-3 text-sm font-medium">
            <div className="p-1.5 rounded-lg bg-yellow-500/20">
              <Building className="h-4 w-4 text-yellow-400" />
            </div>
            Company
            {isFieldComplete(userData.company) && <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />}
          </Label>
          <Input
            id="company"
            type="text"
            placeholder="Enter your company"
            value={userData.company}
            onChange={(e) => onInputChange("company", e.target.value)}
            className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-12 text-sm rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
        </div>
      </div>
    </div>
  )
}
