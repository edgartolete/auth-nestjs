import { SQL, sql } from 'drizzle-orm'
import { AnyMySqlColumn } from 'drizzle-orm/mysql-core'

export function lower(email: AnyMySqlColumn): SQL {
  return sql`(lower(${email}))`
}
