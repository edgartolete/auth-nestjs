import { rateLimit } from 'express-rate-limit'
import { config } from '../config'

const message = {
  success: false,
  message: 'Too many attempts. Please try again later.'
}

export const rateLimiter = {
  global: rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // allow 100 requests per 10 minutes per IP
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message
  }),
  auth: rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: config.isProduction ? 15 : 100, // allow 15 requests per 10 minutes per IP
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message
  })
}
