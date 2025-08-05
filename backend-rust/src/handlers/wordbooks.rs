use axum::{
    extract::{Extension, Path, Query},
    response::Json,
    routing::{delete, get, patch, post},
    Router,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use serde_json::{json, Value};
use std::sync::Arc;

use crate::{
    models::{CreateWordbookRequest, UpdateWordbookRequest},
    services::wordbook::WordbookService,
    utils::errors::AppError,
    AppState,
};

pub fn routes() -> Router {
    Router::new()
        .route("/", get(get_public_wordbooks))
        .route("/shared/:share_code", get(get_shared_wordbook))
        .route("/users/:user_id", get(get_user_wordbooks))
        .route("/users/:user_id", post(create_wordbook))
        .route("/users/:user_id/:wordbook_id", get(get_wordbook))
        .route("/users/:user_id/:wordbook_id", patch(update_wordbook))
        .route("/users/:user_id/:wordbook_id", delete(delete_wordbook))
        .route("/users/:user_id/:wordbook_id/share", post(share_wordbook))
        .route("/users/:user_id/:wordbook_id/unshare", post(unshare_wordbook))
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct WordbookQuery {
    limit: Option<i32>,
    offset: Option<i32>,
    search: Option<String>,
    category: Option<String>,
    difficulty: Option<String>,
}

#[utoipa::path(
    get,
    path = "/wordbooks",
    params(WordbookQuery),
    responses(
        (status = 200, description = "Public wordbooks retrieved successfully", body = Value),
        (status = 500, description = "Internal server error")
    ),
    tag = "Wordbooks"
)]
pub async fn get_public_wordbooks(
    Extension(state): Extension<Arc<AppState>>,
    Query(query): Query<WordbookQuery>,
) -> Result<Json<Value>, AppError> {
    let wordbook_service = WordbookService::new(&state.database);
    let wordbooks = wordbook_service
        .get_public_wordbooks(
            query.limit.unwrap_or(20),
            query.offset.unwrap_or(0),
            query.search,
            query.category,
            query.difficulty,
        )
        .await?;
    
    Ok(Json(json!({
        "wordbooks": wordbooks,
        "message": "Public wordbooks retrieved successfully"
    })))
}

#[utoipa::path(
    get,
    path = "/wordbooks/shared/{share_code}",
    params(
        ("share_code" = String, Path, description = "Wordbook share code")
    ),
    responses(
        (status = 200, description = "Shared wordbook retrieved successfully", body = Value),
        (status = 404, description = "Wordbook not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Wordbooks"
)]
pub async fn get_shared_wordbook(
    Extension(state): Extension<Arc<AppState>>,
    Path(share_code): Path<String>,
) -> Result<Json<Value>, AppError> {
    let wordbook_service = WordbookService::new(&state.database);
    let wordbook = wordbook_service.get_wordbook_by_share_code(&share_code).await?;
    
    Ok(Json(json!({
        "wordbook": wordbook,
        "message": "Shared wordbook retrieved successfully"
    })))
}

#[utoipa::path(
    get,
    path = "/wordbooks/users/{user_id}",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        WordbookQuery
    ),
    responses(
        (status = 200, description = "User wordbooks retrieved successfully", body = Value),
        (status = 404, description = "User not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Wordbooks"
)]
pub async fn get_user_wordbooks(
    Extension(state): Extension<Arc<AppState>>,
    Path(user_id): Path<i32>,
    Query(query): Query<WordbookQuery>,
) -> Result<Json<Value>, AppError> {
    let wordbook_service = WordbookService::new(&state.database);
    let wordbooks = wordbook_service
        .get_user_wordbooks(
            user_id,
            query.limit.unwrap_or(50),
            query.offset.unwrap_or(0),
            query.search,
        )
        .await?;
    
    Ok(Json(json!({
        "wordbooks": wordbooks,
        "message": "User wordbooks retrieved successfully"
    })))
}

#[utoipa::path(
    post,
    path = "/wordbooks/users/{user_id}",
    params(
        ("user_id" = i32, Path, description = "User ID")
    ),
    request_body = CreateWordbookRequest,
    responses(
        (status = 201, description = "Wordbook created successfully", body = Value),
        (status = 400, description = "Invalid request"),
        (status = 404, description = "User not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Wordbooks"
)]
pub async fn create_wordbook(
    Extension(state): Extension<Arc<AppState>>,
    Path(user_id): Path<i32>,
    Json(request): Json<CreateWordbookRequest>,
) -> Result<Json<Value>, AppError> {
    let wordbook_service = WordbookService::new(&state.database);
    let wordbook = wordbook_service.create_wordbook(user_id, request).await?;
    
    Ok(Json(json!({
        "wordbook": wordbook,
        "message": "Wordbook created successfully"
    })))
}

