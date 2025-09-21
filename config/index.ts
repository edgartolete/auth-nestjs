import { Config } from './type'
import dotenv from 'dotenv'
dotenv.config({ quiet: true })

export const config: Config = {
  isProduction: process.env.NODE_ENV === 'production',
  auth: {
    register: {
      enabled: process.env.AUTH_REGISTER_ENABLED === 'true',
      emailVerify: true,
      codeGeneration: 'numbers',
      codeExpiry: 60 * 5 // 5 minutes
    },
    login: {
      accessTokenDuration: '15m',
      refreshTokenDuration: '1d',
      rememberMeDuration: '30d'
    }
  },
  pagination: {
    DEFAULT_PAGE_NUMBER: 1,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_ORDER: 'asc'
  },
  connectionTimeout: '10s'
}
