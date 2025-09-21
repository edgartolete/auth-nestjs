import {
  boolean,
  index,
  int,
  mysqlTable,
  text,
  tinyint,
  uniqueIndex,
  varchar
} from 'drizzle-orm/mysql-core'
import { apps } from './apps.schema'
import { groups } from './groups.schema'
import { relations } from 'drizzle-orm'
import { resourceRoles } from './resourceRoles.schema'
import { lower } from '../../utils/schema.util'
import { resourceRolePermissions } from './resourceRolePermissions.schema'

export const resources = mysqlTable(
  'resources',
  {
    id: int({ unsigned: true }).notNull().autoincrement().primaryKey(),
    appId: tinyint({ unsigned: true })
      .notNull()
      .references(() => apps.id, { onDelete: 'restrict' }),
    groupId: int({ unsigned: true }).references(() => groups.id, { onDelete: 'set null' }),
    name: varchar({ length: 50 }).notNull(),
    description: text(),
    isActive: boolean().notNull().default(true)
  },
  (t) => [
    uniqueIndex('unique_app_resource').on(t.appId, t.groupId, lower(t.name)),
    index('idx_resources_group').on(t.groupId)
  ]
)

export const resourceRelations = relations(resources, ({ one, many }) => ({
  group: one(groups, {
    fields: [resources.groupId],
    references: [groups.id]
  }),
  resourceRoles: many(resourceRoles),
  resourceRolePermissions: many(resourceRolePermissions),
  app: one(apps, {
    fields: [resources.appId],
    references: [apps.id]
  })
}))
