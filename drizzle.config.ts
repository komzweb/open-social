import { defineConfig } from 'drizzle-kit'

import '@/env-config'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: isProd ? process.env.POSTGRES_URL! : process.env.DB_URL!,
  },
})
