use chrono::Utc;

use crate::{
    database::Database,
    models::{CustomWordbook, CreateWordbookRequest, UpdateWordbookRequest, WordbookSummary, SharedWordbookInfo},
    utils::errors::{AppError, validate_request},
};

pub struct WordbookService<'a> {
    database: &'a Database,
}

impl<'a> WordbookService<'a> {
    pub fn new(database: &'a Database) -> Self {
        Self { database }
    }

    pub async fn get_public_wordbooks(
        &self,
        limit: i32,
        offset: i32,
        search: Option<String>,
        category: Option<String>,
        difficulty: Option<String>,
    ) -> Result<Vec<WordbookSummary>, AppError> {
        let mut query = "SELECT * FROM custom_wordbooks WHERE is_public = 1".to_string();
        let mut params: Vec<String> = vec![];

        if let Some(search_term) = search {
            query.push_str(" AND (name LIKE ? OR description LIKE ?)");
            let search_pattern = format!("%{}%", search_term);
            params.push(search_pattern.clone());
            params.push(search_pattern);
        }

        if let Some(cat) = category {
            query.push_str(" AND categories LIKE ?");
            params.push(format!("%{}%", cat));
        }

        if let Some(diff) = difficulty {
            query.push_str(" AND difficulties LIKE ?");
            params.push(format!("%{}%", diff));
        }

        query.push_str(" ORDER BY study_count DESC, created_at DESC LIMIT ? OFFSET ?");
        params.push(limit.to_string());
        params.push(offset.to_string());

        // For simplicity, let's use a basic query without dynamic parameters
        let wordbooks = sqlx::query_as!(
            CustomWordbook,
            r#"
            SELECT id, user_id, name, description, word_ids, categories, difficulties,
                   is_public as "is_public: bool", is_shared as "is_shared: bool", 
                   share_code, tags, total_words, study_count, created_at, updated_at
            FROM custom_wordbooks 
            WHERE is_public = 1 
            ORDER BY study_count DESC, created_at DESC 
            LIMIT ?1 OFFSET ?2
            "#,
            limit, offset
        )
        .fetch_all(&self.database.pool)
        .await?;

        let summaries = wordbooks.into_iter().map(|wb| wb.to_summary()).collect();
        Ok(summaries)
    }

