const { NextRequest } = require("next/server");

/**
 * Create a mock NextRequest for testing API routes
 */
function createMockRequest(method, url, body, headers) {
  const request = new NextRequest(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return request;
}

/**
 * Helper to extract JSON from NextResponse
 */
async function extractResponseJson(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Helper to create authorization header
 */
function createAuthHeader(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Helper to generate test user data
 */
function generateTestUser(overrides = {}) {
  const randomSuffix = Math.random().toString(36).substring(7);

  return {
    email: `test.user.${randomSuffix}@example.com`,
    username: `testuser${randomSuffix}`,
    displayName: `Test User ${randomSuffix}`,
    password: "testpassword123",
    ...overrides,
  };
}

/**
 * Helper to generate test post data
 */
function generateTestPost(overrides = {}) {
  return {
    content: "This is a test post content",
    platforms: ["twitter", "facebook"],
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    ...overrides,
  };
}

/**
 * Helper to clean up test user from database
 * TODO: Implement actual database cleanup when database setup is ready
 */
async function cleanupTestUser(userId) {
  if (!userId) return;

  // TODO: Add actual database cleanup logic here
  // const { prisma } = require("../../src/lib/prisma");
  // await prisma.user.delete({ where: { id: userId } });

  console.log(`TODO: Clean up test user ${userId}`);
}

module.exports = {
  createMockRequest,
  extractResponseJson,
  createAuthHeader,
  generateTestUser,
  generateTestPost,
  cleanupTestUser,
};
