mod common;

use common::{TestContext, create_test_user_request};
use serde_json::Value;

#[tokio::test]
async fn test_create_user() {
    let ctx = TestContext::new().await;
    let user_data = create_test_user_request();
    
    let response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert!(json["user"]["id"].as_i64().is_some());
    assert_eq!(json["user"]["email"], "test@example.com");
    assert_eq!(json["user"]["name"], "Test User");
    assert_eq!(json["user"]["locale"], "en");
    assert!(json["message"].as_str().is_some());
}

#[tokio::test]
async fn test_create_user_invalid_email() {
    let ctx = TestContext::new().await;
    
    let invalid_user_data = serde_json::json!({
        "email": "invalid-email",
        "name": "Test User",
        "locale": "en"
    });
    
    let response = ctx.server
        .post("/api/v1/users")
        .json(&invalid_user_data)
        .await;
    
    // Should fail validation
    assert_eq!(response.status_code(), 400);
}

#[tokio::test]
async fn test_get_user() {
    let ctx = TestContext::new().await;
    
    // First create a user
    let user_data = create_test_user_request();
    let create_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    create_response.assert_status_ok();
    let created_user: Value = create_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    // Then get the user
    let response = ctx.server
        .get(&format!("/api/v1/users/{}", user_id))
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert_eq!(json["user"]["id"], user_id);
    assert_eq!(json["user"]["email"], "test@example.com");
}

#[tokio::test]
async fn test_get_nonexistent_user() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server.get("/api/v1/users/99999").await;
    
    // Should return 404
    assert_eq!(response.status_code(), 404);
}

#[tokio::test]
async fn test_update_user() {
    let ctx = TestContext::new().await;
    
    // First create a user
    let user_data = create_test_user_request();
    let create_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    // Update the user
    let update_data = serde_json::json!({
        "name": "Updated User Name",
        "locale": "ko"
    });
    
    let response = ctx.server
        .patch(&format!("/api/v1/users/{}", user_id))
        .json(&update_data)
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert_eq!(json["user"]["name"], "Updated User Name");
    assert_eq!(json["user"]["locale"], "ko");
}

#[tokio::test]
async fn test_user_settings() {
    let ctx = TestContext::new().await;
    
    // First create a user
    let user_data = create_test_user_request();
    let create_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    // Get user settings (should create default settings)
    let get_response = ctx.server
        .get(&format!("/api/v1/users/{}/settings", user_id))
        .await;
    
    get_response.assert_status_ok();
    
    let settings: Value = get_response.json();
    assert!(settings["settings"]["learning_goal"].as_str().is_some());
    assert!(settings["settings"]["daily_goal"].as_i64().is_some());
    
    // Update user settings
    let update_data = serde_json::json!({
        "learning_goal": "conversational",
        "study_reminders": true,
        "email_notifications": false,
        "difficulty_level": "intermediate",
        "daily_goal": 50
    });
    
    let update_response = ctx.server
        .patch(&format!("/api/v1/users/{}/settings", user_id))
        .json(&update_data)
        .await;
    
    update_response.assert_status_ok();
    
    let updated_settings: Value = update_response.json();
    assert_eq!(updated_settings["settings"]["learning_goal"], "conversational");
    assert_eq!(updated_settings["settings"]["daily_goal"], 50);
}