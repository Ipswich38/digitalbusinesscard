import { CardCategory } from './card-categories'

// AI Models Configuration
export const AI_MODELS = {
  // Hugging Face Models (Free)
  CLIP: 'openai/clip-vit-base-patch32',
  BLIP: 'Salesforce/blip-image-captioning-base',
  SENTIMENT: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
  
  // Local Models (if available)
  LLAMA: 'meta-llama/Llama-3.2-3B-Instruct',
  PHI: 'microsoft/Phi-3-mini-4k-instruct',
  
  // External APIs
  GOOGLE_VISION: 'google-vision-api',
  OPENAI_VISION: 'openai-gpt-4-vision'
}

export interface AIAnalysisResult {
  suggestedCategory: CardCategory
  confidence: number
  reasoning: string
  suggestions: {
    title?: string
    description?: string
    tags?: string[]
    theme?: string
    improvements?: string[]
  }
  imageAnalysis?: {
    objects: string[]
    colors: string[]
    style: string
    mood: string
    quality: number
  }
  textAnalysis?: {
    sentiment: 'positive' | 'negative' | 'neutral'
    topics: string[]
    language: string
    readability: number
  }
}

export interface AIImageAnalysis {
  category: CardCategory
  confidence: number
  objects: string[]
  colors: string[]
  style: string
  mood: string
  isAppropriate: boolean
  suggestedTheme?: string
}

export interface AITextAnalysis {
  category: CardCategory
  confidence: number
  sentiment: 'positive' | 'negative' | 'neutral'
  topics: string[]
  suggestedTags: string[]
  improvements: string[]
}

class AIService {
  private huggingFaceToken: string | null
  private openAIKey: string | null
  
  constructor() {
    this.huggingFaceToken = process.env.HUGGING_FACE_TOKEN || null
    this.openAIKey = process.env.OPENAI_API_KEY || null
  }

  // Analyze image content using CLIP or BLIP
  async analyzeImage(imageUrl: string): Promise<AIImageAnalysis> {
    try {
      // Try Hugging Face first (free)
      if (this.huggingFaceToken) {
        return await this.analyzeImageHuggingFace(imageUrl)
      }
      
      // Fallback to OpenAI if available
      if (this.openAIKey) {
        return await this.analyzeImageOpenAI(imageUrl)
      }
      
      // Local analysis fallback
      return await this.analyzeImageLocal(imageUrl)
      
    } catch (error) {
      console.error('AI image analysis failed:', error)
      return this.getDefaultImageAnalysis()
    }
  }

  // Analyze text content using sentiment analysis
  async analyzeText(text: string): Promise<AITextAnalysis> {
    try {
      if (this.huggingFaceToken) {
        return await this.analyzeTextHuggingFace(text)
      }
      
      if (this.openAIKey) {
        return await this.analyzeTextOpenAI(text)
      }
      
      return await this.analyzeTextLocal(text)
      
    } catch (error) {
      console.error('AI text analysis failed:', error)
      return this.getDefaultTextAnalysis(text)
    }
  }

  // Combined analysis for complete card recommendation
  async analyzeCardContent(data: {
    images?: string[]
    text?: string
    title?: string
    userInput?: any
  }): Promise<AIAnalysisResult> {
    try {
      const imageAnalysis = data.images && data.images.length > 0 
        ? await this.analyzeImage(data.images[0])
        : null
      
      const textAnalysis = data.text || data.title
        ? await this.analyzeText([data.text, data.title].filter(Boolean).join(' '))
        : null

      return this.combineAnalysis(imageAnalysis, textAnalysis, data.userInput)
      
    } catch (error) {
      console.error('AI card analysis failed:', error)
      return this.getDefaultAnalysis()
    }
  }

