import { Request, Response } from 'express'
import { db } from '../db'
import { apps } from '../db/schema/apps.schema'
import dotenv from 'dotenv'
import { config } from '../config'
import { generateRandomCode } from '../utils/helpers.util'
import { redisClient } from '../services/cache.service'
import { sendVerificationCode } from '../services/email.service'
import { generateSuperAccessToken } from '../utils/token.util'
import ms from 'ms'
import { and, eq, like, or, SQL } from 'drizzle-orm'
import { getFilters, getPagination, paginateFilter } from '../utils/request.util'
dotenv.config({ quiet: true })

export const appController = {
  getAllApps: async (req: Request, res: Response) => {
    const { keyword, pageNum, pageSize, activeOnly } = getFilters(req)

    const conditions: (SQL<unknown> | undefined)[] = []

    if (keyword) {
      conditions.push(
        or(
          like(apps.code, `%${keyword}%`),
          like(apps.name, `%${keyword}%`),
          like(apps.description, `%${keyword}%`)
        )
      )
    }

    if (activeOnly) {
      conditions.push(eq(apps.isActive, true))
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0]

    const result = await db.query.apps.findMany({
      where: whereClause,
      extras: {
        total: db.$count(apps).as('total')
      },
      ...paginateFilter(pageSize, pageNum)
    })

    const totalItems = result && result.length > 0 ? (result[0] as any).total : 0

    return res.status(200).json({
      success: true,
      message: 'Apps fetched successfully',
      data: result,
      pagination: getPagination(totalItems, pageNum, pageSize)
    })
  },
  getAppById: async (req: Request, res: Response) => {
    const { activeOnly } = getFilters(req)

    const conditions: (SQL<unknown> | undefined)[] = []

    if (activeOnly) {
      conditions.push(eq(apps.isActive, true))
    }

    conditions.push(eq(apps.code, req.params.appCode))

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0]

    const result = await db.query.apps.findFirst({
      where: whereClause
    })

    return res
      .status(200)
      .json({ success: true, message: 'App fetched successfully', data: result })
  },
  createApp: async (req: Request, res: Response) => {
    await db.insert(apps).values(req.body).$returningId()
    res.status(201).json({ success: true, message: 'App created successfully' })
  },
  updateApp: async (req: Request, res: Response) => {
    const result = await db.update(apps).set(req.body).where(eq(apps.code, req.params.appCode))

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'App not found with this code' })
    }
    return res
      .status(200)
      .json({ success: true, message: `Updated app with code ${req.params.appCode}` })
  },
  deleteApp: async (req: Request, res: Response) => {
    const result = await db.delete(apps).where(eq(apps.code, req.params.appCode))

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'App not found with this code' })
    }
    return res
      .status(200)
      .json({ success: true, message: `Deleted app with code ${req.params.appCode}` })
  },
  login: async (req: Request, res: Response) => {
    const { username, email, password, code } = req.body

    const spUsername = process.env.SUPER_ADMIN_USER
    const spEmail = process.env.SUPER_ADMIN_EMAIL
    const spPassword = process.env.SUPER_ADMIN_PASS

    if (!spUsername || !spEmail || !spPassword) {
      return res
        .status(500)
        .json({ success: false, message: 'Super admin not configured properly' })
    }

    if (!code) {
      let generatedCode = ''

      generatedCode = generateRandomCode()

      await redisClient.setex(`sp-login`, config.auth.register.codeExpiry, generatedCode)

      const sendResponse = await sendVerificationCode(spEmail, generatedCode)

      if (sendResponse.error) {
        return res.status(400).json({ success: false, message: 'Failed to send email' })
      }

      return res.status(200).json({ success: true, message: 'Verification code sent' })
    }

    const cachedCode = await redisClient.get(`sp-login`)

    if (!!code && cachedCode !== code) {
      return res.status(400).json({ success: false, message: 'Invalid or expired code' })
    }

    if (username !== spUsername || email !== spEmail || password !== spPassword) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' })
    }

    await redisClient.del(`sp-login`)

    const accessToken = generateSuperAccessToken()

    const ttlSeconds = ms(config.auth.login.accessTokenDuration) / 1000

    await redisClient.setex(`sp-access`, ttlSeconds, accessToken)

    res.status(200).json({ success: true, message: 'User logged in successfully', accessToken })
  },
  logout: async (_req: Request, res: Response) => {
    await redisClient.del(`sp-access`)

    return res.status(200).json({ success: true, message: 'User logged out successfully' })
  }
}
