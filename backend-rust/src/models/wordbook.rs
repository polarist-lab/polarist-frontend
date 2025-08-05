use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::FromRow;
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, ToSchema)]
pub struct CustomWordbook {
    pub id: i32,
    pub user_id: i32,
    pub name: String,
    pub description: Option<String>,
    pub word_ids: String, // JSON array
    pub categories: Option<String>, // JSON array
    pub difficulties: Option<String>, // JSON array
    pub is_public: bool,
    pub is_shared: bool,
    pub share_code: Option<String>,
    pub tags: Option<String>, // JSON array
    pub total_words: i32,
    pub study_count: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct CreateWordbookRequest {
    #[validate(length(min = 1, max = 100))]
    pub name: String,
    #[validate(length(max = 500))]
    pub description: Option<String>,
    #[validate(length(min = 1))]
    pub word_ids: Vec<String>,
    pub categories: Option<Vec<String>>,
    pub difficulties: Option<Vec<String>>,
    pub is_public: Option<bool>,
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct UpdateWordbookRequest {
    #[validate(length(min = 1, max = 100))]
    pub name: Option<String>,
    #[validate(length(max = 500))]
    pub description: Option<String>,
    pub word_ids: Option<Vec<String>>,
    pub categories: Option<Vec<String>>,
    pub difficulties: Option<Vec<String>>,
    pub is_public: Option<bool>,
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct WordbookSummary {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub total_words: i32,
    pub study_count: i32,
    pub categories: Vec<String>,
    pub difficulties: Vec<String>,
    pub tags: Vec<String>,
    pub is_public: bool,
    pub is_shared: bool,
    pub share_code: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct SharedWordbookInfo {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub total_words: i32,
    pub study_count: i32,
    pub categories: Vec<String>,
    pub difficulties: Vec<String>,
    pub tags: Vec<String>,
    pub creator_name: String,
    pub created_at: DateTime<Utc>,
}

impl CustomWordbook {
    pub fn word_ids_vec(&self) -> Vec<String> {
        serde_json::from_str(&self.word_ids).unwrap_or_default()
    }

    pub fn categories_vec(&self) -> Vec<String> {
        self.categories
            .as_ref()
            .and_then(|c| serde_json::from_str(c).ok())
            .unwrap_or_default()
    }

    pub fn difficulties_vec(&self) -> Vec<String> {
        self.difficulties
            .as_ref()
            .and_then(|d| serde_json::from_str(d).ok())
            .unwrap_or_default()
    }

    pub fn tags_vec(&self) -> Vec<String> {
        self.tags
            .as_ref()
            .and_then(|t| serde_json::from_str(t).ok())
            .unwrap_or_default()
    }

    pub fn to_summary(&self) -> WordbookSummary {
        WordbookSummary {
            id: self.id,
            name: self.name.clone(),
            description: self.description.clone(),
            total_words: self.total_words,
            study_count: self.study_count,
            categories: self.categories_vec(),
            difficulties: self.difficulties_vec(),
            tags: self.tags_vec(),
            is_public: self.is_public,
            is_shared: self.is_shared,
            share_code: self.share_code.clone(),
            created_at: self.created_at,
            updated_at: self.updated_at,
        }
    }

    pub fn update_from_request(&mut self, request: &UpdateWordbookRequest) {
        if let Some(name) = &request.name {
            self.name = name.clone();
        }

        if let Some(description) = &request.description {
            self.description = Some(description.clone());
        }

        if let Some(word_ids) = &request.word_ids {
            self.word_ids = serde_json::to_string(word_ids).unwrap_or_default();
            self.total_words = word_ids.len() as i32;
        }

        if let Some(categories) = &request.categories {
            self.categories = Some(serde_json::to_string(categories).unwrap_or_default());
        }

        if let Some(difficulties) = &request.difficulties {
            self.difficulties = Some(serde_json::to_string(difficulties).unwrap_or_default());
        }

        if let Some(is_public) = request.is_public {
            self.is_public = is_public;
        }

        if let Some(tags) = &request.tags {
            self.tags = Some(serde_json::to_string(tags).unwrap_or_default());
        }

        self.updated_at = Utc::now();
    }

    pub fn generate_share_code() -> String {
        use uuid::Uuid;
        Uuid::new_v4().to_string()[..8].to_string()
    }
}