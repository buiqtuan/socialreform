/**
 * Social Authentication Utilities
 * 
 * Helper functions and types for social authentication integration
 */

import { SocialPlatform } from '@social-reform/shared-types'

// Platform display names
export const PLATFORM_NAMES: Record<SocialPlatform, string> = {
  [SocialPlatform.FACEBOOK]: 'Facebook',
  [SocialPlatform.GOOGLE]: 'Google',
  [SocialPlatform.TIKTOK]: 'TikTok',
  [SocialPlatform.TWITTER]: 'Twitter',
  [SocialPlatform.INSTAGRAM]: 'Instagram',
  [SocialPlatform.LINKEDIN]: 'LinkedIn',
  [SocialPlatform.YOUTUBE]: 'YouTube',
  [SocialPlatform.TWITCH]: 'Twitch',
}

// Platform colors for UI
export const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  [SocialPlatform.FACEBOOK]: '#1877F2',
  [SocialPlatform.GOOGLE]: '#4285F4',
  [SocialPlatform.TIKTOK]: '#FF0050',
  [SocialPlatform.TWITTER]: '#1DA1F2',
  [SocialPlatform.INSTAGRAM]: '#E4405F',
  [SocialPlatform.LINKEDIN]: '#0077B5',
  [SocialPlatform.YOUTUBE]: '#FF0000',
  [SocialPlatform.TWITCH]: '#9146FF',
}

// Platform features
export const PLATFORM_FEATURES: Record<SocialPlatform, {
  hasEmail: boolean;
  hasAvatar: boolean;
  hasUsername: boolean;
  requiresSpecialPermissions: boolean;
}> = {
  [SocialPlatform.FACEBOOK]: {
    hasEmail: true,
    hasAvatar: true,
    hasUsername: false,
    requiresSpecialPermissions: false,
  },
  [SocialPlatform.GOOGLE]: {
    hasEmail: true,
    hasAvatar: true,
    hasUsername: false,
    requiresSpecialPermissions: false,
  },
  [SocialPlatform.TIKTOK]: {
    hasEmail: false,
    hasAvatar: true,
    hasUsername: true,
    requiresSpecialPermissions: true,
  },
  [SocialPlatform.TWITTER]: {
    hasEmail: false,
    hasAvatar: true,
    hasUsername: true,
    requiresSpecialPermissions: true,
  },
  [SocialPlatform.INSTAGRAM]: {
    hasEmail: false,
    hasAvatar: false,
    hasUsername: true,
    requiresSpecialPermissions: false,
  },
  [SocialPlatform.LINKEDIN]: {
    hasEmail: true,
    hasAvatar: true,
    hasUsername: false,
    requiresSpecialPermissions: false,
  },
  [SocialPlatform.YOUTUBE]: {
    hasEmail: false,
    hasAvatar: true,
    hasUsername: false,
    requiresSpecialPermissions: false,
  },
  [SocialPlatform.TWITCH]: {
    hasEmail: true,
    hasAvatar: true,
    hasUsername: true,
    requiresSpecialPermissions: false,
  },
}

// Get API endpoint for a platform
export function getSocialAuthEndpoint(platform: SocialPlatform): string {
  return `/api/auth/${platform}`
}

// Get platform display name
export function getPlatformName(platform: SocialPlatform): string {
  return PLATFORM_NAMES[platform] || platform
}

// Get platform color
export function getPlatformColor(platform: SocialPlatform): string {
  return PLATFORM_COLORS[platform] || '#000000'
}

// Check if platform supports email
export function platformHasEmail(platform: SocialPlatform): boolean {
  return PLATFORM_FEATURES[platform]?.hasEmail || false
}

// Check if platform supports avatar
export function platformHasAvatar(platform: SocialPlatform): boolean {
  return PLATFORM_FEATURES[platform]?.hasAvatar || false
}

// Check if platform supports username
export function platformHasUsername(platform: SocialPlatform): boolean {
  return PLATFORM_FEATURES[platform]?.hasUsername || false
}

// Check if platform requires special permissions
export function platformRequiresSpecialPermissions(platform: SocialPlatform): boolean {
  return PLATFORM_FEATURES[platform]?.requiresSpecialPermissions || false
}

// Get all available platforms
export function getAvailablePlatforms(): SocialPlatform[] {
  return Object.values(SocialPlatform)
}

// Get platforms that support email
export function getEmailSupportedPlatforms(): SocialPlatform[] {
  return getAvailablePlatforms().filter(platformHasEmail)
}

// Get platforms that support avatar
export function getAvatarSupportedPlatforms(): SocialPlatform[] {
  return getAvailablePlatforms().filter(platformHasAvatar)
}

// Social login client-side helper
export async function socialLogin(platform: SocialPlatform, accessToken: string) {
  try {
    const response = await fetch(getSocialAuthEndpoint(platform), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `${getPlatformName(platform)} login failed`)
    }

    return data
  } catch (error) {
    console.error(`${getPlatformName(platform)} login error:`, error)
    throw error
  }
}

// Type for social login response
export interface SocialLoginResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      username: string;
      displayName: string;
      avatar?: string;
      bio?: string;
      verified: boolean;
      createdAt: string;
      updatedAt: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
  error?: string;
  details?: any[];
}

export default {
  getSocialAuthEndpoint,
  getPlatformName,
  getPlatformColor,
  platformHasEmail,
  platformHasAvatar,
  platformHasUsername,
  platformRequiresSpecialPermissions,
  getAvailablePlatforms,
  getEmailSupportedPlatforms,
  getAvatarSupportedPlatforms,
  socialLogin,
}
