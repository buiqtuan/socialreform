import { NextRequest, NextResponse } from 'next/server'
import { readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'

// Auto-generated OpenAPI documentation from route files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'ui'
    
    const openApiSpec = await generateOpenAPIFromRoutes()
    
    if (format === 'json') {
      return NextResponse.json(openApiSpec, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    
    // Return Swagger UI HTML
    const html = generateSwaggerUI(openApiSpec)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error generating API documentation:', error)
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    )
  }
}

async function generateOpenAPIFromRoutes() {
  const apiPath = join(process.cwd(), 'src', 'app', 'api')
  
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Social Reform API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for Social Reform social media management platform',
      contact: {
        name: 'Social Reform Team',
        email: 'support@socialreform.com'
      }
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    paths: {} as any,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            success: {
              type: 'boolean',
              example: false
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentication and authorization' },
      { name: 'Users', description: 'User management' },
      { name: 'Posts', description: 'Social media posts' },
      { name: 'Social Accounts', description: 'Social media account integration' },
      { name: 'Analytics', description: 'Analytics and reporting' },
      { name: 'Media', description: 'Media management' },
      { name: 'Calendar', description: 'Content calendar' },
      { name: 'Notifications', description: 'Push notifications' },
      { name: 'Teams', description: 'Team collaboration' },
      { name: 'Configurations', description: 'System configuration' }
    ]
  }
  
  // Discover and analyze routes
  await discoverRoutes(apiPath, '', openApiSpec)
  
  return openApiSpec
}

async function discoverRoutes(dirPath: string, basePath: string, spec: any) {
  try {
    const items = readdirSync(dirPath)
    
    for (const item of items) {
      const itemPath = join(dirPath, item)
      const stat = statSync(itemPath)
      
      if (stat.isDirectory()) {
        // Skip docs directory
        if (item === 'docs') continue
        
        // Recursively discover in subdirectories
        await discoverRoutes(itemPath, `${basePath}/${item}`, spec)
      } else if (item === 'route.ts') {
        // Analyze route file
        const routeInfo = await analyzeRoute(itemPath, basePath)
        if (routeInfo) {
          spec.paths[routeInfo.path] = routeInfo.operations
        }
      }
    }
  } catch (error) {
    console.error(`Error discovering routes in ${dirPath}:`, error)
  }
}

async function analyzeRoute(filePath: string, routePath: string) {
  try {
    const content = readFileSync(filePath, 'utf8')
    
    // Extract HTTP methods
    const methods = extractHttpMethods(content)
    if (methods.length === 0) return null
    
    // Extract JSDoc comments and schemas
    const routeAnalysis = analyzeRouteContent(content, routePath)
    
    const operations: any = {}
    
    for (const method of methods) {
      const operation: any = {
        tags: [getTagFromPath(routePath)],
        summary: routeAnalysis.summary || `${method} ${routePath}`,
        description: routeAnalysis.description || `${method} operation for ${routePath}`,
        operationId: `${method.toLowerCase()}${routePath.replace(/[^a-zA-Z0-9]/g, '')}`,
        parameters: [],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Success' }
              }
            }
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '500': {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
      
      // Add path parameters
      const pathParams = extractPathParameters(routePath)
      if (pathParams.length > 0) {
        operation.parameters.push(...pathParams)
      }
      
      // Add query parameters
      const queryParams = extractQueryParameters(content)
      if (queryParams.length > 0) {
        operation.parameters.push(...queryParams)
      }
      
      // Add request body for POST/PUT methods
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const requestBody = extractRequestBody(content)
        if (requestBody) {
          operation.requestBody = requestBody
        }
      }
      
      // Add security if required
      if (requiresAuth(content)) {
        operation.security = [{ bearerAuth: [] }]
      }
      
      operations[method.toLowerCase()] = operation
    }
    
    return {
      path: routePath,
      operations
    }
  } catch (error) {
    console.error(`Error analyzing route ${filePath}:`, error)
    return null
  }
}

