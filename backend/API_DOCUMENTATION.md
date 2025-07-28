# Polarist Backend API Documentation

## Architecture Overview

```
backend/
├── src/
│   ├── app.module.ts          # Main application module
│   ├── main.ts               # Application entry point
│   ├── auth/                 # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── strategies/
│   │       ├── google.strategy.ts
│   │       └── jwt.strategy.ts
│   ├── users/                # User management module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   ├── database/             # Database module
│   │   ├── database.module.ts
│   │   ├── database.service.ts
│   │   └── schema.ts
│   └── progress/             # Learning progress module (TODO)
├── package.json
├── tsconfig.json
├── drizzle.config.ts
└── .env
```

## Technology Stack

- **Framework**: NestJS
- **Database**: SQLite (in-memory for testing) / PostgreSQL (production)
- **ORM**: Drizzle ORM
- **Authentication**: JWT + Google OAuth 2.0
- **Language**: TypeScript

## API Endpoints

### Authentication

#### POST `/api/auth/mock-login` (Development Only)
- **Description**: Mock login for testing without Google OAuth
- **Response**: Redirects to frontend with JWT token
- **Example**: `GET http://localhost:4000/api/auth/mock-login`

#### GET `/api/auth/google`
- **Description**: Initiates Google OAuth flow
- **Response**: Redirects to Google OAuth consent screen

#### GET `/api/auth/google/callback`
- **Description**: Google OAuth callback endpoint
- **Response**: Redirects to frontend with JWT token

#### GET `/api/auth/profile`
- **Description**: Get current user profile
- **Auth**: JWT required
- **Response**:
```json
{
  "user": {
    "id": 1,
    "googleId": "google-id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "https://avatar-url.com",
    "locale": "en",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "message": "User profile retrieved successfully"
}
```

#### GET `/api/auth/logout`
- **Description**: User logout (clears client-side token)
- **Response**:
```json
{
  "message": "Logged out successfully"
}
```

### Users

#### GET `/api/users/me`
- **Description**: Get current user information
- **Auth**: JWT required
- **Response**:
```json
{
  "user": {
    "id": 1,
    "googleId": "google-id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "https://avatar-url.com",
    "locale": "en",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  google_id TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar TEXT,
  locale TEXT DEFAULT 'en',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### User Progress Table
```sql
CREATE TABLE user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  word_id TEXT NOT NULL,
  is_learned BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  confidence INTEGER DEFAULT 0,
  last_studied DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Study Sessions Table
```sql
CREATE TABLE study_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  words_studied INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  duration INTEGER,
  metadata TEXT,
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_time DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### User Settings Table
```sql
CREATE TABLE user_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  learning_goal TEXT DEFAULT 'balanced',
  study_reminders BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  difficulty_level TEXT DEFAULT 'beginner',
  daily_goal INTEGER DEFAULT 20,
  preferred_study_time TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/polarist_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Server Port
PORT=4000
```

## Authentication Flow

1. User clicks "로그인" button in frontend
2. Frontend redirects to `/api/auth/google` (or `/api/auth/mock-login` for testing)
3. Backend handles OAuth flow or creates mock user
4. Backend generates JWT token
5. Backend redirects to frontend with token: `frontend-url/auth/callback?token=jwt-token`
6. Frontend stores token in localStorage
7. Frontend uses token for authenticated API requests

## Error Handling

All endpoints return structured error responses:

```json
{
  "message": "Error description",
  "error": "Error type",
  "statusCode": 400
}
```

## Security Features

- JWT token-based authentication
- CORS enabled for frontend communication
- Environment-based configuration
- Input validation and sanitization
- SQL injection prevention through Drizzle ORM

## Future Enhancements

- Rate limiting
- Request logging
- API versioning
- Comprehensive error logging
- Health check endpoints
- Swagger/OpenAPI documentation
- Database migrations
- Redis session storage