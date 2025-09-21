import { pgTable, varchar, date, bigint, index } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { relations } from 'drizzle-orm';
import { bigserial } from 'drizzle-orm/pg-core';

export const profiles = pgTable(
  'profiles',
  {
    id: bigserial({ mode: 'number' }),
    userId: bigint({ mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    avatarUrl: varchar({ length: 255 }),
    avatarKey: varchar({ length: 255 }),
    firstName: varchar({ length: 255 }),
    lastName: varchar({ length: 255 }),
    birthday: date(),
  },
  (t) => [index('idx_profile_user_id').on(t.userId)],
);

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));
