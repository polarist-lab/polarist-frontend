use serde_json::Value;
use crate::{
    database::Database,
    models::{User, CreateUserRequest},
    services::user::UserService,
    utils::{jwt::create_jwt_token, errors::AppError},
};

pub struct AuthService<'a> {
    database: &'a Database,
}

#[derive(serde::Serialize)]
pub struct AuthResponse {
    pub access_token: String,
    pub user: User,
    pub new_user: bool,
    pub guest_data_migrated: bool,
}

impl<'a> AuthService<'a> {
    pub fn new(database: &'a Database) -> Self {
        Self { database }
    }

    pub async fn google_login(&self, google_user_data: Value) -> Result<AuthResponse, AppError> {
        let google_id = google_user_data["google_id"]
            .as_str()
            .ok_or_else(|| AppError::BadRequest("Missing google_id".to_string()))?;

        let user_service = UserService::new(self.database);
        
        // Try to find existing user by Google ID
        match user_service.get_user_by_google_id(google_id).await {
            Ok(user) => {
                let token = create_jwt_token(user.id, &user.email)?;
                Ok(AuthResponse {
                    access_token: token,
                    user,
                    new_user: false,
                    guest_data_migrated: false,
                })
            }
            Err(AppError::NotFound(_)) => {
                // User doesn't exist, return error for login
                Err(AppError::NotFound("User not found. Please sign up first.".to_string()))
            }
            Err(e) => Err(e),
        }
    }

    pub async fn google_signup(
        &self,
        google_user_data: Value,
        guest_id: Option<&str>,
    ) -> Result<AuthResponse, AppError> {
        let google_id = google_user_data["google_id"]
            .as_str()
            .ok_or_else(|| AppError::BadRequest("Missing google_id".to_string()))?;
        
        let email = google_user_data["email"]
            .as_str()
            .ok_or_else(|| AppError::BadRequest("Missing email".to_string()))?;
        
        let name = google_user_data["name"]
            .as_str()
            .ok_or_else(|| AppError::BadRequest("Missing name".to_string()))?;

        let avatar = google_user_data["avatar"].as_str();

        let user_service = UserService::new(self.database);
        
        // Check if user already exists
        if user_service.get_user_by_google_id(google_id).await.is_ok() {
            return Err(AppError::Conflict("User already exists".to_string()));
        }

        // Create new user
        let create_request = CreateUserRequest {
            google_id: Some(google_id.to_string()),
            email: email.to_string(),
            name: name.to_string(),
            avatar: avatar.map(|s| s.to_string()),
            locale: Some("en".to_string()),
        };

        let user = user_service.create_user(create_request).await?;
        
        // TODO: Migrate guest data if guest_id is provided
        let guest_data_migrated = if let Some(_guest_id) = guest_id {
            // Implement guest data migration logic here
            false
        } else {
            false
        };

        let token = create_jwt_token(user.id, &user.email)?;
        
        Ok(AuthResponse {
            access_token: token,
            user,
            new_user: true,
            guest_data_migrated,
        })
    }

    pub async fn verify_token(&self, token: &str) -> Result<User, AppError> {
        let claims = crate::utils::jwt::verify_jwt_token(token)?;
        let user_service = UserService::new(self.database);
        user_service.get_user_by_id(claims.user_id).await
    }
}