"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { UserData } from "./types"
import { CardPreview } from "./card-preview"

interface LivePreviewProps {
  userData: UserData
  currentView: "qr" | "business"
  qrCodeUrl: string
  hasData: boolean
  getSocialMediaOptions: () => Array<{ value: string; label: string; url: string }>
  getSelectedSocialUrl: () => string
}

export function LivePreview({
  userData,
  currentView,
  qrCodeUrl,
  hasData,
  getSocialMediaOptions,
  getSelectedSocialUrl,
}: LivePreviewProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="sticky top-6">
      <Card
        ref={cardRef}
        className="border-0 rounded-[28px] shadow-2xl overflow-hidden relative backdrop-blur-sm w-full max-w-sm mx-auto"
        style={{
          background: userData.useGradient ? userData.backgroundGradient : userData.backgroundColor,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <CardContent className="p-0">
          <CardPreview
            userData={userData}
            currentView={currentView}
            qrCodeUrl={qrCodeUrl}
            hasData={hasData}
            cardRef={cardRef}
            getSocialMediaOptions={getSocialMediaOptions}
            getSelectedSocialUrl={getSelectedSocialUrl}
          />
        </CardContent>
      </Card>
    </div>
  )
}
