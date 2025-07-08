# Social Authentication System

This is a comprehensive, reusable social authentication system that supports multiple social media platforms with a unified API structure.

## 🌟 Features

- **Multi-Platform Support**: Facebook, Google, TikTok, Twitter, Instagram, LinkedIn, YouTube, Twitch
- **Unified API**: Same request/response format across all platforms
- **Extensible**: Easy to add new social platforms
- **Secure**: Token verification with each platform's official API
- **Flexible**: Handles different authentication methods (query params, headers, etc.)
- **Smart User Management**: Automatic user creation, account linking, and username generation

## 🏗️ Architecture

### Core Components

1. **SocialAuthService** (`/lib/services/social-auth.ts`)
   - Platform-specific configurations
   - Token verification logic
   - Data mapping and normalization

2. **SocialLoginHandler** (`/lib/services/social-login-handler.ts`)
   - Generic login flow handler
   - User creation/update logic
   - JWT token generation

3. **Platform Routes** (`/api/auth/{platform}/route.ts`)
   - Individual endpoint for each platform
   - Uses the unified handler

## 🔧 Supported Platforms

| Platform | Endpoint | API Used | Notes |
|----------|----------|----------|-------|
| Facebook | `/api/auth/facebook` | Graph API | Full email support |
| Google | `/api/auth/google` | OAuth2 API | Full email support |
| TikTok | `/api/auth/tiktok` | Open API | Limited email support |
| Twitter | `/api/auth/twitter` | Twitter API v2 | Requires special permissions for email |
| Instagram | `/api/auth/instagram` | Instagram Basic Display | No email support |
| LinkedIn | `/api/auth/linkedin` | LinkedIn API | Separate email endpoint |
| YouTube | `/api/auth/youtube` | YouTube Data API | Uses Google OAuth |
| Twitch | `/api/auth/twitch` | Twitch Helix API | Full support |

## 📝 API Usage

### Request Format (All Platforms)

```http
POST /api/auth/{platform}
Content-Type: application/json

{
  "accessToken": "PLATFORM_ACCESS_TOKEN"
}
```

### Response Format (All Platforms)

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "username": "string",
      "displayName": "string",
      "avatar": "string | null",
      "bio": "string | null",
      "verified": true,
      "createdAt": "2025-07-07T09:15:11.000Z",
      "updatedAt": "2025-07-07T09:15:11.000Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token",
      "expiresIn": 900
    }
  }
}
```

#### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "error": "Invalid {platform} token"
}
```

## 🚀 Adding New Platforms

To add a new social platform:

1. **Add to SocialPlatform enum** (`packages/shared-types/src/index.ts`):
```typescript
export enum SocialPlatform {
  // ... existing platforms
  NEW_PLATFORM = 'new_platform',
}
```

2. **Add platform configuration** (`lib/services/social-auth.ts`):
```typescript
const SOCIAL_PROVIDERS: Record<SocialPlatform, SocialProviderConfig> = {
  // ... existing platforms
  [SocialPlatform.NEW_PLATFORM]: {
    apiUrl: 'https://api.newplatform.com/user',
    fields: ['id', 'email', 'name', 'avatar'],
    tokenParam: 'access_token',
    dataMapper: (data: any): SocialUserData => ({
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
    })
  },
}
```

3. **Create API route** (`app/api/auth/new-platform/route.ts`):
```typescript

import { NextRequest } from 'next/server'
import { SocialPlatform } from '@social-reform/shared-types'
import SocialLoginHandler from '@/lib/services/social-login-handler'

export async function POST(request: NextRequest) {
  return SocialLoginHandler.handleSocialLogin(request, SocialPlatform.NEW_PLATFORM)
}
```

## 🔐 Environment Variables

Some platforms require additional configuration:

```env
# Twitch
TWITCH_CLIENT_ID=your_twitch_client_id

# Add other platform-specific configs as needed
```

## 🛠️ Platform-Specific Notes

### Facebook
- Uses Graph API with `fields` parameter
- Requires `email` and `public_profile` permissions
- Full email support

### Google
- Uses OAuth2 userinfo endpoint
- Requires `openid email profile` scopes
- Full email support

### TikTok
- Uses Open API
- Limited email access (requires special approval)
- Returns `open_id` as unique identifier

### Twitter
- Uses Twitter API v2
- Requires Bearer token authentication
- Email requires special permissions

### Instagram
- Uses Instagram Basic Display API
- No email support
- Username used as display name

### LinkedIn
- Uses LinkedIn API v2
- Requires separate API call for email
- Complex name structure (localized)

### YouTube
- Uses YouTube Data API v3
- Requires Google OAuth
- Channel-based authentication

### Twitch
- Uses Helix API
- Requires Client-ID header
- Full user information support

## 📊 User Management

### User Creation
- Automatic username generation from email or name
- Unique username enforcement with numeric suffixes
- Email fallback for platforms without email support
- Automatic verification for social accounts

### Account Linking
- Links multiple social accounts to single user
- Updates existing social account tokens
- Maintains platform-specific user data

### Data Normalization
- Unified user data structure across platforms
- Consistent field mapping
- Handles missing data gracefully

## 🔒 Security Features

- Token verification with official platform APIs
- JWT token generation for session management
- Secure refresh token storage
- Platform-specific authentication headers
- Input validation with Zod schemas

## 📱 Mobile Integration

Each platform endpoint works seamlessly with mobile SDKs:

```typescript
// Example: React Native Facebook integration
const facebookLogin = async () => {
  try {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email'])
    
    if (result.isCancelled) return
    
    const data = await AccessToken.getCurrentAccessToken()
    
    const response = await fetch('/api/auth/facebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: data.accessToken })
    })
    
    const authData = await response.json()
    // Handle successful login
  } catch (error) {
    // Handle error
  }
}
```

## 🧪 Testing

Use the test files in each platform's directory to verify functionality:

```bash
# Run backend server
pnpm dev:backend

# Test with valid tokens from each platform
node apps/backend/src/app/api/auth/facebook/test.ts
```

## 🚀 Future Enhancements

- OAuth2 flow implementation
- Rate limiting
- Token refresh automation
- Platform-specific feature toggles
- Admin dashboard for social account management
- Analytics and usage tracking
