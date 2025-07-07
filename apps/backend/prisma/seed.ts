import { PrismaClient } from '@prisma/client'
import ConfigurationService from '../src/lib/services/configuration'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Initialize default configurations
  console.log('📝 Initializing default configurations...')
  await ConfigurationService.initializeDefaults()

  // Create default user (optional)
  console.log('👤 Creating default user...')
  const defaultUser = await prisma.user.upsert({
    where: { email: 'admin@socialreform.com' },
    update: {},
    create: {
      email: 'admin@socialreform.com',
      username: 'admin',
      displayName: 'Admin User',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      verified: true,
      userSettings: {
        create: {
          theme: 'dark',
          language: 'en',
          timezone: 'UTC'
        }
      }
    }
  })

  console.log('✅ Seeding completed successfully!')
  console.log(`👤 Default user created: ${defaultUser.email}`)
  console.log('📝 Default configurations initialized')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
