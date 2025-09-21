import { NextFunction, Request, Response } from 'express'

export function validateQueryParams(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: JSON.parse(result.error.message)
      })
    }
    next()
  }
}

export function validateBody(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid body properties',
        errors: JSON.parse(result.error.message)
      })
    }
    next()
  }
}
