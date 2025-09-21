import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  timestamp,
  varchar,
  integer,
  pgTable,
  bigserial,
} from 'drizzle-orm/pg-core';
import { profiles } from './profiles.schema';
import { sessions } from './sessions.schema';
import { groupRoles } from './groupRoles.schema';
import { resourceRoles } from './resourceRoles.schema';
import { roles } from './roles.schema';
import { lower } from 'src/common/utils/schema.util';
import { uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: bigserial({ mode: 'number' }).primaryKey(),
    username: varchar({ length: 50 }).notNull().unique(),
    email: varchar({ length: 100 }).notNull().unique(),
    roleId: integer().references(() => roles.id, {
      onDelete: 'set null',
    }),
    password: varchar({ length: 255 }).notNull(),
    isActive: boolean().notNull().default(true),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('unique_user_username').on(lower(t.username)),
    uniqueIndex('unique_user_email').on(lower(t.email)),
    index('idx_user_username').on(lower(t.username)),
    index('idx_user_email').on(lower(t.email)),
  ],
);

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  sessions: many(sessions),
  groupRoles: many(groupRoles),
  resourceRoles: many(resourceRoles),
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));
