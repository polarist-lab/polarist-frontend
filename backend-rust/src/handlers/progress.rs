use axum::{
    extract::{Extension, Path, Query},
    response::Json,
    routing::{get, patch, post},
    Router,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use serde_json::{json, Value};
use std::sync::Arc;

use crate::{
    models::{CreateProgressRequest, UpdateProgressRequest},
    services::progress::ProgressService,
    utils::errors::AppError,
    AppState,
};

pub fn routes() -> Router {
    Router::new()
        .route("/system/stats", get(get_system_wide_stats_handler))
        .route("/:user_id", get(get_user_progress))
        .route("/:user_id/stats", get(get_progress_stats))
        .route("/:user_id/words/:word_id", get(get_word_progress))
        .route("/:user_id/words/:word_id", post(create_word_progress))
        .route("/:user_id/words/:word_id", patch(update_word_progress))
        .route("/:user_id/sessions", get(get_study_sessions))
        .route("/:user_id/sessions", post(create_study_session))
        .route("/:user_id/sessions/:session_id", get(get_study_session))
        .route("/:user_id/sessions/:session_id", patch(update_study_session))
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct ProgressQuery {
    limit: Option<i32>,
    offset: Option<i32>,
    learned_only: Option<bool>,
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct SessionQuery {
    limit: Option<i32>,
    offset: Option<i32>,
    active_only: Option<bool>,
}

#[utoipa::path(
    get,
    path = "/progress/system/stats",
    responses(
        (status = 200, description = "System-wide statistics retrieved successfully", body = Value),
        (status = 500, description = "Internal server error")
    ),
    tag = "Progress"
)]
pub async fn get_system_wide_stats_handler(
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Json<Value>, AppError> {
    let progress_service = ProgressService::new(&state.database);
    let stats = progress_service.get_system_wide_stats().await?;
    
    Ok(Json(json!({
        "stats": stats,
        "message": "System-wide statistics retrieved successfully"
    })))
}

#[utoipa::path(
    get,
    path = "/progress/{user_id}",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        ProgressQuery
    ),
    responses(
        (status = 200, description = "User progress retrieved successfully", body = Value),
        (status = 404, description = "User not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Progress"
)]
pub async fn get_user_progress(
    Extension(state): Extension<Arc<AppState>>,
    Path(user_id): Path<i32>,
    Query(query): Query<ProgressQuery>,
) -> Result<Json<Value>, AppError> {
    let progress_service = ProgressService::new(&state.database);
    let progress = progress_service
        .get_user_progress(
            user_id,
            query.limit.unwrap_or(50),
            query.offset.unwrap_or(0),
            query.learned_only.unwrap_or(false),
        )
        .await?;
    
    Ok(Json(json!({
        "progress": progress,
        "message": "User progress retrieved successfully"
    })))
}

#[utoipa::path(
    get,
    path = "/progress/{user_id}/stats",
    params(
        ("user_id" = i32, Path, description = "User ID")
    ),
    responses(
        (status = 200, description = "Progress statistics retrieved successfully", body = Value),
        (status = 404, description = "User not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Progress"
)]
pub async fn get_progress_stats(
    Extension(state): Extension<Arc<AppState>>,
    Path(user_id): Path<i32>,
) -> Result<Json<Value>, AppError> {
    let progress_service = ProgressService::new(&state.database);
    let stats = progress_service.get_progress_stats(user_id).await?;
    
    Ok(Json(json!({
        "stats": stats,
        "message": "Progress statistics retrieved successfully"
    })))
}

#[utoipa::path(
    get,
    path = "/progress/{user_id}/words/{word_id}",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        ("word_id" = String, Path, description = "Word ID")
    ),
    responses(
        (status = 200, description = "Word progress retrieved successfully", body = Value),
        (status = 404, description = "Progress not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Progress"
)]
pub async fn get_word_progress(
    Extension(state): Extension<Arc<AppState>>,
    Path((user_id, word_id)): Path<(i32, String)>,
) -> Result<Json<Value>, AppError> {
    let progress_service = ProgressService::new(&state.database);
    let progress = progress_service.get_word_progress(user_id, &word_id).await?;
    
    Ok(Json(json!({
        "progress": progress,
        "message": "Word progress retrieved successfully"
    })))
}

#[utoipa::path(
    post,
    path = "/progress/{user_id}/words/{word_id}",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        ("word_id" = String, Path, description = "Word ID")
    ),
    request_body = CreateProgressRequest,
    responses(
        (status = 201, description = "Word progress created successfully", body = Value),
        (status = 400, description = "Invalid request"),
        (status = 404, description = "User not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Progress"
)]
pub async fn create_word_progress(
    Extension(state): Extension<Arc<AppState>>,
    Path((user_id, word_id)): Path<(i32, String)>,
    Json(mut request): Json<CreateProgressRequest>,
) -> Result<Json<Value>, AppError> {
    request.word_id = word_id;
    
    let progress_service = ProgressService::new(&state.database);
    let progress = progress_service.create_word_progress(user_id, request).await?;
    
    Ok(Json(json!({
        "progress": progress,
        "message": "Word progress created successfully"
    })))
}

