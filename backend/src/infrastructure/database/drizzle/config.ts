import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

export function createDrizzleDatabase(databaseUrl: string) {
  const sqlite = new Database(databaseUrl);
  return drizzle(sqlite, { schema });
}

export type DrizzleDatabase = ReturnType<typeof createDrizzleDatabase>;

export const DRIZZLE_DATABASE = 'DRIZZLE_DATABASE';