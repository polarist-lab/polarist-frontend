use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, ToSchema)]
pub struct StudySession {
    pub id: i32,
    pub user_id: i32,
    pub session_id: String,
    pub words_studied: i32,
    pub correct_answers: i32,
    pub total_attempts: i32,
    pub duration: Option<i32>, // in seconds
    pub metadata: Option<String>, // JSON string
    pub start_time: DateTime<Utc>,
    pub end_time: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct CreateSessionRequest {
    #[validate(length(min = 1))]
    pub session_id: String,
    pub metadata: Option<Value>,
}

#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct UpdateSessionRequest {
    #[validate(range(min = 0))]
    pub words_studied: Option<i32>,
    #[validate(range(min = 0))]
    pub correct_answers: Option<i32>,
    #[validate(range(min = 0))]
    pub total_attempts: Option<i32>,
    #[validate(range(min = 0))]
    pub duration: Option<i32>,
    pub metadata: Option<Value>,
    pub end_session: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct SessionStats {
    pub total_sessions: i32,
    pub total_study_time: i32, // in seconds
    pub average_session_length: f64, // in minutes
    pub total_words_studied: i32,
    pub total_correct_answers: i32,
    pub overall_accuracy: f64,
    pub sessions_this_week: i32,
    pub sessions_this_month: i32,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct SessionSummary {
    pub session_id: String,
    pub words_studied: i32,
    pub correct_answers: i32,
    pub total_attempts: i32,
    pub accuracy: f64,
    pub duration: Option<i32>,
    pub start_time: DateTime<Utc>,
    pub end_time: Option<DateTime<Utc>>,
    pub is_completed: bool,
}

impl StudySession {
    pub fn accuracy(&self) -> f64 {
        if self.total_attempts == 0 {
            0.0
        } else {
            (self.correct_answers as f64 / self.total_attempts as f64) * 100.0
        }
    }

    pub fn is_completed(&self) -> bool {
        self.end_time.is_some()
    }

    pub fn duration_minutes(&self) -> Option<f64> {
        self.duration.map(|d| d as f64 / 60.0)
    }

    pub fn update_from_request(&mut self, request: &UpdateSessionRequest) {
        if let Some(words_studied) = request.words_studied {
            self.words_studied = words_studied;
        }

        if let Some(correct_answers) = request.correct_answers {
            self.correct_answers = correct_answers;
        }

        if let Some(total_attempts) = request.total_attempts {
            self.total_attempts = total_attempts;
        }

        if let Some(duration) = request.duration {
            self.duration = Some(duration);
        }

        if let Some(metadata) = &request.metadata {
            self.metadata = Some(serde_json::to_string(metadata).unwrap_or_default());
        }

        if request.end_session.unwrap_or(false) && self.end_time.is_none() {
            self.end_time = Some(Utc::now());
        }
    }

    pub fn parsed_metadata(&self) -> Option<Value> {
        self.metadata
            .as_ref()
            .and_then(|m| serde_json::from_str(m).ok())
    }
}