#[utoipa::path(
    patch,
    path = "/progress/{user_id}/words/{word_id}",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        ("word_id" = String, Path, description = "Word ID")
    ),
    request_body = UpdateProgressRequest,
    responses(
        (status = 200, description = "Word progress updated successfully", body = Value),
        (status = 404, description = "Progress not found"),
        (status = 400, description = "Invalid request"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Progress"
)]
pub async fn update_word_progress(
    Extension(state): Extension<Arc<AppState>>,
    Path((user_id, word_id)): Path<(i32, String)>,
    Json(request): Json<UpdateProgressRequest>,
) -> Result<Json<Value>, AppError> {
    let progress_service = ProgressService::new(&state.database);
    let progress = progress_service.update_word_progress(user_id, &word_id, request).await?;
    
    Ok(Json(json!({
        "progress": progress,
        "message": "Word progress updated successfully"
    })))
}

#[utoipa::path(
    get,
    path = "/progress/{user_id}/sessions",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        SessionQuery
    ),
    responses(
        (status = 200, description = "Study sessions retrieved successfully", body = Value),
        (status = 404, description = "User not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Progress"
)]
pub async fn get_study_sessions(
    Extension(state): Extension<Arc<AppState>>,
    Path(user_id): Path<i32>,
    Query(query): Query<SessionQuery>,
) -> Result<Json<Value>, AppError> {
    let progress_service = ProgressService::new(&state.database);
    let sessions = progress_service
        .get_study_sessions(
            user_id,
            query.limit.unwrap_or(20),
            query.offset.unwrap_or(0),
            query.active_only.unwrap_or(false),
        )
        .await?;
    
    Ok(Json(json!({
        "sessions": sessions,
        "message": "Study sessions retrieved successfully"
    })))
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct CreateSessionRequest {
    session_id: String,
    metadata: Option<Value>,
}

#[utoipa::path(
    post,
    path = "/progress/{user_id}/sessions",
    params(
        ("user_id" = i32, Path, description = "User ID")
    ),
    request_body = CreateSessionRequest,
    responses(
        (status = 201, description = "Study session created successfully", body = Value),
        (status = 400, description = "Invalid request"),
        (status = 404, description = "User not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Progress"
)]
pub async fn create_study_session(
    Extension(state): Extension<Arc<AppState>>,
    Path(user_id): Path<i32>,
    Json(request): Json<CreateSessionRequest>,
) -> Result<Json<Value>, AppError> {
    let progress_service = ProgressService::new(&state.database);
    let session = progress_service
        .create_study_session(user_id, request.session_id, request.metadata)
        .await?;
    
    Ok(Json(json!({
        "session": session,
        "message": "Study session created successfully"
    })))
}

#[utoipa::path(
    get,
    path = "/progress/{user_id}/sessions/{session_id}",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        ("session_id" = String, Path, description = "Session ID")
    ),
    responses(
        (status = 200, description = "Study session retrieved successfully", body = Value),
        (status = 404, description = "Session not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Progress"
)]
pub async fn get_study_session(
    Extension(state): Extension<Arc<AppState>>,
    Path((user_id, session_id)): Path<(i32, String)>,
) -> Result<Json<Value>, AppError> {
    let progress_service = ProgressService::new(&state.database);
    let session = progress_service.get_study_session(user_id, &session_id).await?;
    
    Ok(Json(json!({
        "session": session,
        "message": "Study session retrieved successfully"
    })))
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct UpdateSessionRequest {
    words_studied: Option<i32>,
    correct_answers: Option<i32>,
    total_attempts: Option<i32>,
    duration: Option<i32>,
    metadata: Option<Value>,
    end_session: Option<bool>,
}

#[utoipa::path(
    patch,
    path = "/progress/{user_id}/sessions/{session_id}",
    params(
        ("user_id" = i32, Path, description = "User ID"),
        ("session_id" = String, Path, description = "Session ID")
    ),
    request_body = UpdateSessionRequest,
    responses(
        (status = 200, description = "Study session updated successfully", body = Value),
        (status = 404, description = "Session not found"),
        (status = 400, description = "Invalid request"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Progress"
)]
pub async fn update_study_session(
    Extension(state): Extension<Arc<AppState>>,
    Path((user_id, session_id)): Path<(i32, String)>,
    Json(request): Json<UpdateSessionRequest>,
) -> Result<Json<Value>, AppError> {
    let update_request = crate::models::UpdateSessionRequest {
        words_studied: request.words_studied,
        correct_answers: request.correct_answers,
        total_attempts: request.total_attempts,
        duration: request.duration,
        metadata: request.metadata,
        end_session: request.end_session,
    };
    
    let progress_service = ProgressService::new(&state.database);
    let session = progress_service
        .update_study_session(user_id, &session_id, update_request)
        .await?;
    
    Ok(Json(json!({
        "session": session,
        "message": "Study session updated successfully"
    })))
}