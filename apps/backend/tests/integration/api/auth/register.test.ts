import { POST } from '@/app/api/auth/register/route'
import { prisma } from '@/lib/prisma'
import { 
  createMockRequest, 
  extractResponseJson, 
  generateTestUser 
} from '../../utils/test-helpers'
import { cleanupTestData } from '../../utils/database-helpers'

describe('/api/auth/register', () => {
  beforeEach(async () => {
    await cleanupTestData()
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  it('should register a new user successfully', async () => {
    const userData = generateTestUser()
    const request = createMockRequest(
      'POST',
      'http://localhost:3001/api/auth/register',
      userData
    )

    const response = await POST(request)
    const data = await extractResponseJson(response)

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.user).toMatchObject({
      email: userData.email,
      username: userData.username,
      displayName: userData.displayName,
    })
    expect(data.data.user.password).toBeUndefined()
    expect(data.data.tokens.accessToken).toBeDefined()
    expect(data.data.tokens.refreshToken).toBeDefined()
    expect(data.data.tokens.expiresIn).toBe(900)

    // Verify user was created in database
    const user = await prisma.user.findUnique({
      where: { email: userData.email }
    })
    expect(user).toBeTruthy()
    expect(user?.password).toBeTruthy() // Password should be hashed
  })

  it('should return error for duplicate email', async () => {
    const userData = generateTestUser()
    
    // Create user first
    const request1 = createMockRequest(
      'POST',
      'http://localhost:3001/api/auth/register',
      userData
    )
    await POST(request1)

    // Try to create again
    const request2 = createMockRequest(
      'POST',
      'http://localhost:3001/api/auth/register',
      userData
    )
    const response = await POST(request2)
    const data = await extractResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toContain('already exists')
  })

  it('should return error for duplicate username', async () => {
    const userData1 = generateTestUser()
    const userData2 = generateTestUser({ username: userData1.username })
    
    // Create user first
    const request1 = createMockRequest(
      'POST',
      'http://localhost:3001/api/auth/register',
      userData1
    )
    await POST(request1)

    // Try to create with same username
    const request2 = createMockRequest(
      'POST',
      'http://localhost:3001/api/auth/register',
      userData2
    )
    const response = await POST(request2)
    const data = await extractResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toContain('already exists')
  })

  it('should return validation error for invalid email', async () => {
    const userData = generateTestUser({ email: 'invalid-email' })
    const request = createMockRequest(
      'POST',
      'http://localhost:3001/api/auth/register',
      userData
    )

    const response = await POST(request)
    const data = await extractResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid input')
    expect(data.details).toBeDefined()
  })

  it('should return validation error for short password', async () => {
    const userData = generateTestUser({ password: '123' })
    const request = createMockRequest(
      'POST',
      'http://localhost:3001/api/auth/register',
      userData
    )

    const response = await POST(request)
    const data = await extractResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid input')
    expect(data.details).toBeDefined()
  })

  it('should return validation error for short username', async () => {
    const userData = generateTestUser({ username: 'ab' })
    const request = createMockRequest(
      'POST',
      'http://localhost:3001/api/auth/register',
      userData
    )

    const response = await POST(request)
    const data = await extractResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid input')
    expect(data.details).toBeDefined()
  })

  it('should return validation error for missing required fields', async () => {
    const request = createMockRequest(
      'POST',
      'http://localhost:3001/api/auth/register',
      {}
    )

    const response = await POST(request)
    const data = await extractResponseJson(response)

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid input')
    expect(data.details).toBeDefined()
  })
})