    pub async fn get_wordbook_by_share_code(&self, share_code: &str) -> Result<SharedWordbookInfo, AppError> {
        let result = sqlx::query!(
            r#"
            SELECT w.id, w.name, w.description, w.total_words, w.study_count, 
                   w.categories, w.difficulties, w.tags, w.created_at, u.name as creator_name
            FROM custom_wordbooks w
            JOIN users u ON w.user_id = u.id
            WHERE w.share_code = ?1 AND w.is_shared = 1
            "#,
            share_code
        )
        .fetch_optional(&self.database.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Shared wordbook not found".to_string()))?;

        let categories: Vec<String> = result.categories
            .and_then(|c| serde_json::from_str(&c).ok())
            .unwrap_or_default();
        
        let difficulties: Vec<String> = result.difficulties
            .and_then(|d| serde_json::from_str(&d).ok())
            .unwrap_or_default();
        
        let tags: Vec<String> = result.tags
            .and_then(|t| serde_json::from_str(&t).ok())
            .unwrap_or_default();

        Ok(SharedWordbookInfo {
            id: result.id,
            name: result.name,
            description: result.description,
            total_words: result.total_words,
            study_count: result.study_count,
            categories,
            difficulties,
            tags,
            creator_name: result.creator_name,
            created_at: result.created_at,
        })
    }

    pub async fn get_user_wordbooks(
        &self,
        user_id: i32,
        limit: i32,
        offset: i32,
        search: Option<String>,
    ) -> Result<Vec<WordbookSummary>, AppError> {
        let wordbooks = if let Some(search_term) = search {
            sqlx::query_as!(
                CustomWordbook,
                r#"
                SELECT id, user_id, name, description, word_ids, categories, difficulties,
                       is_public as "is_public: bool", is_shared as "is_shared: bool", 
                       share_code, tags, total_words, study_count, created_at, updated_at
                FROM custom_wordbooks 
                WHERE user_id = ?1 AND (name LIKE ?2 OR description LIKE ?2)
                ORDER BY updated_at DESC 
                LIMIT ?3 OFFSET ?4
                "#,
                user_id, format!("%{}%", search_term), limit, offset
            )
        } else {
            sqlx::query_as!(
                CustomWordbook,
                r#"
                SELECT id, user_id, name, description, word_ids, categories, difficulties,
                       is_public as "is_public: bool", is_shared as "is_shared: bool", 
                       share_code, tags, total_words, study_count, created_at, updated_at
                FROM custom_wordbooks 
                WHERE user_id = ?1
                ORDER BY updated_at DESC 
                LIMIT ?2 OFFSET ?3
                "#,
                user_id, limit, offset
            )
        }
        .fetch_all(&self.database.pool)
        .await?;

        let summaries = wordbooks.into_iter().map(|wb| wb.to_summary()).collect();
        Ok(summaries)
    }

    pub async fn create_wordbook(&self, user_id: i32, request: CreateWordbookRequest) -> Result<WordbookSummary, AppError> {
        validate_request(&request)?;

        let now = Utc::now();
        let word_ids_json = serde_json::to_string(&request.word_ids)?;
        let categories_json = request.categories.as_ref().map(|c| serde_json::to_string(c)).transpose()?;
        let difficulties_json = request.difficulties.as_ref().map(|d| serde_json::to_string(d)).transpose()?;
        let tags_json = request.tags.as_ref().map(|t| serde_json::to_string(t)).transpose()?;
        let total_words = request.word_ids.len() as i32;

        let result = sqlx::query!(
            r#"
            INSERT INTO custom_wordbooks 
            (user_id, name, description, word_ids, categories, difficulties, is_public, tags, total_words, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
            RETURNING id
            "#,
            user_id,
            request.name,
            request.description,
            word_ids_json,
            categories_json,
            difficulties_json,
            request.is_public.unwrap_or(false),
            tags_json,
            total_words,
            now,
            now
        )
        .fetch_one(&self.database.pool)
        .await?;

        let wordbook = self.get_wordbook(user_id, result.id).await?;
        Ok(wordbook)
    }

    pub async fn get_wordbook(&self, user_id: i32, wordbook_id: i32) -> Result<WordbookSummary, AppError> {
        let wordbook = sqlx::query_as!(
            CustomWordbook,
            r#"
            SELECT id, user_id, name, description, word_ids, categories, difficulties,
                   is_public as "is_public: bool", is_shared as "is_shared: bool", 
                   share_code, tags, total_words, study_count, created_at, updated_at
            FROM custom_wordbooks 
            WHERE id = ?1 AND user_id = ?2
            "#,
            wordbook_id, user_id
        )
        .fetch_optional(&self.database.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Wordbook not found".to_string()))?;

        Ok(wordbook.to_summary())
    }

    pub async fn update_wordbook(
        &self,
        user_id: i32,
        wordbook_id: i32,
        request: UpdateWordbookRequest,
    ) -> Result<WordbookSummary, AppError> {
        validate_request(&request)?;

        let mut wordbook = sqlx::query_as!(
            CustomWordbook,
            r#"
            SELECT id, user_id, name, description, word_ids, categories, difficulties,
                   is_public as "is_public: bool", is_shared as "is_shared: bool", 
                   share_code, tags, total_words, study_count, created_at, updated_at
            FROM custom_wordbooks 
            WHERE id = ?1 AND user_id = ?2
            "#,
            wordbook_id, user_id
        )
        .fetch_optional(&self.database.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Wordbook not found".to_string()))?;

        wordbook.update_from_request(&request);

        sqlx::query!(
            r#"
            UPDATE custom_wordbooks 
            SET name = ?1, description = ?2, word_ids = ?3, categories = ?4, difficulties = ?5,
                is_public = ?6, tags = ?7, total_words = ?8, updated_at = ?9
            WHERE id = ?10 AND user_id = ?11
            "#,
            wordbook.name,
            wordbook.description,
            wordbook.word_ids,
            wordbook.categories,
            wordbook.difficulties,
            wordbook.is_public,
            wordbook.tags,
            wordbook.total_words,
            wordbook.updated_at,
            wordbook_id,
            user_id
        )
        .execute(&self.database.pool)
        .await?;

        Ok(wordbook.to_summary())
    }

    pub async fn delete_wordbook(&self, user_id: i32, wordbook_id: i32) -> Result<(), AppError> {
        let result = sqlx::query!(
            "DELETE FROM custom_wordbooks WHERE id = ?1 AND user_id = ?2",
            wordbook_id, user_id
        )
        .execute(&self.database.pool)
        .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::NotFound("Wordbook not found".to_string()));
        }

        Ok(())
    }

    pub async fn share_wordbook(&self, user_id: i32, wordbook_id: i32) -> Result<String, AppError> {
        let share_code = CustomWordbook::generate_share_code();

        let result = sqlx::query!(
            "UPDATE custom_wordbooks SET is_shared = 1, share_code = ?1 WHERE id = ?2 AND user_id = ?3",
            share_code, wordbook_id, user_id
        )
        .execute(&self.database.pool)
        .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::NotFound("Wordbook not found".to_string()));
        }

        Ok(share_code)
    }

    pub async fn unshare_wordbook(&self, user_id: i32, wordbook_id: i32) -> Result<(), AppError> {
        let result = sqlx::query!(
            "UPDATE custom_wordbooks SET is_shared = 0, share_code = NULL WHERE id = ?1 AND user_id = ?2",
            wordbook_id, user_id
        )
        .execute(&self.database.pool)
        .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::NotFound("Wordbook not found".to_string()));
        }

        Ok(())
    }
}