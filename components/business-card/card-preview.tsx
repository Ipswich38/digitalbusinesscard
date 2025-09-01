"use client"

import type React from "react"
import type { UserData } from "./types"
import { Phone, Mail, Linkedin, User, RotateCcw, Award, Briefcase, MessageSquare, ExternalLink } from "lucide-react"

interface CardPreviewProps {
  userData: UserData
  currentView: "qr" | "business"
  qrCodeUrl: string
  hasData: boolean
  cardRef: React.RefObject<HTMLDivElement>
  getSocialMediaOptions: () => Array<{ value: string; label: string; url: string }>
  getSelectedSocialUrl: () => string
  onFlipCard?: () => void
}

export function CardPreview({
  userData,
  currentView,
  qrCodeUrl,
  hasData,
  cardRef,
  getSocialMediaOptions,
  getSelectedSocialUrl,
  onFlipCard,
}: CardPreviewProps) {
  const cardStyle = {
    background: userData.useGradient ? userData.backgroundGradient : userData.backgroundColor,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 16px rgba(0, 0, 0, 0.2)",
  }

  if (!hasData || !userData.firstName) {
    return (
      <div className="px-8 py-20 text-center space-y-8" style={cardStyle}>
        <div className="flex items-baseline justify-center">
          <h1 className="text-7xl font-serif font-light tracking-tight" style={{ color: userData.textColor }}>
            your
          </h1>
          <span
            className="text-4xl font-light tracking-wide ml-3"
            style={{ fontFamily: "Avenir, system-ui, sans-serif", color: userData.textColor }}
          >
            name
          </span>
        </div>
        <p
          className="text-base font-normal tracking-wide opacity-70"
          style={{ fontFamily: "Avenir, system-ui, sans-serif", color: userData.textColor }}
        >
          add your profession /<br />
          business name
        </p>
        <div className="pt-8">
          <div className="w-44 h-44 mx-auto bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
            <p className="text-white/60 text-sm font-medium">QR Code</p>
          </div>
          <p
            className="text-sm mt-4 font-light opacity-60"
            style={{ fontFamily: "Avenir, system-ui, sans-serif", color: userData.textColor }}
          >
            scan to see details
          </p>
        </div>
      </div>
    )
  }

  if (currentView === "business" && userData.cardSide === "back") {
    return (
      <div className="px-8 py-12 space-y-6 relative">
        {/* Flip indicator */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onFlipCard}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            title="Flip to front"
          >
            <RotateCcw className="h-4 w-4" style={{ color: userData.textColor }} />
          </button>
        </div>

        {/* Portfolio Section */}
        {userData.backContent.portfolio.enabled && userData.backContent.portfolio.projects.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: userData.textColor }}>
              <Briefcase className="h-5 w-5 text-orange-400" />
              Portfolio
            </h3>
            <div className="space-y-3">
              {userData.backContent.portfolio.projects.slice(0, 2).map((project) => (
                <div key={project.id} className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm" style={{ color: userData.textColor }}>
                        {project.title}
                      </h4>
                      <p className="text-xs opacity-70 mt-1" style={{ color: userData.textColor }}>
                        {project.description}
                      </p>
                    </div>
                    {project.url && (
                      <ExternalLink className="h-4 w-4 opacity-60" style={{ color: userData.textColor }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Section */}
        {userData.backContent.services.enabled && userData.backContent.services.items.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: userData.textColor }}>
              <Award className="h-5 w-5 text-blue-400" />
              Services
            </h3>
            <div className="space-y-2">
              {userData.backContent.services.items.slice(0, 3).map((service) => (
                <div key={service.id} className="p-3 rounded-xl bg-white/5 backdrop-blur-sm">
                  <h4 className="font-medium text-sm" style={{ color: userData.textColor }}>
                    {service.title}
                  </h4>
                  <p className="text-xs opacity-70 mt-1" style={{ color: userData.textColor }}>
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        {userData.backContent.testimonials.enabled && userData.backContent.testimonials.items.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: userData.textColor }}>
              <MessageSquare className="h-5 w-5 text-green-400" />
              Testimonials
            </h3>
            <div className="space-y-3">
              {userData.backContent.testimonials.items.slice(0, 1).map((testimonial) => (
                <div key={testimonial.id} className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <p className="text-xs italic opacity-80 mb-2" style={{ color: userData.textColor }}>
                    "{testimonial.text}"
                  </p>
                  <div className="text-xs opacity-70" style={{ color: userData.textColor }}>
                    <span className="font-medium">{testimonial.author}</span>
                    {testimonial.role && <span>, {testimonial.role}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info Section */}
        {userData.backContent.additionalInfo.enabled && userData.backContent.additionalInfo.bio && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: userData.textColor }}>
              About
            </h3>
            <p className="text-xs opacity-80 leading-relaxed" style={{ color: userData.textColor }}>
              {userData.backContent.additionalInfo.bio}
            </p>
            {userData.backContent.additionalInfo.achievements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium opacity-90" style={{ color: userData.textColor }}>
                  Key Achievements
                </h4>
                <ul className="space-y-1">
                  {userData.backContent.additionalInfo.achievements.slice(0, 3).map((achievement, index) => (
                    <li
                      key={index}
                      className="text-xs opacity-70 flex items-start gap-2"
                      style={{ color: userData.textColor }}
                    >
                      <span className="text-orange-400 mt-1">•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (currentView === "business") {
    return (
      <div className="px-8 py-12 space-y-8 relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={onFlipCard}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            title="Flip to back"
          >
            <RotateCcw className="h-4 w-4" style={{ color: userData.textColor }} />
          </button>
        </div>

        {userData.logo && (
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm shadow-lg">
              <img
                src={userData.logo || "/placeholder.svg"}
                alt="Logo"
                className={`w-20 h-20 object-contain ${
                  userData.logoShape === "round"
                    ? "rounded-full"
                    : userData.logoShape === "square"
                      ? "rounded-xl"
                      : "rounded-xl"
                }`}
              />
            </div>
          </div>
        )}

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-serif font-light tracking-tight" style={{ color: userData.textColor }}>
            {userData.firstName}
          </h1>
          {userData.title && (
            <p
              className="text-lg font-normal opacity-80"
              style={{ fontFamily: "Avenir, system-ui, sans-serif", color: userData.textColor }}
            >
              {userData.title}
            </p>
          )}
          {userData.company && (
            <p
              className="text-base font-light opacity-70"
              style={{ fontFamily: "Avenir, system-ui, sans-serif", color: userData.textColor }}
            >
              {userData.company}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {userData.mobile && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-blue-500/20">
                <Phone className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs opacity-60" style={{ color: userData.textColor }}>
                  Mobile
                </p>
                <p className="text-sm font-medium" style={{ color: userData.textColor }}>
                  {userData.mobile}
                </p>
              </div>
            </div>
          )}

          {userData.email && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-cyan-500/20">
                <Mail className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs opacity-60" style={{ color: userData.textColor }}>
                  Email
                </p>
                <p className="text-sm font-medium" style={{ color: userData.textColor }}>
                  {userData.email}
                </p>
              </div>
            </div>
          )}

          {/* Social media sections */}
          {userData.linkedin && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-blue-700/20">
                <Linkedin className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs opacity-60" style={{ color: userData.textColor }}>
                  LinkedIn
                </p>
                <p className="text-sm font-medium" style={{ color: userData.textColor }}>
                  {userData.linkedin.replace("https://", "").replace("http://", "")}
                </p>
              </div>
            </div>
          )}

          {/* Custom fields */}
          {userData.customFields.map(
            (field) =>
              field.value.trim() && (
                <div key={field.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <div className="p-2 rounded-xl bg-orange-500/20">
                    <User className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs opacity-60" style={{ color: userData.textColor }}>
                      {field.label}
                    </p>
                    <p className="text-sm font-medium" style={{ color: userData.textColor }}>
                      {field.value}
                    </p>
                  </div>
                </div>
              ),
          )}
        </div>
      </div>
    )
  }

  // QR View
  return (
    <div className="px-8 py-16 text-center space-y-10">
      {userData.logo && (
        <div className="flex justify-center">
          <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm shadow-lg">
            <img
              src={userData.logo || "/placeholder.svg"}
              alt="Logo"
              className={`w-16 h-16 object-contain ${
                userData.logoShape === "round"
                  ? "rounded-full"
                  : userData.logoShape === "square"
                    ? "rounded-lg"
                    : "rounded-lg"
              }`}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-baseline justify-center">
          <h1
            className="text-7xl font-serif font-light tracking-tight leading-none"
            style={{ color: userData.textColor }}
          >
            {userData.firstName.toLowerCase()}
          </h1>
        </div>
        {userData.title && (
          <p
            className="text-base font-normal tracking-wide opacity-80"
            style={{ fontFamily: "Avenir, system-ui, sans-serif", color: userData.textColor }}
          >
            {userData.title.toLowerCase()}
          </p>
        )}
      </div>

      {(userData.showMobile || userData.showEmail || userData.selectedSocial !== "none") && (
        <div className="space-y-2">
          {userData.showMobile && userData.mobile && (
            <p
              className="text-sm font-light opacity-70"
              style={{ fontFamily: "Avenir, system-ui, sans-serif", color: userData.textColor }}
            >
              {userData.mobile}
            </p>
          )}
          {userData.showEmail && userData.email && (
            <p
              className="text-sm font-light opacity-70"
              style={{ fontFamily: "Avenir, system-ui, sans-serif", color: userData.textColor }}
            >
              {userData.email}
            </p>
          )}
          {userData.selectedSocial !== "none" && getSelectedSocialUrl() && (
            <p
              className="text-sm font-light opacity-70"
              style={{ fontFamily: "Avenir, system-ui, sans-serif", color: userData.textColor }}
            >
              {getSocialMediaOptions().find((option) => option.value === userData.selectedSocial)?.label}
            </p>
          )}
        </div>
      )}

      {qrCodeUrl && (
        <div className="pt-6">
          <div className="inline-block p-4 rounded-3xl bg-white/10 backdrop-blur-sm shadow-lg">
            <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-44 h-44 mx-auto rounded-2xl" />
          </div>
          <p
            className="text-sm mt-4 font-light opacity-60"
            style={{ fontFamily: "Avenir, system-ui, sans-serif", color: userData.textColor }}
          >
            scan to see details
          </p>
        </div>
      )}
    </div>
  )
}
