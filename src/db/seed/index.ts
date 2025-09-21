import { actionsSeed } from './actions.seed'
import { appsSeed } from './apps.seed'
import { groupsSeed } from './groups.seed'
import { rolesSeed } from './roles.seed'
import { usersSeed } from './users.seed'

async function seed() {
  await usersSeed()
  await groupsSeed()
  await appsSeed()
  await actionsSeed()
  await rolesSeed()
}
try {
  console.log('🌱 Seeding database...')
  seed()
  console.log('✅ All Seed DONE!')
} catch (err) {
  console.log('error while seeding: ', err)
}
