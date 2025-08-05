use serde::Deserialize;
use std::env;
use std::path::Path;

#[derive(Debug, Clone, Deserialize)]
pub struct Config {
    pub environment: String,
    pub port: u16,
    pub database_url: String,
    pub jwt_secret: String,
    pub frontend_url: String,
    pub google_client_id: Option<String>,
    pub google_client_secret: Option<String>,
    pub allowed_origins: Vec<String>,
    pub max_file_size: Option<u64>,
    pub rate_limit_requests: Option<u32>,
    pub rate_limit_window: Option<u64>,
}

impl Config {
    pub fn from_env() -> anyhow::Result<Self> {
        // Load environment-specific .env file first
        let env = env::var("NODE_ENV").unwrap_or_else(|_| "development".to_string());
        
        // Try to load environment-specific .env file
        let env_file = format!(".env.{}", env);
        if Path::new(&env_file).exists() {
            dotenvy::from_filename(&env_file).ok();
            tracing::info!("Loaded environment config from {}", env_file);
        } else {
            // Fallback to default .env file
            dotenvy::dotenv().ok();
            tracing::info!("Loaded config from .env file");
        }

        let config = Config {
            environment: env,
            port: env::var("PORT")
                .unwrap_or_else(|_| "4000".to_string())
                .parse()
                .unwrap_or(4000),
            database_url: env::var("DATABASE_URL")
                .unwrap_or_else(|_| {
                    // Smart default based on environment
                    let env = env::var("NODE_ENV").unwrap_or_else(|_| "development".to_string());
                    match env.as_str() {
                        "production" => "postgresql://polarist_prod:CHANGE_PASSWORD@localhost:5433/polarist_prod".to_string(),
                        "test" => "postgresql://polarist_test:test_password_123@localhost:5434/polarist_test".to_string(),
                        _ => "postgresql://polarist_dev:dev_password_123@localhost:5432/polarist_dev".to_string(),
                    }
                }),
            jwt_secret: env::var("JWT_SECRET")
                .unwrap_or_else(|_| {
                    let env = env::var("NODE_ENV").unwrap_or_else(|_| "development".to_string());
                    match env.as_str() {
                        "production" => {
                            panic!("JWT_SECRET must be set in production environment!");
                        },
                        "test" => "test-jwt-secret-for-testing-only".to_string(),
                        _ => "dev-jwt-secret-key-for-local-development-only".to_string(),
                    }
                }),
            frontend_url: env::var("FRONTEND_URL")
                .unwrap_or_else(|_| "http://localhost:3000".to_string()),
            google_client_id: env::var("GOOGLE_CLIENT_ID").ok(),
            google_client_secret: env::var("GOOGLE_CLIENT_SECRET").ok(),
            allowed_origins: env::var("ALLOWED_ORIGINS")
                .unwrap_or_else(|_| "http://localhost:3000".to_string())
                .split(',')
                .map(|s| s.trim().to_string())
                .collect(),
            max_file_size: env::var("MAX_FILE_SIZE")
                .ok()
                .and_then(|s| s.parse().ok()),
            rate_limit_requests: env::var("RATE_LIMIT_REQUESTS")
                .ok()
                .and_then(|s| s.parse().ok()),
            rate_limit_window: env::var("RATE_LIMIT_WINDOW")
                .ok()
                .and_then(|s| s.parse().ok()),
        };

        // Validate production configuration
        if config.is_production() {
            config.validate_production()?;
        }

        tracing::info!("Configuration loaded for {} environment", config.environment);
        Ok(config)
    }

    pub fn is_development(&self) -> bool {
        self.environment == "development"
    }

    pub fn is_production(&self) -> bool {
        self.environment == "production"
    }

    pub fn is_test(&self) -> bool {
        self.environment == "test"
    }

    /// Validate critical production settings
    fn validate_production(&self) -> anyhow::Result<()> {
        // Ensure JWT secret is not default
        if self.jwt_secret.contains("change-this") || 
           self.jwt_secret.contains("dev-jwt") ||
           self.jwt_secret.len() < 32 {
            return Err(anyhow::anyhow!(
                "Production JWT_SECRET must be a secure, unique value (at least 32 characters)"
            ));
        }

        // Ensure database URL is not default
        if self.database_url.contains("CHANGE_PASSWORD") {
            return Err(anyhow::anyhow!(
                "Production DATABASE_URL must be configured with actual credentials"
            ));
        }

        // Ensure frontend URL is HTTPS in production
        if !self.frontend_url.starts_with("https://") && !self.is_development() {
            tracing::warn!("Frontend URL should use HTTPS in production: {}", self.frontend_url);
        }

        Ok(())
    }

    /// Get database type from URL
    pub fn database_type(&self) -> &str {
        if self.database_url.starts_with("postgresql://") || self.database_url.starts_with("postgres://") {
            "postgresql"
        } else if self.database_url.starts_with("sqlite:") {
            "sqlite"
        } else {
            "unknown"
        }
    }

    /// Get max file size with default
    pub fn max_file_size(&self) -> u64 {
        self.max_file_size.unwrap_or(
            if self.is_production() { 5 * 1024 * 1024 } // 5MB in production
            else { 10 * 1024 * 1024 } // 10MB in development
        )
    }

    /// Get rate limit requests with default
    pub fn rate_limit_requests(&self) -> u32 {
        self.rate_limit_requests.unwrap_or(
            if self.is_production() { 60 } // Stricter in production
            else { 100 } // More lenient in development
        )
    }

    /// Get rate limit window with default (in seconds)
    pub fn rate_limit_window(&self) -> u64 {
        self.rate_limit_window.unwrap_or(3600) // 1 hour
    }

    /// Check if OAuth is configured
    pub fn has_google_oauth(&self) -> bool {
        self.google_client_id.is_some() && self.google_client_secret.is_some()
    }

    /// Get CORS origins
    pub fn cors_origins(&self) -> Vec<String> {
        self.allowed_origins.clone()
    }
}