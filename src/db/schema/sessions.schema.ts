import {
  mysqlTable,
  int,
  varchar,
  boolean,
  datetime,
  uniqueIndex,
  timestamp,
  bigint
} from 'drizzle-orm/mysql-core'
import { users } from './users.schema'
import { relations } from 'drizzle-orm'

export const sessions = mysqlTable(
  'sessions',
  {
    id: int({ unsigned: true }).notNull().autoincrement().primaryKey(),
    userId: bigint('userId', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    refreshToken: varchar({ length: 255 }).notNull().unique(),
    ipAddress: varchar({ length: 255 }).notNull(),
    userAgent: varchar({ length: 1024 }).notNull(),
    expiryDate: datetime({ mode: 'date' }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    isActive: boolean().notNull().default(true)
  },
  (t) => [uniqueIndex('unique_session_refresh_token').on(t.refreshToken)]
)

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] })
}))
