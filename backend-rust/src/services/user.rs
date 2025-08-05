use chrono::Utc;
use sqlx::Row;

use crate::{
    database::Database,
    models::{User, UserSettings, CreateUserRequest, UpdateUserRequest, UpdateUserSettingsRequest},
    utils::errors::{AppError, validate_request},
};

pub struct UserService<'a> {
    database: &'a Database,
}

impl<'a> UserService<'a> {
    pub fn new(database: &'a Database) -> Self {
        Self { database }
    }

    pub async fn create_user(&self, request: CreateUserRequest) -> Result<User, AppError> {
        validate_request(&request)?;

        let now = Utc::now();
        let locale = request.locale.unwrap_or_else(|| "en".to_string());

        if !User::is_valid_locale(&locale) {
            return Err(AppError::Validation("Invalid locale".to_string()));
        }

        let result = sqlx::query!(
            r#"
            INSERT INTO users (google_id, email, name, avatar, locale, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
            RETURNING id, google_id, email, name, avatar, locale, created_at, updated_at
            "#,
            request.google_id,
            request.email,
            request.name,
            request.avatar,
            locale,
            now,
            now
        )
        .fetch_one(&self.database.pool)
        .await?;

        let user = User {
            id: result.id,
            google_id: result.google_id,
            email: result.email,
            name: result.name,
            avatar: result.avatar,
            locale: result.locale,
            created_at: result.created_at,
            updated_at: result.updated_at,
        };

        // Create default user settings
        self.create_default_user_settings(user.id).await?;

        Ok(user)
    }

    pub async fn get_user_by_id(&self, user_id: i32) -> Result<User, AppError> {
        let user = sqlx::query_as!(
            User,
            "SELECT id, google_id, email, name, avatar, locale, created_at, updated_at FROM users WHERE id = ?1",
            user_id
        )
        .fetch_optional(&self.database.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("User not found".to_string()))?;

        Ok(user)
    }

    pub async fn get_user_by_google_id(&self, google_id: &str) -> Result<User, AppError> {
        let user = sqlx::query_as!(
            User,
            "SELECT id, google_id, email, name, avatar, locale, created_at, updated_at FROM users WHERE google_id = ?1",
            google_id
        )
        .fetch_optional(&self.database.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("User not found".to_string()))?;

        Ok(user)
    }

    pub async fn get_user_by_email(&self, email: &str) -> Result<User, AppError> {
        let user = sqlx::query_as!(
            User,
            "SELECT id, google_id, email, name, avatar, locale, created_at, updated_at FROM users WHERE email = ?1",
            email
        )
        .fetch_optional(&self.database.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("User not found".to_string()))?;

        Ok(user)
    }

    pub async fn update_user(&self, user_id: i32, request: UpdateUserRequest) -> Result<User, AppError> {
        validate_request(&request)?;

        // Check if user exists
        let mut user = self.get_user_by_id(user_id).await?;

        // Update fields if provided
        if let Some(name) = &request.name {
            user.name = name.clone();
        }
        if let Some(avatar) = &request.avatar {
            user.avatar = Some(avatar.clone());
        }
        if let Some(locale) = &request.locale {
            if !User::is_valid_locale(locale) {
                return Err(AppError::Validation("Invalid locale".to_string()));
            }
            user.locale = locale.clone();
        }

        user.updated_at = Utc::now();

        sqlx::query!(
            "UPDATE users SET name = ?1, avatar = ?2, locale = ?3, updated_at = ?4 WHERE id = ?5",
            user.name,
            user.avatar,
            user.locale,
            user.updated_at,
            user_id
        )
        .execute(&self.database.pool)
        .await?;

        Ok(user)
    }

    pub async fn get_user_settings(&self, user_id: i32) -> Result<UserSettings, AppError> {
        let settings = sqlx::query_as!(
            UserSettings,
            r#"
            SELECT id, user_id, learning_goal, study_reminders as "study_reminders: bool", 
                   email_notifications as "email_notifications: bool", difficulty_level, 
                   daily_goal, preferred_study_time, created_at, updated_at 
            FROM user_settings WHERE user_id = ?1
            "#,
            user_id
        )
        .fetch_optional(&self.database.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("User settings not found".to_string()))?;

        Ok(settings)
    }

    pub async fn update_user_settings(
        &self,
        user_id: i32,
        request: UpdateUserSettingsRequest,
    ) -> Result<UserSettings, AppError> {
        validate_request(&request)?;

        // Check if user exists
        self.get_user_by_id(user_id).await?;

        // Get current settings
        let mut settings = self.get_user_settings(user_id).await?;

        // Update fields if provided
        if let Some(learning_goal) = &request.learning_goal {
            settings.learning_goal = learning_goal.clone();
        }
        if let Some(study_reminders) = request.study_reminders {
            settings.study_reminders = study_reminders;
        }
        if let Some(email_notifications) = request.email_notifications {
            settings.email_notifications = email_notifications;
        }
        if let Some(difficulty_level) = &request.difficulty_level {
            settings.difficulty_level = difficulty_level.clone();
        }
        if let Some(daily_goal) = request.daily_goal {
            settings.daily_goal = daily_goal;
        }
        if let Some(preferred_study_time) = &request.preferred_study_time {
            settings.preferred_study_time = Some(preferred_study_time.clone());
        }

        settings.updated_at = Utc::now();

        sqlx::query!(
            r#"
            UPDATE user_settings 
            SET learning_goal = ?1, study_reminders = ?2, email_notifications = ?3, 
                difficulty_level = ?4, daily_goal = ?5, preferred_study_time = ?6, updated_at = ?7 
            WHERE user_id = ?8
            "#,
            settings.learning_goal,
            settings.study_reminders,
            settings.email_notifications,
            settings.difficulty_level,
            settings.daily_goal,
            settings.preferred_study_time,
            settings.updated_at,
            user_id
        )
        .execute(&self.database.pool)
        .await?;

        Ok(settings)
    }

    async fn create_default_user_settings(&self, user_id: i32) -> Result<(), AppError> {
        let now = Utc::now();

        sqlx::query!(
            r#"
            INSERT INTO user_settings (user_id, learning_goal, study_reminders, email_notifications, 
                                     difficulty_level, daily_goal, created_at, updated_at)
            VALUES (?1, 'balanced', 1, 1, 'beginner', 20, ?2, ?3)
            "#,
            user_id,
            now,
            now
        )
        .execute(&self.database.pool)
        .await?;

        Ok(())
    }
}