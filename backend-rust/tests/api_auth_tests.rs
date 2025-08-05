mod common;

use axum_test::TestServer;
use common::TestContext;
use serde_json::Value;

#[tokio::test]
async fn test_health_check() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server.get("/health").await;
    
    response.assert_status_ok();
    response.assert_json(&serde_json::json!({
        "status": "healthy",
        "service": "polarist-backend",
        "version": env!("CARGO_PKG_VERSION")
    }));
}

#[tokio::test]
async fn test_mock_login() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server.get("/api/v1/auth/mock-login").await;
    
    // Should redirect to frontend with token
    assert_eq!(response.status_code(), 302);
    
    let location = response.headers().get("location").unwrap();
    assert!(location.to_str().unwrap().contains("/auth/callback?token="));
}

#[tokio::test]
async fn test_get_profile_without_auth() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server.get("/api/v1/auth/profile").await;
    
    // Should return mock profile for now (since JWT middleware not implemented)
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert!(json["user"]["email"].as_str().is_some());
    assert!(json["message"].as_str().is_some());
}

#[tokio::test]
async fn test_migrate_guest_data() {
    let ctx = TestContext::new().await;
    
    let request_body = serde_json::json!({
        "guest_id": "test-guest-123"
    });
    
    let response = ctx.server
        .post("/api/v1/auth/migrate-guest-data")
        .json(&request_body)
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert_eq!(json["success"], true);
    assert!(json["message"].as_str().is_some());
}

#[tokio::test]
async fn test_google_signup_redirect() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server.get("/api/v1/auth/google/signup").await;
    
    // Should redirect to Google OAuth
    assert_eq!(response.status_code(), 302);
    
    let location = response.headers().get("location").unwrap();
    assert!(location.to_str().unwrap().contains("accounts.google.com"));
}

#[tokio::test]
async fn test_google_signin_redirect() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server.get("/api/v1/auth/google/signin").await;
    
    // Should redirect to Google OAuth
    assert_eq!(response.status_code(), 302);
    
    let location = response.headers().get("location").unwrap();
    assert!(location.to_str().unwrap().contains("accounts.google.com"));
}