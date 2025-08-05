import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  googleId: text('google_id').unique(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  locale: text('locale').default('en'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// User progress table
export const userProgress = sqliteTable('user_progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  wordId: text('word_id').notNull(),
  isLearned: integer('is_learned', { mode: 'boolean' }).default(false),
  attempts: integer('attempts').default(0),
  correctAnswers: integer('correct_answers').default(0),
  confidence: integer('confidence').default(0), // 0-5 scale
  lastStudied: integer('last_studied', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Study sessions table
export const studySessions = sqliteTable('study_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  sessionId: text('session_id').notNull(),
  wordsStudied: integer('words_studied').default(0),
  correctAnswers: integer('correct_answers').default(0),
  totalAttempts: integer('total_attempts').default(0),
  duration: integer('duration'), // in seconds
  metadata: text('metadata'), // JSON string for additional session data
  startTime: integer('start_time', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  endTime: integer('end_time', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Custom wordbooks table
export const customWordbooks = sqliteTable('custom_wordbooks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  wordIds: text('word_ids').notNull(), // JSON array of word IDs
  categories: text('categories'), // JSON array of categories used
  difficulties: text('difficulties'), // JSON array of difficulties used
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  isShared: integer('is_shared', { mode: 'boolean' }).default(false),
  shareCode: text('share_code').unique(), // For sharing wordbooks
  tags: text('tags'), // JSON array of user-defined tags
  totalWords: integer('total_words').default(0),
  studyCount: integer('study_count').default(0), // How many times this wordbook was studied
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// User settings table
export const userSettings = sqliteTable('user_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  learningGoal: text('learning_goal').default('balanced'),
  studyReminders: integer('study_reminders', { mode: 'boolean' }).default(true),
  emailNotifications: integer('email_notifications', { mode: 'boolean' }).default(true),
  difficultyLevel: text('difficulty_level').default('beginner'),
  dailyGoal: integer('daily_goal').default(20), // words per day
  preferredStudyTime: text('preferred_study_time'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;
export type StudySession = typeof studySessions.$inferSelect;
export type NewStudySession = typeof studySessions.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;