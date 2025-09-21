import { bigint, index, int, mysqlTable, timestamp, uniqueIndex } from 'drizzle-orm/mysql-core'
import { users } from './users.schema'
import { roles } from './roles.schema'
import { groups } from './groups.schema'
import { relations } from 'drizzle-orm'

export const groupRoles = mysqlTable(
  'groupRoles',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
    userId: bigint('userId', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: int({ unsigned: true })
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    groupId: int({ unsigned: true })
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    joinedAt: timestamp().defaultNow().notNull()
  },
  (t) => [
    uniqueIndex('unique_group_roles').on(t.userId, t.roleId, t.groupId),
    index('idx_group_roles_user_id').on(t.userId),
    index('idx_group_roles_role_id').on(t.roleId),
    index('idx_group_roles_group_id').on(t.groupId)
  ]
)

export const groupRolesRelations = relations(groupRoles, ({ one }) => ({
  user: one(users, {
    fields: [groupRoles.userId],
    references: [users.id]
  }),
  role: one(roles, {
    fields: [groupRoles.roleId],
    references: [roles.id]
  }),
  group: one(groups, {
    fields: [groupRoles.groupId],
    references: [groups.id]
  })
}))
