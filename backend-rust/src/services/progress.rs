use chrono::Utc;
use serde_json::Value;

use crate::{
    database::Database,
    models::{UserProgress, StudySession, CreateProgressRequest, UpdateProgressRequest, ProgressStats, SessionStats, SystemStats},
    utils::errors::{AppError, validate_request},
};

pub struct ProgressService<'a> {
    database: &'a Database,
}

impl<'a> ProgressService<'a> {
    pub fn new(database: &'a Database) -> Self {
        Self { database }
    }

    pub async fn get_system_wide_stats(&self) -> Result<SystemStats, AppError> {
        let row = sqlx::query!(
            r#"
            SELECT 
                COUNT(DISTINCT word_id) as total_unique_words,
                COUNT(*) as total_progress_records
            FROM user_progress
            "#
        )
        .fetch_one(&self.database.pool)
        .await?;

        Ok(SystemStats {
            total_unique_words: row.total_unique_words.unwrap_or(0),
            total_progress_records: row.total_progress_records.unwrap_or(0),
        })
    }

    pub async fn get_user_progress(
        &self,
        user_id: i32,
        limit: i32,
        offset: i32,
        learned_only: bool,
    ) -> Result<Vec<UserProgress>, AppError> {
        let progress = if learned_only {
            sqlx::query_as!(
                UserProgress,
                r#"
                SELECT id, user_id, word_id, is_learned as "is_learned: bool", attempts, 
                       correct_answers, confidence, last_studied, created_at, updated_at
                FROM user_progress 
                WHERE user_id = ?1 AND is_learned = 1
                ORDER BY last_studied DESC
                LIMIT ?2 OFFSET ?3
                "#,
                user_id, limit, offset
            )
        } else {
            sqlx::query_as!(
                UserProgress,
                r#"
                SELECT id, user_id, word_id, is_learned as "is_learned: bool", attempts, 
                       correct_answers, confidence, last_studied, created_at, updated_at
                FROM user_progress 
                WHERE user_id = ?1
                ORDER BY last_studied DESC
                LIMIT ?2 OFFSET ?3
                "#,
                user_id, limit, offset
            )
        }
        .fetch_all(&self.database.pool)
        .await?;

        Ok(progress)
    }

