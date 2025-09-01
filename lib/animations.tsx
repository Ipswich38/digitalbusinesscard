import React from 'react'

// Animation component that works with or without framer-motion
interface AnimationProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  whileHover?: any
  whileTap?: any
  animate?: any
  initial?: any
  transition?: any
  [key: string]: any
}

// Try to import framer-motion, fallback to regular div if not available
let MotionDiv: React.ComponentType<AnimationProps>
let hasFramerMotion = false

try {
  const framerMotion = require('framer-motion')
  if (framerMotion && framerMotion.motion) {
    MotionDiv = framerMotion.motion.div
    hasFramerMotion = true
  } else {
    throw new Error('framer-motion not properly loaded')
  }
} catch (error) {
  hasFramerMotion = false
  // Fallback component with CSS transitions
  MotionDiv = ({ 
    children, 
    whileHover, 
    whileTap, 
    animate, 
    initial, 
    transition, 
    className = '',
    style = {},
    ...props 
  }: AnimationProps) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isPressed, setIsPressed] = React.useState(false)

    // Apply CSS transitions for basic animations
    const enhancedStyle: React.CSSProperties = {
      transition: 'all 0.2s ease-in-out',
      transform: isPressed 
        ? 'scale(0.98)' 
        : isHovered 
        ? 'scale(1.02) translateY(-2px)' 
        : 'scale(1)',
      ...style
    }

    // Enhanced className for hover effects
    const enhancedClassName = `${className} cursor-pointer select-none`

    return (
      <div
        {...props}
        className={enhancedClassName}
        style={enhancedStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setIsPressed(false)
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        {children}
      </div>
    )
  }
}

export { MotionDiv }

// Export a hook to check if framer-motion is available
export const useMotion = () => hasFramerMotion

// Export the motion availability status
export { hasFramerMotion }