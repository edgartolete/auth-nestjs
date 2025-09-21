import { Request, Response, NextFunction } from 'express'
import { config } from '../config'
import { systemLogger } from './logger.util'

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

export class CustomErrorException extends Error {
  statusCode: number
  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
  }
}

export async function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const status = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  await systemLogger(req, { level: 'error', origin: 'errorHandler', message })

  if (req.timedout) {
    res.status(503).json({
      success: false,
      message: 'Request timed out',
      stack: !config.isProduction ? err.stack : undefined
    })
  }

  res.status(status).json({
    success: false,
    message,
    stack: !config.isProduction ? err.stack : undefined
  })
}

export async function errorCodeHandler() {
  return {
    '23503': 'Resource is in use and cannot be deleted',
    '23505': 'Duplicate resource exists'
  }
}
