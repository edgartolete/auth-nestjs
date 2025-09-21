import { Request } from 'express'

type SystemLog = {
  level: 'error' | 'warn' | 'info' | 'debug'
  origin: string
  message?: string
  payload?: Record<string, any>
}

export async function systemLogger(req: Request, log: SystemLog) {
  const data = {
    ...log,
    userId: Number(req.user?.id) || 0,
    ip: req.ip,
    path: req.originalUrl
  }
  console.log('systemLog: ', data)
}
