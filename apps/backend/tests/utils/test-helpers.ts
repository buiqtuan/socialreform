import { NextRequest } from 'next/server'

/**
 * Create a mock NextRequest for testing API routes
 */
export function createMockRequest(
  method: string,
  url: string,
  body?: any,
  headers?: Record<string, string>
): NextRequest {
  const request = new NextRequest(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  
  return request
}

/**
 * Helper to extract JSON from NextResponse
 */
export async function extractResponseJson(response: Response) {
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

/**
 * Helper to create authorization header
 */
export function createAuthHeader(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  }
}

/**
 * Helper to generate test user data
 */
export function generateTestUser(overrides: Partial<{
  email: string
  username: string
  displayName: string
  password: string
}> = {}) {
  const randomSuffix = Math.random().toString(36).substring(7)
  
  return {
    email: `test.user.${randomSuffix}@example.com`,
    username: `testuser${randomSuffix}`,
    displayName: `Test User ${randomSuffix}`,
    password: 'testpassword123',
    ...overrides,
  }
}

/**
 * Helper to generate test post data
 */
export function generateTestPost(overrides: Partial<{
  content: string
  platforms: string[]
  scheduledFor: Date
}> = {}) {
  return {
    content: 'This is a test post content',
    platforms: ['twitter', 'facebook'],
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    ...overrides,
  }
}
