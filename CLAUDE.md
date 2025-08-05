# Polarist Korean Learning App - Development Guidelines

## Project Overview
한국어 학습 앱 Polarist의 개발 가이드라인입니다. Next.js 프론트엔드와 Rust(Axum) 백엔드로 구성되어 있습니다.

## Architecture
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Rust + Axum + SQLx + PostgreSQL/SQLite
- **Database**: PostgreSQL (production/dev), SQLite (tests)
- **Structure**: Monorepo (frontend root, backend in `/backend-rust/`)

## Backend API 문서 자동생성 및 동기화 시스템

### Utoipa (Rust OpenAPI 생성기) 통합 지침

#### 필수 설정
- ✅ Cargo.toml에 utoipa 관련 의존성 추가 (완료됨)
  ```toml
  utoipa = { version = "5.1", features = ["axum_extras", "chrono", "uuid"] }
  utoipa-swagger-ui = { version = "8.0", features = ["axum"] }
  ```
- ✅ main.rs에 OpenAPI 구조체 정의 (완료됨)
- ✅ Swagger UI 엔드포인트 `/api/docs` 설정 (완료됨)

#### API 핸들러 어노테이션 규칙 (완료됨)
모든 public async 함수에 `#[utoipa::path]` 어노테이션 필수:

```rust
#[utoipa::path(
    post,
    path = "/users",
    request_body = CreateUserRequest,
    responses(
        (status = 201, description = "User created successfully", body = Value),
        (status = 400, description = "Invalid request"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Users"
)]
pub async fn create_user(/* ... */) -> Result<Json<Value>, AppError> {
    // Implementation
}
```

#### 데이터 모델 어노테이션 규칙 (완료됨)
모든 public 구조체/열거형에 `#[derive(ToSchema)]` 필수:

```rust
#[derive(Debug, Serialize, Deserialize, ToSchema, Validate)]
pub struct CreateUserRequest {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 1, max = 100))]
    pub name: String,
    // ...
}
```

### 프론트엔드-백엔드 타입 동기화 워크플로우

#### 자동화 스크립트 (완료됨)
- `npm run sync-api`: 전체 동기화 (타입 + 클라이언트 생성)
- `npm run sync-api:check`: 동기화 필요 여부 확인
- `npm run sync-api:status`: 마지막 동기화 상태 확인
- `npm run validate-api-sync`: 전체 시스템 검증
- `npm run validate-types`: TypeScript 타입 검증

#### 동기화 프로세스
1. **백엔드 변경 시**:
   ```bash
   # 1. 백엔드 시작
   npm run dev:backend
   
   # 2. API 동기화 실행
   npm run sync-api
   
   # 3. 검증
   npm run validate-api-sync
   ```

2. **자동 생성 파일들**:
   - `src/types/api.ts`: OpenAPI에서 생성된 TypeScript 타입
   - `src/types/api-client.ts`: 타입이 적용된 API 클라이언트
   - `api-sync-log.json`: 동기화 이력 로그

#### API 클라이언트 사용법
```typescript
import { apiClient } from '@/types/api-client';

// 사용자 생성
const user = await apiClient.users.create({
  email: 'user@example.com',
  name: '사용자',
  // TypeScript 타입 안전성 보장
});

// 단어장 조회
const wordbooks = await apiClient.wordbooks.getUserWordbooks(userId, {
  limit: 20,
  search: '한국어'
});
```

### 개발 시 필수 준수 사항

#### 🚨 CRITICAL - 반드시 지켜야 할 규칙
1. **새 API 엔드포인트 추가 시**:
   - `#[utoipa::path]` 어노테이션 필수 추가
   - main.rs의 `paths()` 목록에 함수 추가
   - 동기화 스크립트 실행 (`npm run sync-api`)

2. **데이터 모델 변경 시**:
   - `#[derive(ToSchema)]` 확인
   - main.rs의 `schemas()` 목록에 추가
   - 동기화 스크립트 실행 (`npm run sync-api`)

3. **개발 워크플로우**:
   - 백엔드 코드 변경 → `npm run sync-api` → 프론트엔드 개발
   - 절대 수동으로 타입을 작성하지 않음
   - Swagger UI에서 API 테스트 우선 실행

#### 🔍 품질 관리
- **코드 리뷰 전**: `npm run validate-api-sync` 실행
- **빌드 전**: 타입 동기화 상태 확인
- **배포 전**: Swagger UI 문서 확인

#### 📋 동기화 확인 체크리스트
- [ ] 백엔드 서버 실행 중
- [ ] 새 엔드포인트에 `#[utoipa::path]` 추가
- [ ] 새 모델에 `#[derive(ToSchema)]` 추가
- [ ] main.rs에 paths/schemas 등록
- [ ] `npm run sync-api` 실행 완료
- [ ] `npm run validate-api-sync` 통과
- [ ] TypeScript 컴파일 오류 없음

### 문제 해결

#### 일반적인 문제들
1. **"Backend not running" 오류**:
   ```bash
   npm run dev:backend
   ```

