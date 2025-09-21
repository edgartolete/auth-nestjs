import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as userSchema from './schema/users.schema';
import * as profileSchema from './schema/profiles.schema';
import * as sessionSchema from './schema/sessions.schema';
import * as roleSchema from './schema/roles.schema';
import * as actionSchema from './schema/actions.schema';
import * as groupSchema from './schema/groups.schema';
import * as resourceSchema from './schema/resources.schema';
import * as groupRoleSchema from './schema/groupRoles.schema';
import * as resourceRoleSchema from './schema/resourceRoles.schema';
import * as resourceRolePermissionschema from './schema/resourceRolePermissions.schema';
import { Pool } from 'pg';

dotenv.config({ quiet: true });

const poolConnection = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT
    ? parseInt(process.env.POSTGRES_PORT, 10)
    : undefined,
});

export const db = drizzle(poolConnection, {
  schema: {
    ...userSchema,
    ...profileSchema,
    ...sessionSchema,
    ...actionSchema,
    ...groupSchema,
    ...resourceSchema,
    ...groupRoleSchema,
    ...resourceRoleSchema,
    ...resourceRolePermissionschema,
    ...roleSchema,
  },
});
