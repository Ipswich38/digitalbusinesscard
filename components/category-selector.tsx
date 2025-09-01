"use client"

import { useState } from 'react'

// Optional animation wrapper - fallback if framer-motion not available
let motion: any
try {
  motion = require('framer-motion').motion
} catch {
  // Fallback to regular div if framer-motion not available
  motion = {
    div: ({ children, whileHover, whileTap, transition, initial, animate, ...props }: any) => (
      <div {...props}>{children}</div>
    )
  }
}
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, Share2, Laugh, Heart, Palette, Sparkles } from 'lucide-react'
import { getAllCardCategories, type CardCategory, type CardCategoryConfig } from '@/lib/card-categories'

interface CategorySelectorProps {
  selectedCategory: CardCategory
  onCategorySelect: (category: CardCategory) => void
  className?: string
}

const categoryIcons = {
  business: Briefcase,
  social: Share2, 
  meme: Laugh,
  fan: Heart,
  art: Palette
}

export function CategorySelector({ selectedCategory, onCategorySelect, className = "" }: CategorySelectorProps) {
  const categories = getAllCardCategories()
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-orange-400" />
          Choose Your Card Style
        </h2>
        <p className="text-gray-400 text-lg">
          Select the perfect card category for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {categories.map((category) => {
          const Icon = categoryIcons[category.id as CardCategory]
          const isSelected = selectedCategory === category.id
          
          return (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                  isSelected 
                    ? `border-orange-500 bg-gradient-to-br shadow-lg shadow-orange-500/20` 
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
                style={{
                  background: isSelected 
                    ? `linear-gradient(135deg, ${category.colorScheme.primary}20, ${category.colorScheme.secondary}20)` 
                    : undefined
                }}
                onClick={() => onCategorySelect(category.id)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-colors ${
                    isSelected 
                      ? 'bg-orange-500/20 text-orange-400' 
                      : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50'
                  }`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className={`font-bold text-lg transition-colors ${
                      isSelected ? 'text-white' : 'text-gray-200 hover:text-white'
                    }`}>
                      {category.name}
                    </h3>
                    
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isSelected ? 'text-gray-300' : 'text-gray-400'
                    }`}>
                      {category.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Badge 
                      variant="outline" 
                      className={`text-xs transition-colors ${
                        isSelected 
                          ? 'border-orange-400 text-orange-300' 
                          : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {category.targetAudience.split(',')[0]}
                    </Badge>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex flex-wrap gap-1 justify-center">
                          {category.features.slice(0, 3).map((feature) => (
                            <Badge 
                              key={feature}
                              variant="secondary" 
                              className="text-xs bg-orange-500/20 text-orange-300 border-orange-500/30"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            onCategorySelect(category.id)
                          }}
                        >
                          Create {category.name.split(' ')[0]} Card
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Category Stats */}
      <div className="flex justify-center">
        <div className="grid grid-cols-5 gap-8 text-center">
          {categories.map((category) => (
            <div key={category.id} className="space-y-1">
              <div className="text-2xl">{category.emoji}</div>
              <div className="text-sm text-gray-400">{category.themes.length} themes</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}