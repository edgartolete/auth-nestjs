import { Config } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const val = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT
    ? parseInt(process.env.POSTGRES_PORT, 10)
    : undefined,
  ssl: false,
};
console.log('DB Credentials:', val);

const dbCredentials = {
  host: process.env.POSTGRES_HOST!,
  port: Number(process.env.POSTGRES_PORT!) || 5432,
  user: process.env.POSTGRES_USER!,
  password: 'Abc12345', //process.env.POSTGRES_PASSWORD!,
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
