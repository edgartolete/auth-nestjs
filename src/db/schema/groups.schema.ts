import {
  boolean,
  int,
  mysqlTable,
  text,
  tinyint,
  uniqueIndex,
  varchar
} from 'drizzle-orm/mysql-core'
import { apps } from './apps.schema'
import { relations } from 'drizzle-orm'
import { groupRoles } from './groupRoles.schema'
import { lower } from '../../utils/schema.util'
import { resources } from './resources.schema'

export const groups = mysqlTable(
  'groups',
  {
    id: int({ unsigned: true }).notNull().autoincrement().primaryKey(),
    appId: tinyint({ unsigned: true })
      .notNull()
      .references(() => apps.id, { onDelete: 'restrict' }),
    name: varchar({ length: 50 }).notNull(),
    description: text(),
    isActive: boolean().notNull().default(true)
  },
  (t) => [uniqueIndex('unique_app_group_name').on(t.appId, lower(t.name))]
)

export const groupRelations = relations(groups, ({ one, many }) => ({
  resources: many(resources),
  groupRoles: many(groupRoles),
  app: one(apps, {
    fields: [groups.appId],
    references: [apps.id]
  })
}))
