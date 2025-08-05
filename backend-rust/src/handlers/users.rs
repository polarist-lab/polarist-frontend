use axum::{
    extract::{Extension, Path},
    http::StatusCode,
    response::Json,
    routing::{get, patch, post},
    Router,
};
use serde_json::{json, Value};
use std::sync::Arc;

use crate::{
    models::{CreateUserRequest, UpdateUserRequest, UpdateUserSettingsRequest},
    services::user::UserService,
    utils::errors::AppError,
    AppState,
};

pub fn routes() -> Router {
    Router::new()
        .route("/", post(create_user))
        .route("/:id", get(get_user))
        .route("/:id", patch(update_user))
        .route("/:id/settings", get(get_user_settings))
        .route("/:id/settings", patch(update_user_settings))
}

#[utoipa::path(
    post,
    path = "/users",
    request_body = CreateUserRequest,
    responses(
        (status = 201, description = "User created successfully", body = Value),
        (status = 400, description = "Invalid request"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Users"
)]
pub async fn create_user(
    Extension(state): Extension<Arc<AppState>>,
    Json(request): Json<CreateUserRequest>,
) -> Result<Json<Value>, AppError> {
    let user_service = UserService::new(&state.database);
    let user = user_service.create_user(request).await?;
    
    Ok(Json(json!({
        "user": user,
        "message": "User created successfully"
    })))
}

#[utoipa::path(
    get,
    path = "/users/{id}",
    params(
        ("id" = i32, Path, description = "User ID")
    ),
    responses(
        (status = 200, description = "User retrieved successfully", body = Value),
        (status = 404, description = "User not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Users"
)]
pub async fn get_user(
    Extension(state): Extension<Arc<AppState>>,
    Path(user_id): Path<i32>,
) -> Result<Json<Value>, AppError> {
    let user_service = UserService::new(&state.database);
    let user = user_service.get_user_by_id(user_id).await?;
    
    Ok(Json(json!({
        "user": user,
        "message": "User retrieved successfully"
    })))
}

#[utoipa::path(
    patch,
    path = "/users/{id}",
    params(
        ("id" = i32, Path, description = "User ID")
    ),
    request_body = UpdateUserRequest,
    responses(
        (status = 200, description = "User updated successfully", body = Value),
        (status = 404, description = "User not found"),
        (status = 400, description = "Invalid request"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Users"
)]
pub async fn update_user(
    Extension(state): Extension<Arc<AppState>>,
    Path(user_id): Path<i32>,
    Json(request): Json<UpdateUserRequest>,
) -> Result<Json<Value>, AppError> {
    let user_service = UserService::new(&state.database);
    let user = user_service.update_user(user_id, request).await?;
    
    Ok(Json(json!({
        "user": user,
        "message": "User updated successfully"
    })))
}

#[utoipa::path(
    get,
    path = "/users/{id}/settings",
    params(
        ("id" = i32, Path, description = "User ID")
    ),
    responses(
        (status = 200, description = "User settings retrieved successfully", body = Value),
        (status = 404, description = "User not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Users"
)]
pub async fn get_user_settings(
    Extension(state): Extension<Arc<AppState>>,
    Path(user_id): Path<i32>,
) -> Result<Json<Value>, AppError> {
    let user_service = UserService::new(&state.database);
    let settings = user_service.get_user_settings(user_id).await?;
    
    Ok(Json(json!({
        "settings": settings,
        "message": "User settings retrieved successfully"
    })))
}

#[utoipa::path(
    patch,
    path = "/users/{id}/settings",
    params(
        ("id" = i32, Path, description = "User ID")
    ),
    request_body = UpdateUserSettingsRequest,
    responses(
        (status = 200, description = "User settings updated successfully", body = Value),
        (status = 404, description = "User not found"),
        (status = 400, description = "Invalid request"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Users"
)]
pub async fn update_user_settings(
    Extension(state): Extension<Arc<AppState>>,
    Path(user_id): Path<i32>,
    Json(request): Json<UpdateUserSettingsRequest>,
) -> Result<Json<Value>, AppError> {
    let user_service = UserService::new(&state.database);
    let settings = user_service.update_user_settings(user_id, request).await?;
    
    Ok(Json(json!({
        "settings": settings,
        "message": "User settings updated successfully"
    })))
}