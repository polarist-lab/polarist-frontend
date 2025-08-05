use sqlx::{migrate::MigrateDatabase, AnyPool, Pool, Postgres, Sqlite};
use anyhow::Result;

#[derive(Clone)]
pub struct Database {
    pub pool: AnyPool,
    pub database_type: DatabaseType,
}

#[derive(Debug, Clone, PartialEq)]
pub enum DatabaseType {
    Sqlite,
    Postgres,
}

impl Database {
    pub async fn new(database_url: &str) -> Result<Self> {
        let database_type = if database_url.starts_with("sqlite:") {
            DatabaseType::Sqlite
        } else if database_url.starts_with("postgresql:") || database_url.starts_with("postgres:") {
            DatabaseType::Postgres
        } else {
            return Err(anyhow::anyhow!("Unsupported database URL format: {}", database_url));
        };

        tracing::info!("Connecting to {:?} database: {}", database_type, 
            if database_type == DatabaseType::Postgres { 
                // Hide password in logs for PostgreSQL
                database_url.split('@').last().unwrap_or("***") 
            } else { 
                database_url 
            }
        );

        match database_type {
            DatabaseType::Sqlite => {
                // Create SQLite database if it doesn't exist
                if !Sqlite::database_exists(database_url).await.unwrap_or(false) {
                    tracing::info!("Creating SQLite database: {}", database_url);
                    Sqlite::create_database(database_url).await?;
                }
            }
            DatabaseType::Postgres => {
                // For PostgreSQL, assume the database exists or will be created by admin
                tracing::info!("Connecting to PostgreSQL database");
            }
        }

        // Create connection pool
        let pool = AnyPool::connect(database_url).await?;
        
        // Configure database-specific settings
        match database_type {
            DatabaseType::Sqlite => {
                // Enable foreign keys for SQLite
                sqlx::query("PRAGMA foreign_keys = ON")
                    .execute(&pool)
                    .await?;
                tracing::info!("SQLite foreign keys enabled");
            }
            DatabaseType::Postgres => {
                // PostgreSQL foreign keys are enabled by default
                tracing::info!("PostgreSQL connection established");
            }
        }

        Ok(Database { pool, database_type })
    }

    pub async fn migrate(&self) -> Result<()> {
        tracing::info!("Running database migrations for {:?}...", self.database_type);
        
        match self.database_type {
            DatabaseType::Sqlite => {
                sqlx::migrate!("./migrations/sqlite").run(&self.pool).await?;
            }
            DatabaseType::Postgres => {
                sqlx::migrate!("./migrations/postgres").run(&self.pool).await?;
            }
        }
        
        tracing::info!("Database migrations completed successfully");
        Ok(())
    }

    pub fn is_postgres(&self) -> bool {
        self.database_type == DatabaseType::Postgres
    }

    pub fn is_sqlite(&self) -> bool {
        self.database_type == DatabaseType::Sqlite
    }

    /// Get a database-specific query for getting the current timestamp
    pub fn current_timestamp_sql(&self) -> &'static str {
        match self.database_type {
            DatabaseType::Sqlite => "datetime('now')",
            DatabaseType::Postgres => "NOW()",
        }
    }

    /// Get database-specific auto-increment column definition
    pub fn auto_increment_sql(&self) -> &'static str {
        match self.database_type {
            DatabaseType::Sqlite => "INTEGER PRIMARY KEY AUTOINCREMENT",
            DatabaseType::Postgres => "SERIAL PRIMARY KEY",
        }
    }

    /// Get database-specific boolean type
    pub fn boolean_type_sql(&self) -> &'static str {
        match self.database_type {
            DatabaseType::Sqlite => "INTEGER",  // SQLite uses INTEGER for boolean
            DatabaseType::Postgres => "BOOLEAN",
        }
    }

    /// Get database-specific text type
    pub fn text_type_sql(&self) -> &'static str {
        match self.database_type {
            DatabaseType::Sqlite => "TEXT",
            DatabaseType::Postgres => "TEXT",
        }
    }

    /// Get database-specific JSON type
    pub fn json_type_sql(&self) -> &'static str {
        match self.database_type {
            DatabaseType::Sqlite => "TEXT",  // SQLite stores JSON as TEXT
            DatabaseType::Postgres => "JSONB",  // PostgreSQL has native JSONB
        }
    }
}