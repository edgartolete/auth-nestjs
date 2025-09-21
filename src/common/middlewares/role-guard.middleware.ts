import { Request, Response, NextFunction } from 'express'
import { redisClient } from '../services/cache.service'
import { extractTokenFromHeader } from '../utils/request.util'
import { validateToken } from '../utils/token.util'

export type AllowedRolesT = 'superadmin' | 'admin' | 'moderator' | 'self'

export function rootRoleGuard(allowedRoles: AllowedRolesT[] = []) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.user?.id)

    if (allowedRoles.includes('self') && userId === Number(req.params.id)) {
      return next()
    }

    const roleKey = `root-role:${req.params.appCode}:${userId}`

    const storedRoles = (await redisClient.get(roleKey)) as AllowedRolesT | null

    if (storedRoles && allowedRoles.includes(storedRoles)) {
      return next()
    }

    if (allowedRoles.includes('superadmin')) {
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

      return res
        .status(401)
        .json({ success: false, message: 'You are not authorized to access this endpoint.' })
    }

    return res
      .status(401)
      .json({ success: false, message: 'You are not authorized to access this endpoint.' })
  }
}
