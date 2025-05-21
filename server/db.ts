import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure SQLite with memory-efficient options
const sqlite = new Database('dev.db', {
  // Optimize memory usage for production
  readonly: process.env.NODE_ENV === 'production',
  fileMustExist: process.env.NODE_ENV === 'production'
});

// Use a more memory-efficient cache setting
sqlite.pragma('cache_size = -2000'); // Use 2MB cache instead of default
sqlite.pragma('journal_mode = WAL'); // Use WAL mode for better concurrency
sqlite.pragma('synchronous = NORMAL'); // Less durability, more performance

export const db = drizzle(sqlite, { schema });