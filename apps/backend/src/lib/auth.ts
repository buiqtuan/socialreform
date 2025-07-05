import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateAccessToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: '15m' }
  )
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  )
}

export async function verifyAccessToken(token: string): Promise<{ userId: string } | null> {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }
    return payload
  } catch (error) {
    return null
  }
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { userId: string }
    
    // Check if refresh token exists in database
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token }
    })

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null
    }

    return payload
  } catch (error) {
    return null
  }
}

export async function storeRefreshToken(userId: string, token: string): Promise<void> {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt
    }
  })
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { token }
  })
}
