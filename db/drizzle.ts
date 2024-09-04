import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { drizzle as drizzleVercel } from 'drizzle-orm/vercel-postgres'
import postgres from 'postgres'
import { sql } from '@vercel/postgres'

import '@/env-config'

declare global {
  var db: PostgresJsDatabase | undefined
}

function createDatabaseClient() {
  if (process.env.NODE_ENV === 'production') {
    return drizzleVercel(sql)
  } else {
    if (!global.db) {
      global.db = drizzle(postgres(process.env.DB_URL!))
    }
    return global.db
  }
}

export const db = createDatabaseClient()
