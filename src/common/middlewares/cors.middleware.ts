import { config } from '../config'
import dotenv from 'dotenv'
dotenv.config({ quiet: true })

export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      // allow requests like curl/Postman or same-origin
      return callback(null, true)
    }

    if (config.isProduction) {
      const allowedDomains = (process.env.ALLOWED_DOMAINS || '').split(',').map((d) => d.trim())
      if (allowedDomains.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    } else {
      if (origin.startsWith(`http://localhost`) || origin.startsWith(`http://127.0.0.1`)) {
        return callback(null, true)
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
