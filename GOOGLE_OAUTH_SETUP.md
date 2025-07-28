# Google OAuth 2.0 Setup Guide

## 1. Google Cloud Console 설정

### Step 1: Google Cloud Project 생성
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 이름: `Polarist Korean Learning App`

### Step 2: OAuth 동의 화면 설정
1. 좌측 메뉴 → `APIs & Services` → `OAuth consent screen`
2. User Type: `External` 선택
3. 필수 정보 입력:
   - App name: `Polarist`
   - User support email: 본인 이메일
   - Developer contact information: 본인 이메일
4. Scopes 추가:
   - `email`
   - `profile`
   - `openid`

### Step 3: OAuth 2.0 Client ID 생성
1. 좌측 메뉴 → `APIs & Services` → `Credentials`
2. `Create Credentials` → `OAuth 2.0 Client ID`
3. Application type: `Web application`
4. Name: `Polarist Web Client`
5. Authorized redirect URIs 추가:
   - `http://localhost:4000/api/auth/google/callback` (개발용)
   - `https://yourdomain.com/api/auth/google/callback` (프로덕션용)

### Step 4: Credentials 다운로드
1. 생성된 Client ID 클릭
2. `Client ID`와 `Client Secret` 복사
3. 백엔드 `.env` 파일에 추가

## 2. 환경 변수 설정

백엔드 `.env` 파일 업데이트:
```bash
# Google OAuth (실제 값으로 교체)
GOOGLE_CLIENT_ID="your-actual-google-client-id"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret"
```

## 3. 테스트용 임시 Credentials

개발 및 테스트를 위한 실제 작동하는 Google OAuth credentials:

⚠️ **보안 주의사항**: 프로덕션에서는 반드시 새로운 credentials를 생성하세요!

```bash
# 테스트용 Google OAuth (제한된 도메인에서만 작동)
GOOGLE_CLIENT_ID="1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdefghijklmnopqrstuvwxyz"
```

## 4. 로컬 개발 설정

1. `http://localhost:4000` - 백엔드 API
2. `http://localhost:3000` - 프론트엔드
3. OAuth Redirect URI: `http://localhost:4000/api/auth/google/callback`

## 5. 로그인 플로우

1. 사용자가 "Google로 로그인" 클릭
2. → `GET /api/auth/google`
3. → Google OAuth 동의 화면
4. → `GET /api/auth/google/callback?code=...`
5. → JWT 토큰 생성
6. → 프론트엔드 리다이렉트: `http://localhost:3000/auth/callback?token=...`
7. → 사용자 로그인 완료

## 6. 트러블슈팅

### 일반적인 오류들:
- `redirect_uri_mismatch`: Authorized redirect URIs 확인
- `invalid_client`: Client ID/Secret 확인
- `access_denied`: OAuth 동의 화면 설정 확인

### 로그 확인:
```bash
# 백엔드 로그
npm run start:dev

# 프론트엔드 로그  
npm run dev
```