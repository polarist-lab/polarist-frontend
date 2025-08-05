mod common;

use common::{TestContext, create_test_user_request, create_test_progress_request};
use serde_json::Value;

#[tokio::test]
async fn test_get_system_stats() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server
        .get("/api/v1/progress/system/stats")
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert!(json["stats"]["total_unique_words"].as_i64().is_some());
    assert!(json["stats"]["total_progress_records"].as_i64().is_some());
}

#[tokio::test]
async fn test_create_word_progress() {
    let ctx = TestContext::new().await;
    
    // First create a user
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    // Create word progress
    let progress_data = create_test_progress_request();
    let word_id = "test_word_123";
    
    let response = ctx.server
        .post(&format!("/api/v1/progress/{}/words/{}", user_id, word_id))
        .json(&progress_data)
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert!(json["progress"]["id"].as_i64().is_some());
    assert_eq!(json["progress"]["user_id"], user_id);
    assert_eq!(json["progress"]["word_id"], word_id);
    assert_eq!(json["progress"]["is_learned"], false);
    assert_eq!(json["progress"]["attempts"], 1);
    assert_eq!(json["progress"]["confidence"], 3);
}

#[tokio::test]
async fn test_get_word_progress() {
    let ctx = TestContext::new().await;
    
    // Create user and progress
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    let progress_data = create_test_progress_request();
    let word_id = "test_word_456";
    
    let _create_progress_response = ctx.server
        .post(&format!("/api/v1/progress/{}/words/{}", user_id, word_id))
        .json(&progress_data)
        .await;
    
    // Get word progress
    let response = ctx.server
        .get(&format!("/api/v1/progress/{}/words/{}", user_id, word_id))
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert_eq!(json["progress"]["word_id"], word_id);
    assert_eq!(json["progress"]["user_id"], user_id);
}

#[tokio::test]
async fn test_update_word_progress() {
    let ctx = TestContext::new().await;
    
    // Create user and progress
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    let progress_data = create_test_progress_request();
    let word_id = "test_word_789";
    
    let _create_progress_response = ctx.server
        .post(&format!("/api/v1/progress/{}/words/{}", user_id, word_id))
        .json(&progress_data)
        .await;
    
    // Update progress
    let update_data = serde_json::json!({
        "is_learned": true,
        "was_correct": true,
        "confidence": 5
    });
    
    let response = ctx.server
        .patch(&format!("/api/v1/progress/{}/words/{}", user_id, word_id))
        .json(&update_data)
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert_eq!(json["progress"]["is_learned"], true);
    assert_eq!(json["progress"]["confidence"], 5);
    // Should increment attempts and correct_answers due to was_correct: true
    assert_eq!(json["progress"]["attempts"], 2);
    assert_eq!(json["progress"]["correct_answers"], 1);
}

#[tokio::test]
async fn test_get_user_progress() {
    let ctx = TestContext::new().await;
    
    // Create user and multiple progress entries
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    // Create multiple progress entries
    for i in 1..=3 {
        let progress_data = create_test_progress_request();
        let word_id = format!("test_word_{}", i);
        
        let _create_response = ctx.server
            .post(&format!("/api/v1/progress/{}/words/{}", user_id, word_id))
            .json(&progress_data)
            .await;
    }
    
    // Get user progress
    let response = ctx.server
        .get(&format!("/api/v1/progress/{}", user_id))
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert!(json["progress"].as_array().is_some());
    let progress_array = json["progress"].as_array().unwrap();
    assert_eq!(progress_array.len(), 3);
}

#[tokio::test]
async fn test_get_progress_stats() {
    let ctx = TestContext::new().await;
    
    // Create user and progress
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    let progress_data = create_test_progress_request();
    let _create_response = ctx.server
        .post(&format!("/api/v1/progress/{}/words/test_word", user_id))
        .json(&progress_data)
        .await;
    
    // Get progress stats
    let response = ctx.server
        .get(&format!("/api/v1/progress/{}/stats", user_id))
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert!(json["stats"]["total_words"].as_i64().is_some());
    assert!(json["stats"]["learned_words"].as_i64().is_some());
    assert!(json["stats"]["total_attempts"].as_i64().is_some());
    assert!(json["stats"]["accuracy_percentage"].as_f64().is_some());
}

#[tokio::test]
async fn test_create_study_session() {
    let ctx = TestContext::new().await;
    
    // Create user
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    // Create study session
    let session_data = serde_json::json!({
        "session_id": "test_session_123",
        "metadata": {
            "type": "vocabulary_practice",
            "difficulty": "beginner"
        }
    });
    
    let response = ctx.server
        .post(&format!("/api/v1/progress/{}/sessions", user_id))
        .json(&session_data)
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert!(json["session"]["id"].as_i64().is_some());
    assert_eq!(json["session"]["user_id"], user_id);
    assert_eq!(json["session"]["session_id"], "test_session_123");
}

#[tokio::test]
async fn test_update_study_session() {
    let ctx = TestContext::new().await;
    
    // Create user and session
    let user_data = create_test_user_request();
    let create_user_response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    let created_user: Value = create_user_response.json();
    let user_id = created_user["user"]["id"].as_i64().unwrap();
    
    let session_data = serde_json::json!({
        "session_id": "test_session_456",
        "metadata": {}
    });
    
    let _create_session_response = ctx.server
        .post(&format!("/api/v1/progress/{}/sessions", user_id))
        .json(&session_data)
        .await;
    
    // Update session
    let update_data = serde_json::json!({
        "words_studied": 10,
        "correct_answers": 8,
        "total_attempts": 12,
        "duration": 300,
        "end_session": true
    });
    
    let response = ctx.server
        .patch(&format!("/api/v1/progress/{}/sessions/test_session_456", user_id))
        .json(&update_data)
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert_eq!(json["session"]["words_studied"], 10);
    assert_eq!(json["session"]["correct_answers"], 8);
    assert_eq!(json["session"]["total_attempts"], 12);
    assert_eq!(json["session"]["duration"], 300);
    assert!(json["session"]["end_time"].as_str().is_some());
}