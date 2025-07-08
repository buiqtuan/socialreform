/**
 * Sample test users for integration tests
 */
export const testUsers = {
  validUser: {
    email: 'valid.user@example.com',
    username: 'validuser',
    displayName: 'Valid User',
    password: 'validpassword123',
  },
  adminUser: {
    email: 'admin@example.com',
    username: 'admin',
    displayName: 'Admin User',
    password: 'adminpassword123',
  },
  secondUser: {
    email: 'second.user@example.com',
    username: 'seconduser',
    displayName: 'Second User',
    password: 'secondpassword123',
  },
}

/**
 * Sample social media posts for testing
 */
export const testPosts = {
  basicPost: {
    content: 'This is a basic test post',
    platforms: ['twitter'],
  },
  multiPlatformPost: {
    content: 'This post goes to multiple platforms',
    platforms: ['twitter', 'facebook', 'instagram'],
  },
  scheduledPost: {
    content: 'This is a scheduled post',
    platforms: ['twitter'],
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  },
}

/**
 * Sample social account data for testing
 */
export const testSocialAccounts = {
  twitter: {
    platform: 'twitter',
    platformUserId: 'test_twitter_123',
    username: 'testtwitteruser',
    displayName: 'Test Twitter User',
    accessToken: 'twitter_access_token',
    refreshToken: 'twitter_refresh_token',
  },
  facebook: {
    platform: 'facebook',
    platformUserId: 'test_facebook_456',
    username: 'testfacebookuser',
    displayName: 'Test Facebook User',
    accessToken: 'facebook_access_token',
    refreshToken: 'facebook_refresh_token',
  },
  instagram: {
    platform: 'instagram',
    platformUserId: 'test_instagram_789',
    username: 'testinstagramuser',
    displayName: 'Test Instagram User',
    accessToken: 'instagram_access_token',
    refreshToken: 'instagram_refresh_token',
  },
}

/**
 * Test API endpoints
 */
export const testEndpoints = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    me: '/api/auth/me',
  },
  users: {
    profile: '/api/users/profile',
    settings: '/api/users/settings',
  },
  posts: {
    create: '/api/posts',
    list: '/api/posts',
    byId: (id: string) => `/api/posts/${id}`,
    schedule: '/api/posts/schedule',
  },
  socialAccounts: {
    connect: '/api/social-accounts/connect',
    list: '/api/social-accounts',
    disconnect: (platform: string) => `/api/social-accounts/${platform}/disconnect`,
  },
}
