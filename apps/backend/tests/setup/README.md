# Test Setup - AI Documentation

## 🎯 **SIMPLIFIED TESTING ARCHITECTURE**

This directory contains **ONE unified test setup** for the entire backend testing infrastructure. No more multiple configuration files or TypeScript complications.

## 📁 **File Structure**

```
tests/setup/
├── jest.config.js    # Jest configuration (test runner settings)
├── test-setup.js     # Unified test environment setup
└── README.md         # This documentation
```

## 🔧 **Core Files Explained**

### `jest.config.js`
- **Purpose**: Jest test runner configuration
- **What it does**: 
  - Defines test file patterns (`*.test.js`, `*.spec.js`)
  - Sets up coverage collection
  - Configures test environment (Node.js)
  - Points to the unified setup file

### `test-setup.js`
- **Purpose**: Single source of truth for all test setup
- **What it does**:
  - Sets environment variables for testing
  - Provides global test utilities (generateTestUser, createMockRequest, etc.)
  - Handles beforeAll/afterAll hooks
  - Configures mocks and test helpers

## 🚀 **How Tests Work**

1. **Jest loads** `jest.config.js`
2. **Jest runs** `test-setup.js` before any tests
3. **Global utilities** are available in all test files
4. **Tests execute** using plain JavaScript (no TypeScript)

## 📝 **Writing Tests**

Create `.test.js` files in `tests/integration/`:

```javascript
// tests/integration/my-feature.test.js
describe('My Feature', () => {
  it('should work with test utilities', () => {
    // Global utilities are available automatically
    const user = generateTestUser();
    const req = createMockRequest({ body: { userId: user.id } });
    const res = createMockResponse();
    
    expect(user.email).toContain('@example.com');
    expect(req.body.userId).toBe(user.id);
  });
});
```

## 🧪 **Available Global Utilities**

These are automatically available in all test files:

- `generateTestUser(overrides)` - Creates test user objects
- `createMockRequest(data)` - Creates Express request mocks
- `createMockResponse()` - Creates Express response mocks  
- `createMockNext()` - Creates Express next() function mocks
- `sleep(ms)` - Async sleep utility

## ⚡ **Running Tests**

```bash
pnpm test           # Run all tests
pnpm test:watch     # Run in watch mode
pnpm test:coverage  # Run with coverage report
```

## 🔄 **Test Lifecycle**

1. **beforeAll**: Runs once before all tests (database setup, server start)
2. **beforeEach**: Runs before each test (clear mocks)
3. **TEST EXECUTION**: Your actual test code
4. **afterEach**: Runs after each test (restore mocks)
5. **afterAll**: Runs once after all tests (cleanup, server stop)

## 🎨 **Benefits of This Setup**

- ✅ **Single file management** - Everything in one place
- ✅ **No TypeScript complexity** - Plain JavaScript testing
- ✅ **Global utilities** - No repetitive imports
- ✅ **Consistent environment** - Same setup for all tests
- ✅ **Easy to extend** - Add new utilities in one file
- ✅ **AI-friendly** - Clear structure for AI code generation

## 🔧 **Extending the Setup**

To add new test utilities, edit `test-setup.js`:

```javascript
// Add to the GLOBAL TEST UTILITIES section
global.myNewUtility = (params) => {
  // Your utility logic
  return result;
};
```

## 🚨 **Important Notes for AI**

- **Always use `.test.js` extension** (not `.test.ts`)
- **Global utilities are available without import**
- **Tests run in Node.js environment** (not browser)
- **Environment variables are set in test-setup.js**
- **No TypeScript compilation** - pure JavaScript execution
- **Jest configuration is in jest.config.js**
- **All setup logic is in test-setup.js**

## 📚 **Common Test Patterns**

```javascript
// API endpoint testing
describe('POST /api/users', () => {
  it('should create user', async () => {
    const userData = generateTestUser();
    const req = createMockRequest({ body: userData });
    const res = createMockResponse();
    
    await userController.createUser(req, res, createMockNext());
    
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

// Async operation testing
describe('Database operations', () => {
  it('should handle async operations', async () => {
    const result = await someAsyncFunction();
    expect(result).toBeDefined();
  });
});
```

This setup eliminates configuration complexity and focuses on **writing actual tests quickly and efficiently**.
