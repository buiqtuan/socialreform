import { SocialPlatform } from '@social-reform/shared-types'

// Base interface for social user data
export interface SocialUserData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  username?: string;
}

// Configuration for different social providers
interface SocialProviderConfig {
  apiUrl: string;
  fields: string[];
  tokenParam: string;
  dataMapper: (data: any) => SocialUserData;
}

// Social provider configurations
const SOCIAL_PROVIDERS: Record<SocialPlatform, SocialProviderConfig> = {
  [SocialPlatform.FACEBOOK]: {
    apiUrl: 'https://graph.facebook.com/me',
    fields: ['id', 'email', 'name', 'picture'],
    tokenParam: 'access_token',
    dataMapper: (data: any): SocialUserData => ({
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.picture?.data?.url,
    })
  },
  [SocialPlatform.GOOGLE]: {
    apiUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    fields: [],
    tokenParam: 'access_token',
    dataMapper: (data: any): SocialUserData => ({
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.picture,
    })
  },
  [SocialPlatform.TIKTOK]: {
    apiUrl: 'https://open-api.tiktok.com/user/info',
    fields: ['open_id', 'union_id', 'avatar_url', 'display_name'],
    tokenParam: 'access_token',
    dataMapper: (data: any): SocialUserData => ({
      id: data.data.user.open_id,
      email: '', // TikTok doesn't always provide email
      name: data.data.user.display_name,
      avatar: data.data.user.avatar_url,
      username: data.data.user.display_name,
    })
  },
  [SocialPlatform.TWITTER]: {
    apiUrl: 'https://api.twitter.com/2/users/me',
    fields: ['id', 'username', 'name', 'profile_image_url'],
    tokenParam: 'access_token',
    dataMapper: (data: any): SocialUserData => ({
      id: data.data.id,
      email: '', // Twitter API v2 requires separate endpoint for email
      name: data.data.name,
      avatar: data.data.profile_image_url,
      username: data.data.username,
    })
  },
  [SocialPlatform.INSTAGRAM]: {
    apiUrl: 'https://graph.instagram.com/me',
    fields: ['id', 'username', 'account_type'],
    tokenParam: 'access_token',
    dataMapper: (data: any): SocialUserData => ({
      id: data.id,
      email: '', // Instagram doesn't provide email
      name: data.username,
      avatar: '',
      username: data.username,
    })
  },
  [SocialPlatform.LINKEDIN]: {
    apiUrl: 'https://api.linkedin.com/v2/people/~',
    fields: ['id', 'firstName', 'lastName', 'profilePicture'],
    tokenParam: 'access_token',
    dataMapper: (data: any): SocialUserData => ({
      id: data.id,
      email: '', // LinkedIn requires separate API call for email
      name: `${data.firstName.localized.en_US} ${data.lastName.localized.en_US}`,
      avatar: data.profilePicture?.displayImage,
    })
  },
  [SocialPlatform.YOUTUBE]: {
    apiUrl: 'https://www.googleapis.com/youtube/v3/channels',
    fields: ['id', 'snippet'],
    tokenParam: 'access_token',
    dataMapper: (data: any): SocialUserData => ({
      id: data.items[0].id,
      email: '', // YouTube uses Google OAuth, email from separate endpoint
      name: data.items[0].snippet.title,
      avatar: data.items[0].snippet.thumbnails?.default?.url,
    })
  },
  [SocialPlatform.TWITCH]: {
    apiUrl: 'https://api.twitch.tv/helix/users',
    fields: [],
    tokenParam: 'access_token',
    dataMapper: (data: any): SocialUserData => ({
      id: data.data[0].id,
      email: data.data[0].email,
      name: data.data[0].display_name,
      avatar: data.data[0].profile_image_url,
      username: data.data[0].login,
    })
  },
}

