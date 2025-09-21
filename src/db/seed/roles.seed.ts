import { sql } from 'drizzle-orm'
import { db } from '..'
import { roles } from '../schema/roles.schema'

export async function rolesSeed() {
  await db
    .insert(roles)
    .values([
      { id: 1, appId: 1, code: 'superadmin', name: 'Super Administrator' },
      { id: 2, appId: 1, code: 'admin', name: 'Administrator' },
      { id: 3, appId: 1, code: 'moderator', name: 'Moderator' },
      { id: 4, appId: 1, code: 'normal', name: 'Normal User' },
      { id: 5, appId: 1, code: 'guest', name: 'Guest' }
    ])
    .onDuplicateKeyUpdate({ set: { id: sql`id` } }) // keep existing record

  console.log('✅ Done seeding Roles!')
}
