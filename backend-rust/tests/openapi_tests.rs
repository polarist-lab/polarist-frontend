mod common;

use common::TestContext;
use serde_json::Value;

#[tokio::test]
async fn test_openapi_spec_endpoint() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server.get("/api-docs/openapi.json").await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    
    // Check basic OpenAPI structure
    assert_eq!(json["openapi"], "3.0.3");
    assert!(json["info"]["title"].as_str().is_some());
    assert!(json["info"]["version"].as_str().is_some());
    assert!(json["paths"].as_object().is_some());
    assert!(json["components"]["schemas"].as_object().is_some());
}

#[tokio::test]
async fn test_swagger_ui_endpoint() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server.get("/api/docs").await;
    
    response.assert_status_ok();
    
    let content = response.text();
    // Should contain Swagger UI HTML
    assert!(content.contains("swagger-ui"));
    assert!(content.contains("Polarist Korean Learning API"));
}

#[tokio::test]
async fn test_openapi_spec_completeness() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server.get("/api-docs/openapi.json").await;
    let json: Value = response.json();
    
    let paths = json["paths"].as_object().unwrap();
    let schemas = json["components"]["schemas"].as_object().unwrap();
    
    // Check that we have all expected endpoints
    let expected_endpoints = vec![
        "/api/v1/auth/mock-login",
        "/api/v1/auth/profile",
        "/api/v1/users",
        "/api/v1/users/{id}",
        "/api/v1/wordbooks",
        "/api/v1/wordbooks/users/{user_id}",
        "/api/v1/progress/system/stats",
        "/api/v1/progress/{user_id}",
    ];
    
    for endpoint in expected_endpoints {
        assert!(paths.contains_key(endpoint), "Missing endpoint: {}", endpoint);
    }
    
    // Check that we have all expected schemas
    let expected_schemas = vec![
        "User",
        "CreateUserRequest",
        "UpdateUserRequest",
        "UserSettings",
        "CustomWordbook",
        "CreateWordbookRequest",
        "UserProgress",
        "CreateProgressRequest",
        "StudySession",
    ];
    
    for schema in expected_schemas {
        assert!(schemas.contains_key(schema), "Missing schema: {}", schema);
    }
}

#[tokio::test]
async fn test_openapi_tags() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server.get("/api-docs/openapi.json").await;
    let json: Value = response.json();
    
    let tags = json["tags"].as_array().unwrap();
    let tag_names: Vec<&str> = tags
        .iter()
        .map(|tag| tag["name"].as_str().unwrap())
        .collect();
    
    assert!(tag_names.contains(&"Authentication"));
    assert!(tag_names.contains(&"Users"));
    assert!(tag_names.contains(&"Progress"));
    assert!(tag_names.contains(&"Wordbooks"));
}

#[tokio::test]
async fn test_schema_validation() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server.get("/api-docs/openapi.json").await;
    let json: Value = response.json();
    
    let schemas = json["components"]["schemas"].as_object().unwrap();
    
    // Test User schema
    let user_schema = &schemas["User"];
    assert!(user_schema["properties"]["id"].is_object());
    assert!(user_schema["properties"]["email"].is_object());
    assert!(user_schema["properties"]["name"].is_object());
    
    // Test CreateUserRequest schema
    let create_user_schema = &schemas["CreateUserRequest"];
    assert!(create_user_schema["properties"]["email"].is_object());
    assert!(create_user_schema["properties"]["name"].is_object());
    
    // Test CustomWordbook schema
    let wordbook_schema = &schemas["CustomWordbook"];
    assert!(wordbook_schema["properties"]["id"].is_object());
    assert!(wordbook_schema["properties"]["name"].is_object());
    assert!(wordbook_schema["properties"]["user_id"].is_object());
}

#[tokio::test]
async fn test_endpoint_documentation() {
    let ctx = TestContext::new().await;
    
    let response = ctx.server.get("/api-docs/openapi.json").await;
    let json: Value = response.json();
    
    let paths = json["paths"].as_object().unwrap();
    
    // Check that endpoints have proper documentation
    let auth_profile = &paths["/api/v1/auth/profile"]["get"];
    assert!(auth_profile["responses"].is_object());
    assert!(auth_profile["tags"].as_array().unwrap().contains(&Value::String("Authentication".to_string())));
    
    let create_user = &paths["/api/v1/users"]["post"];
    assert!(create_user["requestBody"].is_object());
    assert!(create_user["responses"].is_object());
    assert!(create_user["tags"].as_array().unwrap().contains(&Value::String("Users".to_string())));
}