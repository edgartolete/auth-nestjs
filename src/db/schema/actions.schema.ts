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
import { relations } from 'drizzle-orm'
import { resourceRolePermissions } from './resourceRolePermissions.schema'

export const actions = mysqlTable(
  'actions',
  {
    id: int({ unsigned: true }).notNull().autoincrement().primaryKey(),
    appId: tinyint({ unsigned: true })
      .notNull()
      .references(() => apps.id, { onDelete: 'restrict' }),
    code: varchar({ length: 10 }).notNull(),
    description: text(),
    isActive: boolean().notNull().default(true)
  },
  (t) => [
    uniqueIndex('unique_app_action_code').on(t.appId, t.code),
    index('idx_action_code').on(t.code)
  ]
)

export const actionRelations = relations(actions, ({ one, many }) => ({
  resourcePolePermissions: many(resourceRolePermissions),
  app: one(apps, {
    fields: [actions.appId],
    references: [apps.id]
  })
}))
