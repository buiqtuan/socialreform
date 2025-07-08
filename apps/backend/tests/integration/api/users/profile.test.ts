// Example test for users profile endpoint
import { GET, PUT } from '@/app/api/users/profile/route'
import { 
  createMockRequest, 
  extractResponseJson, 
  generateTestUser,
  createAuthHeader 
} from '../../utils/test-helpers'
import { createTestUser, cleanupTestData } from '../../utils/database-helpers'
import { generateAccessToken } from '@/lib/auth'

describe('/api/users/profile', () => {
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

  describe('GET /api/users/profile', () => {
    it('should retrieve user profile successfully', async () => {
      const request = createMockRequest(
        'GET',
        'http://localhost:3001/api/users/profile',
        undefined,
        createAuthHeader(authToken)
      )

      const response = await GET(request)
      const data = await extractResponseJson(response)

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.user.id).toBe(testUser.id)
      expect(data.data.user.email).toBe(testUser.email)
      expect(data.data.user.username).toBe(testUser.username)
      expect(data.data.user.password).toBeUndefined()
    })

    it('should fail without authentication', async () => {
      const request = createMockRequest(
        'GET',
        'http://localhost:3001/api/users/profile'
      )

      const response = await GET(request)
      const data = await extractResponseJson(response)

      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })
  })

  describe('PUT /api/users/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        displayName: 'Updated Display Name',
        bio: 'Updated bio description',
      }

      const request = createMockRequest(
        'PUT',
        'http://localhost:3001/api/users/profile',
        updateData,
        createAuthHeader(authToken)
      )

      const response = await PUT(request)
      const data = await extractResponseJson(response)

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.user.displayName).toBe(updateData.displayName)
      expect(data.data.user.bio).toBe(updateData.bio)
    })

    it('should fail without authentication', async () => {
      const updateData = {
        displayName: 'Updated Display Name',
      }

      const request = createMockRequest(
        'PUT',
        'http://localhost:3001/api/users/profile',
        updateData
      )

      const response = await PUT(request)
      const data = await extractResponseJson(response)

      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })

    it('should validate update data', async () => {
      const invalidData = {
        displayName: '', // Invalid empty display name
      }

      const request = createMockRequest(
        'PUT',
        'http://localhost:3001/api/users/profile',
        invalidData,
        createAuthHeader(authToken)
      )

      const response = await PUT(request)
      const data = await extractResponseJson(response)

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid input')
    })
  })
})
