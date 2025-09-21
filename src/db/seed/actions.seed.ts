import { sql } from 'drizzle-orm'
import { db } from '..'
import { actions } from '../schema/actions.schema'

export async function actionsSeed() {
  await db
    .insert(actions)
    .values([
      { id: 1, appId: 1, code: 'read', description: 'Read data', isActive: true },
      { id: 2, appId: 1, code: 'write', description: 'Create data', isActive: true },
      { id: 3, appId: 1, code: 'update', description: 'Update data', isActive: true },
      { id: 4, appId: 1, code: 'delete', description: 'Delete data', isActive: true }
    ])
    .onDuplicateKeyUpdate({ set: { id: sql`id` } }) // keep existing record

  console.log('✅ Done seeding Actions!')
}
