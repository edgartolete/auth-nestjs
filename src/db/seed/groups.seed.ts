import { sql } from 'drizzle-orm'
import { db } from '..'
import { groups } from '../schema/groups.schema'

export async function groupsSeed() {
  await db
    .insert(groups)
    .values([
      { id: 1, appId: 1, name: 'Facebook Trolls', description: 'Fake News Group', isActive: true }
    ])
    .onDuplicateKeyUpdate({ set: { id: sql`id` } }) // keep existing record

  console.log('✅ Done seeding Groups!')
}
