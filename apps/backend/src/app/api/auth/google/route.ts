import { NextRequest } from 'next/server'
import { SocialPlatform } from '@social-reform/shared-types'
import SocialLoginHandler from '@/lib/services/social-login-handler'

export async function POST(request: NextRequest) {
  return SocialLoginHandler.handleSocialLogin(request, SocialPlatform.GOOGLE)
}
