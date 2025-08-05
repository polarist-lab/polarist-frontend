use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, ToSchema)]
pub struct UserProgress {
    pub id: i32,
    pub user_id: i32,
    pub word_id: String,
    pub is_learned: bool,
    pub attempts: i32,
    pub correct_answers: i32,
    pub confidence: i32, // 0-5 scale
    pub last_studied: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct CreateProgressRequest {
    #[validate(length(min = 1))]
    pub word_id: String,
    pub is_learned: Option<bool>,
    #[validate(range(min = 0))]
    pub attempts: Option<i32>,
    #[validate(range(min = 0))]
    pub correct_answers: Option<i32>,
    #[validate(range(min = 0, max = 5))]
    pub confidence: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct UpdateProgressRequest {
    pub is_learned: Option<bool>,
    pub was_correct: Option<bool>, // If provided, will increment attempts and possibly correct_answers
    #[validate(range(min = 0, max = 5))]
    pub confidence: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ProgressStats {
    pub total_words: i32,
    pub learned_words: i32,
    pub total_attempts: i32,
    pub total_correct: i32,
    pub accuracy_percentage: f64,
    pub average_confidence: f64,
    pub words_studied_today: i32,
    pub current_streak: i32,
    pub longest_streak: i32,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct WordProgressSummary {
    pub word_id: String,
    pub is_learned: bool,
    pub attempts: i32,
    pub correct_answers: i32,
    pub confidence: i32,
    pub accuracy: f64,
    pub last_studied: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct SystemStats {
    pub total_unique_words: i32,
    pub total_progress_records: i32,
}

impl UserProgress {
    pub fn accuracy(&self) -> f64 {
        if self.attempts == 0 {
            0.0
        } else {
            (self.correct_answers as f64 / self.attempts as f64) * 100.0
        }
    }

    pub fn update_from_request(&mut self, request: &UpdateProgressRequest) {
        if let Some(is_learned) = request.is_learned {
            self.is_learned = is_learned;
        }

        if let Some(was_correct) = request.was_correct {
            self.attempts += 1;
            if was_correct {
                self.correct_answers += 1;
            }
        }

        if let Some(confidence) = request.confidence {
            self.confidence = confidence;
        }

        self.last_studied = Some(Utc::now());
        self.updated_at = Utc::now();
    }
}