  // Hugging Face Image Analysis
  private async analyzeImageHuggingFace(imageUrl: string): Promise<AIImageAnalysis> {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${AI_MODELS.CLIP}`,
      {
        headers: { 
          Authorization: `Bearer ${this.huggingFaceToken}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: imageUrl,
          parameters: {
            candidate_labels: [
              'business professional',
              'social media content',
              'meme funny content',
              'fan art celebrity',
              'artwork painting'
            ]
          }
        })
      }
    )

    const results = await response.json()
    return this.parseImageResults(results)
  }

  // OpenAI Vision Analysis
  private async analyzeImageOpenAI(imageUrl: string): Promise<AIImageAnalysis> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and categorize it as: business, social, meme, fan, or art. Provide confidence, objects, colors, style, and mood.'
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    })

    const results = await response.json()
    return this.parseOpenAIImageResults(results)
  }

  // Local image analysis (basic fallback)
  private async analyzeImageLocal(imageUrl: string): Promise<AIImageAnalysis> {
    // Basic analysis based on image properties
    // This would be enhanced with local ML models
    return {
      category: 'business',
      confidence: 0.5,
      objects: ['unknown'],
      colors: ['unknown'],
      style: 'unknown',
      mood: 'neutral',
      isAppropriate: true,
      suggestedTheme: 'professional-minimal'
    }
  }

  // Hugging Face Text Analysis
  private async analyzeTextHuggingFace(text: string): Promise<AITextAnalysis> {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${AI_MODELS.SENTIMENT}`,
      {
        headers: { 
          Authorization: `Bearer ${this.huggingFaceToken}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ inputs: text })
      }
    )

    const results = await response.json()
    return this.parseTextResults(results, text)
  }

  // OpenAI Text Analysis
  private async analyzeTextOpenAI(text: string): Promise<AITextAnalysis> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Analyze this text and categorize it as business, social, meme, fan, or art. Provide sentiment, topics, and suggested tags: "${text}"`
          }
        ],
        max_tokens: 200
      })
    })

    const results = await response.json()
    return this.parseOpenAITextResults(results, text)
  }

  // Local text analysis
  private async analyzeTextLocal(text: string): Promise<AITextAnalysis> {
    // Basic keyword-based analysis
    const businessKeywords = ['professional', 'business', 'company', 'service', 'contact']
    const socialKeywords = ['follow', 'like', 'share', 'social', 'instagram', 'twitter']
    const memeKeywords = ['funny', 'lol', 'meme', 'joke', 'humor', 'viral']
    const fanKeywords = ['fan', 'idol', 'kpop', 'anime', 'celebrity', 'stan']
    const artKeywords = ['art', 'artist', 'painting', 'gallery', 'exhibition', 'creative']

    const lowerText = text.toLowerCase()
    const scores = {
      business: businessKeywords.filter(k => lowerText.includes(k)).length,
      social: socialKeywords.filter(k => lowerText.includes(k)).length,
      meme: memeKeywords.filter(k => lowerText.includes(k)).length,
      fan: fanKeywords.filter(k => lowerText.includes(k)).length,
      art: artKeywords.filter(k => lowerText.includes(k)).length
    }

    const category = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0] as CardCategory

    return {
      category,
      confidence: Math.max(0.3, scores[category] / 10),
      sentiment: 'neutral',
      topics: Object.keys(scores).filter(k => scores[k as keyof typeof scores] > 0),
      suggestedTags: this.extractTags(text),
      improvements: ['Consider adding more specific keywords', 'Enhance description clarity']
    }
  }

  // Helper methods
  private parseImageResults(results: any): AIImageAnalysis {
    // Parse Hugging Face CLIP results
    const topLabel = results.labels?.[0] || results[0]
    const category = this.mapLabelToCategory(topLabel?.label || topLabel)
    
    return {
      category,
      confidence: topLabel?.score || 0.5,
      objects: results.objects || ['unknown'],
      colors: results.colors || ['unknown'],
      style: results.style || 'unknown',
      mood: results.mood || 'neutral',
      isAppropriate: true,
      suggestedTheme: this.getSuggestedTheme(category)
    }
  }

  private parseOpenAIImageResults(results: any): AIImageAnalysis {
    const content = results.choices?.[0]?.message?.content || ''
    // Parse OpenAI response and extract relevant information
    return this.parseAIResponse(content)
  }

  private parseTextResults(results: any, originalText: string): AITextAnalysis {
    const sentiment = results[0]?.label?.toLowerCase().includes('positive') ? 'positive' 
      : results[0]?.label?.toLowerCase().includes('negative') ? 'negative' 
      : 'neutral'

    return {
      category: this.inferCategoryFromText(originalText),
      confidence: results[0]?.score || 0.5,
      sentiment,
      topics: this.extractTopics(originalText),
      suggestedTags: this.extractTags(originalText),
      improvements: this.generateImprovements(originalText)
    }
  }

  private parseOpenAITextResults(results: any, originalText: string): AITextAnalysis {
    const content = results.choices?.[0]?.message?.content || ''
    // Parse OpenAI response
    return this.parseAITextResponse(content, originalText)
  }

  private combineAnalysis(
    imageAnalysis: AIImageAnalysis | null, 
    textAnalysis: AITextAnalysis | null,
    userInput?: any
  ): AIAnalysisResult {
    const imageWeight = 0.6
    const textWeight = 0.4

    let suggestedCategory: CardCategory = 'business'
    let confidence = 0.5

    if (imageAnalysis && textAnalysis) {
      const imageScore = imageAnalysis.confidence * imageWeight
      const textScore = textAnalysis.confidence * textWeight
      
      if (imageScore > textScore) {
        suggestedCategory = imageAnalysis.category
        confidence = imageScore
      } else {
        suggestedCategory = textAnalysis.category
        confidence = textScore
      }
    } else if (imageAnalysis) {
      suggestedCategory = imageAnalysis.category
      confidence = imageAnalysis.confidence
    } else if (textAnalysis) {
      suggestedCategory = textAnalysis.category
      confidence = textAnalysis.confidence
    }

    return {
      suggestedCategory,
      confidence,
      reasoning: this.generateReasoning(imageAnalysis, textAnalysis),
      suggestions: this.generateSuggestions(suggestedCategory, imageAnalysis, textAnalysis),
      imageAnalysis: imageAnalysis ? {
        objects: imageAnalysis.objects,
        colors: imageAnalysis.colors,
        style: imageAnalysis.style,
        mood: imageAnalysis.mood,
        quality: confidence
      } : undefined,
      textAnalysis: textAnalysis ? {
        sentiment: textAnalysis.sentiment,
        topics: textAnalysis.topics,
        language: 'en',
        readability: confidence
      } : undefined
    }
  }

  // Utility methods
  private mapLabelToCategory(label: string): CardCategory {
    if (label.includes('business') || label.includes('professional')) return 'business'
    if (label.includes('social') || label.includes('media')) return 'social'
    if (label.includes('meme') || label.includes('funny')) return 'meme'
    if (label.includes('fan') || label.includes('celebrity')) return 'fan'
    if (label.includes('art') || label.includes('painting')) return 'art'
    return 'business'
  }

  private getSuggestedTheme(category: CardCategory): string {
    const themes = {
      business: 'professional-minimal',
      social: 'linkedin-professional',
      meme: 'classic-meme',
      fan: 'kpop-holographic',
      art: 'museum-classic'
    }
    return themes[category]
  }

  private inferCategoryFromText(text: string): CardCategory {
    return this.analyzeTextLocal(text).then(result => result.category) as any || 'business'
  }

  private extractTopics(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/)
    return words.filter(word => word.length > 3).slice(0, 5)
  }

  private extractTags(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/)
    return words
      .filter(word => word.length > 2 && !['the', 'and', 'or', 'but'].includes(word))
      .slice(0, 8)
  }

  private generateImprovements(text: string): string[] {
    const improvements = []
    if (text.length < 50) improvements.push('Consider adding more descriptive content')
    if (!text.includes('contact') && !text.includes('email')) improvements.push('Add contact information')
    if (text.split(' ').length < 10) improvements.push('Expand description for better engagement')
    return improvements
  }

  private generateReasoning(imageAnalysis: AIImageAnalysis | null, textAnalysis: AITextAnalysis | null): string {
    if (imageAnalysis && textAnalysis) {
      return `Based on image content (${imageAnalysis.category}, ${Math.round(imageAnalysis.confidence * 100)}% confidence) and text analysis (${textAnalysis.category}, ${Math.round(textAnalysis.confidence * 100)}% confidence)`
    } else if (imageAnalysis) {
      return `Based on image content showing ${imageAnalysis.objects.join(', ')} with ${imageAnalysis.style} style`
    } else if (textAnalysis) {
      return `Based on text content with ${textAnalysis.sentiment} sentiment and topics: ${textAnalysis.topics.join(', ')}`
    }
    return 'Based on general content analysis'
  }

  private generateSuggestions(
    category: CardCategory, 
    imageAnalysis: AIImageAnalysis | null, 
    textAnalysis: AITextAnalysis | null
  ) {
    return {
      title: this.generateTitleSuggestion(category),
      description: this.generateDescriptionSuggestion(category),
      tags: textAnalysis?.suggestedTags || [],
      theme: this.getSuggestedTheme(category),
      improvements: textAnalysis?.improvements || []
    }
  }

  private generateTitleSuggestion(category: CardCategory): string {
    const suggestions = {
      business: 'Professional Business Card',
      social: 'Social Media Profile',
      meme: 'Epic Meme Card',
      fan: 'Fan Collection Card',
      art: 'Artistic Showcase'
    }
    return suggestions[category]
  }

  private generateDescriptionSuggestion(category: CardCategory): string {
    const suggestions = {
      business: 'Professional networking and business connections',
      social: 'Connect with me on social media platforms',
      meme: 'Bringing you the best memes and humor',
      fan: 'Celebrating my favorite idols and fandoms',
      art: 'Showcasing beautiful artwork and creativity'
    }
    return suggestions[category]
  }

  // Default fallbacks
  private getDefaultImageAnalysis(): AIImageAnalysis {
    return {
      category: 'business',
      confidence: 0.3,
      objects: ['unknown'],
      colors: ['unknown'],
      style: 'unknown',
      mood: 'neutral',
      isAppropriate: true
    }
  }

  private getDefaultTextAnalysis(text: string): AITextAnalysis {
    return {
      category: 'business',
      confidence: 0.3,
      sentiment: 'neutral',
      topics: [],
      suggestedTags: this.extractTags(text),
      improvements: ['Add more descriptive content']
    }
  }

  private getDefaultAnalysis(): AIAnalysisResult {
    return {
      suggestedCategory: 'business',
      confidence: 0.3,
      reasoning: 'Default analysis due to unavailable AI services',
      suggestions: {
        title: 'Professional Business Card',
        description: 'Create a professional digital business card',
        tags: [],
        theme: 'professional-minimal',
        improvements: []
      }
    }
  }

  // Additional helper methods
  private parseAIResponse(content: string): AIImageAnalysis {
    // Parse structured AI response - implement based on actual response format
    return this.getDefaultImageAnalysis()
  }

  private parseAITextResponse(content: string, originalText: string): AITextAnalysis {
    // Parse structured AI response - implement based on actual response format
    return this.getDefaultTextAnalysis(originalText)
  }
}

// Export singleton instance
export const aiService = new AIService()