use axum::Router;
use axum_test::TestServer;
use polarist_backend::{create_app, AppState, config::Config, database::Database};
use std::{env, sync::Arc};
use tempfile::NamedTempFile;

pub struct TestContext {
    pub server: TestServer,
    pub config: Config,
    pub database: Database,
    pub _temp_db: Option<NamedTempFile>, // Keep alive to prevent deletion for SQLite
}

impl TestContext {
    pub async fn new() -> Self {
        Self::new_with_db_type(None).await
    }

    pub async fn new_sqlite() -> Self {
        Self::new_with_db_type(Some("sqlite")).await
    }

    pub async fn new_postgres() -> Self {
        Self::new_with_db_type(Some("postgres")).await
    }

    async fn new_with_db_type(db_type: Option<&str>) -> Self {
        // Determine database type from environment or parameter
        let db_type = db_type.unwrap_or(&env::var("TEST_DB_TYPE").unwrap_or_else(|_| "sqlite".to_string()));
        
        let (database_url, temp_db) = match db_type {
            "postgres" => {
                // Use test PostgreSQL database
                let database_url = env::var("TEST_DATABASE_URL")
                    .unwrap_or_else(|_| "postgresql://polarist_test:test_password_123@localhost:5434/polarist_test".to_string());
                (database_url, None)
            }
            _ => {
                // Use SQLite for fast local tests
                let temp_db = NamedTempFile::new().unwrap();
                let db_path = temp_db.path().to_str().unwrap();
                let database_url = format!("sqlite:{}", db_path);
                (database_url, Some(temp_db))
            }
        };

        // Create test config
        let config = Config {
            database_url: database_url.clone(),
            jwt_secret: "test-jwt-secret-key-for-testing-only".to_string(),
            frontend_url: "http://localhost:3000".to_string(),
            port: 0, // Let OS choose port
            environment: "test".to_string(),
            google_client_id: Some("test-client-id".to_string()),
            google_client_secret: Some("test-client-secret".to_string()),
            allowed_origins: vec!["http://localhost:3000".to_string()],
            max_file_size: None,
            rate_limit_requests: None,
            rate_limit_window: None,
        };

        // Initialize database
        let database = Database::new(&database_url).await.unwrap();
        database.migrate().await.unwrap();

        // For PostgreSQL tests, clean up existing test data
        if database.is_postgres() {
            Self::cleanup_test_data(&database).await;
        }

        // Create app state
        let app_state = Arc::new(AppState {
            config: config.clone(),
            database: database.clone(),
        });

        // Create test server
        let app = create_app(app_state);
        let server = TestServer::new(app).unwrap();

        Self {
            server,
            config,
            database,
            _temp_db: temp_db,
        }
    }

    /// Clean up test data for PostgreSQL tests
    async fn cleanup_test_data(database: &Database) {
        let queries = [
            "DELETE FROM user_progress WHERE 1=1",
            "DELETE FROM study_sessions WHERE 1=1", 
            "DELETE FROM custom_wordbooks WHERE 1=1",
            "DELETE FROM user_settings WHERE 1=1",
            "DELETE FROM users WHERE email LIKE '%test%' OR email LIKE '%example%'",
        ];

        for query in &queries {
            if let Err(e) = sqlx::query(query).execute(&database.pool).await {
                tracing::warn!("Failed to cleanup test data: {} - {}", query, e);
            }
        }
    }

    pub fn base_url(&self) -> String {
        format!("{}/api/v1", self.server.server_address())
    }
}

// Test data builders
pub fn create_test_user_request() -> serde_json::Value {
    serde_json::json!({
        "email": "test@example.com",
        "name": "Test User",
        "locale": "en"
    })
}

pub fn create_test_wordbook_request() -> serde_json::Value {
    serde_json::json!({
        "name": "Test Wordbook",
        "description": "A test wordbook",
        "word_ids": ["word1", "word2", "word3"],
        "categories": ["basic", "common"],
        "difficulties": ["beginner"],
        "is_public": false,
        "tags": ["test"]
    })
}

pub fn create_test_progress_request() -> serde_json::Value {
    serde_json::json!({
        "word_id": "test_word",
        "is_learned": false,
        "attempts": 1,
        "correct_answers": 0,
        "confidence": 3
    })
}