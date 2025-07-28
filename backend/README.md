# Polarist Backend API

NestJS backend for the Polarist Korean learning application with Google OAuth and Drizzle ORM.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your actual values:
   - Database URL
   - Google OAuth credentials
   - JWT secret

3. **Database Setup**
   ```bash
   # Generate migration files
   npm run db:generate
   
   # Apply migrations
   npm run db:migrate
   
   # Or push schema directly (for development)
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run start:dev
   ```

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/profile` - Get user profile (requires JWT)
- `GET /auth/logout` - Logout

### Users  
- `GET /users/me` - Get current user profile (requires JWT)

### Health Check
- `GET /health` - API health status

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:4000/auth/google/callback` (development)
   - Your production callback URL
6. Copy Client ID and Client Secret to `.env`

## Database Schema

- **users** - User profiles and Google OAuth data
- **user_progress** - Individual word learning progress
- **study_sessions** - Learning session records
- **user_settings** - User preferences and settings