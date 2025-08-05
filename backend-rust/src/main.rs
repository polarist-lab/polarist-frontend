use axum::{
    extract::Extension,
    http::StatusCode,
    response::Json,
    routing::get,
    Router,
};
use serde_json::{json, Value};
use std::{env, sync::Arc};
use tower::ServiceBuilder;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

mod config;
mod database;
mod models;
mod handlers;
mod middleware;
mod services;
mod utils;

use config::Config;
use database::Database;

#[derive(OpenApi)]
#[openapi(
    paths(
        // Auth endpoints
        handlers::auth::mock_login,
        handlers::auth::get_profile,
        // User endpoints
        handlers::users::create_user,
        handlers::users::get_user,
        handlers::users::update_user,
        handlers::users::get_user_settings,
        handlers::users::update_user_settings,
        // Wordbook endpoints
        handlers::wordbooks::get_public_wordbooks,
        handlers::wordbooks::get_shared_wordbook,
        handlers::wordbooks::get_user_wordbooks,
        handlers::wordbooks::create_wordbook,
        handlers::wordbooks::get_wordbook,
        handlers::wordbooks::update_wordbook,
        handlers::wordbooks::delete_wordbook,
        handlers::wordbooks::share_wordbook,
        handlers::wordbooks::unshare_wordbook,
        // Progress endpoints
        handlers::progress::get_system_wide_stats_handler,
        handlers::progress::get_user_progress,
        handlers::progress::get_progress_stats,
        handlers::progress::get_word_progress,
        handlers::progress::create_word_progress,
        handlers::progress::update_word_progress,
        handlers::progress::get_study_sessions,
        handlers::progress::create_study_session,
        handlers::progress::get_study_session,
        handlers::progress::update_study_session,
    ),
    components(
        schemas(
            // User models
            models::User,
            models::CreateUserRequest,
            models::UpdateUserRequest,
            models::UserSettings,
            models::UpdateUserSettingsRequest,
            // Progress models
            models::UserProgress,
            models::CreateProgressRequest,
            models::UpdateProgressRequest,
            models::ProgressStats,
            models::WordProgressSummary,
            models::SystemStats,
            // Session models
            models::StudySession,
            models::CreateSessionRequest,
            models::UpdateSessionRequest,
            models::SessionStats,
            models::SessionSummary,
            // Wordbook models
            models::CustomWordbook,
            models::CreateWordbookRequest,
            models::UpdateWordbookRequest,
            models::WordbookSummary,
            models::SharedWordbookInfo,
            // Auth handler models
            handlers::auth::AuthResponse,
            handlers::auth::LoginQuery,
            handlers::auth::MigrateGuestDataRequest,
            // Wordbook handler models
            handlers::wordbooks::WordbookQuery,
            // Progress handler models
            handlers::progress::ProgressQuery,
            handlers::progress::SessionQuery,
            handlers::progress::CreateSessionRequest,
            handlers::progress::UpdateSessionRequest,
        )
    ),
    tags(
        (name = "Authentication", description = "Authentication and authorization endpoints"),
        (name = "Users", description = "User management endpoints"),
        (name = "Progress", description = "Learning progress tracking endpoints"),
        (name = "Wordbooks", description = "Custom wordbook management endpoints")
    ),
    info(
        title = "Polarist Korean Learning API",
        version = "0.1.0",
        description = "API for Polarist Korean Learning App",
    )
)]
struct ApiDoc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "polarist_backend=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Parse command line arguments
    let args: Vec<String> = env::args().collect();
    let migrate_only = args.contains(&"--migrate".to_string());

    // Load configuration
    let config = Config::from_env()?;
    
    // Initialize database
    let database = Database::new(&config.database_url).await?;
    
    // Run migrations
    database.migrate().await?;
    
    // If migrate-only mode, exit after migration
    if migrate_only {
        tracing::info!("✅ Database migrations completed successfully");
        tracing::info!("📚 Environment: {}", config.environment);
        tracing::info!("🗄️ Database: {} ({})", config.database_url, config.database_type());
        return Ok(());
    }
    
    let shared_state = Arc::new(AppState {
        config: config.clone(),
        database,
    });

    // Build our application with routes
    let app = create_app(shared_state);

    // Run server
    let listener = tokio::net::TcpListener::bind(&format!("0.0.0.0:{}", config.port)).await?;
    
    tracing::info!("🚀 Polarist Backend API running on http://0.0.0.0:{}", config.port);
    tracing::info!("📚 Environment: {}", config.environment);
    tracing::info!("🗄️ Database: {} ({})", config.database_url, config.database_type());
    tracing::info!("📖 API Documentation: http://0.0.0.0:{}/api/docs", config.port);
    
    axum::serve(listener, app).await?;

    Ok(())
}

#[derive(Clone)]
pub struct AppState {
    pub config: Config,
    pub database: Database,
}

fn create_app(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/", get(health_check))
        .route("/health", get(health_check))
        .nest("/api/v1", api_routes())
        .merge(SwaggerUi::new("/api/docs").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(CorsLayer::permissive()) // TODO: Configure CORS properly for production
                .layer(Extension(state))
        )
}

fn api_routes() -> Router {
    Router::new()
        .nest("/auth", handlers::auth::routes())
        .nest("/users", handlers::users::routes())
        .nest("/progress", handlers::progress::routes())
        .nest("/wordbooks", handlers::wordbooks::routes())
}

async fn health_check() -> Result<Json<Value>, StatusCode> {
    Ok(Json(json!({
        "status": "healthy",
        "service": "polarist-backend",
        "version": env!("CARGO_PKG_VERSION"),
        "timestamp": chrono::Utc::now()
    })))
}