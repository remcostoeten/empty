import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const pageViewsSqlite = sqliteTable("page_views", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  environment: text("environment"),
  pathname: text("pathname").notNull(),
  referrer: text("referrer"),
  locale: text("locale"),
  timezone: text("timezone"),
  screenBucket: text("screen_bucket"),
  visitId: text("visit_id").notNull(),
  fingerprint: text("fingerprint"),
  navigationType: text("navigation_type"),
  country: text("country"),
  region: text("region"),
  city: text("city"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const pageViewsPg = pgTable("page_views", {
  id: varchar("id", { length: 32 }).primaryKey(),
  projectId: varchar("project_id", { length: 128 }).notNull(),
  environment: varchar("environment", { length: 64 }),
  pathname: varchar("pathname", { length: 2048 }).notNull(),
  referrer: varchar("referrer", { length: 2048 }),
  locale: varchar("locale", { length: 16 }),
  timezone: varchar("timezone", { length: 128 }),
  screenBucket: varchar("screen_bucket", { length: 8 }),
  visitId: varchar("visit_id", { length: 64 }).notNull(),
  fingerprint: varchar("fingerprint", { length: 64 }),
  navigationType: varchar("navigation_type", { length: 32 }),
  country: varchar("country", { length: 64 }),
  region: varchar("region", { length: 128 }),
  city: varchar("city", { length: 128 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export type PageViewSqliteInsert = typeof pageViewsSqlite.$inferInsert;
export type PageViewPgInsert = typeof pageViewsPg.$inferInsert;
