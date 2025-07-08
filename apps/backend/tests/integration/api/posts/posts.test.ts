// Example test for posts endpoint
import { POST, GET } from '@/app/api/posts/route'
import { 
  createMockRequest, 
  extractResponseJson, 
  generateTestUser,
  createAuthHeader 
} from '../../utils/test-helpers'
import { createTestUser, createTestPost, cleanupTestData } from '../../utils/database-helpers'
import { generateAccessToken } from '@/lib/auth'

describe('/api/posts', () => {
  let testUser: any
  let authToken: string

  beforeEach(async () => {
    await cleanupTestData()
    
    // Create a test user and auth token
    const userData = generateTestUser()
    testUser = await createTestUser(userData)
    authToken = generateAccessToken(testUser.id)
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  describe('POST /api/posts', () => {
    it('should create a new post successfully', async () => {
      const postData = {
        content: 'This is a test post',
        platforms: ['twitter', 'facebook'],
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }

      const request = createMockRequest(
        'POST',
        'http://localhost:3001/api/posts',
        postData,
        createAuthHeader(authToken)
      )

      const response = await POST(request)
      const data = await extractResponseJson(response)

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.post.content).toBe(postData.content)
      expect(data.data.post.platforms).toEqual(postData.platforms)
      expect(data.data.post.userId).toBe(testUser.id)
    })

    it('should fail without authentication', async () => {
      const postData = {
        content: 'This is a test post',
        platforms: ['twitter'],
      }

      const request = createMockRequest(
        'POST',
        'http://localhost:3001/api/posts',
        postData
      )

      const response = await POST(request)
      const data = await extractResponseJson(response)

      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })

    it('should validate required fields', async () => {
      const request = createMockRequest(
        'POST',
        'http://localhost:3001/api/posts',
        {}, // Empty body
        createAuthHeader(authToken)
      )

      const response = await POST(request)
      const data = await extractResponseJson(response)

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid input')
    })
  })

  describe('GET /api/posts', () => {
    it('should retrieve user posts successfully', async () => {
      // Create some test posts
      await createTestPost(testUser.id, { content: 'Post 1' })
      await createTestPost(testUser.id, { content: 'Post 2' })

      const request = createMockRequest(
        'GET',
        'http://localhost:3001/api/posts',
        undefined,
        createAuthHeader(authToken)
      )

      const response = await GET(request)
      const data = await extractResponseJson(response)

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.posts).toHaveLength(2)
      expect(data.data.posts[0].userId).toBe(testUser.id)
      expect(data.data.posts[1].userId).toBe(testUser.id)
    })

    it('should fail without authentication', async () => {
      const request = createMockRequest(
        'GET',
        'http://localhost:3001/api/posts'
      )

      const response = await GET(request)
      const data = await extractResponseJson(response)

      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })

    it('should return empty array when user has no posts', async () => {
      const request = createMockRequest(
        'GET',
        'http://localhost:3001/api/posts',
        undefined,
        createAuthHeader(authToken)
      )

      const response = await GET(request)
      const data = await extractResponseJson(response)

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.posts).toHaveLength(0)
    })
  })
})
