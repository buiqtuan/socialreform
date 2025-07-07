# Configuration Management System

Social Reform uses a database-driven configuration system instead of traditional environment variables for most settings. This approach provides several advantages:

## ✅ Benefits

- **Dynamic Updates**: Change settings without restarting the application
- **Security**: Separate sensitive and non-sensitive configurations
- **Auditability**: Track when and how configurations change
- **Team Collaboration**: Share configurations across development teams
- **Environment Consistency**: Ensure consistent settings across deployments
- **UI Management**: Manage configurations through admin interfaces

## 🏗️ Architecture

### Database Schema

```sql
CREATE TABLE configurations (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_secret BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Configuration Categories

- **`authentication`**: JWT secrets, token expiration settings
- **`social_media`**: API keys and secrets for social platforms
- **`email`**: Email service configuration
- **`upload`**: File upload limits and allowed types
- **`firebase`**: Firebase/FCM configuration
- **`app`**: Application settings (name, version, maintenance mode)
- **`api`**: External API configurations
- **`general`**: Miscellaneous settings

## 🚀 Usage

### 1. Using the Config Helper (Recommended)

```typescript
import { Config } from '@/lib/config'

// Get JWT secret with fallback
const jwtSecret = await Config.jwtSecret()

// Get upload settings
const maxSize = await Config.uploadMaxSize()
const allowedTypes = await Config.allowedFileTypes()

// Check maintenance mode
const isMaintenanceMode = await Config.isMaintenanceMode()
```

### 2. Using ConfigurationService Directly

```typescript
import ConfigurationService from '@/lib/services/configuration'

// Get single value
const appName = await ConfigurationService.get('APP_NAME')

// Get multiple values
const keys = await ConfigurationService.getMultiple([
  'YOUTUBE_CLIENT_ID',
  'INSTAGRAM_CLIENT_ID'
])

// Get by category
const authConfigs = await ConfigurationService.getByCategory('authentication')
```

### 3. Setting Configurations

```typescript
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
```

## 🔧 API Endpoints

### Get All Categories
```http
GET /api/configurations
```

### Get Configurations by Category
```http
GET /api/configurations?category=authentication
```

### Get Specific Configuration
```http
GET /api/configurations/JWT_SECRET
```

### Create/Update Configuration
```http
POST /api/configurations
Content-Type: application/json

{
  "key": "CUSTOM_SETTING",
  "value": "my-value",
  "description": "A custom setting",
  "category": "app",
  "isSecret": false
}
```

### Update Specific Configuration
```http
PUT /api/configurations/CUSTOM_SETTING
Content-Type: application/json

{
  "value": "updated-value",
  "description": "Updated description"
}
```

### Toggle Configuration Active State
```http
PATCH /api/configurations/CUSTOM_SETTING/toggle
```

## 🎛️ Admin Interface

Access the configuration admin interface at:
```
http://localhost:3001/admin/config
```

This provides a visual interface to view and manage all configurations organized by category.

## 🔐 Security Considerations

### Environment Variables Still Used For:
- **Database Connection**: `DATABASE_URL` (never store in database)
- **System-level Settings**: Railway deployment settings

### Database Configurations:
- **Secrets**: Marked with `isSecret: true` flag
- **API Keys**: Stored encrypted in database
- **Public Settings**: Non-sensitive configurations

### Best Practices:
1. **Never store database credentials** in the configuration table
2. **Mark sensitive data** with `isSecret: true`
3. **Use proper authentication** for admin interfaces in production
4. **Implement audit logging** for configuration changes
5. **Use environment variables** for deployment-specific settings

## 📝 Migration from Environment Variables

If you have existing environment variables, you can migrate them:

```typescript
// Migration script
const envVars = [
  'YOUTUBE_CLIENT_ID',
  'INSTAGRAM_CLIENT_ID',
  'TWITTER_CLIENT_ID'
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
```

## 🔄 Caching

The Config helper implements automatic caching:
- **Cache Duration**: 5 minutes
- **Cache Invalidation**: Manual via `Config.clearCache()`
- **Memory Efficient**: Only caches frequently accessed values

```typescript
// Clear cache for specific key
Config.clearCache('JWT_SECRET')

// Clear all cache
Config.clearCache()
```

## 🛠️ Development Setup

1. **Run migrations** to create the configuration table:
   ```bash
   pnpm db:push
   ```

2. **Seed default configurations**:
   ```bash
   pnpm db:seed
   ```

3. **Access admin interface**:
   ```
   http://localhost:3001/admin/config
   ```

## 📋 Default Configurations

The system comes with pre-configured defaults for:

- JWT authentication settings
- File upload limits
- Email service configuration
- Social media API placeholders
- Firebase configuration
- Application metadata

## 🔍 Monitoring

Monitor configuration usage through:
- Database queries and performance
- Cache hit/miss ratios
- Configuration access patterns
- Admin interface activity

## 🚨 Troubleshooting

### Common Issues:

1. **Configuration not found**: Check if key exists and is active
2. **Cache issues**: Clear cache and retry
3. **Database connection**: Verify DATABASE_URL is correct
4. **Permission errors**: Check database permissions

### Debug Mode:
```typescript
// Enable detailed logging
const config = await ConfigurationService.get('DEBUG_KEY')
console.log('Config result:', config)
```

## 📚 Examples

See `src/lib/examples/configuration-usage.ts` for comprehensive usage examples.
