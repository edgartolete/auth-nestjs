import {
  boolean,
  index,
  text,
  varchar,
  serial,
  pgTable,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { resourceRolePermissions } from './resourceRolePermissions.schema';

export const actions = pgTable(
  'actions',
  {
    id: serial().primaryKey(),
    code: varchar({ length: 10 }).notNull(),
    description: text(),
    isActive: boolean().notNull().default(true),
  },
  (t) => [index('idx_action_code').on(t.code)],
);

export const actionRelations = relations(actions, ({ many }) => ({
  resourcePolePermissions: many(resourceRolePermissions),
}));
