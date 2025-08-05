# Clean Architecture 리팩토링 플랜

## 개요

Polarist Backend API를 Clean Architecture 패턴으로 리팩토링하여 유지보수성, 테스트 가능성, 확장성을 개선합니다.

## 현재 구조 분석

### 문제점
- **DTO 부재**: 요청/응답 데이터 검증 및 타입 정의 없음
- **비즈니스 로직 분산**: Service에 비즈니스 로직과 데이터 액세스 로직 혼재
- **직접적인 데이터베이스 의존성**: Service가 직접 Drizzle ORM에 의존
- **일관성 없는 에러 처리**: 각 서비스마다 다른 에러 처리 방식
- **입력 검증 부족**: Controller에서 입력 데이터 검증 미흡

### 현재 디렉토리 구조
```
src/
├── app.module.ts
├── main.ts
├── auth/
├── database/
├── health/
├── progress/
├── users/
└── wordbooks/
```

## 목표 아키텍처

### Clean Architecture 레이어

1. **Domain Layer (도메인 계층)**
   - 비즈니스 규칙과 엔티티
   - 외부 의존성 없음
   - 가장 안정적인 계층

2. **Application Layer (애플리케이션 계층)**
   - Use Cases (비즈니스 로직 조합)
   - DTO 정의
   - 포트 인터페이스 정의

3. **Infrastructure Layer (인프라스트럭처 계층)**
   - 데이터베이스 구현
   - 외부 서비스 연동
   - 기술적 세부사항

4. **Presentation Layer (프레젠테이션 계층)**
   - REST API 엔드포인트
   - 요청/응답 처리
   - 인증/인가

### 새로운 디렉토리 구조
```
src/
├── application/              # 애플리케이션 레이어
│   ├── dtos/                # 데이터 전송 객체
│   │   ├── auth/
│   │   │   ├── google-login.dto.ts
│   │   │   ├── auth-response.dto.ts
│   │   │   └── migrate-guest-data.dto.ts
│   │   ├── users/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── user-response.dto.ts
│   │   ├── progress/
│   │   │   ├── word-progress.dto.ts
│   │   │   ├── study-stats.dto.ts
│   │   │   └── study-session.dto.ts
│   │   └── wordbooks/
│   │       ├── create-wordbook.dto.ts
│   │       ├── update-wordbook.dto.ts
│   │       └── wordbook-response.dto.ts
│   ├── interfaces/          # 포트 인터페이스
│   │   ├── repositories/    # 리포지토리 인터페이스
│   │   └── services/        # 외부 서비스 인터페이스
│   ├── use-cases/           # 유스케이스
│   │   ├── auth/
│   │   ├── users/
│   │   ├── progress/
│   │   └── wordbooks/
│   └── services/            # 애플리케이션 서비스
│       ├── auth.service.ts
│       ├── users.service.ts
│       ├── progress.service.ts
│       └── wordbooks.service.ts
├── domain/                  # 도메인 레이어
│   ├── entities/            # 도메인 엔티티
│   │   ├── user.entity.ts
│   │   ├── word-progress.entity.ts
│   │   ├── study-session.entity.ts
│   │   └── wordbook.entity.ts
│   ├── value-objects/       # 값 객체
│   │   ├── email.vo.ts
│   │   ├── word-id.vo.ts
│   │   └── confidence-level.vo.ts
│   ├── repositories/        # 리포지토리 인터페이스
│   │   ├── user.repository.interface.ts
│   │   ├── progress.repository.interface.ts
│   │   └── wordbook.repository.interface.ts
│   └── services/            # 도메인 서비스
│       ├── password-hash.service.ts
│       └── progress-calculation.service.ts
├── infrastructure/          # 인프라스트럭처 레이어
│   ├── database/           # 데이터베이스
│   │   ├── drizzle/
│   │   │   ├── schema.ts
│   │   │   ├── migrations/
│   │   │   └── config.ts
│   │   └── repositories/   # 리포지토리 구현
│   │       ├── user.repository.ts
│   │       ├── progress.repository.ts
│   │       └── wordbook.repository.ts
│   ├── external/           # 외부 서비스
│   │   ├── google-auth.service.ts
│   │   └── jwt.service.ts
│   └── config/            # 설정
│       ├── database.config.ts
│       └── auth.config.ts
├── presentation/           # 프레젠테이션 레이어
│   ├── controllers/        # REST 컨트롤러
│   │   ├── auth.controller.ts
│   │   ├── users.controller.ts
│   │   ├── progress.controller.ts
│   │   └── wordbooks.controller.ts
│   ├── guards/            # 가드
│   │   ├── jwt-auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/      # 인터셉터
│   │   ├── logging.interceptor.ts
│   │   └── response.interceptor.ts
│   └── filters/           # 예외 필터
│       ├── http-exception.filter.ts
│       └── domain-exception.filter.ts
├── shared/                # 공통 모듈
│   ├── constants/         # 상수
│   │   ├── api.constants.ts
│   │   └── error.constants.ts
│   ├── exceptions/        # 커스텀 예외
│   │   ├── domain.exception.ts
│   │   ├── application.exception.ts
│   │   └── infrastructure.exception.ts
│   ├── types/            # 공통 타입
│   │   ├── api-response.type.ts
│   │   └── pagination.type.ts
│   └── utils/            # 유틸리티
│       ├── validation.util.ts
│       └── date.util.ts
├── app.module.ts
└── main.ts
```

