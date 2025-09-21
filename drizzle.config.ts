import { Config } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const dbCredentials = {
  host: process.env.POSTGRES_HOST!,
  port: Number(process.env.POSTGRES_PORT!) || 5432,
  user: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
  ssl: false,
};

const config: Config = {
  schema: './src/db/schema',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials,
};

export default config;
