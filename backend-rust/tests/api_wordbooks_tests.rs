mod common;

use common::{TestContext, create_test_user_request, create_test_wordbook_request};
use serde_json::Value;

#[tokio::test]
async fn test_create_wordbook() {
    let ctx = TestContext::new().await;
    
    // First create a user
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    // Create a wordbook
    let wordbook_data = create_test_wordbook_request();
    let response = ctx.server
        .post(&format!("/api/v1/wordbooks/users/{}", user_id))
        .json(&wordbook_data)
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert!(json["wordbook"]["id"].as_i64().is_some());
    assert_eq!(json["wordbook"]["name"], "Test Wordbook");
    assert_eq!(json["wordbook"]["user_id"], user_id);
    assert_eq!(json["wordbook"]["total_words"], 3);
}

#[tokio::test]
async fn test_get_user_wordbooks() {
    let ctx = TestContext::new().await;
    
    // Create user and wordbook
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    let wordbook_data = create_test_wordbook_request();
    let _create_wordbook_response = ctx.server
        .post(&format!("/api/v1/wordbooks/users/{}", user_id))
        .json(&wordbook_data)
        .await;
    
    // Get user wordbooks
    let response = ctx.server
        .get(&format!("/api/v1/wordbooks/users/{}", user_id))
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert!(json["wordbooks"].as_array().is_some());
    let wordbooks = json["wordbooks"].as_array().unwrap();
    assert_eq!(wordbooks.len(), 1);
    assert_eq!(wordbooks[0]["name"], "Test Wordbook");
}

#[tokio::test]
async fn test_get_public_wordbooks() {
    let ctx = TestContext::new().await;
    
    // Create user and public wordbook
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    let mut wordbook_data = create_test_wordbook_request();
    wordbook_data["is_public"] = serde_json::Value::Bool(true);
    
    let _create_wordbook_response = ctx.server
        .post(&format!("/api/v1/wordbooks/users/{}", user_id))
        .json(&wordbook_data)
        .await;
    
    // Get public wordbooks
    let response = ctx.server.get("/api/v1/wordbooks").await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert!(json["wordbooks"].as_array().is_some());
}

#[tokio::test]
async fn test_update_wordbook() {
    let ctx = TestContext::new().await;
    
    // Create user and wordbook
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    let wordbook_data = create_test_wordbook_request();
    let create_wordbook_response = ctx.server
        .post(&format!("/api/v1/wordbooks/users/{}", user_id))
        .json(&wordbook_data)
        .await;
    
    let created_wordbook: Value = create_wordbook_response.json();
    let wordbook_id = created_wordbook["wordbook"]["id"].as_i64().unwrap();
    
    // Update wordbook
    let update_data = serde_json::json!({
        "name": "Updated Wordbook Name",
        "description": "Updated description",
        "is_public": true
    });
    
    let response = ctx.server
        .patch(&format!("/api/v1/wordbooks/users/{}/{}", user_id, wordbook_id))
        .json(&update_data)
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert_eq!(json["wordbook"]["name"], "Updated Wordbook Name");
    assert_eq!(json["wordbook"]["description"], "Updated description");
    assert_eq!(json["wordbook"]["is_public"], true);
}

#[tokio::test]
async fn test_share_wordbook() {
    let ctx = TestContext::new().await;
    
    // Create user and wordbook
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    let wordbook_data = create_test_wordbook_request();
    let create_wordbook_response = ctx.server
        .post(&format!("/api/v1/wordbooks/users/{}", user_id))
        .json(&wordbook_data)
        .await;
    
    let created_wordbook: Value = create_wordbook_response.json();
    let wordbook_id = created_wordbook["wordbook"]["id"].as_i64().unwrap();
    
    // Share wordbook
    let response = ctx.server
        .post(&format!("/api/v1/wordbooks/users/{}/{}/share", user_id, wordbook_id))
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert!(json["share_code"].as_str().is_some());
    let share_code = json["share_code"].as_str().unwrap();
    
    // Get shared wordbook
    let shared_response = ctx.server
        .get(&format!("/api/v1/wordbooks/shared/{}", share_code))
        .await;
    
    shared_response.assert_status_ok();
    
    let shared_json: Value = shared_response.json();
    assert_eq!(shared_json["wordbook"]["name"], "Test Wordbook");
}

#[tokio::test]
async fn test_delete_wordbook() {
    let ctx = TestContext::new().await;
    
    // Create user and wordbook
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    let wordbook_data = create_test_wordbook_request();
    let create_wordbook_response = ctx.server
        .post(&format!("/api/v1/wordbooks/users/{}", user_id))
        .json(&wordbook_data)
        .await;
    
    let created_wordbook: Value = create_wordbook_response.json();
    let wordbook_id = created_wordbook["wordbook"]["id"].as_i64().unwrap();
    
    // Delete wordbook
    let response = ctx.server
        .delete(&format!("/api/v1/wordbooks/users/{}/{}", user_id, wordbook_id))
        .await;
    
    response.assert_status_ok();
    
    // Verify wordbook is deleted
    let get_response = ctx.server
        .get(&format!("/api/v1/wordbooks/users/{}/{}", user_id, wordbook_id))
        .await;
    
    assert_eq!(get_response.status_code(), 404);
}