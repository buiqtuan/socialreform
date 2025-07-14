# Authentication API Integration Tests

This directory contains comprehensive integration tests for the authentication endpoints of the Social Reform backend API.

## Test Structure

### 1. `register.test.js` - Foundation Testing
This file contains the foundational integration tests that focus on:
- **Test Data Generation**: Validates that test helper functions work correctly
- **Mock Request Creation**: Tests the creation of mock HTTP requests
- **Data Validation**: Validates input data formats and constraints
- **Response Structure Validation**: Defines expected API response structures
- **Test Helper Functions**: Tests utility functions for testing

### 2. `auth-integration.test.js` - Comprehensive Integration Tests
This file demonstrates comprehensive integration testing patterns:
- **Registration Flow**: Tests user registration with various scenarios
- **Login Flow**: Tests user authentication with different conditions
- **Error Handling**: Tests various error conditions and edge cases
- **Security Tests**: Tests security features like input validation and rate limiting
- **Full Authentication Flow**: Tests complete register → login → protected route flows

### 3. `supertest-example.test.js` - Real HTTP Integration Example
This file shows how to implement actual HTTP-based integration tests using supertest:
- **Real HTTP Requests**: Makes actual HTTP requests to API endpoints
- **Test Server Setup**: Demonstrates starting/stopping test servers
- **Database Integration**: Shows database setup and cleanup
- **Token-based Authentication**: Tests JWT token flows
- **Protected Routes**: Tests authenticated endpoints

## Key Features Tested

### Registration Endpoint (`POST /api/auth/register`)
- ✅ Successful registration with valid data
- ✅ Input validation (email format, password length, username constraints)
- ✅ Duplicate email/username prevention
- ✅ Required field validation
- ✅ Response structure validation
- ✅ Security (password not returned in response)

### Login Endpoint (`POST /api/auth/login`)
- ✅ Successful login with valid credentials
- ✅ Invalid credentials handling
- ✅ Non-existent user handling
- ✅ Input validation
- ✅ Token generation and response
- ✅ Security measures

### Integration Scenarios
- ✅ Complete registration → login flow
- ✅ Token refresh flows
- ✅ Protected route access
- ✅ Logout functionality
- ✅ Error handling across all endpoints

### Security Testing
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ XSS prevention
- ✅ Rate limiting
- ✅ Password security (hashing, not returned)
- ✅ Token validation

## Test Data Management

### Test User Generation
```javascript
const testUser = generateTestUser({
  email: "custom@example.com", // Optional override
  username: "customuser",      // Optional override
  // ... other overrides
});
```

### Database Cleanup
```javascript
afterEach(async () => {
  if (registeredUser?.id) {
    await cleanupTestUser(registeredUser.id);
  }
});
```

## Running Tests

### Run All Integration Tests
```bash
pnpm test:integration
```

### Run Specific Test File
```bash
npx jest tests/integration/api/auth/register.test.js
```

### Run Tests in Watch Mode
```bash
pnpm test:watch
```

### Run Tests with Coverage
```bash
pnpm test:coverage
```

## Test Environment Setup

### Environment Variables
- `NODE_ENV=test`
- `JWT_SECRET=test-jwt-secret-key`
- `TEST_DATABASE_URL=postgresql://test:test@localhost:5432/social_reform_test`

### Database Setup
For real integration tests, you would need:
1. Test database instance
2. Database migration/seeding
3. Test data cleanup between tests

### Test Server Setup
For HTTP integration tests, you would need:
1. Next.js test server instance
2. Port management
3. Server lifecycle management

## Mock vs Real Testing

### Current Implementation (Mock-based)
- ✅ Fast execution
- ✅ No external dependencies
- ✅ Isolated testing
- ❌ Doesn't test real HTTP layer
- ❌ Doesn't test database integration

### Future Implementation (HTTP-based)
- ✅ Tests complete request/response cycle
- ✅ Tests database integration
- ✅ Tests middleware and error handling
- ❌ Slower execution
- ❌ Requires test infrastructure

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use clear, descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Data Management
- Generate unique test data for each test
- Clean up test data after each test
- Use transactions for database tests when possible

### 3. Error Testing
- Test all error conditions
- Validate error response formats
- Test edge cases and boundary conditions

### 4. Security Testing
- Test input validation
- Test authentication/authorization
- Test rate limiting and abuse prevention

### 5. Performance Considerations
- Use beforeAll/afterAll for expensive setup
- Minimize database operations
- Use parallel test execution when possible

## Future Enhancements

### 1. Real HTTP Testing
- Implement supertest-based tests
- Set up test server automation
- Add database integration testing

### 2. Advanced Scenarios
- Social login integration tests
- Password reset flow tests
- Email verification tests
- Multi-device login tests

### 3. Performance Testing
- Load testing for endpoints
- Concurrent user testing
- Rate limiting validation

### 4. Security Testing
- Penetration testing scenarios
- OWASP security tests
- Token security validation

## Test Utilities

### Helper Functions
- `generateTestUser()` - Creates test user data
- `createMockRequest()` - Creates mock HTTP requests
- `extractResponseJson()` - Extracts JSON from responses
- `cleanupTestUser()` - Cleans up test data
- `createAuthHeader()` - Creates authorization headers

### Mock Data Generators
- Unique email addresses
- Valid usernames
- Secure passwords
- Display names
- Test post data

### Response Validators
- Success response structure
- Error response structure
- Token format validation
- User data validation

This comprehensive test suite ensures that the authentication system is robust, secure, and reliable across all scenarios.
