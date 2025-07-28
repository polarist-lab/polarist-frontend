# 🚀 Google OAuth 빠른 설정 가이드

## 📋 5분 내에 Google 로그인 활성화하기

### 1️⃣ Google Cloud Console 접속
```
https://console.cloud.google.com/
```

### 2️⃣ 새 프로젝트 생성
1. 상단 프로젝트 선택기 클릭
2. "새 프로젝트" 클릭
3. 프로젝트 이름: `Polarist-Korean-Learning`
4. "만들기" 클릭

### 3️⃣ Google+ API 활성화
1. 좌측 메뉴 → "APIs & Services" → "Library"
2. "Google+ API" 검색 → 클릭 → "사용" 클릭

### 4️⃣ OAuth 동의 화면 설정
1. 좌측 메뉴 → "APIs & Services" → "OAuth consent screen"
2. **User Type**: "External" 선택 → "만들기"
3. **필수 정보 입력**:
   - App name: `Polarist`
   - User support email: `본인 이메일`
   - Developer contact: `본인 이메일`
4. "저장 후 계속" 클릭
5. **Scopes** 단계에서 "저장 후 계속" (기본값 사용)
6. **Test users** 단계에서 본인 이메일 추가
7. "저장 후 계속" 클릭

### 5️⃣ OAuth 2.0 Client ID 생성
1. 좌측 메뉴 → "APIs & Services" → "Credentials"
2. 상단 "+ CREATE CREDENTIALS" → "OAuth 2.0 Client ID"
3. **Application type**: "Web application"
4. **Name**: `Polarist Web Client`
5. **Authorized redirect URIs** 추가:
   ```
   http://localhost:4000/api/auth/google/callback
   ```
6. "만들기" 클릭

### 6️⃣ Credentials 복사
1. 생성된 Client ID 팝업에서 **Client ID**와 **Client Secret** 복사
2. 또는 Credentials 목록에서 다운로드 버튼 클릭

### 7️⃣ 백엔드 환경 변수 업데이트
```bash
# /backend/.env 파일 수정
GOOGLE_CLIENT_ID="복사한-클라이언트-ID"
GOOGLE_CLIENT_SECRET="복사한-클라이언트-시크릿"
```

### 8️⃣ 백엔드 재시작
```bash
cd backend
npm run start:dev
```

## ✅ 테스트
1. http://localhost:3000 접속
2. "Google로 로그인" 클릭
3. Google OAuth 동의 화면 확인
4. 로그인 완료!

## 🔧 문제 해결

### ❌ `redirect_uri_mismatch` 오류
- Authorized redirect URIs에 정확히 이 URL 추가:
  ```
  http://localhost:4000/api/auth/google/callback
  ```

### ❌ `invalid_client` 오류
- Client ID와 Secret이 정확한지 확인
- `.env` 파일 저장 후 백엔드 재시작

### ❌ `access_denied` 오류
- OAuth 동의 화면에서 본인 이메일을 Test users에 추가
- App을 "Testing" 상태에서 "Production"으로 게시

## 📧 지원
문제가 있으면 백엔드 콘솔 로그를 확인하세요:
```bash
npm run start:dev
```