#[utoipa::path(
    get,
    path = "/wordbooks/users/{user_id}/{wordbook_id}",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        ("wordbook_id" = i32, Path, description = "Wordbook ID")
    ),
    responses(
        (status = 200, description = "Wordbook retrieved successfully", body = Value),
        (status = 404, description = "Wordbook not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Wordbooks"
)]
pub async fn get_wordbook(
    Extension(state): Extension<Arc<AppState>>,
    Path((user_id, wordbook_id)): Path<(i32, i32)>,
) -> Result<Json<Value>, AppError> {
    let wordbook_service = WordbookService::new(&state.database);
    let wordbook = wordbook_service.get_wordbook(user_id, wordbook_id).await?;
    
    Ok(Json(json!({
        "wordbook": wordbook,
        "message": "Wordbook retrieved successfully"
    })))
}

#[utoipa::path(
    patch,
    path = "/wordbooks/users/{user_id}/{wordbook_id}",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        ("wordbook_id" = i32, Path, description = "Wordbook ID")
    ),
    request_body = UpdateWordbookRequest,
    responses(
        (status = 200, description = "Wordbook updated successfully", body = Value),
        (status = 404, description = "Wordbook not found"),
        (status = 400, description = "Invalid request"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Wordbooks"
)]
pub async fn update_wordbook(
    Extension(state): Extension<Arc<AppState>>,
    Path((user_id, wordbook_id)): Path<(i32, i32)>,
    Json(request): Json<UpdateWordbookRequest>,
) -> Result<Json<Value>, AppError> {
    let wordbook_service = WordbookService::new(&state.database);
    let wordbook = wordbook_service.update_wordbook(user_id, wordbook_id, request).await?;
    
    Ok(Json(json!({
        "wordbook": wordbook,
        "message": "Wordbook updated successfully"
    })))
}

#[utoipa::path(
    delete,
    path = "/wordbooks/users/{user_id}/{wordbook_id}",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        ("wordbook_id" = i32, Path, description = "Wordbook ID")
    ),
    responses(
        (status = 200, description = "Wordbook deleted successfully", body = Value),
        (status = 404, description = "Wordbook not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Wordbooks"
)]
pub async fn delete_wordbook(
    Extension(state): Extension<Arc<AppState>>,
    Path((user_id, wordbook_id)): Path<(i32, i32)>,
) -> Result<Json<Value>, AppError> {
    let wordbook_service = WordbookService::new(&state.database);
    wordbook_service.delete_wordbook(user_id, wordbook_id).await?;
    
    Ok(Json(json!({
        "message": "Wordbook deleted successfully"
    })))
}

#[utoipa::path(
    post,
    path = "/wordbooks/users/{user_id}/{wordbook_id}/share",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        ("wordbook_id" = i32, Path, description = "Wordbook ID")
    ),
    responses(
        (status = 200, description = "Wordbook shared successfully", body = Value),
        (status = 404, description = "Wordbook not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Wordbooks"
)]
pub async fn share_wordbook(
    Extension(state): Extension<Arc<AppState>>,
    Path((user_id, wordbook_id)): Path<(i32, i32)>,
) -> Result<Json<Value>, AppError> {
    let wordbook_service = WordbookService::new(&state.database);
    let share_code = wordbook_service.share_wordbook(user_id, wordbook_id).await?;
    
    Ok(Json(json!({
        "share_code": share_code,
        "message": "Wordbook shared successfully"
    })))
}

#[utoipa::path(
    post,
    path = "/wordbooks/users/{user_id}/{wordbook_id}/unshare",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        ("wordbook_id" = i32, Path, description = "Wordbook ID")
    ),
    responses(
        (status = 200, description = "Wordbook unshared successfully", body = Value),
        (status = 404, description = "Wordbook not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Wordbooks"
)]
pub async fn unshare_wordbook(
    Extension(state): Extension<Arc<AppState>>,
    Path((user_id, wordbook_id)): Path<(i32, i32)>,
) -> Result<Json<Value>, AppError> {
    let wordbook_service = WordbookService::new(&state.database);
    wordbook_service.unshare_wordbook(user_id, wordbook_id).await?;
    
    Ok(Json(json!({
        "message": "Wordbook unshared successfully"
    })))
}