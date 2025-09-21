import { Request, Response, NextFunction } from 'express'
import { extractTokenFromHeader } from '../utils/request.util'
import { MyJwtPayload, validateToken } from '../utils/token.util'
import { redisClient } from '../services/cache.service'

declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload
    }
  }
}

export async function authTokenGuard(req: Request, res: Response, next: NextFunction) {
  const accessToken = extractTokenFromHeader(req)

  if (!accessToken) {
    return res.status(401).json({ success: false, message: 'Authorization header missing' })
  }

  const { expired, decoded } = validateToken(accessToken)

  if (expired || !decoded) {
    return res.status(401).json({ success: false, message: 'Token Invalid or expired token' })
  }

  const storedToken = await redisClient.get(`sp-access`)

  if (storedToken === accessToken) {
    return next()
  }

  const { id, username, appId, appCode } = decoded

  if (!appId || appCode !== req.params.appCode) {
    return res.status(401).json({ success: false, message: 'Token Invalid for this App' })
  }

  req.user = { id, username, appId, appCode }

  next()
}
