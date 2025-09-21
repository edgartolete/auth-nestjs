import {
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  serial,
  bigint,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { roles } from './roles.schema';
import { relations } from 'drizzle-orm';
import { resources } from './resources.schema';

export const resourceRoles = pgTable(
  'resourceRoles',
  {
    id: serial(),
    userId: bigint({ mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: integer()
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    resourceId: integer()
      .notNull()
      .references(() => resources.id, { onDelete: 'cascade' }),
    assignedAt: timestamp().defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('unique_resource_roles').on(t.userId, t.resourceId),
    index('idx_resource_role_user').on(t.userId),
    index('idx_resource_role_resource').on(t.resourceId),
  ],
);

export const resourceRolesRelations = relations(resourceRoles, ({ one }) => ({
  user: one(users, {
    fields: [resourceRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [resourceRoles.roleId],
    references: [roles.id],
  }),
  resource: one(resources, {
    fields: [resourceRoles.resourceId],
    references: [resources.id],
  }),
}));
