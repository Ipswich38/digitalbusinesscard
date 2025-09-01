import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample templates
  const businessTemplate = await prisma.template.upsert({
    where: { id: 'template-business-1' },
    update: {},
    create: {
      id: 'template-business-1',
      name: 'Professional Business',
      description: 'Clean and professional template for business professionals',
      category: 'business',
      isPublic: true,
      data: {
        backgroundColor: '#1C1B1F',
        textColor: '#E6E1E5',
        useGradient: false,
        cardStyle: 'glassmorphic',
        cornerRadius: 'rounded',
        fontPair: 'Modern Serif',
        logoShape: 'round',
      }
    }
  })

  const creativeTemplate = await prisma.template.upsert({
    where: { id: 'template-creative-1' },
    update: {},
    create: {
      id: 'template-creative-1',
      name: 'Creative Designer',
      description: 'Vibrant template perfect for designers and creative professionals',
      category: 'creative',
      isPublic: true,
      data: {
        backgroundColor: '#6366F1',
        textColor: '#FFFFFF',
        useGradient: true,
        backgroundGradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
        cardStyle: 'solid',
        cornerRadius: 'extra-rounded',
        fontPair: 'Modern Sans',
        logoShape: 'square',
      }
    }
  })

  const techTemplate = await prisma.template.upsert({
    where: { id: 'template-tech-1' },
    update: {},
    create: {
      id: 'template-tech-1',
      name: 'Tech Professional',
      description: 'Modern template for developers and tech professionals',
      category: 'technology',
      isPublic: true,
      data: {
        backgroundColor: '#0F172A',
        textColor: '#F1F5F9',
        useGradient: true,
        backgroundGradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
        cardStyle: 'outlined',
        cornerRadius: 'rounded',
        fontPair: 'Monospace',
        logoShape: 'auto',
        animatedBackground: true,
        animatedBackgroundType: 'particles',
      }
    }
  })

  console.log('✅ Created templates:', {
    business: businessTemplate.name,
    creative: creativeTemplate.name,
    tech: techTemplate.name,
  })

  // Create sample integrations for development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Setting up development integrations...')
    
    // These would be created when users actually connect their accounts
    // This is just for development/testing purposes
  }

  console.log('🎉 Database seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })