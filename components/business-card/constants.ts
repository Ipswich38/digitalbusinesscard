import type { ColorPreset, GradientPreset } from "./types"

export const colorPresets: ColorPreset[] = [
  { bg: "#1C1B1F", text: "#E6E1E5", name: "Material Dark" },
  { bg: "#FFFBFE", text: "#1C1B1F", name: "Material Light" },
  { bg: "#0F172A", text: "#F1F5F9", name: "Slate" },
  { bg: "#6750A4", text: "#FFFFFF", name: "Primary Purple" },
  { bg: "#1976D2", text: "#FFFFFF", name: "Material Blue" },
  { bg: "#388E3C", text: "#FFFFFF", name: "Material Green" },
  { bg: "#D32F2F", text: "#FFFFFF", name: "Material Red" },
  { bg: "#F57C00", text: "#FFFFFF", name: "Material Orange" },
]

export const gradientPresets: GradientPreset[] = [
  { gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", name: "Purple Blue" },
  { gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", name: "Pink Red" },
  { gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", name: "Blue Cyan" },
  { gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", name: "Green Teal" },
  { gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", name: "Pink Yellow" },
  { gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", name: "Mint Pink" },
  { gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", name: "Coral Pink" },
  { gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", name: "Peach Orange" },
]

export const themePresets = [
  {
    name: "Minimalist",
    colors: { bg: "#FFFFFF", text: "#1A1A1A" },
    gradient: "",
    useGradient: false,
    description: "Clean and simple",
    category: "professional",
  },
  {
    name: "Corporate",
    colors: { bg: "#1C1B1F", text: "#E6E1E5" },
    gradient: "",
    useGradient: false,
    description: "Professional and elegant",
    category: "professional",
  },
  {
    name: "Gradient Glow",
    colors: { bg: "#000000", text: "#FFFFFF" },
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    useGradient: true,
    description: "Modern with gradient background",
    category: "modern",
  },
  {
    name: "Playful",
    colors: { bg: "#F57C00", text: "#FFFFFF" },
    gradient: "",
    useGradient: false,
    description: "Vibrant and energetic",
    category: "creative",
  },
  {
    name: "Ocean Breeze",
    colors: { bg: "#000000", text: "#FFFFFF" },
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    useGradient: true,
    description: "Cool and refreshing",
    category: "modern",
  },
  {
    name: "Sunset",
    colors: { bg: "#000000", text: "#FFFFFF" },
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    useGradient: true,
    description: "Warm and inviting",
    category: "creative",
  },
  {
    name: "Forest",
    colors: { bg: "#1B4332", text: "#D8F3DC" },
    gradient: "",
    useGradient: false,
    description: "Natural and calming",
    category: "professional",
  },
  {
    name: "Midnight",
    colors: { bg: "#0F0F23", text: "#E0E0E0" },
    gradient: "",
    useGradient: false,
    description: "Sleek and mysterious",
    category: "modern",
  },
]

export const fontPairs = [
  {
    name: "Modern Serif",
    heading: "Playfair Display",
    body: "Source Sans Pro",
    description: "Elegant and readable",
    category: "professional",
  },
  {
    name: "Minimal Sans",
    heading: "Inter",
    body: "Inter",
    description: "Clean and modern",
    category: "minimal",
  },
  {
    name: "Rounded Friendly",
    heading: "Nunito",
    body: "Nunito",
    description: "Approachable and warm",
    category: "friendly",
  },
]

export const animatedBackgrounds = [
  {
    name: "Gradient Flow",
    gradient: "linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)",
    animation: "gradientFlow 15s ease infinite",
    description: "Flowing gradient animation",
  },
  {
    name: "Ocean Waves",
    gradient: "linear-gradient(-45deg, #4facfe, #00f2fe, #43e97b, #38f9d7)",
    animation: "gradientFlow 20s ease infinite",
    description: "Gentle wave-like motion",
  },
  {
    name: "Sunset Glow",
    gradient: "linear-gradient(-45deg, #fa709a, #fee140, #ff9a9e, #fecfef)",
    animation: "gradientFlow 12s ease infinite",
    description: "Warm sunset colors",
  },
]

export const backgroundAnimationCSS = `
@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-gradient {
  background-size: 400% 400%;
  animation: var(--animation);
}
`
