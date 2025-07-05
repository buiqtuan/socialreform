<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Social Reform - Copilot Instructions

This is a full-stack social media management tool built as a monorepo with the following architecture:

## Tech Stack
- **Mobile App**: React Native with TypeScript (Expo + Expo Router)
- **Backend API**: Next.js 14 with TypeScript (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Monorepo**: pnpm workspaces

## Project Structure
- `apps/mobile/` - React Native mobile application
- `apps/backend/` - Next.js API backend
- `packages/shared-types/` - Shared TypeScript types
- `packages/shared-utils/` - Shared utility functions
- `packages/shared-config/` - Shared configuration

## Development Guidelines

### Backend Development
- Use Next.js 14 App Router structure
- Implement API routes in `src/app/api/`
- Use Prisma for database operations
- Implement JWT authentication with refresh tokens
- Use Zod for request validation
- Follow RESTful API conventions

### Mobile Development
- Use Expo Router for navigation
- Implement screens in `src/app/`
- Use React Query for API state management
- Implement proper TypeScript types
- Follow React Native best practices

### Shared Packages
- Use `@social-reform/shared-types` for common TypeScript interfaces
- Use `@social-reform/shared-utils` for common utility functions
- Use `@social-reform/shared-config` for configuration constants

### Code Style
- Use TypeScript for all code
- Follow ESLint rules
- Use meaningful variable and function names
- Add proper error handling
- Include TODO comments for incomplete features

## Key Features to Implement
- Multi-platform social media management
- Content scheduling and calendar
- Analytics and reporting
- Media upload and management
- Team collaboration
- Push notifications
- Real-time updates
