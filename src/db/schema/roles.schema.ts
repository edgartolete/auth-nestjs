import { relations } from 'drizzle-orm';
import { integer, varchar, uniqueIndex, boolean } from 'drizzle-orm/pg-core';
import { groupRoles } from './groupRoles.schema';
import { resourceRoles } from './resourceRoles.schema';
import { resourceRolePermissions } from './resourceRolePermissions.schema';
import { users } from './users.schema';
import { pgTable } from 'drizzle-orm/pg-core';
import { lower } from 'src/common/utils/schema.util';

export const roles = pgTable(
  'roles',
  {
    id: integer().notNull().generatedAlwaysAsIdentity().primaryKey(),
    code: varchar({ length: 10 }).notNull(),
    name: varchar({ length: 50 }).notNull(),
    isActive: boolean().notNull().default(true),
  },
  (t) => [
    uniqueIndex('unique_app_role_code').on(lower(t.code)),
    uniqueIndex('unique_app_role_name').on(lower(t.name)),
  ],
);

export const roleRelations = relations(roles, ({ many }) => ({
  users: many(users),
  groupRoles: many(groupRoles),
  resourceRoles: many(resourceRoles),
  resourceRolePermissions: many(resourceRolePermissions),
}));
