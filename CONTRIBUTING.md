# Contributing to Digital Business Card Pro

First off, thank you for considering contributing to Digital Business Card Pro! 🎉

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Issue Guidelines](#issue-guidelines)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/digitalbusinesscard.git
   cd digitalbusinesscard
   ```

2. **Set up development environment**
   ```bash
   # Run the automated setup script
   ./scripts/dev-setup.sh
   
   # Or manually:
   pnpm install
   cp .env.example .env.local
   docker compose -f docker-compose.dev.yml up -d
   pnpm prisma generate
   pnpm prisma db push
   pnpm run db:seed
   ```

3. **Start developing**
   ```bash
   pnpm dev
   ```

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── business-card/    # Business card components
│   ├── dashboard/        # Dashboard components
│   └── email/            # Email signature components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication config
│   ├── prisma.ts         # Database client
│   └── validation.ts     # Data validation
├── prisma/               # Database schema & migrations
├── public/               # Static assets
└── scripts/              # Development & deployment scripts
```

## 🔄 Development Process

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Messages
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(dashboard): add analytics filtering
fix(auth): resolve OAuth redirect issue
docs(readme): update installation steps
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code formatting
- `refactor` - Code restructuring
- `test` - Testing
- `chore` - Maintenance

### Testing

```bash
# Run type checks
pnpm type-check

# Run linting
pnpm lint

# Fix linting issues
pnpm lint --fix

# Format code
pnpm format
```

## 🔍 Pull Request Process

1. **Before submitting**
   - Ensure your code follows our style guide
   - Run all checks: `pnpm type-check && pnpm lint`
   - Test your changes thoroughly
   - Update documentation if needed

2. **PR Checklist**
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex logic
   - [ ] Documentation updated
   - [ ] No breaking changes (or marked as such)
   - [ ] Tests pass locally

3. **PR Description Template**
   ```markdown
   ## What
   Brief description of changes
   
   ## Why
   Reason for the changes
   
   ## How
   Technical approach used
   
   ## Testing
   How you tested the changes
   
   ## Screenshots (if applicable)
   Visual changes or new features
   ```

## 🎨 Style Guide

### TypeScript
- Use TypeScript for all new code
- Prefer interfaces over types for object shapes
- Use proper type annotations
- Avoid `any` type unless absolutely necessary

### React
- Use functional components with hooks
- Prefer custom hooks for complex logic
- Use proper TypeScript props interfaces
- Follow React best practices

### Database
- Use Prisma schema for all database changes
- Create migrations for schema changes
- Follow proper naming conventions

### API Routes
- Use proper HTTP status codes
- Implement error handling
- Add input validation
- Include proper TypeScript types

### CSS/Styling
- Use Tailwind CSS utility classes
- Keep custom CSS minimal
- Use CSS variables for theming
- Ensure mobile responsiveness

## 🐛 Issue Guidelines

### Bug Reports
Include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, etc.)
- Screenshots if applicable
- Console errors if any

### Feature Requests
Include:
- Clear problem description
- Proposed solution
- Alternative solutions considered
- Additional context

### Labels
- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed

## 🏗️ Architecture Guidelines

### Database
- Use Prisma for all database operations
- Follow proper relational design
- Use appropriate indexes
- Consider data privacy (GDPR compliance)

### Authentication
- Use NextAuth.js for authentication
- Implement proper session handling
- Follow security best practices
- Support multiple OAuth providers

### API Design
- Follow RESTful conventions
- Use proper HTTP methods
- Implement consistent error handling
- Add rate limiting where appropriate

### Performance
- Optimize database queries
- Use appropriate caching strategies
- Implement code splitting
- Optimize images and assets

## 🔒 Security Guidelines

- Never commit secrets or API keys
- Use environment variables for configuration
- Implement proper input validation
- Follow OWASP security guidelines
- Use HTTPS in production

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ❓ Questions?

Feel free to:
- Open a discussion on GitHub
- Ask in existing issues
- Reach out to maintainers

Thank you for contributing! 🙏