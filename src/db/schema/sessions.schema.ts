import {
  pgTable,
  varchar,
  boolean,
  date,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { relations } from 'drizzle-orm';
import { bigserial } from 'drizzle-orm/pg-core';

export const sessions = pgTable(
  'sessions',
  {
    id: bigserial({ mode: 'number' }),
    userId: bigserial({ mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    refreshToken: varchar({ length: 255 }).notNull().unique(),
    ipAddress: varchar({ length: 255 }).notNull(),
    userAgent: varchar({ length: 1024 }).notNull(),
    expiryDate: date().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    isActive: boolean().notNull().default(true),
  },
  (t) => [uniqueIndex('unique_session_refresh_token').on(t.refreshToken)],
);

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
