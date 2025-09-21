import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    port: process.env.POSTGRES_PORT
      ? parseInt(process.env.POSTGRES_PORT, 10)
      : undefined,
  },
} satisfies Config;
