import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { comparePassword, generateAccessToken, generateRefreshToken, storeRefreshToken } from '@/lib/auth'
import { ApiResponse, User } from '@social-reform/shared-types'

interface LoginResponse {
  user: Omit<User, 'password'>;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        verified: true,
        createdAt: true,
        password: true, // Include password for verification
      }
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid credentials' 
        } as ApiResponse<never>,
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid credentials' 
        } as ApiResponse<never>,
        { status: 401 }
      )
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    // Store refresh token
    await storeRefreshToken(user.id, refreshToken)

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          verified: user.verified,
          createdAt: user.createdAt
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 900, // 15 minutes
        }
      }
    } as ApiResponse<LoginResponse>)
  } catch (err) {
    console.error('Login error:', err)
    
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid input', 
          details: err.errors 
        } as ApiResponse<never>,
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}
