import { relations } from 'drizzle-orm'
import {
  bigint,
  boolean,
  index,
  int,
  mysqlTable,
  timestamp,
  tinyint,
  uniqueIndex,
  varchar
} from 'drizzle-orm/mysql-core'
import { profiles } from './profiles.schema'
import { sessions } from './sessions.schema'
import { apps } from './apps.schema'
import { groupRoles } from './groupRoles.schema'
import { resourceRoles } from './resourceRoles.schema'
import { lower } from '../../utils/schema.util'
import { roles } from './roles.schema'

export const users = mysqlTable(
  'users',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
    appId: tinyint({ unsigned: true })
      .notNull()
      .references(() => apps.id, { onDelete: 'restrict' }),
    username: varchar({ length: 50 }).notNull(),
    email: varchar({ length: 100 }).notNull(),
    roleId: int({ unsigned: true }).references(() => roles.id, { onDelete: 'set null' }),
    password: varchar({ length: 255 }).notNull(),
    isActive: boolean().notNull().default(true),
    createdAt: timestamp().defaultNow().notNull()
  },
  (t) => [
    uniqueIndex('unique_app_username').on(t.appId, lower(t.username)),
    uniqueIndex('unique_app_email').on(t.appId, lower(t.email)),
    index('idx_user_username').on(t.username),
    index('idx_user_email').on(t.email)
  ]
)

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  sessions: many(sessions),
  groupRoles: many(groupRoles),
  resourceRoles: many(resourceRoles),
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id]
  }),
  app: one(apps, {
    fields: [users.appId],
    references: [apps.id]
  })
}))
