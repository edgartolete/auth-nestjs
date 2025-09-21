import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  mysqlTable,
  text,
  tinyint,
  uniqueIndex,
  varchar
} from 'drizzle-orm/mysql-core'
import { users } from './users.schema'
import { roles } from './roles.schema'
import { resources } from './resources.schema'
import { groups } from './groups.schema'
import { actions } from './actions.schema'
import { lower } from '../../utils/schema.util'

export const apps = mysqlTable(
  'apps',
  {
    id: tinyint({ unsigned: true }).notNull().autoincrement().primaryKey(),
    code: varchar({ length: 10 }).notNull().unique(),
    name: varchar({ length: 50 }).notNull().unique(),
    description: text(),
    isActive: boolean().notNull().default(true)
  },
  (t) => [
    uniqueIndex('unique_apps_code').on(lower(t.code)),
    uniqueIndex('unique_apps_name').on(lower(t.name)),
    index('idx_app_code').on(t.code)
  ]
)

export const appRelations = relations(apps, ({ many }) => ({
  users: many(users),
  roles: many(roles),
  resources: many(resources),
  groups: many(groups),
  actions: many(actions)
}))