// Special handling for different auth methods
const getAuthHeaders = (platform: SocialPlatform, token: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  switch (platform) {
    case SocialPlatform.TWITTER:
      headers['Authorization'] = `Bearer ${token}`
      break
    case SocialPlatform.TWITCH:
      headers['Authorization'] = `Bearer ${token}`
      headers['Client-ID'] = process.env.TWITCH_CLIENT_ID || ''
      break
    case SocialPlatform.LINKEDIN:
      headers['Authorization'] = `Bearer ${token}`
      break
    default:
      // Most providers use token as query parameter
      break
  }

  return headers
}

const buildApiUrl = (platform: SocialPlatform, token: string): string => {
  const config = SOCIAL_PROVIDERS[platform]
  let url = config.apiUrl

  // Add fields if supported
  if (config.fields.length > 0) {
    const fieldsParam = config.fields.join(',')
    url += `?fields=${fieldsParam}`
  }

  // Add token as query parameter for providers that need it
  if (![SocialPlatform.TWITTER, SocialPlatform.TWITCH, SocialPlatform.LINKEDIN].includes(platform)) {
    const separator = url.includes('?') ? '&' : '?'
    url += `${separator}${config.tokenParam}=${token}`
  }

  // Special case for YouTube
  if (platform === SocialPlatform.YOUTUBE) {
    url += `&mine=true&part=snippet`
  }

  return url
}

export class SocialAuthService {
  /**
   * Verify a social media token and get user data
   */
  static async verifyToken(
    platform: SocialPlatform, 
    token: string
  ): Promise<SocialUserData | null> {
    try {
      const config = SOCIAL_PROVIDERS[platform]
      if (!config) {
        throw new Error(`Unsupported platform: ${platform}`)
      }

      const url = buildApiUrl(platform, token)
      const headers = getAuthHeaders(platform, token)

      const response = await fetch(url, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        console.error(`${platform} API error:`, response.status, response.statusText)
        return null
      }

      const data = await response.json()
      
      // Check for API errors
      if (data.error) {
        console.error(`${platform} API error:`, data.error)
        return null
      }

      // Map the response data to our standard format
      const userData = config.dataMapper(data)
      
      // Validate required fields
      if (!userData.id || (!userData.email && !userData.username)) {
        console.error(`${platform} API returned incomplete data:`, userData)
        return null
      }

      return userData
    } catch (error) {
      console.error(`${platform} token verification error:`, error)
      return null
    }
  }

  /**
   * Get additional user information if needed (like email for some providers)
   */
  static async getAdditionalUserInfo(
    platform: SocialPlatform,
    token: string,
    userData: SocialUserData
  ): Promise<Partial<SocialUserData>> {
    const additionalData: Partial<SocialUserData> = {}

    try {
      switch (platform) {
        case SocialPlatform.TWITTER:
          // Get email from Twitter if needed
          if (!userData.email) {
            // Note: This requires special Twitter API permissions
            // additionalData.email = await this.getTwitterEmail(token)
          }
          break
        
        case SocialPlatform.LINKEDIN:
          // Get email from LinkedIn
          if (!userData.email) {
            additionalData.email = await this.getLinkedInEmail(token)
          }
          break
        
        default:
          // No additional info needed for other platforms
          break
      }
    } catch (error) {
      console.error(`Error getting additional info for ${platform}:`, error)
    }

    return additionalData
  }

  /**
   * Get LinkedIn email (requires separate API call)
   */
  private static async getLinkedInEmail(token: string): Promise<string | undefined> {
    try {
      const response = await fetch(
        'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        return data.elements?.[0]?.['handle~']?.emailAddress
      }
    } catch (error) {
      console.error('LinkedIn email fetch error:', error)
    }
    return undefined
  }

  /**
   * Generate a username from email or name
   */
  static generateUsername(email: string, name: string): string {
    const baseUsername = email ? 
      email.split('@')[0].toLowerCase() : 
      name.toLowerCase().replace(/\s+/g, '')
    
    return baseUsername.replace(/[^a-z0-9]/g, '')
  }

  /**
   * Get supported platforms
   */
  static getSupportedPlatforms(): SocialPlatform[] {
    return Object.keys(SOCIAL_PROVIDERS) as SocialPlatform[]
  }
}

export default SocialAuthService
