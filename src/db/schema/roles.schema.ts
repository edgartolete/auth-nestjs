import { relations } from 'drizzle-orm'
import { mysqlTable, int, varchar, uniqueIndex, boolean, tinyint } from 'drizzle-orm/mysql-core'
import { apps } from './apps.schema'
import { groupRoles } from './groupRoles.schema'
import { resourceRoles } from './resourceRoles.schema'
import { lower } from '../../utils/schema.util'
import { resourceRolePermissions } from './resourceRolePermissions.schema'
import { users } from './users.schema'

//ROLES: admin | operator
export const roles = mysqlTable(
  'roles',
  {
    id: int({ unsigned: true }).notNull().autoincrement().primaryKey(),
    appId: tinyint({ unsigned: true })
      .notNull()
      .references(() => apps.id, { onDelete: 'restrict' }),
    code: varchar({ length: 10 }).notNull(),
    name: varchar({ length: 50 }).notNull(),
    isActive: boolean().notNull().default(true)
  },
  (t) => [
    uniqueIndex('unique_app_role_code').on(t.appId, lower(t.code)),
    uniqueIndex('unique_app_role_name').on(t.appId, lower(t.name))
  ]
)

export const roleRelations = relations(roles, ({ one, many }) => ({
  users: many(users),
  groupRoles: many(groupRoles),
  resourceRoles: many(resourceRoles),
  resourceRolePermissions: many(resourceRolePermissions),
  app: one(apps, {
    fields: [roles.appId],
    references: [apps.id]
  })
}))
