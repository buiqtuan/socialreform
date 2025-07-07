import { NextRequest, NextResponse } from 'next/server'
import ConfigurationService from '@/lib/services/configuration'

// GET /api/configurations/[key]
export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = params
    const value = await ConfigurationService.get(key)

    if (value === null) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ key, value })
  } catch (error) {
    console.error('Error fetching configuration:', error)
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    )
  }
}

// PUT /api/configurations/[key]
export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = params
    const body = await request.json()
    const { value, description, category, isSecret } = body

    if (!value) {
      return NextResponse.json(
        { error: 'Value is required' },
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
        { error: 'Failed to update configuration' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating configuration:', error)
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    )
  }
}

// PATCH /api/configurations/[key]/toggle
export async function PATCH(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = params
    const success = await ConfigurationService.toggle(key)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to toggle configuration' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error toggling configuration:', error)
    return NextResponse.json(
      { error: 'Failed to toggle configuration' },
      { status: 500 }
    )
  }
}
