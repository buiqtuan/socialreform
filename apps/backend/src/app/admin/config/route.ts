import { NextRequest, NextResponse } from 'next/server'
import ConfigurationService from '@/lib/services/configuration'

export async function GET(request: NextRequest) {
  try {
    const categories = await ConfigurationService.getCategories()
    const allConfigurations: Record<string, any[]> = {}

    // Get configurations for each category
    for (const category of categories) {
      allConfigurations[category] = await ConfigurationService.getByCategory(category, false)
    }

    // Generate HTML admin interface
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Reform - Configuration Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { 
            background: #2563eb;
            color: white;
            padding: 20px 0;
            margin-bottom: 30px;
            border-radius: 8px;
        }
        .header h1 { text-align: center; font-size: 28px; }
        .header p { text-align: center; opacity: 0.9; margin-top: 5px; }
        .category { 
            background: white;
            margin-bottom: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .category-header { 
            background: #1f2937;
            color: white;
            padding: 15px 20px;
            font-size: 18px;
            font-weight: 600;
            text-transform: capitalize;
        }
        .config-grid { 
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .config-item { 
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 15px;
            background: #f9fafb;
        }
        .config-key { 
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
            font-size: 14px;
        }
        .config-value { 
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 8px;
            font-family: monospace;
            font-size: 13px;
            margin-bottom: 8px;
            min-height: 36px;
            word-break: break-all;
        }
        .config-description { 
            font-size: 12px;
            color: #6b7280;
            font-style: italic;
        }
        .secret-badge { 
            background: #ef4444;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            margin-left: 8px;
        }
        .empty-state { 
            text-align: center;
            padding: 40px;
            color: #6b7280;
        }
        .warning { 
            background: #fef3c7;
            border: 1px solid #f59e0b;
            color: #92400e;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .api-info { 
            background: #dbeafe;
            border: 1px solid #3b82f6;
            color: #1e40af;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .api-info h3 { margin-bottom: 10px; }
        .api-info code { 
            background: #1e40af;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Social Reform</h1>
            <p>Configuration Management</p>
        </div>

        <div class="warning">
            <strong>⚠️ Warning:</strong> This is a development interface. In production, implement proper authentication and authorization.
        </div>

        <div class="api-info">
            <h3>📡 API Endpoints</h3>
            <p><strong>GET</strong> <code>/api/configurations</code> - Get all categories</p>
            <p><strong>GET</strong> <code>/api/configurations?category=auth</code> - Get configurations by category</p>
            <p><strong>POST</strong> <code>/api/configurations</code> - Create/update configuration</p>
            <p><strong>GET</strong> <code>/api/configurations/[key]</code> - Get specific configuration</p>
            <p><strong>PUT</strong> <code>/api/configurations/[key]</code> - Update specific configuration</p>
        </div>

        ${categories.map(category => `
            <div class="category">
                <div class="category-header">
                    📋 ${category.replace('_', ' ')} Configuration
                </div>
                <div class="config-grid">
                    ${allConfigurations[category]?.length ? allConfigurations[category].map(config => `
                        <div class="config-item">
                            <div class="config-key">
                                ${config.key}
                                ${config.isSecret ? '<span class="secret-badge">SECRET</span>' : ''}
                            </div>
                            <div class="config-value">
                                ${config.value || '<em>Not set</em>'}
                            </div>
                            ${config.description ? `<div class="config-description">${config.description}</div>` : ''}
                        </div>
                    `).join('') : '<div class="empty-state">No configurations found</div>'}
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>
    `

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    })
  } catch (error) {
    console.error('Error generating admin interface:', error)
    return NextResponse.json(
      { error: 'Failed to generate admin interface' },
      { status: 500 }
    )
  }
}
