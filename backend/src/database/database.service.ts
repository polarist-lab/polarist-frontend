import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private sqlite: Database.Database;
  public db: ReturnType<typeof drizzle>;

  async onModuleInit() {
    // Use in-memory SQLite for testing
    this.sqlite = new Database(':memory:');
    this.db = drizzle(this.sqlite, { schema });
    
    // Create tables
    await this.createTables();
    
    console.log('🗄️  Database connected successfully (SQLite in-memory)');
  }

  private async createTables() {
    // Create users table
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        google_id TEXT UNIQUE,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        avatar TEXT,
        locale TEXT DEFAULT 'en',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user_progress table
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        word_id TEXT NOT NULL,
        correct_count INTEGER DEFAULT 0,
        incorrect_count INTEGER DEFAULT 0,
        last_reviewed DATETIME,
        mastery_level INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create user_sessions table
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        session_duration INTEGER,
        words_studied INTEGER,
        correct_answers INTEGER,
        total_answers INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create user_settings table
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        daily_goal INTEGER DEFAULT 20,
        preferred_locale TEXT DEFAULT 'en',
        notifications_enabled BOOLEAN DEFAULT true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  }

  async onModuleDestroy() {
    this.sqlite.close();
  }
}