import {
  boolean,
  text,
  uniqueIndex,
  varchar,
  pgTable,
  serial,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { groupRoles } from './groupRoles.schema';
import { resources } from './resources.schema';
import { lower } from 'src/common/utils/schema.util';

export const groups = pgTable(
  'groups',
  {
    id: serial().primaryKey(),
    name: varchar({ length: 50 }).notNull(),
    description: text(),
    isActive: boolean().notNull().default(true),
  },
  (t) => [uniqueIndex('unique_app_group_name').on(lower(t.name))],
);

export const groupRelations = relations(groups, ({ many }) => ({
  resources: many(resources),
  groupRoles: many(groupRoles),
}));