function extractHttpMethods(content: string): string[] {
  const methods: string[] = []
  const methodRegex = /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(/g
  let match
  
  while ((match = methodRegex.exec(content)) !== null) {
    methods.push(match[1])
  }
  
  return methods
}

function analyzeRouteContent(content: string, routePath: string) {
  // Extract JSDoc comments
  const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//)
  let summary = ''
  let description = ''
  
  if (jsdocMatch) {
    const jsdoc = jsdocMatch[0]
    const summaryMatch = jsdoc.match(/\*\s*([^@\n]+)/)
    if (summaryMatch) {
      summary = summaryMatch[1].trim()
    }
    
    const descMatch = jsdoc.match(/\*\s*@description\s+(.+)/i)
    if (descMatch) {
      description = descMatch[1].trim()
    }
  }
  
  // Generate default summary based on route
  if (!summary) {
    summary = generateDefaultSummary(routePath)
  }
  
  return { summary, description }
}

function generateDefaultSummary(routePath: string): string {
  const parts = routePath.split('/').filter(p => p)
  const resource = parts[parts.length - 1]
  
  if (resource?.startsWith('[') && resource?.endsWith(']')) {
    // Dynamic route
    const parentResource = parts[parts.length - 2]
    return `Manage ${parentResource} by ID`
  }
  
  return `Manage ${resource || 'resource'}`
}

function extractPathParameters(routePath: string) {
  const params: any[] = []
  const paramRegex = /\[([^\]]+)\]/g
  let match
  
  while ((match = paramRegex.exec(routePath)) !== null) {
    const paramName = match[1]
    params.push({
      name: paramName,
      in: 'path',
      required: true,
      schema: {
        type: 'string'
      },
      description: `${paramName} parameter`
    })
  }
  
  return params
}

function extractQueryParameters(content: string) {
  const params: any[] = []
  const queryRegex = /searchParams\.get\(['"]([^'"]+)['"]\)/g
  let match
  
  while ((match = queryRegex.exec(content)) !== null) {
    const paramName = match[1]
    params.push({
      name: paramName,
      in: 'query',
      required: false,
      schema: {
        type: 'string'
      },
      description: `${paramName} query parameter`
    })
  }
  
  return params
}

function extractRequestBody(content: string) {
  // Check if route uses request.json()
  if (content.includes('request.json()')) {
    // Try to find Zod schema
    const zodMatch = content.match(/const\s+\w+Schema\s*=\s*z\.object\({([^}]+)}\)/s)
    
    if (zodMatch) {
      // Parse Zod schema (basic parsing)
      const schemaContent = zodMatch[1]
      const properties: any = {}
      
      const fieldRegex = /(\w+):\s*z\.(\w+)\(\)/g
      let fieldMatch
      
      while ((fieldMatch = fieldRegex.exec(schemaContent)) !== null) {
        const [, fieldName, fieldType] = fieldMatch
        properties[fieldName] = {
          type: mapZodTypeToOpenApi(fieldType)
        }
      }
      
      return {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties
            }
          }
        }
      }
    }
    
    // Default JSON body
    return {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object'
          }
        }
      }
    }
  }
  
  return null
}

function mapZodTypeToOpenApi(zodType: string): string {
  const typeMap: Record<string, string> = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    date: 'string',
    email: 'string',
    url: 'string'
  }
  
  return typeMap[zodType] || 'string'
}

function requiresAuth(content: string): boolean {
  // Check for common authentication patterns
  return content.includes('authorization') || 
         content.includes('Bearer') ||
         content.includes('jwt') ||
         content.includes('token')
}

function getTagFromPath(routePath: string): string {
  const parts = routePath.split('/').filter(p => p)
  const firstPart = parts[0]
  
  if (!firstPart) return 'General'
  
  const tagMap: Record<string, string> = {
    'auth': 'Auth',
    'users': 'Users',
    'posts': 'Posts',
    'social-accounts': 'Social Accounts',
    'analytics': 'Analytics',
    'media': 'Media',
    'calendar': 'Calendar',
    'notifications': 'Notifications',
    'teams': 'Teams',
    'configurations': 'Configurations'
  }
  
  return tagMap[firstPart] || firstPart.charAt(0).toUpperCase() + firstPart.slice(1)
}

function generateSwaggerUI(spec: any) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${spec.info.title}</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info { margin: 20px 0; }
        .swagger-ui .info .title { font-size: 36px; color: #3b4151; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                spec: ${JSON.stringify(spec, null, 2)},
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                tryItOutEnabled: true,
                requestInterceptor: (request) => {
                    // Add base URL if not present
                    if (!request.url.startsWith('http')) {
                        request.url = '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}' + request.url;
                    }
                    return request;
                },
                onComplete: () => {
                    console.log('Swagger UI loaded successfully');
                }
            });
            
            window.ui = ui;
        }
    </script>
</body>
</html>
  `
}
