import { Request, Response } from 'express'
import { db } from '../db'
import { and, eq, like, or, SQL } from 'drizzle-orm'
import { users } from '../db/schema/users.schema'
import { extractAppId, getFilters, getPagination, paginateFilter } from '../utils/request.util'
import { profiles } from '../db/schema/profiles.schema'
import * as bcrypt from 'bcrypt'
import { deleteSingleFile } from '../services/storage.service'
import { systemLogger } from '../utils/logger.util'
import { alias } from 'drizzle-orm/mysql-core'
import { roles } from '../db/schema/roles.schema'
import { resourceRoles } from '../db/schema/resourceRoles.schema'
import { resources } from '../db/schema/resources.schema'
import { resourceRolePermissions } from '../db/schema/resourceRolePermissions.schema'
import { groups } from '../db/schema/groups.schema'
import { groupRoles } from '../db/schema/groupRoles.schema'
import { actions } from '../db/schema/actions.schema'
import { redisClient } from '../services/cache.service'

export const userController = {
  getAllUsers: async (req: Request, res: Response) => {
    const { keyword, pageNum, pageSize, activeOnly } = getFilters(req)

    const appId = await extractAppId(req)

    if (!appId) {
      return res.status(400).json({ success: false, message: 'App ID is required' })
    }

    const conditions: (SQL<unknown> | undefined)[] = []

    if (keyword) {
      conditions.push(or(like(users.username, `%${keyword}%`), like(users.email, `%${keyword}%`)))
    }

    if (activeOnly) {
      conditions.push(eq(users.isActive, true))
    }

    conditions.push(eq(users.appId, appId))

    const result = await db.query.users.findMany({
      where: and(...conditions),
      with: {
        profile: true
      },
      extras: {
        total: db.$count(users).as('total')
      },
      ...paginateFilter(pageSize, pageNum)
    })

    const totalItems = result && result.length > 0 ? (result[0] as any).total : 0

    const message = result.length ? 'Users fetched successfully' : 'No users found'

    res.status(200).json({
      success: true,
      message,
      data: result,
      pagination: getPagination(totalItems, pageNum, pageSize)
    })
  },
  getUserById: async (req: Request, res: Response) => {
    const userId = Number(req.params.id)

    const { activeOnly } = getFilters(req)

    const appId = await extractAppId(req)

    if (!appId) {
      return res.status(400).json({ success: false, message: 'App ID is required' })
    }

    const conditions: (SQL<unknown> | undefined)[] = []

    if (activeOnly) {
      conditions.push(eq(users.isActive, true))
    }

    if (appId) {
      conditions.push(eq(users.appId, appId))
    }

    conditions.push(eq(users.id, userId))

    const result = await db.query.users.findFirst({
      columns: { id: true, username: true, email: true, createdAt: true },
      where: and(...conditions),
      with: {
        profile: true
      }
    })

    if (!result) {
      return res.status(400).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: result
    })
  },
  createUser: async (req: Request, res: Response) => {
    const appId = await extractAppId(req)

    if (!appId) {
      return res.status(400).json({ success: false, message: 'App ID is required' })
    }

    const searchResult = await db.query.users.findFirst({
      where: and(
        eq(users.appId, appId),
        or(eq(users.username, req.body.username), eq(users.email, req.body.email))
      )
    })

    if (searchResult) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      })
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    const newUser = {
      ...req.body,
      appId,
      password: hashedPassword
    }

    const result = await db.insert(users).values(newUser)

    const userId = result[0].insertId

    await db.insert(profiles).values({ userId })

    return res
      .status(201)
      .json({ success: true, message: 'User created successfully', data: result })
  },
  updateUser: async (req: Request, res: Response) => {
    const appId = await extractAppId(req)

    if (!appId) {
      return res.status(400).json({ success: false, message: 'App ID is required' })
    }

    const userId = Number(req.params.id)

    const whereClause = and(eq(users.id, userId), eq(users.appId, appId))

    const searchResult = await db.query.users.findFirst({
      columns: { id: true },
      where: whereClause
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this ID'
      })
    }

    const roleKey = `root-role:${req.appId}:${userId}`

    const storedRoles = await redisClient.get(roleKey)

    const updatedUser = {
      ...req.body,
      roleId: storedRoles === 'admin' || storedRoles == 'superadmin' ? req.body.roleId : undefined
    }

    await db.update(users).set(updatedUser).where(whereClause)

    return res.status(200).json({ success: true, message: `Updated user with ID ${userId}` })
  },
  deleteUser: async (req: Request, res: Response) => {
    const userId = Number(req.params.id)
    const appId = await extractAppId(req)

    if (!appId) {
      return res.status(400).json({ success: false, message: 'App ID is required' })
    }

    const whereClause = and(eq(users.id, userId), eq(users.appId, appId))

    const isHardDelete = req.body?.hard

    const searchResult = await db.query.users.findFirst({
      columns: { id: true },
      with: {
        profile: true
      },
      where: whereClause
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this ID'
      })
    }

    if (!isHardDelete) {
      await db.update(users).set({ isActive: false }).where(whereClause)
      return res.status(200).json({ success: true, message: `Soft deleted user with ID ${userId}` })
    }

    const profileAvatarKey = searchResult.profile?.avatarKey

    if (profileAvatarKey) {
      const result = await deleteSingleFile(profileAvatarKey)

      if (!result.success) {
        await systemLogger(req, {
          level: 'error',
          origin: 'userController.deleteUser',
          message: `failed to delete aws file`,
          payload: { params: req.params, result }
        })
      }
    }

    await db.delete(users).where(whereClause)

    return res.status(200).json({ success: true, message: `Deleted user with ID ${userId}` })
  },
  getRoles: async (req: Request, res: Response) => {
    const { groups, resources } = await userController.queryRoles(Number(req.params.id))
    return res
      .status(200)
      .json({ success: true, message: 'Roles fetched successfully', data: { groups, resources } })
  },
  queryRoles: async (userId: number) => {
    const groupRole = alias(roles, 'groupRole')
    const resourceRole = alias(roles, 'resourceRole')

    const rowsResources = await db
      .select({
        resourceRoles,
        resources,
        resourceRolePermissions,
        groups,
        groupRoles,
        actions,
        resourceRole
      })
      .from(resourceRoles)
      .where(eq(resourceRoles.userId, userId))
      .leftJoin(resources, eq(resourceRoles.resourceId, resources.id))
      .leftJoin(resourceRolePermissions, eq(resources.id, resourceRolePermissions.resourceId))
      .leftJoin(groups, eq(groups.id, resources.groupId))
      .leftJoin(groupRoles, eq(groupRoles.groupId, groups.id))
      .leftJoin(resourceRole, eq(resourceRoles.roleId, resourceRole.id))
      .leftJoin(
        actions,
        and(
          eq(actions.id, resourceRolePermissions.actionId),
          eq(resourceRole.id, resourceRolePermissions.roleId)
        )
      )

    const nestedResources = Object.values(
      rowsResources.reduce(
        (acc, row) => {
          const rr = row.resourceRoles
          const res = row.resources
          const perm = row.resourceRolePermissions
          const gp = row.groups
          const act = row.actions
          const rrl = row.resourceRole

          if (res && rr && !acc[rr!.id]) {
            acc[rr!.id] = {
              id: res.id,
              name: res.name,
              resourceRole: rrl ? { id: rrl.id, code: rrl.code, name: rrl.name } : null,
              group: gp ? { id: gp.id, name: gp.name } : null,
              resourceRolePermissions: []
            }
          }

          if (perm && act) {
            acc[rr!.id].resourceRolePermissions.push(act.code)
          }

          return acc
        },
        {} as Record<number, any>
      )
    )

    const rowsGroups = await db
      .select({
        groupRoles,
        groups,
        groupRole
      })
      .from(groupRoles)
      .where(eq(groupRoles.userId, userId))
      .leftJoin(groups, eq(groups.id, groupRoles.groupId))
      .leftJoin(groupRole, eq(groupRole.id, groupRoles.roleId))

    const nestedGroups = Object.values(
      rowsGroups.reduce(
        (acc, row) => {
          const gls = row.groupRoles
          const gp = row.groups
          const gr = row.groupRole

          if (gls && gp && !acc[gls!.id]) {
            acc[gls!.id] = {
              id: gp.id,
              name: gp.name,
              role: gr
                ? {
                    id: gr?.id,
                    code: gr?.code,
                    name: gr?.name
                  }
                : null
            }
          }

          return acc
        },
        {} as Record<number, any>
      )
    )

    return { resources: nestedResources, groups: nestedGroups }
  }
}
