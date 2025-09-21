import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { config } from '../config'
dotenv.config({ quiet: true })

type PayloadT = { id: number; username: string; appId?: number; appCode?: string }
export function generateAccessToken(payload: PayloadT): string {
  const secretKey: Secret = `${process.env.TOKEN_SECRET_KEY}`
  return jwt.sign(payload, secretKey, { expiresIn: config.auth.login.accessTokenDuration })
}

export function generateRefreshToken(payload: PayloadT, remember: boolean = false): string {
  const expiry = remember
    ? config.auth.login.rememberMeDuration
    : config.auth.login.refreshTokenDuration
  const secretKey: Secret = `${process.env.TOKEN_SECRET_KEY}`
  return jwt.sign(payload, secretKey, { expiresIn: expiry })
}

export interface MyJwtPayload extends JwtPayload {
  id: number
  username: string
  appId?: number
  appCode?: string
}

export function validateToken(token: string): { expired: boolean; decoded?: MyJwtPayload } {
  const secretKey: Secret = `${process.env.TOKEN_SECRET_KEY}`
  try {
    const decoded = jwt.verify(token, secretKey) as MyJwtPayload
    return { expired: false, decoded }
  } catch (_err) {
    return { expired: true }
  }
}

export function generateSuperAccessToken() {
  const secretKey: Secret = `${process.env.TOKEN_SECRET_KEY}`
  return jwt.sign({ username: 'superadmin' }, secretKey, {
    expiresIn: config.auth.login.accessTokenDuration
  })
}
