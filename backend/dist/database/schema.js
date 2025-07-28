"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSettings = exports.customWordbooks = exports.studySessions = exports.userProgress = exports.users = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
// Users table
exports.users = (0, sqlite_core_1.sqliteTable)('users', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    googleId: (0, sqlite_core_1.text)('google_id').unique(),
    email: (0, sqlite_core_1.text)('email').notNull().unique(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    avatar: (0, sqlite_core_1.text)('avatar'),
    locale: (0, sqlite_core_1.text)('locale').default('en'),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: (0, sqlite_core_1.integer)('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
// User progress table
exports.userProgress = (0, sqlite_core_1.sqliteTable)('user_progress', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    userId: (0, sqlite_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    wordId: (0, sqlite_core_1.text)('word_id').notNull(),
    isLearned: (0, sqlite_core_1.integer)('is_learned', { mode: 'boolean' }).default(false),
    attempts: (0, sqlite_core_1.integer)('attempts').default(0),
    correctAnswers: (0, sqlite_core_1.integer)('correct_answers').default(0),
    confidence: (0, sqlite_core_1.integer)('confidence').default(0), // 0-5 scale
    lastStudied: (0, sqlite_core_1.integer)('last_studied', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: (0, sqlite_core_1.integer)('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
// Study sessions table
exports.studySessions = (0, sqlite_core_1.sqliteTable)('study_sessions', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    userId: (0, sqlite_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    sessionId: (0, sqlite_core_1.text)('session_id').notNull(),
    wordsStudied: (0, sqlite_core_1.integer)('words_studied').default(0),
    correctAnswers: (0, sqlite_core_1.integer)('correct_answers').default(0),
    totalAttempts: (0, sqlite_core_1.integer)('total_attempts').default(0),
    duration: (0, sqlite_core_1.integer)('duration'), // in seconds
    metadata: (0, sqlite_core_1.text)('metadata'), // JSON string for additional session data
    startTime: (0, sqlite_core_1.integer)('start_time', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    endTime: (0, sqlite_core_1.integer)('end_time', { mode: 'timestamp' }),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
// Custom wordbooks table
exports.customWordbooks = (0, sqlite_core_1.sqliteTable)('custom_wordbooks', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    userId: (0, sqlite_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    description: (0, sqlite_core_1.text)('description'),
    wordIds: (0, sqlite_core_1.text)('word_ids').notNull(), // JSON array of word IDs
    categories: (0, sqlite_core_1.text)('categories'), // JSON array of categories used
    difficulties: (0, sqlite_core_1.text)('difficulties'), // JSON array of difficulties used
    isPublic: (0, sqlite_core_1.integer)('is_public', { mode: 'boolean' }).default(false),
    isShared: (0, sqlite_core_1.integer)('is_shared', { mode: 'boolean' }).default(false),
    shareCode: (0, sqlite_core_1.text)('share_code').unique(), // For sharing wordbooks
    tags: (0, sqlite_core_1.text)('tags'), // JSON array of user-defined tags
    totalWords: (0, sqlite_core_1.integer)('total_words').default(0),
    studyCount: (0, sqlite_core_1.integer)('study_count').default(0), // How many times this wordbook was studied
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: (0, sqlite_core_1.integer)('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
// User settings table
exports.userSettings = (0, sqlite_core_1.sqliteTable)('user_settings', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    userId: (0, sqlite_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    learningGoal: (0, sqlite_core_1.text)('learning_goal').default('balanced'),
    studyReminders: (0, sqlite_core_1.integer)('study_reminders', { mode: 'boolean' }).default(true),
    emailNotifications: (0, sqlite_core_1.integer)('email_notifications', { mode: 'boolean' }).default(true),
    difficultyLevel: (0, sqlite_core_1.text)('difficulty_level').default('beginner'),
    dailyGoal: (0, sqlite_core_1.integer)('daily_goal').default(20), // words per day
    preferredStudyTime: (0, sqlite_core_1.text)('preferred_study_time'),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: (0, sqlite_core_1.integer)('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
