# 🚀 Automated API Documentation System

This system automatically generates comprehensive API documentation from your Next.js API routes **without requiring any manual updates or external packages**.

## 🎯 Key Features

- **🔄 Fully Automated**: Scans your API routes and generates documentation automatically
- **📊 OpenAPI 3.0**: Industry-standard specification with Swagger UI
- **🎨 Interactive Interface**: Test your APIs directly from the documentation
- **📱 Mobile Responsive**: Works perfectly on all devices
- **🧪 Zero Configuration**: No setup required, works out of the box
- **⚡ Real-time Updates**: Changes to your API routes are immediately reflected

## 📖 Accessing Documentation

When your backend server is running, access the documentation at:

### 🏠 Main Hub
```
http://localhost:3001/api/documentation
```
*Beautiful landing page with overview and quick access to all documentation formats*

### 📚 Interactive Documentation (Swagger UI)
```
http://localhost:3001/api/docs
```
*Full interactive Swagger UI with testing capabilities*

### 📄 Raw OpenAPI JSON
```
http://localhost:3001/api/docs?format=json
```
*Machine-readable OpenAPI 3.0 specification in JSON format*

## 🚀 Getting Started

1. **Start your backend server:**
   ```bash
   pnpm dev:backend
   # or
   pnpm dev
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:3001/api/documentation
   ```

3. **That's it!** Your API documentation is ready to use.

## 🔍 How It Works

### Automatic Discovery
The system automatically:
- 📁 Scans your \`src/app/api\` directory
- 🔍 Discovers all \`route.ts\` files
- 📊 Analyzes HTTP methods (GET, POST, PUT, DELETE, PATCH)
- 🏷️ Extracts parameters from route paths and query strings
- 📝 Generates OpenAPI 3.0 compliant documentation

### Smart Analysis
- **Path Parameters**: Automatically detects \`[id]\` style parameters
- **Query Parameters**: Extracts \`searchParams.get()\` usage
- **Request Bodies**: Identifies \`request.json()\` patterns
- **Zod Schemas**: Parses Zod validation schemas for better documentation
- **Authentication**: Detects routes that require authentication

### Route Organization
Your API routes are automatically organized by categories:
- 🔐 **Auth** - Authentication endpoints
- 👥 **Users** - User management
- 📝 **Posts** - Social media posts
- 🔗 **Social Accounts** - Platform integrations
- 📊 **Analytics** - Performance metrics
- 📁 **Media** - File management
- 📅 **Calendar** - Content scheduling
- 🔔 **Notifications** - Push notifications
- 👨‍💼 **Teams** - Collaboration
- ⚙️ **Configurations** - System settings

## 🎨 Enhanced Documentation

### Adding JSDoc Comments
For even better documentation, add JSDoc comments to your route files:

```typescript
/**
 * User authentication endpoint
 * @description Authenticates user credentials and returns JWT tokens
 * @param {string} email - User email address
 * @param {string} password - User password
 */
export async function POST(request: NextRequest) {
  // Your authentication logic here
}
```

### Zod Schema Integration
The system automatically detects and documents Zod schemas:

```typescript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  const { email, password } = loginSchema.parse(await request.json())
  // Your logic here
}
```

## 🔧 Advanced Features

### Authentication Detection
Routes requiring authentication are automatically detected and marked with a security requirement:

```typescript
// This will be marked as requiring authentication
export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')
  // Your protected route logic
}
```

### Response Status Codes
The system automatically documents common HTTP status codes:
- ✅ **200**: Success
- ❌ **400**: Bad Request
- 🔒 **401**: Unauthorized
- ❌ **500**: Internal Server Error

### Request/Response Examples
Based on your code patterns, the system generates:
- Request body schemas
- Response examples
- Parameter descriptions
- Error responses

## 📊 Integration Examples

### Import into Postman
1. Go to `http://localhost:3001/api/docs?format=json`
2. Copy the JSON response
3. In Postman: Import > Raw Text > Paste JSON
4. All your endpoints will be ready to test!

### Use with API Clients
```javascript
// Fetch the OpenAPI spec
const spec = await fetch('http://localhost:3001/api/docs?format=json')
const apiSpec = await spec.json()

// Use with your favorite API client library
```

### SDK Generation
Use the OpenAPI spec to generate SDKs:
```bash
# Generate TypeScript SDK
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3001/api/docs?format=json \
  -g typescript-fetch \
  -o ./generated-sdk
```

## 🛠️ Development Workflow

### 1. Create New API Route
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello from new API!' })
}
```

### 2. Documentation Updates Automatically
- No manual updates needed
- Documentation reflects your new endpoint immediately
- Parameter detection happens automatically

### 3. Test Your API
- Visit the documentation page
- Use the interactive Swagger UI
- Test your endpoints directly from the browser

## 🎯 Best Practices

### 1. Consistent Route Structure
```
src/app/api/
├── auth/
│   ├── login/route.ts
│   └── logout/route.ts
├── users/
│   ├── route.ts
│   └── [id]/route.ts
└── posts/
    ├── route.ts
    └── [id]/route.ts
```

### 2. Use Descriptive Names
```typescript
// Good
export async function POST(request: NextRequest) { /* login logic */ }

// Better with JSDoc
/**
 * Authenticate user with email and password
 */
export async function POST(request: NextRequest) { /* login logic */ }
```

### 3. Validate Input with Zod
```typescript
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  age: z.number().min(18)
})

export async function POST(request: NextRequest) {
  const userData = userSchema.parse(await request.json())
  // Your logic here
}
```

## 🔍 Troubleshooting

### Documentation Not Updating
- Restart your development server
- Check for syntax errors in route files
- Ensure routes are properly exported

### Missing Parameters
- Check that you're using `searchParams.get()` for query parameters
- Verify path parameters use `[param]` syntax
- Ensure request bodies use `request.json()`

### Authentication Not Detected
- Use common authentication patterns in your code
- Include 'authorization', 'Bearer', 'jwt', or 'token' in your code
- Add explicit security comments if needed

## 🚀 Benefits

### For Developers
- **No maintenance overhead** - Documentation updates automatically
- **Consistent format** - All APIs documented the same way
- **Interactive testing** - Test APIs without leaving the documentation
- **Type safety** - Zod schemas provide additional validation info

### For Teams
- **Always up-to-date** - Documentation never goes stale
- **Self-documenting** - New team members can understand APIs quickly
- **Standard format** - Everyone knows where to find API docs
- **Integration ready** - OpenAPI format works with all tools

### For Production
- **Zero dependencies** - No external packages to maintain
- **Fast performance** - Documentation generated on-demand
- **Secure** - No additional attack surface
- **Scalable** - Works with any number of API endpoints

## 📈 Next Steps

1. **Start using the documentation** - Access `/api/documentation` now
2. **Add JSDoc comments** - Enhance your route files with better descriptions
3. **Share with your team** - Everyone can use the same documentation
4. **Integrate with tools** - Use the OpenAPI spec with other development tools

---

*This automated documentation system is designed to be zero-maintenance and always up-to-date with your API changes. Happy coding! 🎉*
