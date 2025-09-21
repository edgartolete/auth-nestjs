import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/mysql2';
import * as userSchema from './schema/users.schema';
import * as profileSchema from './schema/profiles.schema';
import * as sessionSchema from './schema/sessions.schema';
import * as roleSchema from './schema/roles.schema';
import * as appSchema from './schema/apps.schema';
import * as actionSchema from './schema/actions.schema';
import * as groupSchema from './schema/groups.schema';
import * as resourceSchema from './schema/resources.schema';
import * as groupRoleSchema from './schema/groupRoles.schema';
import * as resourceRoleSchema from './schema/resourceRoles.schema';
import * as resourceRolePermissionschema from './schema/resourceRolePermissions.schema';
import { Pool } from 'pg';

dotenv.config({ quiet: true });

const poolConnection = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});

export const db = drizzle(poolConnection, {
  schema: {
    ...userSchema,
    ...profileSchema,
    ...sessionSchema,
    ...actionSchema,
    ...appSchema,
    ...groupSchema,
    ...resourceSchema,
    ...groupRoleSchema,
    ...resourceRoleSchema,
    ...resourceRolePermissionschema,
    ...roleSchema,
  },
  mode: 'default',
});
