import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { attachDatabasePool } from "@vercel/functions"
import * as schema from "@/db/schema"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
})

attachDatabasePool(pool)

export const db = drizzle({ client: pool, schema })

export type Db = typeof db
