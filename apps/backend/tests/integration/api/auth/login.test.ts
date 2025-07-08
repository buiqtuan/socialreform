// Example test for login endpoint
import { POST } from '@/app/api/auth/login/route'
import { 
  createMockRequest, 
  extractResponseJson, 
  generateTestUser 
} from '../../utils/test-helpers'
import { createTestUser, cleanupTestData } from '../../utils/database-helpers'

describe('/api/auth/login', () => {
  beforeEach(async () => {
    await cleanupTestData()
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  it('should login successfully with valid credentials', async () => {
    const userData = generateTestUser()
    
    // Create user first
    await createTestUser(userData)

    // Attempt login
    const request = createMockRequest(
      'POST',
      'http://localhost:3001/api/auth/login',
      {
        email: userData.email,
        password: userData.password,
      }
    )

    const response = await POST(request)
    const data = await extractResponseJson(response)

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.user.email).toBe(userData.email)
    expect(data.data.tokens.accessToken).toBeDefined()
    expect(data.data.tokens.refreshToken).toBeDefined()
  })

  it('should fail with invalid credentials', async () => {
    const userData = generateTestUser()
    
    // Create user first
    await createTestUser(userData)

    // Attempt login with wrong password
    const request = createMockRequest(
      'POST',
      'http://localhost:3001/api/auth/login',
      {
        email: userData.email,
        password: 'wrongpassword',
      }
    )

    const response = await POST(request)
    const data = await extractResponseJson(response)

    expect(response.status).toBe(401)
    expect(data.error).toContain('Invalid')
  })

  it('should fail with non-existent user', async () => {
    const request = createMockRequest(
      'POST',
      'http://localhost:3001/api/auth/login',
      {
        email: 'nonexistent@example.com',
        password: 'password123',
      }
    )

    const response = await POST(request)
    const data = await extractResponseJson(response)

    expect(response.status).toBe(401)
    expect(data.error).toContain('Invalid')
  })
})
