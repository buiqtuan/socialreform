import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

/**
 * Create a test user in the database
 */
export async function createTestUser(userData: {
  email: string
  username: string
  displayName: string
  password?: string
}) {
  const hashedPassword = userData.password 
    ? await hashPassword(userData.password)
    : undefined

  return await prisma.user.create({
    data: {
      email: userData.email,
      username: userData.username,
      displayName: userData.displayName,
      password: hashedPassword,
    },
  })
}

/**
 * Create a test social account for a user
 */
export async function createTestSocialAccount(
  userId: string,
  platform: string,
  accountData: any = {}
) {
  return await prisma.socialAccount.create({
    data: {
      userId,
      platform,
      platformUserId: `test_${platform}_${userId}`,
      username: `test_${platform}_user`,
      accessToken: 'test_access_token',
      refreshToken: 'test_refresh_token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      ...accountData,
    },
  })
}

/**
 * Create a test post
 */
export async function createTestPost(
  userId: string,
  postData: any = {}
) {
  return await prisma.post.create({
    data: {
      userId,
      content: 'Test post content',
      platforms: ['twitter'],
      status: 'draft',
      ...postData,
    },
  })
}

/**
 * Clean up all test data
 */
export async function cleanupTestData() {
  // Clean up in order due to foreign key constraints
  await prisma.post.deleteMany({})
  await prisma.socialAccount.deleteMany({})
  await prisma.refreshToken.deleteMany({})
  await prisma.user.deleteMany({})
}
