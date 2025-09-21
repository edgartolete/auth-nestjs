import { sql } from 'drizzle-orm'
import { db } from '..'
import { users } from '../schema/users.schema'

export async function usersSeed() {
  await db
    .insert(users)
    .values([
      {
        id: 1,
        appId: 1,
        username: 'johndoe',
        email: 'test@mail.com',
        password: 'VeryStrongPassword',
        isActive: true
      }
    ])
    .onDuplicateKeyUpdate({ set: { id: sql`id` } }) // keep existing record

  console.log('✅ Done seeding Users!')
}
