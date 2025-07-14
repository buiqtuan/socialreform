/**
 * UNIFIED TEST SETUP - Single file to handle all test configuration
 *
 * This file handles:
 * 1. Jest test environment setup
 * 2. Global test utilities
 * 3. Mock configurations
 * 4. Database/API setup for integration tests
 */

// ============================================================================
// ENVIRONMENT SETUP
// ============================================================================

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgresql://test:test@localhost:5432/social_reform_test";

console.log("🧪 Test environment initialized");

// ============================================================================
// GLOBAL TEST HOOKS
// ============================================================================

beforeAll(async () => {
  console.log("🚀 Starting test suite");

  // TODO: Add database setup here when needed
  // await setupTestDatabase();

  // TODO: Add test server startup here when needed
  // await startTestServer();
});

afterAll(async () => {
  console.log("🧹 Cleaning up after tests");

  // TODO: Add database cleanup here when needed
  // await cleanupTestDatabase();

  // TODO: Add test server shutdown here when needed
  // await stopTestServer();
});

beforeEach(() => {
  // Reset any test state before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up after each test
  jest.restoreAllMocks();
});

// ============================================================================
// GLOBAL TEST UTILITIES
// ============================================================================

/**
 * Generate a test user object
 */
global.generateTestUser = (overrides = {}) => {
  return {
    id: Math.floor(Math.random() * 10000),
    email: `test-${Date.now()}@example.com`,
    username: `testuser${Date.now()}`,
    name: "Test User",
    ...overrides,
  };
};

/**
 * Create a mock Express request object
 */
global.createMockRequest = (data = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...data,
  };
};

/**
 * Create a mock Express response object
 */
global.createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Sleep utility for async tests
 */
global.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock next() function for middleware tests
 */
global.createMockNext = () => jest.fn();

// ============================================================================
// MOCK CONFIGURATIONS
// ============================================================================

// Mock console.log in tests to reduce noise (uncomment if needed)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
// };

console.log("✅ Global test utilities loaded");

// ============================================================================
// EXPORT FOR MANUAL IMPORT (if needed)
// ============================================================================

module.exports = {
  generateTestUser: global.generateTestUser,
  createMockRequest: global.createMockRequest,
  createMockResponse: global.createMockResponse,
  createMockNext: global.createMockNext,
  sleep: global.sleep,
};
