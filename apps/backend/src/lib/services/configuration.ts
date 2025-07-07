import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface ConfigurationItem {
  key: string
  value: string
  description?: string
  category: string
  isSecret: boolean
  isActive: boolean
}

export class ConfigurationService {
  /**
   * Get a configuration value by key
   */
  static async get(key: string): Promise<string | null> {
    try {
      const config = await prisma.configuration.findUnique({
        where: { key, isActive: true }
      })
      return config?.value || null
    } catch (error) {
      console.error(`Error getting configuration ${key}:`, error)
      return null
    }
  }

  /**
   * Get multiple configuration values by keys
   */
  static async getMultiple(keys: string[]): Promise<Record<string, string>> {
    try {
      const configs = await prisma.configuration.findMany({
        where: { 
          key: { in: keys },
          isActive: true
        }
      })
      
      return configs.reduce((acc, config) => {
        acc[config.key] = config.value
        return acc
      }, {} as Record<string, string>)
    } catch (error) {
      console.error('Error getting multiple configurations:', error)
      return {}
    }
  }

  /**
   * Get all configurations by category
   */
  static async getByCategory(category: string, includeSecrets = false): Promise<ConfigurationItem[]> {
    try {
      const configs = await prisma.configuration.findMany({
        where: { 
          category,
          isActive: true,
          ...(includeSecrets ? {} : { isSecret: false })
        },
        orderBy: { key: 'asc' }
      })
      
      return configs.map(config => ({
        key: config.key,
        value: config.isSecret && !includeSecrets ? '***' : config.value,
        description: config.description || undefined,
        category: config.category,
        isSecret: config.isSecret,
        isActive: config.isActive
      }))
    } catch (error) {
      console.error(`Error getting configurations for category ${category}:`, error)
      return []
    }
  }

  /**
   * Set a configuration value
   */
  static async set(key: string, value: string, options: {
    description?: string
    category?: string
    isSecret?: boolean
  } = {}): Promise<boolean> {
    try {
      await prisma.configuration.upsert({
        where: { key },
        update: {
          value,
          description: options.description,
          category: options.category || 'general',
          isSecret: options.isSecret || false,
          updatedAt: new Date()
        },
        create: {
          key,
          value,
          description: options.description,
          category: options.category || 'general',
          isSecret: options.isSecret || false
        }
      })
      return true
    } catch (error) {
      console.error(`Error setting configuration ${key}:`, error)
      return false
    }
  }

  /**
   * Delete a configuration
   */
  static async delete(key: string): Promise<boolean> {
    try {
      await prisma.configuration.delete({
        where: { key }
      })
      return true
    } catch (error) {
      console.error(`Error deleting configuration ${key}:`, error)
      return false
    }
  }

  /**
   * Toggle configuration active state
   */
  static async toggle(key: string): Promise<boolean> {
    try {
      const config = await prisma.configuration.findUnique({
        where: { key }
      })
      
      if (!config) return false
      
      await prisma.configuration.update({
        where: { key },
        data: { isActive: !config.isActive }
      })
      return true
    } catch (error) {
      console.error(`Error toggling configuration ${key}:`, error)
      return false
    }
  }

  /**
   * Get all available categories
   */
  static async getCategories(): Promise<string[]> {
    try {
      const categories = await prisma.configuration.findMany({
        where: { isActive: true },
        distinct: ['category'],
        select: { category: true }
      })
      
      return categories.map(c => c.category)
    } catch (error) {
      console.error('Error getting categories:', error)
      return []
    }
  }

