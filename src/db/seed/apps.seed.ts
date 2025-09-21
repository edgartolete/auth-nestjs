import { sql } from 'drizzle-orm'
import { db } from '..'
import { apps } from '../schema/apps.schema'

export async function appsSeed() {
  await db
    .insert(apps)
    .values([
      { id: 1, code: 'a01', name: 'App 1', description: 'App Descriptions', isActive: true }
    ])
    .onDuplicateKeyUpdate({ set: { id: sql`id` } }) // keep existing record

  console.log('✅ Done seeding Apps!')
}
