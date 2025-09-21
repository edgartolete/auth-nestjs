import { index, integer, pgTable, uniqueIndex } from 'drizzle-orm/pg-core';
import { roles } from './roles.schema';
import { relations } from 'drizzle-orm';
import { resources } from './resources.schema';
import { actions } from './actions.schema';

export const resourceRolePermissions = pgTable(
  'resourceRolePermissions',
  {
    roleId: integer()
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    actionId: integer()
      .notNull()
      .references(() => actions.id, { onDelete: 'cascade' }),
    resourceId: integer()
      .notNull()
      .references(() => resources.id, { onDelete: 'cascade' }),
  },
  (t) => [
    uniqueIndex('unique_resource_role_permissions').on(
      t.roleId,
      t.actionId,
      t.resourceId,
    ),
    index('idx_resource_role_permissions_role').on(t.roleId),
    index('idx_resource_role_permissions_resource').on(t.resourceId),
  ],
);

export const rolePermissionRelations = relations(
  resourceRolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [resourceRolePermissions.roleId],
      references: [roles.id],
    }),
    action: one(actions, {
      fields: [resourceRolePermissions.actionId],
      references: [actions.id],
    }),
    resource: one(resources, {
      fields: [resourceRolePermissions.resourceId],
      references: [resources.id],
    }),
  }),
);
