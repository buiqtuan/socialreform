import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateAccessToken, generateRefreshToken, storeRefreshToken } from '@/lib/auth'
import { ApiResponse, User, SocialPlatform } from '@social-reform/shared-types'
import SocialAuthService, { SocialUserData } from '@/lib/services/social-auth'

interface SocialLoginResponse {
  user: Omit<User, 'password'>;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
}

const socialLoginSchema = z.object({
  accessToken: z.string().min(1),
  platform: z.nativeEnum(SocialPlatform).optional(), // Optional, can be inferred from route
})

export class SocialLoginHandler {
  /**
   * Handle social login for any platform
   */
  static async handleSocialLogin(
    request: NextRequest,
    platform: SocialPlatform
  ): Promise<NextResponse> {
    try {
      const body = await request.json()
      const { accessToken } = socialLoginSchema.parse(body)

      // Verify token and get user data from the social platform
      const socialUserData = await SocialAuthService.verifyToken(platform, accessToken)
      if (!socialUserData) {
        return NextResponse.json(
          { 
            success: false,
            error: `Invalid ${platform} token` 
          } as ApiResponse<never>,
          { status: 401 }
        )
      }

      // Get additional user information if needed
      const additionalInfo = await SocialAuthService.getAdditionalUserInfo(
        platform, 
        accessToken, 
        socialUserData
      )
      
      // Merge additional info
      const completeUserData = { ...socialUserData, ...additionalInfo }

      // Handle user creation/update
      let user = await this.findOrCreateUser(completeUserData, platform, accessToken)

      // Generate JWT tokens
      const jwtAccessToken = generateAccessToken(user.id)
      const jwtRefreshToken = generateRefreshToken(user.id)

      // Store refresh token
      await storeRefreshToken(user.id, jwtRefreshToken)

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
            bio: user.bio,
            verified: user.verified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          },
          tokens: {
            accessToken: jwtAccessToken,
            refreshToken: jwtRefreshToken,
            expiresIn: 900, // 15 minutes
          }
        }
      } as ApiResponse<SocialLoginResponse>)
    } catch (err) {
      console.error(`${platform} login error:`, err)
      
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

  /**
   * Find existing user or create new one
   */
  private static async findOrCreateUser(
    socialUserData: SocialUserData,
    platform: SocialPlatform,
    accessToken: string
  ) {
    // Check if user already exists with this social account or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          // Match by email if available
          ...(socialUserData.email ? [{ email: socialUserData.email }] : []),
          // Match by social account
          {
            socialAccounts: {
              some: {
                platform: platform,
                platformUserId: socialUserData.id
              }
            }
          }
        ]
      },
      include: {
        socialAccounts: {
          where: {
            platform: platform
          }
        }
      }
    })

    if (user) {
      // Update existing social account or create new one
      await this.updateOrCreateSocialAccount(user.id, socialUserData, platform, accessToken)
    } else {
      // Create new user with social account
      user = await this.createUserWithSocialAccount(socialUserData, platform, accessToken)
    }

    return user
  }

  /**
   * Update existing social account or create new one
   */
  private static async updateOrCreateSocialAccount(
    userId: string,
    socialUserData: SocialUserData,
    platform: SocialPlatform,
    accessToken: string
  ) {
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: userId,
        platform: platform
      }
    })

    if (existingAccount) {
      // Update existing account
      await prisma.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          accessToken,
          platformUsername: socialUserData.username || socialUserData.name,
          updatedAt: new Date()
        }
      })
    } else {
      // Create new social account for existing user
      await prisma.socialAccount.create({
        data: {
          userId: userId,
          platform: platform,
          platformUserId: socialUserData.id,
          platformUsername: socialUserData.username || socialUserData.name,
          accessToken,
          isActive: true
        }
      })
    }
  }

  /**
   * Create new user with social account
   */
  private static async createUserWithSocialAccount(
    socialUserData: SocialUserData,
    platform: SocialPlatform,
    accessToken: string
  ) {
    // Generate unique username
    const baseUsername = SocialAuthService.generateUsername(
      socialUserData.email || '', 
      socialUserData.name
    )
    let username = baseUsername
    let counter = 1

    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`
      counter++
    }

    // Create user with social account
    const user = await prisma.user.create({
      data: {
        email: socialUserData.email || `${username}@${platform}.local`, // Fallback email
        username,
        displayName: socialUserData.name,
        avatar: socialUserData.avatar,
        password: '', // Empty password for social users
        verified: true, // Social accounts are considered verified
        socialAccounts: {
          create: {
            platform: platform,
            platformUserId: socialUserData.id,
            platformUsername: socialUserData.username || socialUserData.name,
            accessToken,
            isActive: true
          }
        }
      },
      include: {
        socialAccounts: true
      }
    })

    return user
  }
}

export default SocialLoginHandler
