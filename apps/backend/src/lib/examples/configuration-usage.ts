/**
 * Example usage of the Configuration System
 * 
 * This demonstrates how to use the database-stored configurations
 * instead of environment variables.
 */

import { Config } from '@/lib/config'
import ConfigurationService from '@/lib/services/configuration'

// Example 1: Using the Config helper (recommended)
export async function exampleWithConfigHelper() {
  // Get JWT secret with fallback
  const jwtSecret = await Config.jwtSecret()
  
  // Get upload settings
  const maxSize = await Config.uploadMaxSize()
  const allowedTypes = await Config.allowedFileTypes()
  
  // Get social media credentials
  const youtubeClientId = await Config.youtubeClientId()
  const instagramSecret = await Config.instagramClientSecret()
  
  // Check maintenance mode
  const isMaintenanceMode = await Config.isMaintenanceMode()
  
  console.log('JWT Secret:', jwtSecret)
  console.log('Max Upload Size:', maxSize)
  console.log('Allowed File Types:', allowedTypes)
  console.log('YouTube Client ID:', youtubeClientId)
  console.log('Instagram Secret:', instagramSecret ? '***' : 'Not set')
  console.log('Maintenance Mode:', isMaintenanceMode)
}

// Example 2: Using ConfigurationService directly
export async function exampleWithConfigurationService() {
  // Get single configuration
  const appName = await ConfigurationService.get('APP_NAME')
  
  // Get multiple configurations
  const socialMediaKeys = await ConfigurationService.getMultiple([
    'YOUTUBE_CLIENT_ID',
    'INSTAGRAM_CLIENT_ID',
    'TWITTER_CLIENT_ID'
  ])
  
  // Get configurations by category
  const authConfigs = await ConfigurationService.getByCategory('authentication')
  const emailConfigs = await ConfigurationService.getByCategory('email', true) // include secrets
  
  console.log('App Name:', appName)
  console.log('Social Media Keys:', socialMediaKeys)
  console.log('Auth Configs:', authConfigs)
  console.log('Email Configs:', emailConfigs)
}

// Example 3: Setting configurations programmatically
export async function exampleSetConfigurations() {
  // Set a simple configuration
  await ConfigurationService.set('CUSTOM_SETTING', 'my-value', {
    description: 'A custom application setting',
    category: 'app'
  })
  
  // Set a secret configuration
  await ConfigurationService.set('API_SECRET_KEY', 'super-secret-key', {
    description: 'Secret API key for external service',
    category: 'api',
    isSecret: true
  })
  
  // Update multiple configurations
  const configs = [
    { key: 'EMAIL_HOST', value: 'smtp.gmail.com' },
    { key: 'EMAIL_PORT', value: '587' },
    { key: 'EMAIL_USER', value: 'your-email@gmail.com' }
  ]
  
  for (const config of configs) {
    await ConfigurationService.set(config.key, config.value, {
      category: 'email'
    })
  }
}

// Example 4: Using configurations in API routes
export async function exampleInAPIRoute() {
  // This would be used in an API route handler
  
  // Check if maintenance mode is enabled
  const isMaintenanceMode = await Config.isMaintenanceMode()
  if (isMaintenanceMode) {
    return Response.json(
      { error: 'Service is under maintenance' },
      { status: 503 }
    )
  }
  
  // Get upload limits
  const maxSize = await Config.uploadMaxSize()
  const allowedTypes = await Config.allowedFileTypes()
  
  // Validate file upload
  const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
  
  if (file.size > maxSize) {
    return Response.json(
      { error: 'File too large' },
      { status: 413 }
    )
  }
  
  if (!allowedTypes.includes(file.type)) {
    return Response.json(
      { error: 'File type not allowed' },
      { status: 400 }
    )
  }
  
  // Process file upload...
}

// Example 5: Using configurations in authentication
export async function exampleInAuth() {
  // Get JWT configuration
  const jwtSecret = await Config.jwtSecret()
  const jwtExpiresIn = await Config.jwtExpiresIn()
  
  // Create JWT token
  const jwt = require('jsonwebtoken')
  const token = jwt.sign(
    { userId: 'user123' },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  )
  
  return token
}

// Example 6: Dynamic configuration updates
export async function exampleDynamicUpdates() {
  // Toggle maintenance mode
  await ConfigurationService.toggle('MAINTENANCE_MODE')
  
  // Update app version
  await ConfigurationService.set('APP_VERSION', '1.1.0', {
    description: 'Application version',
    category: 'app'
  })
  
  // Clear cache to get fresh values
  Config.clearCache()
  
  // Get updated values
  const isMaintenanceMode = await Config.isMaintenanceMode()
  const appVersion = await Config.appVersion()
  
  console.log('Maintenance Mode:', isMaintenanceMode)
  console.log('App Version:', appVersion)
}

// Example 7: Migration from environment variables
export async function migrateFromEnvironmentVariables() {
  // If you have existing environment variables, you can migrate them
  const envVars = [
    'YOUTUBE_CLIENT_ID',
    'INSTAGRAM_CLIENT_ID',
    'TWITTER_CLIENT_ID',
    'FIREBASE_PROJECT_ID'
  ]
  
  for (const envVar of envVars) {
    const value = process.env[envVar]
    if (value) {
      await ConfigurationService.set(envVar, value, {
        description: `Migrated from environment variable`,
        category: 'social_media'
      })
    }
  }
}

export {
  Config,
  ConfigurationService
}