  /**
   * Initialize default configurations
   */
  static async initializeDefaults(): Promise<void> {
    const defaults: Array<{
      key: string
      value: string
      description: string
      category: string
      isSecret: boolean
    }> = [
      // Authentication
      {
        key: 'JWT_SECRET',
        value: 'your-super-secret-jwt-key-change-this-in-production',
        description: 'Secret key for JWT token generation',
        category: 'authentication',
        isSecret: true
      },
      {
        key: 'JWT_REFRESH_SECRET',
        value: 'your-super-secret-refresh-jwt-key-change-this-in-production',
        description: 'Secret key for JWT refresh token generation',
        category: 'authentication',
        isSecret: true
      },
      {
        key: 'JWT_EXPIRES_IN',
        value: '1h',
        description: 'JWT token expiration time',
        category: 'authentication',
        isSecret: false
      },
      {
        key: 'JWT_REFRESH_EXPIRES_IN',
        value: '7d',
        description: 'JWT refresh token expiration time',
        category: 'authentication',
        isSecret: false
      },

      // File Upload
      {
        key: 'UPLOAD_MAX_SIZE',
        value: '50000000',
        description: 'Maximum file upload size in bytes',
        category: 'upload',
        isSecret: false
      },
      {
        key: 'ALLOWED_FILE_TYPES',
        value: 'image/jpeg,image/png,image/gif,video/mp4,video/quicktime',
        description: 'Allowed file types for upload',
        category: 'upload',
        isSecret: false
      },

      // Email Service
      {
        key: 'EMAIL_HOST',
        value: '',
        description: 'Email service host',
        category: 'email',
        isSecret: false
      },
      {
        key: 'EMAIL_PORT',
        value: '587',
        description: 'Email service port',
        category: 'email',
        isSecret: false
      },
      {
        key: 'EMAIL_USER',
        value: '',
        description: 'Email service username',
        category: 'email',
        isSecret: false
      },
      {
        key: 'EMAIL_PASSWORD',
        value: '',
        description: 'Email service password',
        category: 'email',
        isSecret: true
      },

      // Social Media API Keys
      {
        key: 'YOUTUBE_CLIENT_ID',
        value: '',
        description: 'YouTube API client ID',
        category: 'social_media',
        isSecret: false
      },
      {
        key: 'YOUTUBE_CLIENT_SECRET',
        value: '',
        description: 'YouTube API client secret',
        category: 'social_media',
        isSecret: true
      },
      {
        key: 'INSTAGRAM_CLIENT_ID',
        value: '',
        description: 'Instagram API client ID',
        category: 'social_media',
        isSecret: false
      },
      {
        key: 'INSTAGRAM_CLIENT_SECRET',
        value: '',
        description: 'Instagram API client secret',
        category: 'social_media',
        isSecret: true
      },
      {
        key: 'TWITTER_CLIENT_ID',
        value: '',
        description: 'Twitter API client ID',
        category: 'social_media',
        isSecret: false
      },
      {
        key: 'TWITTER_CLIENT_SECRET',
        value: '',
        description: 'Twitter API client secret',
        category: 'social_media',
        isSecret: true
      },
      {
        key: 'TIKTOK_CLIENT_ID',
        value: '',
        description: 'TikTok API client ID',
        category: 'social_media',
        isSecret: false
      },
      {
        key: 'TIKTOK_CLIENT_SECRET',
        value: '',
        description: 'TikTok API client secret',
        category: 'social_media',
        isSecret: true
      },

      // Firebase
      {
        key: 'FIREBASE_PROJECT_ID',
        value: '',
        description: 'Firebase project ID',
        category: 'firebase',
        isSecret: false
      },
      {
        key: 'FIREBASE_PRIVATE_KEY',
        value: '',
        description: 'Firebase private key',
        category: 'firebase',
        isSecret: true
      },
      {
        key: 'FIREBASE_CLIENT_EMAIL',
        value: '',
        description: 'Firebase client email',
        category: 'firebase',
        isSecret: false
      },

      // Application Settings
      {
        key: 'APP_NAME',
        value: 'Social Reform',
        description: 'Application name',
        category: 'app',
        isSecret: false
      },
      {
        key: 'APP_VERSION',
        value: '1.0.0',
        description: 'Application version',
        category: 'app',
        isSecret: false
      },
      {
        key: 'MAINTENANCE_MODE',
        value: 'false',
        description: 'Enable maintenance mode',
        category: 'app',
        isSecret: false
      }
    ]

    for (const config of defaults) {
      await this.set(config.key, config.value, {
        description: config.description,
        category: config.category,
        isSecret: config.isSecret
      })
    }
  }
}

export default ConfigurationService
