use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, ToSchema)]
pub struct User {
    pub id: i64,
    pub google_id: Option<String>,
    pub email: String,
    pub name: String,
    pub avatar: Option<String>,
    pub locale: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct CreateUserRequest {
    pub google_id: Option<String>,
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 1, max = 100))]
    pub name: String,
    pub avatar: Option<String>,
    pub locale: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct UpdateUserRequest {
    #[validate(length(min = 1, max = 100))]
    pub name: Option<String>,
    pub avatar: Option<String>,
    pub locale: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, ToSchema)]
pub struct UserSettings {
    pub id: i64,
    pub user_id: i64,
    pub learning_goal: String,
    pub study_reminders: bool,
    pub email_notifications: bool,
    pub difficulty_level: String,
    pub daily_goal: i64,
    pub preferred_study_time: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct UpdateUserSettingsRequest {
    pub learning_goal: Option<String>,
    pub study_reminders: Option<bool>,
    pub email_notifications: Option<bool>,
    pub difficulty_level: Option<String>,
    #[validate(range(min = 1, max = 500))]
    pub daily_goal: Option<i32>,
    pub preferred_study_time: Option<String>,
}

impl User {
    pub fn is_valid_locale(locale: &str) -> bool {
        matches!(locale, "en" | "ko" | "ja" | "zh" | "id" | "th" | "vi" | "ar" | "es" | "hi" | "pt")
    }
}

impl Default for CreateUserRequest {
    fn default() -> Self {
        Self {
            google_id: None,
            email: String::new(),
            name: String::new(),
            avatar: None,
            locale: Some("en".to_string()),
        }
    }
}