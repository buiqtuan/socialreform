# Test Configuration

## Environment Setup

Before running tests, make sure you have:

1. A test database configured in your `.env.test` file
2. All dependencies installed (`pnpm install`)
3. Database schema migrated for test environment

## Running Tests

### Run all integration tests
```bash
pnpm test:integration
```

### Run tests with coverage
```bash
pnpm test:coverage
```

### Run tests in watch mode
```bash
pnpm test:watch
```

### Run specific test file
```bash
pnpm test tests/integration/api/auth/register.test.ts
```

## Test Structure

```
tests/
├── integration/           # Integration tests
│   └── api/              # API endpoint tests
│       ├── auth/         # Authentication tests
│       ├── posts/        # Posts API tests
│       ├── users/        # Users API tests
│       └── ...
├── utils/                # Test utilities
│   ├── test-helpers.ts   # General test helpers
│   └── database-helpers.ts # Database test utilities
├── fixtures/             # Test data fixtures
│   └── test-data.ts      # Sample test data
└── setup/               # Test configuration
    ├── jest.config.js    # Jest configuration
    └── setup-tests.ts    # Global test setup
```

## Writing Tests

### Basic Test Structure

```typescript
import { POST } from '@/app/api/your-endpoint/route'
import { createMockRequest, extractResponseJson } from '../../utils/test-helpers'
import { cleanupTestData } from '../../utils/database-helpers'

describe('/api/your-endpoint', () => {
  beforeEach(async () => {
    await cleanupTestData()
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  it('should handle valid request', async () => {
    const request = createMockRequest('POST', 'http://localhost:3001/api/your-endpoint', {
      // request body
    })

    const response = await POST(request)
    const data = await extractResponseJson(response)

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })
})
```

## Test Data Management

- Use `generateTestUser()` to create unique test users
- Use `createTestUser()` to insert users into the test database
- Use `cleanupTestData()` to clean up after tests
- Use fixtures from `test-data.ts` for consistent test scenarios

## Best Practices

1. Always clean up test data before and after each test
2. Use descriptive test names that explain what is being tested
3. Test both success and error scenarios
4. Mock external services and dependencies
5. Use the provided test helpers for consistency
6. Keep tests isolated and independent
