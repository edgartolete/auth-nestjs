import { Request, Response, NextFunction } from 'express'
import { db } from '../db'
import { eq } from 'drizzle-orm'
import { apps } from '../db/schema/apps.schema'

declare global {
  namespace Express {
    interface Request {
      appId: number
    }
  }
}

export async function appCodePipe(req: Request, res: Response, next: NextFunction) {
  const appCode = req.params.appCode
  const result = await db.query.apps.findFirst({ where: eq(apps.code, appCode) })

  if (!result) {
    return res.status(401).json({ success: false, message: 'App Code is invalid' })
  }

  req.appId = Number(result.id)

  next()
}