    pub async fn get_word_progress(&self, user_id: i32, word_id: &str) -> Result<UserProgress, AppError> {
        let progress = sqlx::query_as!(
            UserProgress,
            r#"
            SELECT id, user_id, word_id, is_learned as "is_learned: bool", attempts, 
                   correct_answers, confidence, last_studied, created_at, updated_at
            FROM user_progress 
            WHERE user_id = ?1 AND word_id = ?2
            "#,
            user_id, word_id
        )
        .fetch_optional(&self.database.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Word progress not found".to_string()))?;

        Ok(progress)
    }

    pub async fn create_word_progress(
        &self,
        user_id: i32,
        request: CreateProgressRequest,
    ) -> Result<UserProgress, AppError> {
        validate_request(&request)?;

        let now = Utc::now();
        let result = sqlx::query!(
            r#"
            INSERT INTO user_progress (user_id, word_id, is_learned, attempts, correct_answers, 
                                     confidence, last_studied, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
            RETURNING id
            "#,
            user_id,
            request.word_id,
            request.is_learned.unwrap_or(false),
            request.attempts.unwrap_or(0),
            request.correct_answers.unwrap_or(0),
            request.confidence.unwrap_or(0),
            now,
            now,
            now
        )
        .fetch_one(&self.database.pool)
        .await?;

        self.get_word_progress(user_id, &request.word_id).await
    }

    pub async fn update_word_progress(
        &self,
        user_id: i32,
        word_id: &str,
        request: UpdateProgressRequest,
    ) -> Result<UserProgress, AppError> {
        validate_request(&request)?;

        let mut progress = self.get_word_progress(user_id, word_id).await?;
        progress.update_from_request(&request);

        sqlx::query!(
            r#"
            UPDATE user_progress 
            SET is_learned = ?1, attempts = ?2, correct_answers = ?3, confidence = ?4, 
                last_studied = ?5, updated_at = ?6
            WHERE user_id = ?7 AND word_id = ?8
            "#,
            progress.is_learned,
            progress.attempts,
            progress.correct_answers,
            progress.confidence,
            progress.last_studied,
            progress.updated_at,
            user_id,
            word_id
        )
        .execute(&self.database.pool)
        .await?;

        Ok(progress)
    }

    pub async fn get_progress_stats(&self, user_id: i32) -> Result<ProgressStats, AppError> {
        let row = sqlx::query!(
            r#"
            SELECT 
                COUNT(*) as total_words,
                COUNT(CASE WHEN is_learned = 1 THEN 1 END) as learned_words,
                COALESCE(SUM(attempts), 0) as total_attempts,
                COALESCE(SUM(correct_answers), 0) as total_correct,
                COALESCE(AVG(CAST(confidence AS REAL)), 0.0) as avg_confidence
            FROM user_progress 
            WHERE user_id = ?1
            "#,
            user_id
        )
        .fetch_one(&self.database.pool)
        .await?;

        let accuracy_percentage = if row.total_attempts > 0 {
            (row.total_correct as f64 / row.total_attempts as f64) * 100.0
        } else {
            0.0
        };

        // TODO: Calculate streak data
        let words_studied_today = 0;
        let current_streak = 0;
        let longest_streak = 0;

        Ok(ProgressStats {
            total_words: row.total_words,
            learned_words: row.learned_words,
            total_attempts: row.total_attempts,
            total_correct: row.total_correct,
            accuracy_percentage,
            average_confidence: row.avg_confidence,
            words_studied_today,
            current_streak,
            longest_streak,
        })
    }

    pub async fn get_study_sessions(
        &self,
        user_id: i32,
        limit: i32,
        offset: i32,
        active_only: bool,
    ) -> Result<Vec<StudySession>, AppError> {
        let sessions = if active_only {
            sqlx::query_as!(
                StudySession,
                "SELECT * FROM study_sessions WHERE user_id = ?1 AND end_time IS NULL ORDER BY start_time DESC LIMIT ?2 OFFSET ?3",
                user_id, limit, offset
            )
        } else {
            sqlx::query_as!(
                StudySession,
                "SELECT * FROM study_sessions WHERE user_id = ?1 ORDER BY start_time DESC LIMIT ?2 OFFSET ?3",
                user_id, limit, offset
            )
        }
        .fetch_all(&self.database.pool)
        .await?;

        Ok(sessions)
    }

    pub async fn create_study_session(
        &self,
        user_id: i32,
        session_id: String,
        metadata: Option<Value>,
    ) -> Result<StudySession, AppError> {
        let now = Utc::now();
        let metadata_str = metadata.map(|m| serde_json::to_string(&m).unwrap_or_default());

        let result = sqlx::query!(
            r#"
            INSERT INTO study_sessions (user_id, session_id, metadata, start_time, created_at)
            VALUES (?1, ?2, ?3, ?4, ?5)
            RETURNING id
            "#,
            user_id,
            session_id,
            metadata_str,
            now,
            now
        )
        .fetch_one(&self.database.pool)
        .await?;

        self.get_study_session(user_id, &session_id).await
    }

    pub async fn get_study_session(&self, user_id: i32, session_id: &str) -> Result<StudySession, AppError> {
        let session = sqlx::query_as!(
            StudySession,
            "SELECT * FROM study_sessions WHERE user_id = ?1 AND session_id = ?2",
            user_id, session_id
        )
        .fetch_optional(&self.database.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Study session not found".to_string()))?;

        Ok(session)
    }

    pub async fn update_study_session(
        &self,
        user_id: i32,
        session_id: &str,
        request: crate::models::UpdateSessionRequest,
    ) -> Result<StudySession, AppError> {
        validate_request(&request)?;

        let mut session = self.get_study_session(user_id, session_id).await?;
        session.update_from_request(&request);

        sqlx::query!(
            r#"
            UPDATE study_sessions 
            SET words_studied = ?1, correct_answers = ?2, total_attempts = ?3, 
                duration = ?4, metadata = ?5, end_time = ?6
            WHERE user_id = ?7 AND session_id = ?8
            "#,
            session.words_studied,
            session.correct_answers,
            session.total_attempts,
            session.duration,
            session.metadata,
            session.end_time,
            user_id,
            session_id
        )
        .execute(&self.database.pool)
        .await?;

        Ok(session)
    }
}