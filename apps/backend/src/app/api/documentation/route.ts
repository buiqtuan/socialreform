import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Reform API Documentation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container { 
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 700px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
        }
        h1 { 
            font-size: 36px;
            color: #2d3748;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .subtitle { 
            font-size: 18px;
            color: #718096;
            margin-bottom: 40px;
        }
        .features { 
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .feature { 
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border: 2px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        .feature:hover { 
            transform: translateY(-5px);
            border-color: #667eea;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }
        .feature h3 { 
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 18px;
        }
        .feature p { 
            color: #4a5568;
            font-size: 14px;
            line-height: 1.5;
        }
        .cta-button { 
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            margin: 10px;
        }
        .cta-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        .secondary-button { 
            background: #e2e8f0;
            color: #2d3748;
        }
        .secondary-button:hover { 
            background: #cbd5e0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .info { 
            background: #ebf8ff;
            border: 1px solid #90cdf4;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #2c5282;
        }
        .footer { 
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 14px;
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Social Reform API</h1>
        <p class="subtitle">Automated API Documentation System</p>
        
        <div class="features">
            <div class="feature">
                <h3>🔄 Auto-Generated</h3>
                <p>Documentation is automatically generated from your API route files. No manual updates needed!</p>
            </div>
            <div class="feature">
                <h3>📊 OpenAPI 3.0</h3>
                <p>Industry-standard OpenAPI specification with Swagger UI for interactive testing.</p>
            </div>
            <div class="feature">
                <h3>🎯 Real-time Updates</h3>
                <p>Changes to your API routes are immediately reflected in the documentation.</p>
            </div>
            <div class="feature">
                <h3>🧪 Interactive Testing</h3>
                <p>Test your API endpoints directly from the documentation interface.</p>
            </div>
        </div>

        <div class="info">
            <strong>✨ Zero Configuration Required!</strong><br>
            This documentation system automatically discovers and documents all your API routes. 
            Just access the links below to explore your API.
        </div>

        <div>
            <a href="/api/docs" class="cta-button">
                📚 View Interactive Documentation
            </a>
            <a href="/api/docs?format=json" class="cta-button secondary-button">
                📄 Download OpenAPI JSON
            </a>
        </div>

        <div class="footer">
            <p>
                🔧 <strong>How it works:</strong> The system scans your <code>src/app/api</code> directory, 
                analyzes route files, and generates comprehensive documentation automatically.
            </p>
            <p style="margin-top: 10px;">
                📝 <strong>Tip:</strong> Add JSDoc comments to your route files for even better documentation!
            </p>
        </div>
    </div>
</body>
</html>
  `
  
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' }
  })
}
