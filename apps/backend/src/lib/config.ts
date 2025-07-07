import ConfigurationService from './services/configuration'

/**
 * Configuration helper to easily access app settings
 */
export class Config {
  // Cache for frequently accessed configurations
  private static cache = new Map<string, { value: string; expiry: number }>()
  private static cacheExpiry = 5 * 60 * 1000 // 5 minutes

  /**
   * Get configuration with caching
   */
  static async get(key: string, fallback?: string): Promise<string> {
    // Check cache first
    const cached = this.cache.get(key)
    if (cached && cached.expiry > Date.now()) {
      return cached.value
    }

    // Get from database
    const value = await ConfigurationService.get(key)
    const result = value || fallback || ''

    // Cache the result
    this.cache.set(key, {
      value: result,
      expiry: Date.now() + this.cacheExpiry
    })

    return result
  }

  /**
   * Get multiple configurations
   */
  static async getMultiple(keys: string[]): Promise<Record<string, string>> {
    return await ConfigurationService.getMultiple(keys)
  }

  /**
   * Clear cache for a specific key or all keys
   */
  static clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }

  // Convenience methods for common configurations
  static async jwtSecret(): Promise<string> {
    return await this.get('JWT_SECRET', process.env.JWT_SECRET || 'fallback-secret')
  }

  static async jwtRefreshSecret(): Promise<string> {
    return await this.get('JWT_REFRESH_SECRET', process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret')
  }

  static async jwtExpiresIn(): Promise<string> {
    return await this.get('JWT_EXPIRES_IN', '1h')
  }

  static async jwtRefreshExpiresIn(): Promise<string> {
    return await this.get('JWT_REFRESH_EXPIRES_IN', '7d')
  }

  static async uploadMaxSize(): Promise<number> {
    const value = await this.get('UPLOAD_MAX_SIZE', '50000000')
    return parseInt(value, 10)
  }

  static async allowedFileTypes(): Promise<string[]> {
    const value = await this.get('ALLOWED_FILE_TYPES', 'image/jpeg,image/png,image/gif,video/mp4,video/quicktime')
    return value.split(',').map(type => type.trim())
  }

  static async appName(): Promise<string> {
    return await this.get('APP_NAME', 'Social Reform')
  }

  static async appVersion(): Promise<string> {
    return await this.get('APP_VERSION', '1.0.0')
  }

  static async isMaintenanceMode(): Promise<boolean> {
    const value = await this.get('MAINTENANCE_MODE', 'false')
    return value.toLowerCase() === 'true'
  }

  // Social media API keys
  static async youtubeClientId(): Promise<string> {
    return await this.get('YOUTUBE_CLIENT_ID', '')
  }

  static async youtubeClientSecret(): Promise<string> {
    return await this.get('YOUTUBE_CLIENT_SECRET', '')
  }

  static async instagramClientId(): Promise<string> {
    return await this.get('INSTAGRAM_CLIENT_ID', '')
  }

  static async instagramClientSecret(): Promise<string> {
    return await this.get('INSTAGRAM_CLIENT_SECRET', '')
  }

  static async twitterClientId(): Promise<string> {
    return await this.get('TWITTER_CLIENT_ID', '')
  }

  static async twitterClientSecret(): Promise<string> {
    return await this.get('TWITTER_CLIENT_SECRET', '')
  }

  static async tiktokClientId(): Promise<string> {
    return await this.get('TIKTOK_CLIENT_ID', '')
  }

  static async tiktokClientSecret(): Promise<string> {
    return await this.get('TIKTOK_CLIENT_SECRET', '')
  }

  // Firebase
  static async firebaseProjectId(): Promise<string> {
    return await this.get('FIREBASE_PROJECT_ID', process.env.FIREBASE_PROJECT_ID || '')
  }

  static async firebasePrivateKey(): Promise<string> {
    return await this.get('FIREBASE_PRIVATE_KEY', process.env.FIREBASE_PRIVATE_KEY || '')
  }

  static async firebaseClientEmail(): Promise<string> {
    return await this.get('FIREBASE_CLIENT_EMAIL', process.env.FIREBASE_CLIENT_EMAIL || '')
  }

  // Email
  static async emailHost(): Promise<string> {
    return await this.get('EMAIL_HOST', '')
  }

  static async emailPort(): Promise<number> {
    const value = await this.get('EMAIL_PORT', '587')
    return parseInt(value, 10)
  }

  static async emailUser(): Promise<string> {
    return await this.get('EMAIL_USER', '')
  }

  static async emailPassword(): Promise<string> {
    return await this.get('EMAIL_PASSWORD', '')
  }
}

export default Config