## 핵심 원칙

### 1. 의존성 역전 원칙 (DIP)
- 고수준 모듈(Use Cases)은 저수준 모듈(Repository)에 의존하지 않음
- 인터페이스를 통한 의존성 주입

### 2. 단일 책임 원칙 (SRP)
- 각 클래스는 하나의 변경 이유만 가짐
- Use Case는 하나의 비즈니스 작업만 담당

### 3. 개방-폐쇄 원칙 (OCP)
- 확장에는 열려있고 수정에는 닫혀있음
- 새로운 기능 추가 시 기존 코드 수정 최소화

### 4. 인터페이스 분리 원칙 (ISP)
- 클라이언트는 사용하지 않는 인터페이스에 의존하지 않음
- 세분화된 인터페이스 설계

## 주요 패턴

### 1. Repository Pattern
```typescript
// Domain Layer
export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}

// Infrastructure Layer
@Injectable()
export class DrizzleUserRepository implements UserRepository {
  // 구현
}
```

### 2. Use Case Pattern
```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // 비즈니스 로직 구현
  }
}
```

### 3. DTO Pattern
```typescript
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
```

## 마이그레이션 이점

### 1. 테스트 용이성
- 각 레이어별 독립적인 단위 테스트
- Mock 객체를 통한 의존성 격리
- 통합 테스트 작성 용이

### 2. 유지보수성
- 관심사 분리로 코드 이해 용이
- 변경 영향도 최소화
- 코드 재사용성 증대

### 3. 확장성
- 새로운 기능 추가 시 기존 코드 영향 최소
- 다양한 데이터베이스나 외부 서비스 교체 용이
- 마이크로서비스 분리 준비

### 4. 타입 안전성
- DTO를 통한 API 계약 명확화
- 컴파일 타임 오류 감지
- IDE 지원 향상

## 성능 고려사항

### 1. 레이어 간 데이터 변환 최적화
- 불필요한 객체 생성 최소화
- 지연 로딩 활용

### 2. 캐싱 전략
- 도메인 엔티티 캐싱
- 쿼리 결과 캐싱

### 3. 데이터베이스 접근 최적화
- Repository에서 효율적인 쿼리 작성
- N+1 문제 방지

## 마이그레이션 위험 요소

### 1. 복잡성 증가
- 초기 러닝 커브
- 코드 양 증가

### 2. 성능 오버헤드
- 레이어 간 데이터 변환 비용
- 추가적인 추상화 레벨

### 3. 과도한 추상화
- YAGNI 원칙 위반 가능성
- 불필요한 복잡성 도입

## 결론

Clean Architecture 도입을 통해 장기적인 유지보수성과 확장성을 확보할 수 있습니다. 
단계적 마이그레이션을 통해 위험을 최소화하고, 팀의 생산성을 유지하면서 코드 품질을 개선할 수 있습니다.