# Polarist Backend - Rust Edition

한국어 학습 앱 Polarist의 Rust 백엔드 서버입니다. Axum + SQLx를 사용하여 고성능 API를 제공합니다.

## 🚀 기술 스택

- **웹 프레임워크**: Axum 0.8
- **데이터베이스**: SQLite + SQLx
- **인증**: JWT + Google OAuth
- **로깅**: tracing + tracing-subscriber
- **검증**: validator
- **에러 처리**: thiserror + anyhow

## 📁 프로젝트 구조

```
src/
├── main.rs              # 애플리케이션 진입점
├── config.rs            # 설정 관리
├── database.rs          # 데이터베이스 연결
├── models/              # 데이터 모델
│   ├── user.rs
│   ├── progress.rs
│   ├── session.rs
│   └── wordbook.rs
├── handlers/            # HTTP 핸들러
│   ├── auth.rs
│   ├── users.rs
│   ├── progress.rs
│   └── wordbooks.rs
├── services/            # 비즈니스 로직
│   ├── auth.rs
│   ├── user.rs
│   ├── progress.rs
│   └── wordbook.rs
├── middleware/          # 미들웨어
│   └── auth.rs
└── utils/               # 유틸리티
    ├── errors.rs
    └── jwt.rs
```

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
# Rust 설치 (없다면)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 프로젝트 디렉토리로 이동
cd backend-rust
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 수정하여 필요한 값들을 설정하세요:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=sqlite:./database.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id (선택사항)
GOOGLE_CLIENT_SECRET=your-google-client-secret (선택사항)
```

### 3. 데이터베이스 마이그레이션

```bash
# SQLx CLI 설치 (없다면)
cargo install sqlx-cli

# 마이그레이션 실행 (앱 실행 시 자동으로 실행됨)
```

### 4. 개발 서버 실행

```bash
# 개발 모드
cargo run

# 또는 감시 모드 (cargo-watch 설치 필요)
cargo install cargo-watch
cargo watch -x run
```

서버가 `http://localhost:4000`에서 실행됩니다.

## 📚 API 엔드포인트

### 인증 (Authentication)
- `GET /api/v1/auth/mock-login` - 테스트용 모의 로그인
- `GET /api/v1/auth/google/signup` - Google OAuth 회원가입
- `GET /api/v1/auth/google/signin` - Google OAuth 로그인
- `GET /api/v1/auth/profile` - 현재 사용자 프로필
- `GET /api/v1/auth/logout` - 로그아웃
- `POST /api/v1/auth/migrate-guest-data` - 게스트 데이터 마이그레이션

### 사용자 (Users)
- `POST /api/v1/users` - 사용자 생성
- `GET /api/v1/users/:id` - 사용자 조회
- `PATCH /api/v1/users/:id` - 사용자 정보 수정
- `GET /api/v1/users/:id/settings` - 사용자 설정 조회
- `PATCH /api/v1/users/:id/settings` - 사용자 설정 수정

### 학습 진도 (Progress)
- `GET /api/v1/progress/:user_id` - 사용자 학습 진도 조회
- `GET /api/v1/progress/:user_id/stats` - 학습 통계
- `GET /api/v1/progress/:user_id/words/:word_id` - 특정 단어 진도
- `POST /api/v1/progress/:user_id/words/:word_id` - 단어 진도 생성
- `PATCH /api/v1/progress/:user_id/words/:word_id` - 단어 진도 수정

### 스터디 세션 (Study Sessions)
- `GET /api/v1/progress/:user_id/sessions` - 스터디 세션 목록
- `POST /api/v1/progress/:user_id/sessions` - 스터디 세션 생성
- `GET /api/v1/progress/:user_id/sessions/:session_id` - 특정 세션 조회
- `PATCH /api/v1/progress/:user_id/sessions/:session_id` - 세션 수정

### 단어장 (Wordbooks)
- `GET /api/v1/wordbooks` - 공개 단어장 목록
- `GET /api/v1/wordbooks/shared/:share_code` - 공유된 단어장 조회
- `GET /api/v1/wordbooks/users/:user_id` - 사용자 단어장 목록
- `POST /api/v1/wordbooks/users/:user_id` - 단어장 생성
- `GET /api/v1/wordbooks/users/:user_id/:wordbook_id` - 단어장 조회
- `PATCH /api/v1/wordbooks/users/:user_id/:wordbook_id` - 단어장 수정
- `DELETE /api/v1/wordbooks/users/:user_id/:wordbook_id` - 단어장 삭제
- `POST /api/v1/wordbooks/users/:user_id/:wordbook_id/share` - 단어장 공유
- `POST /api/v1/wordbooks/users/:user_id/:wordbook_id/unshare` - 공유 해제

## 🧪 테스트

```bash
# 단위 테스트 실행
cargo test

# 특정 테스트 실행
cargo test test_name

# 테스트 커버리지 (cargo-tarpaulin 설치 필요)
cargo install cargo-tarpaulin
cargo tarpaulin --out html
```

## 🏗️ 빌드

### 개발 빌드
```bash
cargo build
```

### 릴리즈 빌드
```bash
cargo build --release
```

### Docker 빌드
```bash
# Dockerfile 생성 후
docker build -t polarist-backend .
docker run -p 4000:4000 polarist-backend
```

## 📊 로깅 및 모니터링

환경 변수로 로그 레벨을 조정할 수 있습니다:

```bash
# 개발 중 자세한 로그
RUST_LOG=polarist_backend=debug,tower_http=debug cargo run

# 프로덕션에서는 info 레벨
RUST_LOG=info cargo run
```

## 🔧 개발 도구

### 유용한 Cargo 명령어
```bash
# 코드 포맷팅
cargo fmt

# 린트 검사
cargo clippy

# 문서 생성
cargo doc --open

# 의존성 업데이트
cargo update
```

### VSCode 확장 프로그램
- rust-analyzer
- CodeLLDB (디버깅)
- Error Lens
- Better TOML

## 🚀 배포

### 환경별 설정
- **개발**: `NODE_ENV=development`
- **스테이징**: `NODE_ENV=staging`
- **프로덕션**: `NODE_ENV=production`

### 성능 최적화
- 릴리즈 빌드 사용: `cargo build --release`
- 데이터베이스 연결 풀 크기 조정
- JWT 토큰 만료 시간 설정
- CORS 설정을 프로덕션 환경에 맞게 조정

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 라이선스

This project is licensed under the MIT License.

## 🆘 문제 해결

### 일반적인 문제들

1. **데이터베이스 연결 실패**
   ```bash
   # 데이터베이스 파일 권한 확인
   ls -la database.db
   
   # SQLite 설치 확인
   sqlite3 --version
   ```

2. **포트 충돌**
   ```bash
   # 다른 포트 사용
   PORT=4001 cargo run
   ```

3. **JWT 토큰 오류**
   ```bash
   # JWT_SECRET 환경 변수 확인
   echo $JWT_SECRET
   ```

### 로그 확인
```bash
# 자세한 로그로 문제 진단
RUST_LOG=debug cargo run
```