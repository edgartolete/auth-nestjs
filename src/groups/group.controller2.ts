import { Request, Response } from 'express'
import { db } from '../db'
import { extractAppId, getFilters, getPagination, paginateFilter } from '../utils/request.util'
import { and, eq, like, or, SQL } from 'drizzle-orm'
import { groups } from '../db/schema/groups.schema'
import { users } from '../db/schema/users.schema'
import { groupRoles } from '../db/schema/groupRoles.schema'

export const groupController = {
  getAllGroups: async (req: Request, res: Response) => {
    const { keyword, pageNum, pageSize, activeOnly } = getFilters(req)

    const appId = await extractAppId(req)

    if (!appId) {
      return res
        .status(400)
        .json({ success: false, message: 'App ID is required to create action' })
    }

    const conditions: (SQL<unknown> | undefined)[] = []

    if (keyword) {
      conditions.push(
        or(like(groups.name, `%${keyword}%`), like(groups.description, `%${keyword}%`))
      )
    }

    if (activeOnly) {
      conditions.push(eq(groups.isActive, true))
    }

    conditions.push(eq(groups.appId, appId))

    const result = await db.query.groups.findMany({
      where: and(...conditions),
      extras: {
        total: db.$count(groups).as('total')
      },
      ...paginateFilter(pageSize, pageNum)
    })

    const totalItems = result && result.length > 0 ? (result[0] as any).total : 0

    const message = result.length ? 'Groups fetched successfully' : 'No resources found'

    res.status(200).json({
      success: true,
      message,
      data: result,
      pagination: getPagination(totalItems, pageNum, pageSize)
    })
  },
  getGroupById: async (req: Request, res: Response) => {
    const appId = await extractAppId(req)

    if (!appId) {
      return res
        .status(400)
        .json({ success: false, message: 'App ID is required to create action' })
    }

    const groupId = Number(req.params.groupId)

    const { activeOnly } = getFilters(req)

    const conditions: (SQL<unknown> | undefined)[] = []

    if (activeOnly) {
      conditions.push(eq(groups.isActive, true))
    }

    conditions.push(eq(groups.appId, appId))

    conditions.push(eq(groups.id, groupId))

    const result = await db.query.groups.findFirst({
      where: and(...conditions)
    })

    if (!result) {
      return res.status(400).json({ success: false, message: 'Group not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Group fetched successfully',
      data: result
    })
  },
  createGroup: async (req: Request, res: Response) => {
    const appId = await extractAppId(req)

    if (!appId) {
      return res
        .status(400)
        .json({ success: false, message: 'App ID is required to create action' })
    }

    const searchResult = await db.query.groups.findFirst({
      where: and(eq(groups.appId, appId), eq(groups.name, req.body.name))
    })

    if (searchResult) {
      return res.status(400).json({
        success: false,
        message: 'group with this code already exists'
      })
    }

    const newGroup = {
      ...req.body,
      appId
    }

    const result = await db.insert(groups).values(newGroup).$returningId()

    res.status(201).json({ success: true, message: 'Group created successfully', data: result })
  },
  updateGroup: async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId)
    const whereClause = eq(groups.id, groupId)

    const searchResult = await db.query.groups.findFirst({
      columns: { id: true },
      where: whereClause
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'Group not found with this ID'
      })
    }

    await db.update(groups).set(req.body).where(whereClause)

    return res.status(200).json({ success: true, message: `Updated group with ID ${groupId}` })
  },
  deleteGroup: async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId)

    const isHardDelete = req.body?.hard

    const whereClause = eq(groups.id, groupId)

    const searchResult = await db.query.groups.findFirst({
      columns: { id: true },
      where: whereClause
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'Group not found with this ID'
      })
    }

    if (!isHardDelete) {
      await db.update(groups).set({ isActive: false }).where(whereClause)
      return res
        .status(200)
        .json({ success: true, message: `Soft deleted user with ID ${groupId}` })
    }

    await db.delete(groups).where(whereClause)

    return res.status(200).json({ success: true, message: `Deleted user with ID ${groupId}` })
  },
  getGroupUsers: async (req: Request, res: Response) => {
    const { keyword, pageNum, pageSize, activeOnly } = getFilters(req)

    const groupId = Number(req.params.groupId)

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'GroupId is required'
      })
    }

    const conditions: (SQL<unknown> | undefined)[] = []

    if (activeOnly) {
      conditions.push(eq(users.isActive, true))
    }

    if (keyword) {
      conditions.push(like(users.username, `%${keyword}%`))
    }

    conditions.push(eq(groupRoles.userId, users.id))

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0]

    const result = await db
      .select({
        users,
        total: db.$count(groupRoles, eq(groupRoles.groupId, groupId)).as('total')
      })
      .from(groupRoles)
      .where(eq(groupRoles.groupId, groupId))
      .leftJoin(users, whereClause)
      .limit(pageSize)
      .offset(pageNum - 1)

    const totalItems = result && result.length > 0 ? (result[0] as any).total : 0

    const data = result.map((i) => i.users) ?? []

    const message = result.length ? 'Groups fetched successfully' : 'No groups user found'

    res.status(200).json({
      success: true,
      message,
      data,
      pagination: getPagination(totalItems, pageNum, pageSize)
    })
  },
  addGroupUsers: async (req: Request, res: Response) => {
    await db.insert(groupRoles).values({ ...req.body, groupId: Number(req.params.groupId) })
    return res.status(200).json({ success: true, message: 'Users added to group' })
  },
  updateGroupUsers: async (req: Request, res: Response) => {
    await db
      .update(groupRoles)
      .set(req.body)
      .where(
        and(
          eq(groupRoles.groupId, Number(req.params.groupId)),
          eq(groupRoles.userId, Number(req.params.userId))
        )
      )

    return res.status(200).json({ success: true, message: 'Group user updated' })
  },
  removeGroupUsers: async (req: Request, res: Response) => {
    await db
      .delete(groupRoles)
      .where(
        and(
          eq(groupRoles.id, Number(req.params.groupRoleId)),
          eq(groupRoles.groupId, Number(req.params.groupId))
        )
      )
    return res.status(200).json({ success: true })
  }
}
