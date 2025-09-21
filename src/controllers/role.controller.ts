import { Request, Response } from 'express'
import { extractAppId, getFilters, getPagination, paginateFilter } from '../utils/request.util'
import { and, eq, like, SQL } from 'drizzle-orm'
import { roles } from '../db/schema/roles.schema'
import { db } from '../db'

export const roleController = {
  getAllRoles: async (req: Request, res: Response) => {
    const { keyword, pageNum, pageSize, activeOnly } = getFilters(req)

    const appId = await extractAppId(req)

    if (!appId) {
      return res
        .status(400)
        .json({ success: false, message: 'App ID is required to create action' })
    }

    const conditions: (SQL<unknown> | undefined)[] = []

    if (keyword) {
      conditions.push(like(roles.name, `%${keyword}%`))
    }

    if (activeOnly) {
      conditions.push(eq(roles.isActive, true))
    }

    conditions.push(eq(roles.appId, appId))

    const whereClause = { where: conditions.length > 0 ? and(...conditions) : undefined }

    const result = await db.query.roles.findMany({
      ...whereClause,
      extras: {
        total: db.$count(roles).as('total')
      },
      ...paginateFilter(pageSize, pageNum)
    })

    const totalItems = result && result.length > 0 ? (result[0] as any).total : 0

    const message = result.length ? 'Roles fetched successfully' : 'No roles found'

    res.status(200).json({
      success: true,
      message,
      data: result,
      pagination: getPagination(totalItems, pageNum, pageSize)
    })
  },
  getRoleById: async (req: Request, res: Response) => {
    const appId = await extractAppId(req)

    if (!appId) {
      return res
        .status(400)
        .json({ success: false, message: 'App ID is required to create action' })
    }

    const roleId = Number(req.params.id)

    const { activeOnly } = getFilters(req)

    const conditions: (SQL<unknown> | undefined)[] = []

    if (activeOnly) {
      conditions.push(eq(roles.isActive, true))
    }

    conditions.push(eq(roles.appId, appId))

    conditions.push(eq(roles.id, roleId))

    const whereClause = { where: conditions.length > 0 ? and(...conditions) : undefined }

    const result = await db.query.roles.findFirst({
      ...whereClause
    })

    const message = result ? 'Role fetched successfully' : 'Role not found'

    res.status(200).json({ success: true, message, data: result })
  },
  createRole: async (req: Request, res: Response) => {
    const appId = await extractAppId(req)

    if (!appId) {
      return res
        .status(400)
        .json({ success: false, message: 'App ID is required to create action' })
    }

    const searchResult = await db.query.roles.findFirst({
      where: and(eq(roles.appId, appId), eq(roles.name, req.body.name))
    })

    if (searchResult) {
      return res.status(400).json({
        success: false,
        message: 'Role already exists'
      })
    }

    const newRole = {
      ...req.body,
      appId
    }

    const result = await db.insert(roles).values(newRole)

    res.status(201).json({ success: true, message: 'Role created successfully', data: result })
  },

  updateRole: async (req: Request, res: Response) => {
    const roleId = Number(req.params.id)

    const searchResult = await db.query.roles.findFirst({
      columns: { id: true },
      where: eq(roles.id, roleId)
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this ID'
      })
    }

    const result = await db.update(roles).set(req.body).where(eq(roles.id, roleId))

    res.status(200).json({ success: true, message: `Updated role with ID ${roleId}`, data: result })
  },
  deleteRole: async (req: Request, res: Response) => {
    const roleId = Number(req.params.id)
    const whereClause = eq(roles.id, roleId)

    const isHardDelete = req.body?.hard

    const searchResult = await db.query.roles.findFirst({
      columns: { id: true },
      where: whereClause
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'Role not found with this ID'
      })
    }

    if (!isHardDelete) {
      const result = await db.update(roles).set({ isActive: false }).where(whereClause)

      return res
        .status(200)
        .json({ success: true, message: `Deleted role with ID ${roleId}`, data: result })
    }

    const result = await db.delete(roles).where(whereClause)

    return res
      .status(200)
      .json({ success: true, message: `Deleted role with ID ${roleId}`, data: result })
  }
}
