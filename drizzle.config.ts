import type { Config } from 'drizzle-kit';
import { env } from './env';

export default {
  schema: './src/db/schema',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: env.DB_HOST,
    user: "",
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  },
} satisfies Config;
