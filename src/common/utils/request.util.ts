import { Request } from 'express'
import { config } from '../config'
import { redisClient } from '../services/cache.service'
import { db } from '../db'
import { eq } from 'drizzle-orm'
import { apps } from '../db/schema/apps.schema'

export function paginateFilter(pageSize: number, pageNum: number) {
  return {
    limit: Math.round(pageSize),
    offset: Math.round((pageNum - 1) * pageSize)
  }
}

export function getFilters(req: Request) {
  const keyword = req.query.keyword as string | undefined
  const pageNum = Number(req.query.pageNum) || config.pagination.DEFAULT_PAGE_NUMBER
  const pageSize = Number(req.query.pageSize) || config.pagination.DEFAULT_PAGE_SIZE
  const order = req.query.orderBy || config.pagination.DEFAULT_ORDER
  const activeOnly = req.query.activeOnly !== 'false'

  return {
    keyword,
    pageNum,
    pageSize,
    order,
    activeOnly
  }
}

export function getPagination(totalItems: number, pageNum: number, pageSize: number) {
  return {
    totalItems,
    page: pageNum,
    pageSize: pageSize,
    totalPages: Math.ceil(totalItems / pageSize),
    hasNextPage: totalItems > pageNum * pageSize,
    hasPreviousPage: pageNum > 1
  }
}

export function extractTokenFromHeader(request: Request): string | null {
  const [type, token] = request?.headers?.authorization?.split(' ') ?? []
  return type === 'Bearer' ? token : null
}

export async function extractAppId(req: Request) {
  const isSuperAdmin = await checkSuperAdmin(req)

  if (!isSuperAdmin && !req.user?.appId) return null

  if (isSuperAdmin && !req.body?.appId) {
    const result = await db.query.apps.findFirst({
      where: eq(apps.code, req.params.appCode)
    })

    if (!result) return null

    return result.id
  }

  return req.user?.appId || req.body?.appId
}

export async function checkSuperAdmin(req: Request) {
  const accessToken = extractTokenFromHeader(req)

  const storedToken = await redisClient.get(`sp-access`)

  return accessToken === storedToken
}
