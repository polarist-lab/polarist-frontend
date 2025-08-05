-- PostgreSQL Initial Migration
-- Converted from SQLite to PostgreSQL with proper types and constraints

-- Enable UUID extension for future use
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    google_id TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar TEXT,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User progress table
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id TEXT NOT NULL,
    is_learned BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    confidence INTEGER DEFAULT 0, -- 0-5 scale
    last_studied TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- Study sessions table
CREATE TABLE study_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    words_studied INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    duration INTEGER, -- in seconds
    metadata JSONB, -- Native JSON support for PostgreSQL
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Custom wordbooks table
CREATE TABLE custom_wordbooks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    word_ids JSONB NOT NULL, -- JSON array of word IDs
    categories JSONB, -- JSON array of categories used
    difficulties JSONB, -- JSON array of difficulties used
    is_public BOOLEAN DEFAULT FALSE,
    is_shared BOOLEAN DEFAULT FALSE,
    share_code TEXT UNIQUE, -- For sharing wordbooks
    tags JSONB, -- JSON array of user-defined tags
    total_words INTEGER DEFAULT 0,
    study_count INTEGER DEFAULT 0, -- How many times this wordbook was studied
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User settings table
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    learning_goal TEXT DEFAULT 'balanced',
    study_reminders BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    difficulty_level TEXT DEFAULT 'beginner',
    daily_goal INTEGER DEFAULT 20, -- words per day
    preferred_study_time TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
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

-- Create partial indexes for faster queries on JSONB columns
CREATE INDEX idx_study_sessions_metadata ON study_sessions USING GIN (metadata);
CREATE INDEX idx_custom_wordbooks_word_ids ON custom_wordbooks USING GIN (word_ids);
CREATE INDEX idx_custom_wordbooks_categories ON custom_wordbooks USING GIN (categories);
CREATE INDEX idx_custom_wordbooks_tags ON custom_wordbooks USING GIN (tags);

-- Add check constraints for data validation
ALTER TABLE user_progress ADD CONSTRAINT check_confidence_range CHECK (confidence >= 0 AND confidence <= 5);
ALTER TABLE user_progress ADD CONSTRAINT check_non_negative_attempts CHECK (attempts >= 0);
ALTER TABLE user_progress ADD CONSTRAINT check_non_negative_correct_answers CHECK (correct_answers >= 0);

ALTER TABLE study_sessions ADD CONSTRAINT check_non_negative_duration CHECK (duration IS NULL OR duration >= 0);
ALTER TABLE study_sessions ADD CONSTRAINT check_non_negative_words_studied CHECK (words_studied >= 0);
ALTER TABLE study_sessions ADD CONSTRAINT check_non_negative_correct_answers CHECK (correct_answers >= 0);
ALTER TABLE study_sessions ADD CONSTRAINT check_non_negative_total_attempts CHECK (total_attempts >= 0);

ALTER TABLE custom_wordbooks ADD CONSTRAINT check_non_negative_total_words CHECK (total_words >= 0);
ALTER TABLE custom_wordbooks ADD CONSTRAINT check_non_negative_study_count CHECK (study_count >= 0);

ALTER TABLE user_settings ADD CONSTRAINT check_positive_daily_goal CHECK (daily_goal > 0);
ALTER TABLE user_settings ADD CONSTRAINT check_valid_learning_goal 
    CHECK (learning_goal IN ('balanced', 'vocabulary_focus', 'grammar_focus', 'speaking_focus', 'reading_focus'));
ALTER TABLE user_settings ADD CONSTRAINT check_valid_difficulty_level 
    CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'));

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_wordbooks_updated_at BEFORE UPDATE ON custom_wordbooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create helpful views for common queries
CREATE VIEW user_statistics AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(DISTINCT up.word_id) as total_words_studied,
    COUNT(DISTINCT CASE WHEN up.is_learned = TRUE THEN up.word_id END) as words_learned,
    AVG(up.confidence) as average_confidence,
    COUNT(DISTINCT ss.id) as total_sessions,
    SUM(ss.duration) as total_study_time,
    us.daily_goal,
    us.difficulty_level
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN study_sessions ss ON u.id = ss.user_id
LEFT JOIN user_settings us ON u.id = us.user_id
GROUP BY u.id, u.name, u.email, us.daily_goal, us.difficulty_level;

-- Comment on tables and important columns
COMMENT ON TABLE users IS 'User accounts with authentication information';
COMMENT ON TABLE user_progress IS 'Individual word learning progress for each user';
COMMENT ON TABLE study_sessions IS 'Records of study sessions with performance metrics';
COMMENT ON TABLE custom_wordbooks IS 'User-created custom word collections';
COMMENT ON TABLE user_settings IS 'User preferences and learning configuration';

COMMENT ON COLUMN users.google_id IS 'Google OAuth identifier for SSO authentication';
COMMENT ON COLUMN user_progress.confidence IS 'User confidence level (0-5 scale) for this word';
COMMENT ON COLUMN study_sessions.metadata IS 'Additional session data stored as JSON';
COMMENT ON COLUMN custom_wordbooks.share_code IS 'Unique code for sharing wordbooks between users';