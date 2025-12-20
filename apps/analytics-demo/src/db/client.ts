import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { pageViewsSqlite } from "@remcostuten/analytics";

const sqlite = new Database("./data/analytics.db");

export const db = drizzle(sqlite);
export const pageViewsTable = pageViewsSqlite;
