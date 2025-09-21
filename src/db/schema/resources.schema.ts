import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  varchar,
  serial,
} from 'drizzle-orm/pg-core';
import { groups } from './groups.schema';
import { relations } from 'drizzle-orm';
import { resourceRoles } from './resourceRoles.schema';
import { resourceRolePermissions } from './resourceRolePermissions.schema';
import { lower } from 'src/common/utils/schema.util';

export const resources = pgTable(
  'resources',
  {
    id: serial().primaryKey(),
    groupId: integer().references(() => groups.id, { onDelete: 'set null' }),
    name: varchar({ length: 50 }).notNull(),
    description: text(),
    isActive: boolean().notNull().default(true),
  },
  (t) => [
    uniqueIndex('unique_app_resource').on(t.groupId, lower(t.name)),
    index('idx_resources_group').on(t.groupId),
  ],
);

export const resourceRelations = relations(resources, ({ one, many }) => ({
  group: one(groups, {
    fields: [resources.groupId],
    references: [groups.id],
  }),
  resourceRoles: many(resourceRoles),
  resourceRolePermissions: many(resourceRolePermissions),
}));
