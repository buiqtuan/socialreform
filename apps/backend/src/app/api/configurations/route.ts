import { NextRequest, NextResponse } from 'next/server'
import ConfigurationService from '@/lib/services/configuration'

// GET /api/configurations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const includeSecrets = searchParams.get('includeSecrets') === 'true'

    if (category) {
      const configurations = await ConfigurationService.getByCategory(category, includeSecrets)
      return NextResponse.json({ configurations })
    }

    const categories = await ConfigurationService.getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching configurations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch configurations' },
      { status: 500 }
    )
  }
}

// POST /api/configurations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value, description, category, isSecret } = body

    if (!key || !value) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    const success = await ConfigurationService.set(key, value, {
      description,
      category,
      isSecret
    })

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save configuration' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving configuration:', error)
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    )
  }
}

// DELETE /api/configurations
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      )
    }

    const success = await ConfigurationService.delete(key)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete configuration' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting configuration:', error)
    return NextResponse.json(
      { error: 'Failed to delete configuration' },
      { status: 500 }
    )
  }
}
