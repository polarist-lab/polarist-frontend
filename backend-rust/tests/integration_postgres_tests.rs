mod common;

use common::TestContext;
use serde_json::Value;

// These tests specifically test PostgreSQL functionality
// Run with: cargo test integration_postgres_tests --features postgres-test

#[tokio::test]
async fn test_postgres_health_check() {
    let ctx = TestContext::new_postgres().await;
    
    let response = ctx.server.get("/health").await;
    
    response.assert_status_ok();
    let json: Value = response.json();
    assert_eq!(json["status"], "healthy");
    assert_eq!(json["service"], "polarist-backend");
}

#[tokio::test]
async fn test_postgres_user_crud_operations() {
    let ctx = TestContext::new_postgres().await;
    
    // Create a user
    let create_request = serde_json::json!({
        "email": "postgres-test@example.com",
        "name": "PostgreSQL Test User",
        "locale": "en"
    });
    
    let response = ctx.server
        .post("/api/v1/users")
        .json(&create_request)
        .await;
    
    response.assert_status_ok();
    let created_user: Value = response.json();
    let user_id = created_user["id"].as_i64().unwrap();
    
    // Get the user
    let response = ctx.server
        .get(&format!("/api/v1/users/{}", user_id))
        .await;
    
    response.assert_status_ok();
    let user: Value = response.json();
    assert_eq!(user["email"], "postgres-test@example.com");
    assert_eq!(user["name"], "PostgreSQL Test User");
    
    // Update the user
    let update_request = serde_json::json!({
        "name": "Updated PostgreSQL User",
        "locale": "ko"
    });
    
    let response = ctx.server
        .put(&format!("/api/v1/users/{}", user_id))
        .json(&update_request)
        .await;
    
    response.assert_status_ok();
    let updated_user: Value = response.json();
    assert_eq!(updated_user["name"], "Updated PostgreSQL User");
    assert_eq!(updated_user["locale"], "ko");
}

#[tokio::test]
async fn test_postgres_jsonb_functionality() {
    let ctx = TestContext::new_postgres().await;
    
    // Create a user first
    let user_request = serde_json::json!({
        "email": "jsonb-test@example.com",
        "name": "JSONB Test User",
        "locale": "en"
    });
    
    let user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_request)
        .await;
    
    let user: Value = user_response.json();
    let user_id = user["id"].as_i64().unwrap();
    
    // Create a wordbook with complex JSON data
    let wordbook_request = serde_json::json!({
        "name": "JSONB Test Wordbook",
        "description": "Testing PostgreSQL JSONB functionality",
        "word_ids": ["word1", "word2", "word3", "한국어", "테스트"],
        "categories": ["basic", "intermediate", "한국어"],
        "difficulties": ["beginner", "intermediate"],
        "is_public": false,
        "tags": ["test", "jsonb", "postgresql", "한국어"]
    });
    
    let response = ctx.server
        .post(&format!("/api/v1/users/{}/wordbooks", user_id))
        .json(&wordbook_request)
        .await;
    
    response.assert_status_ok();
    let wordbook: Value = response.json();
    
    // Verify JSONB arrays are stored correctly
    let word_ids = wordbook["word_ids"].as_array().unwrap();
    assert_eq!(word_ids.len(), 5);
    assert!(word_ids.contains(&Value::String("한국어".to_string())));
    
    let categories = wordbook["categories"].as_array().unwrap();
    assert!(categories.contains(&Value::String("한국어".to_string())));
    
    let tags = wordbook["tags"].as_array().unwrap();
    assert!(tags.contains(&Value::String("한국어".to_string())));
}

#[tokio::test]
async fn test_postgres_transactions_and_constraints() {
    let ctx = TestContext::new_postgres().await;
    
    // Create a user
    let user_request = serde_json::json!({
        "email": "transaction-test@example.com", 
        "name": "Transaction Test User",
        "locale": "en"
    });
    
    let user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_request)
        .await;
    
    let user: Value = user_response.json();
    let user_id = user["id"].as_i64().unwrap();
    
    // Test foreign key constraint - create progress for the user
    let progress_request = serde_json::json!({
        "word_id": "test_word_postgres",
        "is_learned": false,
        "attempts": 1,
        "correct_answers": 0,
        "confidence": 3
    });
    
    let response = ctx.server
        .post(&format!("/api/v1/users/{}/progress", user_id))
        .json(&progress_request)    
        .await;
    
    response.assert_status_ok();
    
    // Test check constraint - try invalid confidence value
    let invalid_progress_request = serde_json::json!({
        "word_id": "test_word_invalid",
        "is_learned": false,
        "attempts": 1,
        "correct_answers": 0,
        "confidence": 10  // Should fail check constraint (max 5)
    });
    
    let response = ctx.server
        .post(&format!("/api/v1/users/{}/progress", user_id))
        .json(&invalid_progress_request)
        .await;
    
    // Should fail due to check constraint
    assert_ne!(response.status_code(), 200);
}

#[tokio::test] 
async fn test_postgres_concurrent_operations() {
    let ctx = TestContext::new_postgres().await;
    
    // Create multiple users concurrently
    let mut handles = vec![];
    
    for i in 0..5 {
        let server = ctx.server.clone();
        let handle = tokio::spawn(async move {
            let user_request = serde_json::json!({
                "email": format!("concurrent-test-{}@example.com", i),
                "name": format!("Concurrent Test User {}", i),
                "locale": "en"
            });
            
            let response = server
                .post("/api/v1/users")
                .json(&user_request)
                .await;
            
            response.assert_status_ok();
            response.json::<Value>()
        });
        
        handles.push(handle);
    }
    
    // Wait for all operations to complete
    let results: Vec<Value> = futures::future::join_all(handles)
        .await
        .into_iter()
        .map(|r| r.unwrap())
        .collect();
    
    // Verify all users were created with unique IDs
    assert_eq!(results.len(), 5);
    let user_ids: std::collections::HashSet<i64> = results
        .iter()
        .map(|user| user["id"].as_i64().unwrap())
        .collect();
    
    assert_eq!(user_ids.len(), 5); // All IDs should be unique
}

#[tokio::test]
async fn test_postgres_triggers_and_updated_at() {
    let ctx = TestContext::new_postgres().await;
    
    // Create a user
    let user_request = serde_json::json!({
        "email": "trigger-test@example.com",
        "name": "Trigger Test User", 
        "locale": "en"
    });
    
    let user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_request)
        .await;
    
    let user: Value = user_response.json();
    let user_id = user["id"].as_i64().unwrap();
    let created_at = user["created_at"].as_str().unwrap();
    let initial_updated_at = user["updated_at"].as_str().unwrap();
    
    // Wait a moment to ensure timestamp difference
    tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    
    // Update the user
    let update_request = serde_json::json!({
        "name": "Updated Name for Trigger Test",
        "locale": "ko"
    });
    
    let response = ctx.server
        .put(&format!("/api/v1/users/{}", user_id))
        .json(&update_request)
        .await;
    
    let updated_user: Value = response.json();
    let final_updated_at = updated_user["updated_at"].as_str().unwrap();
    
    // Verify trigger updated the updated_at timestamp
    assert_eq!(updated_user["created_at"].as_str().unwrap(), created_at);
    assert_ne!(final_updated_at, initial_updated_at);
    assert!(final_updated_at > initial_updated_at);
}