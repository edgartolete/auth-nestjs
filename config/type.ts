export type Config = {
  isProduction: boolean
  auth: {
    register: {
      enabled: boolean
      emailVerify: boolean
      codeGeneration?: 'numbers' | 'random'
      codeExpiry: number | string
    }
    login: {
      accessTokenDuration: DurationString
      refreshTokenDuration: DurationString
      rememberMeDuration: DurationString
    }
  }
  pagination: {
    DEFAULT_PAGE_NUMBER: number
    DEFAULT_PAGE_SIZE: number
    DEFAULT_ORDER: 'asc' | 'desc'
  }
  connectionTimeout: string
}

type DurationString = `${number}${'s' | 'm' | 'h' | 'd' | 'w'}`
