import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  integer,
  bigint,
  serial,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { roles } from './roles.schema';
import { groups } from './groups.schema';
import { relations } from 'drizzle-orm';

export const groupRoles = pgTable(
  'groupRoles',
  {
    id: serial().primaryKey(),
    userId: bigint({ mode: 'number' })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    roleId: integer()
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    groupId: integer()
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    joinedAt: timestamp().defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('unique_group_roles').on(t.userId, t.roleId, t.groupId),
    index('idx_group_roles_user_id').on(t.userId),
    index('idx_group_roles_role_id').on(t.roleId),
    index('idx_group_roles_group_id').on(t.groupId),
  ],
);

export const groupRolesRelations = relations(groupRoles, ({ one }) => ({
  user: one(users, {
    fields: [groupRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [groupRoles.roleId],
    references: [roles.id],
  }),
  group: one(groups, {
    fields: [groupRoles.groupId],
    references: [groups.id],
  }),
}));
