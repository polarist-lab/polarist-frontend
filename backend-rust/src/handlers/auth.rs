use axum::{
    extract::{Extension, Query},
    http::StatusCode,
    response::{Json, Redirect},
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::sync::Arc;
use utoipa::ToSchema;

use crate::{services::auth::AuthService, utils::errors::AppError, AppState};

pub fn routes() -> Router {
    Router::new()
        .route("/mock-login", get(mock_login))
        .route("/google/signup", get(google_signup))
        .route("/google/signup/redirect", get(google_signup_callback))
        .route("/google/signin", get(google_signin))
        .route("/google/signin/redirect", get(google_signin_callback))
        .route("/profile", get(get_profile))
        .route("/logout", get(logout))
        .route("/migrate-guest-data", post(migrate_guest_data))
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct LoginQuery {
    guest_id: Option<String>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct AuthResponse {
    pub access_token: String,
    pub user: crate::models::User,
    pub new_user: bool,
    pub guest_data_migrated: bool,
}

// Mock login for development/testing
#[utoipa::path(
    get,
    path = "/auth/mock-login",
    responses(
        (status = 302, description = "Redirect to frontend with token")
    ),
    tag = "Authentication"
)]
pub async fn mock_login(
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Redirect, AppError> {
    let auth_service = AuthService::new(&state.database);
    
    let mock_user_data = json!({
        "google_id": "mock-google-id-123",
        "email": "test@example.com",
        "name": "테스트 사용자",
        "avatar": "https://via.placeholder.com/32"
    });

    let auth_response = auth_service.google_login(mock_user_data).await?;
    
    let redirect_url = format!(
        "{}/auth/callback?token={}",
        state.config.frontend_url,
        auth_response.access_token
    );
    
    Ok(Redirect::to(&redirect_url))
}

pub async fn google_signup(
    Query(query): Query<LoginQuery>,
) -> Result<Redirect, AppError> {
    // In a real implementation, this would redirect to Google OAuth
    // For now, we'll simulate it
    let google_oauth_url = format!(
        "https://accounts.google.com/oauth/authorize?client_id=mock&redirect_uri=signup/redirect&scope=email%20profile&response_type=code&state={}",
        query.guest_id.unwrap_or_default()
    );
    
    Ok(Redirect::to(&google_oauth_url))
}

pub async fn google_signup_callback(
    Extension(state): Extension<Arc<AppState>>,
    Query(query): Query<serde_json::Map<String, serde_json::Value>>,
) -> Result<Redirect, AppError> {
    let auth_service = AuthService::new(&state.database);
    
    // Mock Google user data - in real implementation, this would come from Google
    let mock_user_data = json!({
        "google_id": "google-signup-123",
        "email": "newuser@example.com",
        "name": "새 사용자",
        "avatar": "https://via.placeholder.com/32"
    });

    let guest_id = query.get("state").and_then(|v| v.as_str());
    let auth_response = auth_service.google_signup(mock_user_data, guest_id).await?;
    
    let redirect_url = format!(
        "{}/auth/callback?token={}&new_user=true&migrated={}",
        state.config.frontend_url,
        auth_response.access_token,
        auth_response.guest_data_migrated
    );
    
    Ok(Redirect::to(&redirect_url))
}

pub async fn google_signin() -> Result<Redirect, AppError> {
    // In a real implementation, this would redirect to Google OAuth
    let google_oauth_url = "https://accounts.google.com/oauth/authorize?client_id=mock&redirect_uri=signin/redirect&scope=email%20profile&response_type=code";
    
    Ok(Redirect::to(google_oauth_url))
}

pub async fn google_signin_callback(
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Redirect, AppError> {
    let auth_service = AuthService::new(&state.database);
    
    // Mock Google user data - in real implementation, this would come from Google
    let mock_user_data = json!({
        "google_id": "google-signin-123",
        "email": "user@example.com",
        "name": "기존 사용자",
        "avatar": "https://via.placeholder.com/32"
    });

    let auth_response = auth_service.google_login(mock_user_data).await?;
    
    let redirect_url = format!(
        "{}/auth/callback?token={}",
        state.config.frontend_url,
        auth_response.access_token
    );
    
    Ok(Redirect::to(&redirect_url))
}

#[utoipa::path(
    get,
    path = "/auth/profile",
    responses(
        (status = 200, description = "User profile retrieved", body = AuthResponse)
    ),
    tag = "Authentication"
)]
pub async fn get_profile(
    Extension(_state): Extension<Arc<AppState>>,
    // TODO: Add JWT authentication middleware to extract user from token
) -> Result<Json<Value>, AppError> {
    // This would normally extract user from JWT token
    Ok(Json(json!({
        "user": {
            "id": 1,
            "email": "test@example.com",
            "name": "테스트 사용자",
            "locale": "en"
        },
        "message": "User profile retrieved successfully"
    })))
}

pub async fn logout() -> Result<Json<Value>, AppError> {
    Ok(Json(json!({
        "message": "Logged out successfully"
    })))
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct MigrateGuestDataRequest {
    guest_id: String,
}

pub async fn migrate_guest_data(
    Extension(_state): Extension<Arc<AppState>>,
    Json(request): Json<MigrateGuestDataRequest>,
) -> Result<Json<Value>, AppError> {
    // TODO: Implement guest data migration
    let _guest_id = request.guest_id;
    
    Ok(Json(json!({
        "success": true,
        "message": "Guest data migrated successfully"
    })))
}