2. **"OpenAPI spec incomplete" 오류**:
   - main.rs에서 paths/schemas 누락 확인
   - 핸들러 어노테이션 확인

3. **TypeScript 타입 오류**:
   ```bash
   npm run sync-api
   npm run validate-types
   ```

4. **동기화 이력 확인**:
   ```bash
   npm run sync-api:status
   ```

#### 수동 복구 방법
```bash
# 1. 모든 생성 파일 삭제
rm -rf src/types/api*
rm -f api-sync-log.json

# 2. 백엔드 재시작
npm run dev:backend

# 3. 전체 재동기화
npm run sync-api

# 4. 검증
npm run validate-api-sync
```

### API 문서 접근
- **개발 환경**: http://localhost:4000/api/docs
- **API 스펙**: http://localhost:4000/api-docs/openapi.json
- **상태 확인**: `npm run sync-api:status`

## 테스트 시스템

### 테스트 구조
```
__tests__/
├── api-client.test.ts        # 프론트엔드 API 클라이언트 테스트
├── sync-api.test.ts          # API 동기화 시스템 테스트  
├── integration/
│   └── api-sync-e2e.test.ts  # 통합 테스트 (E2E)
└── mocks/
    ├── server.ts             # MSW 테스트 서버
    └── handlers.ts           # API 모킹 핸들러

backend-rust/tests/
├── common/mod.rs             # 테스트 유틸리티
├── api_auth_tests.rs         # 인증 API 테스트
├── api_users_tests.rs        # 사용자 API 테스트
├── api_wordbooks_tests.rs    # 단어장 API 테스트
├── api_progress_tests.rs     # 진도 API 테스트
└── openapi_tests.rs          # OpenAPI 스펙 테스트
```

### 테스트 실행 명령어
```bash
# 전체 테스트 (프론트엔드 + 백엔드)
npm run test:all

# 프론트엔드 테스트만
npm run test

# 백엔드 테스트만  
npm run test:backend              # SQLite 사용 (기본)
npm run test:backend:sqlite       # SQLite 명시적 사용
npm run test:backend:postgres     # PostgreSQL 통합 테스트

# 특정 테스트
npm run test:api-client     # API 클라이언트 테스트
npm run test:sync-system    # 동기화 시스템 테스트
npm run test:integration    # 통합 테스트

# 테스트 커버리지
npm run test:coverage

# 테스트 감시 모드
npm run test:watch
```

### 테스트 작성 가이드라인

#### 🧪 백엔드 API 테스트 (Rust)
```rust
#[tokio::test]
async fn test_create_user() {
    let ctx = TestContext::new().await;
    let user_data = create_test_user_request();
    
    let response = ctx.server
        .post("/api/v1/users")
        .json(&user_data)
        .await;
    
    response.assert_status_ok();
    
    let json: Value = response.json();
    assert_eq!(json["user"]["email"], "test@example.com");
}
```

#### 🧪 프론트엔드 API 클라이언트 테스트 (TypeScript)
```typescript
it('should create user with type safety', async () => {
  const userData = {
    email: 'test@example.com',
    name: 'Test User',
    locale: 'en'
  }

  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({ user: { id: 1, ...userData } })
  })

  const result = await apiClient.users.create(userData)
  
  expect(result.user.email).toBe('test@example.com')
})
```

#### 🧪 통합 테스트 (E2E)
```typescript
it('should complete end-to-end sync successfully', async () => {
  // 백엔드 시작
  await startBackend()
  
  // OpenAPI 스펙 검증
  const spec = await fetchOpenApiSpec()
  expect(spec.paths['/api/v1/users']).toBeDefined()
  
  // 동기화 실행 및 검증
  await syncAPI()
  expect(fs.existsSync(TYPES_FILE)).toBe(true)
})
```

### 테스트 모킹 (MSW)
- Mock Service Worker를 사용하여 API 요청을 모킹
- 실제 네트워크 요청 없이 API 클라이언트 테스트 가능
- 프론트엔드와 백엔드 독립적 테스트

### CI/CD 통합
```bash
# 테스트 파이프라인 예시
npm install
npm run test:backend
npm run sync-api
npm run test
npm run validate-api-sync
npm run build
```

### 테스트 품질 보장
- **코드 커버리지**: 최소 80% 목표
- **API 호환성**: 스키마 변경 시 테스트 업데이트 필수
- **통합 테스트**: 실제 백엔드와의 호환성 검증
- **타입 안전성**: TypeScript 컴파일 오류 없음 보장

### 개발 워크플로우에서의 테스트
1. **코드 변경 전**: `npm run test:watch` 실행
2. **API 변경 후**: `npm run sync-api && npm run test:api-client`
3. **커밋 전**: `npm run test:all` 실행
4. **배포 전**: `npm run test:integration` 실행

## Development Guidelines

### Code Style
- **Rust**: `cargo fmt` + `cargo clippy` 사용
- **TypeScript**: Prettier + ESLint 설정 준수
- **Naming**: camelCase (TS), snake_case (Rust)

### API Development
1. Rust에서 모델/핸들러 구현
2. Utoipa 어노테이션 추가
3. OpenAPI 스펙 생성
4. TypeScript 타입 동기화
5. 프론트엔드 API 클라이언트 업데이트

