# Social Reform

A comprehensive social media management tool for video creators, built with React Native and Next.js.

## 🚀 Features

- **Multi-Platform Support**: Manage content across YouTube, Instagram, TikTok, Twitter, Facebook, LinkedIn, and Twitch
- **Content Scheduling**: Schedule posts and manage your content calendar
- **Analytics Dashboard**: Track performance metrics and engagement across all platforms
- **Media Management**: Upload, organize, and manage your media assets
- **Team Collaboration**: Work with team members and manage permissions
- **Push Notifications**: Stay updated with real-time notifications
- **Mobile & Web**: Native mobile app and web dashboard

## 🔧 Environment Setup

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database (we recommend Railway for hosting)
- (Optional) Firebase project for push notifications

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd social-reform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment templates
   cp apps/backend/.env.example apps/backend/.env
   cp apps/mobile/.env.example apps/mobile/.env
   ```

4. **Configure database**
   - Create a PostgreSQL database (Railway recommended)
   - Update `DATABASE_URL` in `apps/backend/.env` with your connection string
   - Generate secure JWT secrets and update them in the .env file

5. **Initialize database**
   ```bash
   pnpm db:push
   ```

6. **Start development servers**
   ```bash
   pnpm dev
   ```

### Environment Variables

#### Backend (`apps/backend/.env`)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
- Social media API keys (optional)
- Firebase credentials (optional)

#### Mobile (`apps/mobile/.env`)
- `API_URL`: Backend API URL
- `FIREBASE_CONFIG`: Firebase configuration (optional)

⚠️ **Important**: Never commit `.env` files to git. They contain sensitive credentials.

## 🏗️ Tech Stack

### Frontend
- **Mobile App**: React Native with TypeScript
- **Framework**: Expo with Expo Router
- **Navigation**: React Navigation
- **State Management**: React Query + Context API
- **UI Components**: React Native Paper

### Backend
- **API**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with refresh tokens
- **Push Notifications**: Firebase Cloud Messaging (FCM)

### Architecture
- **Monorepo**: pnpm workspaces
- **Shared Types**: TypeScript interfaces and types
- **Shared Utils**: Common utility functions
- **Shared Config**: Configuration constants

## 📁 Project Structure

```
social-reform/
├── apps/
│   ├── mobile/          # React Native app
│   └── backend/         # Next.js API
├── packages/
│   ├── shared-types/    # Shared TypeScript types
│   ├── shared-utils/    # Shared utility functions
│   └── shared-config/   # Shared configuration
├── docs/                # Documentation
├── scripts/            # Build and deployment scripts
└── .github/            # GitHub workflows and configs
```

## 🛠️ Development Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v8 or higher)
- PostgreSQL database
- Firebase project (for push notifications)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd social-reform
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
# Backend
cp apps/backend/.env.example apps/backend/.env.local
# Edit the environment variables

# Mobile (if needed)
cp apps/mobile/.env.example apps/mobile/.env.local
```

4. Set up the database
```bash
pnpm db:push
pnpm db:seed
```

5. Start development servers
```bash
# Start both mobile and backend
pnpm dev

# Or start individually
pnpm dev:mobile
pnpm dev:backend
```

## 📱 Mobile App

The mobile app is built with React Native and Expo, providing a native experience on both iOS and Android.

### Key Features
- Native performance
- Offline support
- Push notifications
- Camera integration
- Media library access

### Development
```bash
cd apps/mobile
pnpm dev
```

## 🔧 Backend API

The backend is built with Next.js 14 using the App Router, providing a modern and scalable API.

### Key Features
- RESTful API endpoints
- JWT authentication
- PostgreSQL database
- File upload handling
- Real-time notifications

### Development
```bash
cd apps/backend
pnpm dev
```

## 🔐 Authentication

The application uses JWT-based authentication with refresh tokens:

- Access tokens (15 minutes)
- Refresh tokens (7 days)
- Secure token storage
- Automatic token refresh

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities include:

- Users
- Posts
- Social Accounts
- Analytics
- Notifications
- Media Files
- Teams

## 🚀 Deployment

### Backend Deployment
- Vercel (recommended)
- Docker containers
- Cloud providers (AWS, GCP, Azure)

### Mobile App Deployment
- Expo Application Services (EAS)
- App Store & Google Play Store

### Database
- Supabase (recommended)
- Railway
- Self-hosted PostgreSQL

## 📝 API Documentation

API documentation is available in the `/docs/api` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please create an issue in the repository or contact the development team.
