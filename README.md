# 💼 Digital Business Card Pro

> **The most advanced digital business card platform** - Create, share, and track professional digital business cards with enterprise-grade analytics, CRM integration, and team collaboration.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.7-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)](https://postgresql.org/)

## ✨ Features

### 🚀 **Core Features**
- **Instant Card Creation** - Create beautiful digital business cards in minutes
- **QR Code Generation** - Share cards instantly via QR codes
- **Live Preview** - See changes in real-time as you customize
- **Multiple Export Formats** - PNG, PDF, Apple Wallet, Google Wallet
- **Mobile Responsive** - Perfect on all devices

### 📊 **Advanced Analytics**
- Real-time view tracking
- QR scan monitoring
- Click-through analytics
- Geographic insights
- Device breakdown
- Interactive dashboards

### 🔗 **CRM Integration**
- **Zapier** webhooks for 5000+ apps
- **HubSpot** contact sync
- **Salesforce** integration ready
- Custom webhook support
- Lead capture automation

### 👥 **Team Collaboration**
- Multi-user accounts
- Team templates
- Brand compliance tools
- Usage analytics
- Role-based permissions

### ✉️ **Email Signatures**
- HTML & text signature generation
- Multiple layouts and themes
- QR code integration
- Copy/download functionality
- Brand customization

### 📱 **Progressive Web App**
- Offline functionality
- Mobile app experience
- Push notifications
- Background sync
- Install prompts

## 🏗️ **Tech Stack**

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Analytics**: Custom real-time tracking
- **Deployment**: Docker, Vercel, or any Node.js host

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- pnpm (recommended) or npm

### 1. Clone and Install
```bash
git clone https://github.com/Ipswich38/digitalbusinesscard.git
cd digitalbusinesscard
pnpm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
# Required: DATABASE_URL, NEXTAUTH_SECRET
```

### 3. Database Setup
```bash
# Start PostgreSQL (or use Docker)
docker compose -f docker-compose.dev.yml up -d

# Setup database
pnpm prisma generate
pnpm prisma db push
pnpm run db:seed
```

### 4. Start Development
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📋 **Environment Variables**

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | NextAuth.js secret (32+ chars) |
| `NEXTAUTH_URL` | ✅ | Your app URL |
| `GOOGLE_CLIENT_ID` | ⚪ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ⚪ | Google OAuth secret |
| `LINKEDIN_CLIENT_ID` | ⚪ | LinkedIn OAuth client ID |
| `LINKEDIN_CLIENT_SECRET` | ⚪ | LinkedIn OAuth secret |
| `HUBSPOT_API_KEY` | ⚪ | HubSpot integration |
| `ZAPIER_WEBHOOK_URL` | ⚪ | Zapier webhook endpoint |

## 🐳 **Docker Deployment**

### Development
```bash
docker compose -f docker-compose.dev.yml up
```

### Production
```bash
# Build and start
docker compose up -d

# Or use the deployment script
./scripts/deploy.sh
```

## 📊 **API Reference**

### Core Endpoints
- `GET /api/health` - Health check
- `GET /api/metrics` - System metrics
- `GET /api/cards` - User's cards
- `POST /api/cards` - Create card
- `PATCH /api/cards/[id]` - Update card
- `DELETE /api/cards/[id]` - Delete card

### Analytics
- `POST /api/analytics/track` - Track events
- `GET /api/analytics/[cardId]` - Get analytics

### Integration
- `POST /api/integrations/webhook` - CRM webhooks
- `POST /api/email/signature` - Generate signatures

## 🎨 **Customization**

### Themes & Templates
The app includes several built-in themes:
- **Professional Business** - Clean, corporate design
- **Creative Designer** - Vibrant, artistic layout  
- **Tech Professional** - Modern, minimalist style

### Custom Branding
- Upload custom logos
- Brand color palettes
- Custom fonts
- Animated backgrounds
- Gradient overlays

## 📈 **Analytics Dashboard**

Track your networking success with detailed analytics:

- **📊 Overview** - Views, scans, clicks at a glance
- **🌍 Geographic** - See where your connections are
- **📱 Devices** - Desktop vs mobile usage
- **🔗 Referrers** - Traffic sources
- **📈 Trends** - Growth over time

## 🔧 **Development**

### Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript checks
pnpm db:studio    # Open Prisma Studio
pnpm db:seed      # Seed database
```

### Database Management
```bash
pnpm prisma generate    # Generate client
pnpm prisma db push     # Push schema changes
pnpm prisma migrate dev # Create migration
pnpm prisma studio      # Visual database editor
```

### Backup & Restore
```bash
# Create backup
./scripts/backup.sh

# Restore from backup
gunzip -c backups/backup_20241201_120000.sql.gz | psql $DATABASE_URL
```

## 🌐 **Deployment**

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy automatically

### Docker
```bash
# Production deployment
DOCKER_BUILD=true pnpm build
docker compose up -d
```

### Manual
```bash
# Use deployment script
./scripts/deploy.sh
```

## 🔒 **Security**

- ✅ SQL injection protection (Prisma)
- ✅ XSS prevention (React + CSP)
- ✅ CSRF protection (NextAuth.js)
- ✅ Rate limiting ready
- ✅ Environment variable validation
- ✅ Secure session handling
- ✅ Input validation (Zod)

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Run linting and type checks
6. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

### Documentation
- 📖 [Setup Guide](SETUP.md) - Detailed installation
- 🔧 [API Documentation](docs/api.md) - API reference
- 🎨 [Customization Guide](docs/customization.md) - Theming
- 🚀 [Deployment Guide](docs/deployment.md) - Production setup

### Getting Help
- 🐛 [Report Issues](https://github.com/Ipswich38/digitalbusinesscard/issues)
- 💬 [Discussions](https://github.com/Ipswich38/digitalbusinesscard/discussions)
- 📧 Email: support@digitalbusinesscard.pro

## 🗺️ **Roadmap**

### Q1 2025
- [ ] Mobile app (React Native)
- [ ] Advanced templates marketplace
- [ ] White-label solutions
- [ ] Enterprise SSO

### Q2 2025
- [ ] AI-powered design suggestions
- [ ] Video business cards
- [ ] NFC integration
- [ ] Advanced analytics

## 🏆 **Why Choose Digital Business Card Pro?**

| Feature | Our App | Competitors |
|---------|---------|-------------|
| **Open Source** | ✅ | ❌ |
| **Real-time Analytics** | ✅ | Limited |
| **CRM Integration** | ✅ Full API | Basic |
| **Custom Domains** | ✅ | Pro plans only |
| **Team Collaboration** | ✅ | Enterprise only |
| **Email Signatures** | ✅ | ❌ |
| **Progressive Web App** | ✅ | ❌ |
| **Self-hosted Option** | ✅ | ❌ |

---

<div align="center">

**Built with ❤️ by developers, for developers**

[⭐ Star us on GitHub](https://github.com/Ipswich38/digitalbusinesscard) | [🚀 Deploy Now](https://vercel.com/new/clone?repository-url=https://github.com/Ipswich38/digitalbusinesscard) | [📧 Get Support](mailto:support@digitalbusinesscard.pro)

</div>