### Database & PostgreSQL Setup

#### Database Architecture
- **PostgreSQL**: Production 및 Development 환경
- **SQLite**: 빠른 로컬 테스트용
- **Multi-database Support**: 런타임에 데이터베이스 타입 선택

#### Docker Compose로 PostgreSQL 실행
```bash
# 개발 환경 (포트 5432)
npm run db:setup

# 운영 환경 (포트 5433)  
npm run db:setup:prod

# 테스트 환경 (포트 5434)
npm run db:setup:test
```

#### 데이터베이스 관리 명령어
```bash
# PostgreSQL 컨테이너 시작
npm run db:setup           # 개발용
npm run db:setup:prod      # 운영용
npm run db:setup:test      # 테스트용

# 마이그레이션 실행
npm run db:migrate         # 개발환경
npm run db:migrate:prod    # 운영환경  
npm run db:migrate:test    # 테스트환경

# 데이터베이스 초기화 (데이터 삭제 후 재생성)
npm run db:reset           # 개발용
npm run db:reset:test      # 테스트용

# PostgreSQL 로그 확인
npm run db:logs

# PostgreSQL shell 접속
npm run db:shell

# 컨테이너 중지
npm run db:stop            # 개발용
npm run db:stop:prod       # 운영용
npm run db:stop:test       # 테스트용
```

#### 환경별 설정

**Development (.env.development)**
```bash
NODE_ENV=development
DATABASE_URL=postgresql://polarist_dev:dev_password_123@localhost:5432/polarist_dev
PORT=4000
JWT_SECRET=dev-jwt-secret-key-for-local-development-only
```

**Production (.env.production)**
```bash
NODE_ENV=production
DATABASE_URL=postgresql://polarist_prod:CHANGE_THIS_PASSWORD@localhost:5433/polarist_prod
JWT_SECRET=CHANGE_THIS_TO_LONG_RANDOM_STRING_FOR_PRODUCTION
FRONTEND_URL=https://your-production-domain.com
```

**Test (.env.test)**
```bash
NODE_ENV=test
DATABASE_URL=postgresql://polarist_test:test_password_123@localhost:5434/polarist_test
JWT_SECRET=test-jwt-secret-for-testing-only
```

#### 마이그레이션 시스템
- **SQLite 마이그레이션**: `backend-rust/migrations/sqlite/`
- **PostgreSQL 마이그레이션**: `backend-rust/migrations/postgres/`
- **자동 마이그레이션**: 서버 시작 시 실행
- **수동 마이그레이션**: `--migrate` 플래그 사용

#### PostgreSQL 고급 기능 활용
- **JSONB**: JSON 데이터 네이티브 저장 및 인덱싱
- **Foreign Keys**: 데이터 무결성 보장
- **Check Constraints**: 데이터 유효성 검증
- **Triggers**: `updated_at` 자동 업데이트
- **Views**: 복잡한 쿼리를 위한 뷰 생성
- **GIN Indexes**: JSONB 컬럼 고속 검색

#### 보안 설정
- **운영환경**: 반드시 강력한 비밀번호 설정
- **JWT Secret**: 최소 32자 이상의 랜덤 문자열
- **Database Password**: 복잡한 비밀번호 사용
- **HTTPS**: 운영환경에서 HTTPS 필수

#### 백업 및 복구
```bash
# PostgreSQL 백업 (운영환경)
docker compose -f docker-compose.prod.yml exec postgres-prod pg_dump -U polarist_prod polarist_prod > backup.sql

# 복구
docker compose -f docker-compose.prod.yml exec -T postgres-prod psql -U polarist_prod -d polarist_prod < backup.sql
```

#### 성능 최적화
- **Connection Pooling**: SQLx로 자동 관리
- **Prepared Statements**: SQL 인젝션 방지 및 성능 향상
- **Database Indexes**: 자주 조회되는 컬럼에 인덱스 생성
- **JSONB Indexes**: JSON 필드 검색 성능 향상

### Testing
- **Backend**: 
  - `npm run test:backend` (SQLite - 빠른 로컬 테스트)
  - `npm run test:backend:postgres` (PostgreSQL - 통합 테스트)
- **Frontend**: Jest + Testing Library + MSW
- **API 테스트**: Swagger UI 활용
- **Database 테스트**: SQLite (기본), PostgreSQL (통합)

### Deployment
- **Development**: 
  ```bash
  npm run db:setup        # PostgreSQL 시작
  npm run dev:backend     # Rust 백엔드
  npm run dev            # Next.js 프론트엔드
  ```
- **Production**: Docker containerization
  ```bash
  npm run db:setup:prod   # 운영 PostgreSQL
  npm run db:migrate:prod # 운영 마이그레이션
  ```

### Quick Start
```bash
# 1. PostgreSQL 시작
npm run db:setup

# 2. 백엔드 시작 (마이그레이션 자동 실행)
npm run dev:backend

# 3. 프론트엔드 시작
npm run dev

# 4. API 문서 확인
# http://localhost:4000/api/docs
```