"use client"
import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, ImageIcon, Upload, Eye, Plus, X, Type, Sparkles, Layers } from "lucide-react"
import type { UserData, CustomField } from "../types"
import {
  colorPresets,
  gradientPresets,
  themePresets,
  fontPairs,
  animatedBackgrounds,
  backgroundAnimationCSS,
} from "../constants"

interface CustomizationFormProps {
  userData: UserData
  onInputChange: (field: keyof UserData, value: string | boolean) => void
  getSocialMediaOptions: () => Array<{ value: string; label: string; url: string }>
}

export function CustomizationForm({ userData, onInputChange, getSocialMediaOptions }: CustomizationFormProps) {
  const selectColorPreset = (preset: { bg: string; text: string }) => {
    onInputChange("backgroundColor", preset.bg)
    onInputChange("textColor", preset.text)
    onInputChange("useGradient", false)
    onInputChange("backgroundGradient", "")
    onInputChange("animatedBackground", false)
  }

  const selectGradientPreset = (gradient: string) => {
    onInputChange("backgroundGradient", gradient)
    onInputChange("useGradient", true)
    onInputChange("animatedBackground", false)
  }

  const selectThemePreset = (theme: (typeof themePresets)[0]) => {
    onInputChange("backgroundColor", theme.colors.bg)
    onInputChange("textColor", theme.colors.text)
    onInputChange("useGradient", theme.useGradient)
    onInputChange("backgroundGradient", theme.gradient)
    onInputChange("animatedBackground", false)
  }

  const selectAnimatedBackground = (animatedBg: (typeof animatedBackgrounds)[0]) => {
    onInputChange("backgroundGradient", animatedBg.gradient)
    onInputChange("useGradient", true)
    onInputChange("animatedBackground", true)
    onInputChange("animatedBackgroundType", animatedBg.animation)
  }

  const detectLogoShape = (imageUrl: string): Promise<"round" | "square"> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve("square")
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        const corners = [
          [0, 0],
          [canvas.width - 1, 0],
          [0, canvas.height - 1],
          [canvas.width - 1, canvas.height - 1],
        ]

        let transparentCorners = 0
        corners.forEach(([x, y]) => {
          const index = (y * canvas.width + x) * 4
          const alpha = data[index + 3]
          if (alpha < 128) transparentCorners++
        })

        resolve(transparentCorners >= 3 ? "round" : "square")
      }
      img.onerror = () => resolve("square")
      img.src = imageUrl
    })
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        const detectedShape = await detectLogoShape(result)
        onInputChange("logo", result)
        onInputChange("logoShape", detectedShape)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    onInputChange("logo", "")
  }

  const addCustomField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      label: "",
      value: "",
    }
    const updatedFields = [...userData.customFields, newField]
    onInputChange("customFields", updatedFields as any)
  }

  const removeCustomField = (id: string) => {
    const updatedFields = userData.customFields.filter((field) => field.id !== id)
    onInputChange("customFields", updatedFields as any)
  }

  const updateCustomField = (id: string, key: "label" | "value", newValue: string) => {
    const updatedFields = userData.customFields.map((field) =>
      field.id === id ? { ...field, [key]: newValue } : field,
    )
    onInputChange("customFields", updatedFields as any)
  }

  return (
    <div className="space-y-8">
      <style dangerouslySetInnerHTML={{ __html: backgroundAnimationCSS }} />

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Make it uniquely yours</h2>
        <p className="text-gray-400">Customize colors, fonts, animations, and fine-tune every detail</p>
      </div>

      <Tabs defaultValue="themes" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700/50">
          <TabsTrigger
            value="themes"
            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300"
          >
            <Palette className="h-4 w-4 mr-2" />
            Themes
          </TabsTrigger>
          <TabsTrigger
            value="typography"
            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300"
          >
            <Type className="h-4 w-4 mr-2" />
            Fonts
          </TabsTrigger>
          <TabsTrigger
            value="effects"
            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Effects
          </TabsTrigger>
          <TabsTrigger
            value="layout"
            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300"
          >
            <Layers className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-6 mt-6">
          {/* Theme Presets */}
          <div className="space-y-4">
            <Label className="text-white text-lg font-medium">Theme Presets</Label>

            <div className="grid grid-cols-2 gap-3">
              {themePresets.map((theme, index) => (
                <button
                  key={index}
                  onClick={() => selectThemePreset(theme)}
                  className="p-4 rounded-xl border-2 border-transparent hover:border-orange-400 transition-all duration-200 text-left group"
                  style={{
                    background: theme.useGradient ? theme.gradient : theme.colors.bg,
                  }}
                >
                  <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
                    {theme.name}
                  </div>
                  <div className="text-xs opacity-70" style={{ color: theme.colors.text }}>
                    {theme.description}
                  </div>
                  <div
                    className="text-xs mt-1 px-2 py-1 rounded-full bg-black/20 inline-block"
                    style={{ color: theme.colors.text }}
                  >
                    {theme.category}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Customization */}
          <div className="space-y-4">
            <Label className="text-white text-lg font-medium">Custom Colors</Label>

            <div className="grid grid-cols-4 gap-2">
              {colorPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => selectColorPreset(preset)}
                  className="w-12 h-12 rounded-lg border-2 border-transparent hover:border-orange-400 transition-all duration-200 relative shadow-md hover:shadow-lg transform hover:scale-105"
                  style={{ backgroundColor: preset.bg }}
                  title={preset.name}
                >
                  <div
                    className="w-3 h-3 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-sm"
                    style={{ backgroundColor: preset.text }}
                  />
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <Label className="text-white text-sm font-medium">Gradient Backgrounds</Label>
              <div className="grid grid-cols-4 gap-2">
                {gradientPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => selectGradientPreset(preset.gradient)}
                    className="w-12 h-12 rounded-lg border-2 border-transparent hover:border-orange-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    style={{ background: preset.gradient }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-white text-sm font-medium">Background</Label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={userData.backgroundColor}
                    onChange={(e) => onInputChange("backgroundColor", e.target.value)}
                    className="w-10 h-10 rounded-xl border-2 border-gray-600 bg-transparent cursor-pointer shadow-md"
                  />
                  <Input
                    type="text"
                    value={userData.backgroundColor}
                    onChange={(e) => onInputChange("backgroundColor", e.target.value)}
                    className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white text-sm h-10 flex-1 rounded-xl"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-white text-sm font-medium">Text</Label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={userData.textColor}
                    onChange={(e) => onInputChange("textColor", e.target.value)}
                    className="w-10 h-10 rounded-xl border-2 border-gray-600 bg-transparent cursor-pointer shadow-md"
                  />
                  <Input
                    type="text"
                    value={userData.textColor}
                    onChange={(e) => onInputChange("textColor", e.target.value)}
                    className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white text-sm h-10 flex-1 rounded-xl"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6 mt-6">
          <div className="space-y-4">
            <Label className="text-white text-lg font-medium">Font Combinations</Label>

            <div className="grid gap-3">
              {fontPairs.map((fontPair, index) => (
                <button
                  key={index}
                  onClick={() => onInputChange("fontPair", fontPair.name)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    userData.fontPair === fontPair.name
                      ? "border-orange-400 bg-orange-500/10"
                      : "border-gray-600 hover:border-gray-500 bg-gray-800/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-white font-medium">{fontPair.name}</div>
                    <div className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">{fontPair.category}</div>
                  </div>
                  <div className="text-gray-400 text-sm mb-2">{fontPair.description}</div>
                  <div className="space-y-1">
                    <div className="text-white text-lg" style={{ fontFamily: fontPair.heading }}>
                      Heading Sample
                    </div>
                    <div className="text-gray-300 text-sm" style={{ fontFamily: fontPair.body }}>
                      Body text sample for readability
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-6 mt-6">
          <div className="space-y-4">
            <Label className="text-white text-lg font-medium">Animated Backgrounds</Label>

            <div className="grid gap-3">
              {animatedBackgrounds.map((animatedBg, index) => (
                <button
                  key={index}
                  onClick={() => selectAnimatedBackground(animatedBg)}
                  className="p-4 rounded-xl border-2 border-transparent hover:border-orange-400 transition-all duration-200 text-left overflow-hidden relative"
                  style={{
                    background: animatedBg.gradient,
                    backgroundSize: "400% 400%",
                  }}
                >
                  <div className="relative z-10">
                    <div className="text-white font-medium mb-1">{animatedBg.name}</div>
                    <div className="text-white/80 text-sm">{animatedBg.description}</div>
                  </div>
                  <div
                    className="absolute inset-0 animated-gradient"
                    style={
                      {
                        background: animatedBg.gradient,
                        "--animation": animatedBg.animation,
                      } as React.CSSProperties
                    }
                  />
                </button>
              ))}
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white text-sm font-medium">Enable Animation</Label>
                  <p className="text-gray-400 text-xs mt-1">Toggle subtle background animation</p>
                </div>
                <Switch
                  checked={userData.animatedBackground || false}
                  onCheckedChange={(checked) => onInputChange("animatedBackground", checked)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6 mt-6">
          <div className="space-y-4">
            <Label className="text-white text-lg font-medium">Card Style</Label>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "glassmorphic", label: "Glassmorphic", description: "Frosted glass effect" },
                { value: "solid", label: "Solid", description: "Clean solid background" },
                { value: "outlined", label: "Outlined", description: "Border with transparency" },
              ].map((style) => (
                <button
                  key={style.value}
                  onClick={() => onInputChange("cardStyle", style.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                    userData.cardStyle === style.value
                      ? "border-orange-400 bg-orange-500/10"
                      : "border-gray-600 hover:border-gray-500 bg-gray-800/30"
                  }`}
                >
                  <div className="text-white font-medium mb-1">{style.label}</div>
                  <div className="text-gray-400 text-xs">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-white text-lg font-medium">Corner Style</Label>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "rounded", label: "Rounded", description: "Standard corners" },
                { value: "sharp", label: "Sharp", description: "Square corners" },
                { value: "extra-rounded", label: "Extra Rounded", description: "Very curved corners" },
              ].map((corner) => (
                <button
                  key={corner.value}
                  onClick={() => onInputChange("cornerRadius", corner.value)}
                  className={`p-4 border-2 transition-all duration-200 text-center ${
                    userData.cornerRadius === corner.value
                      ? "border-orange-400 bg-orange-500/10"
                      : "border-gray-600 hover:border-gray-500 bg-gray-800/30"
                  } ${
                    corner.value === "rounded"
                      ? "rounded-xl"
                      : corner.value === "sharp"
                        ? "rounded-none"
                        : "rounded-3xl"
                  }`}
                >
                  <div className="text-white font-medium mb-1">{corner.label}</div>
                  <div className="text-gray-400 text-xs">{corner.description}</div>
                </button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Logo Upload */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-500/20">
            <ImageIcon className="h-5 w-5 text-blue-400" />
          </div>
          <Label className="text-white text-lg font-medium">Add your personal touch</Label>
        </div>

        {userData.logo ? (
          <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/50 flex items-center gap-4 shadow-lg">
            <div className="p-2 rounded-xl bg-white/10">
              <img
                src={userData.logo || "/placeholder.svg"}
                alt="Logo preview"
                className={`w-12 h-12 object-contain ${
                  userData.logoShape === "round"
                    ? "rounded-full"
                    : userData.logoShape === "square"
                      ? "rounded-lg"
                      : "rounded-lg"
                }`}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white font-medium">Logo uploaded</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onInputChange("logoShape", "auto")}
                  className={`px-2 py-1 text-xs rounded ${
                    userData.logoShape === "auto"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Auto
                </button>
                <button
                  onClick={() => onInputChange("logoShape", "round")}
                  className={`px-2 py-1 text-xs rounded ${
                    userData.logoShape === "round"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Round
                </button>
                <button
                  onClick={() => onInputChange("logoShape", "square")}
                  className={`px-2 py-1 text-xs rounded ${
                    userData.logoShape === "square"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Square
                </button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeLogo}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-0 h-auto text-xs mt-1 rounded-lg"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/30 backdrop-blur-sm border-gray-600 border-2 border-dashed rounded-2xl p-6 text-center hover:bg-gray-800/50 transition-colors">
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
            <Label
              htmlFor="logo-upload"
              className="cursor-pointer flex flex-col items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <div className="p-3 rounded-full bg-gray-700/50">
                <Upload className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Upload logo or profile picture</span>
            </Label>
          </div>
        )}
      </div>

      {/* Display Options */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-500/20">
            <Eye className="h-5 w-5 text-green-400" />
          </div>
          <Label className="text-white text-lg font-medium">What to show on QR view</Label>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/50 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white text-sm">Show Mobile Number</Label>
            <Switch checked={userData.showMobile} onCheckedChange={(checked) => onInputChange("showMobile", checked)} />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-white text-sm">Show Email</Label>
            <Switch checked={userData.showEmail} onCheckedChange={(checked) => onInputChange("showEmail", checked)} />
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm">Show Social Media</Label>
            <Select value={userData.selectedSocial} onValueChange={(value) => onInputChange("selectedSocial", value)}>
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                <SelectValue placeholder="Select social media to display" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="none">None</SelectItem>
                {getSocialMediaOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Custom Fields */}
      <div className="space-y-4">
        <Label className="text-white text-lg font-medium">Additional Information</Label>

        {userData.customFields.map((field) => (
          <div
            key={field.id}
            className="space-y-4 p-5 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <Label className="text-white text-sm font-medium">Custom Field</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCustomField(field.id)}
                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-2 h-8 w-8 rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              type="text"
              placeholder="Field name (e.g., Website, Portfolio)"
              value={field.label}
              onChange={(e) => updateCustomField(field.id, "label", e.target.value)}
              className="bg-gray-700/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-11 text-sm rounded-xl"
            />
            <Input
              type="text"
              placeholder="Field value"
              value={field.value}
              onChange={(e) => updateCustomField(field.id, "value", e.target.value)}
              className="bg-gray-700/50 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 h-11 text-sm rounded-xl"
            />
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addCustomField}
          className="w-full bg-gray-800/30 backdrop-blur-sm border-gray-600 text-white hover:bg-gray-700/50 h-12 text-sm font-medium flex items-center gap-3 rounded-xl transition-all duration-200 hover:shadow-lg"
        >
          <div className="p-1 rounded-lg bg-green-500/20">
            <Plus className="h-4 w-4 text-green-400" />
          </div>
          Add Custom Field
        </Button>
      </div>
    </div>
  )
}
