use axum::{
    extract::{Extension, Request},
    http::{HeaderMap, StatusCode},
    middleware::Next,
    response::Response,
};
use std::sync::Arc;

use crate::{services::auth::AuthService, utils::errors::AppError, AppState};

pub async fn auth_middleware(
    Extension(state): Extension<Arc<AppState>>,
    headers: HeaderMap,
    mut request: Request,
    next: Next,
) -> Result<Response, AppError> {
    let auth_header = headers
        .get("Authorization")
        .and_then(|header| header.to_str().ok())
        .ok_or_else(|| AppError::Authentication("Missing Authorization header".to_string()))?;

    if !auth_header.starts_with("Bearer ") {
        return Err(AppError::Authentication("Invalid Authorization header format".to_string()));
    }

    let token = &auth_header[7..]; // Remove "Bearer " prefix
    
    let auth_service = AuthService::new(&state.database);
    let user = auth_service.verify_token(token).await?;

    // Add user to request extensions
    request.extensions_mut().insert(user);

    Ok(next.run(request).await)
}