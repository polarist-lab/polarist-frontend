-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar TEXT,
    locale TEXT DEFAULT 'en',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id TEXT NOT NULL,
    is_learned BOOLEAN DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    confidence INTEGER DEFAULT 0, -- 0-5 scale
    last_studied DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, word_id)
);

-- Study sessions table
CREATE TABLE study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    words_studied INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    duration INTEGER, -- in seconds
    metadata TEXT, -- JSON string for additional session data
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Custom wordbooks table
CREATE TABLE custom_wordbooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    word_ids TEXT NOT NULL, -- JSON array of word IDs
    categories TEXT, -- JSON array of categories used
    difficulties TEXT, -- JSON array of difficulties used
    is_public BOOLEAN DEFAULT 0,
    is_shared BOOLEAN DEFAULT 0,
    share_code TEXT UNIQUE, -- For sharing wordbooks
    tags TEXT, -- JSON array of user-defined tags
    total_words INTEGER DEFAULT 0,
    study_count INTEGER DEFAULT 0, -- How many times this wordbook was studied
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User settings table
CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    learning_goal TEXT DEFAULT 'balanced',
    study_reminders BOOLEAN DEFAULT 1,
    email_notifications BOOLEAN DEFAULT 1,
    difficulty_level TEXT DEFAULT 'beginner',
    daily_goal INTEGER DEFAULT 20, -- words per day
    preferred_study_time TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_word_id ON user_progress(word_id);
CREATE INDEX idx_user_progress_last_studied ON user_progress(last_studied);
CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_session_id ON study_sessions(session_id);
CREATE INDEX idx_custom_wordbooks_user_id ON custom_wordbooks(user_id);
CREATE INDEX idx_custom_wordbooks_share_code ON custom_wordbooks(share_code);