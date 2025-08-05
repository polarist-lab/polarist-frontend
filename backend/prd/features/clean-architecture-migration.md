# Clean Architecture Migration Feature PRD

## 📋 기능 개요

### 목적
기존 NestJS 모놀리식 구조를 Clean Architecture 4계층 구조로 마이그레이션하여 코드의 유지보수성, 테스트 가능성, 확장성을 극대화합니다.

### 비즈니스 가치
- **개발 속도 향상**: 명확한 계층 분리로 병렬 개발 가능
- **유지보수 비용 절감**: 의존성 역전으로 변경 영향도 최소화
- **품질 향상**: 테스트 가능한 구조로 버그 발생률 감소
- **확장성**: 새로운 기능 추가 시 기존 코드 영향 최소화

## 🎯 사용자 스토리

### As a Developer
- **US-001**: 새로운 API 엔드포인트를 추가할 때, 비즈니스 로직과 데이터 액세스 로직을 분리하여 개발하고 싶다
- **US-002**: 데이터베이스를 변경할 때, 비즈니스 로직에 영향을 주지 않고 작업하고 싶다
- **US-003**: 단위 테스트를 작성할 때, 외부 의존성 없이 비즈니스 로직만 테스트하고 싶다
- **US-004**: 코드 리뷰 시, 각 계층의 책임이 명확하게 구분된 코드를 검토하고 싶다

### As a System Architect
- **US-005**: 마이크로서비스로 전환할 때, 도메인별로 독립적인 서비스 분리가 가능한 구조를 원한다
- **US-006**: 새로운 팀원이 합류할 때, 일관된 구조로 빠른 온보딩이 가능하기를 원한다

## 🏗️ 기술 요구사항

### 현재 상태 (As-Is)
```
src/
├── app.module.ts
├── main.ts
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
└── wordbooks/
    ├── wordbooks.controller.ts
    ├── wordbooks.service.ts
    └── wordbooks.module.ts
```

**문제점**:
- Service 클래스에 비즈니스 로직과 데이터 액세스 로직이 혼재
- 직접적인 ORM 의존성
- DTO 부재로 타입 안전성 부족
- 테스트 시 데이터베이스 의존성 필요

### 목표 상태 (To-Be)
```
src/
├── shared/                    # 공통 컴포넌트
│   ├── exceptions/
│   ├── filters/
│   ├── interceptors/
│   └── types/
├── domain/                    # Domain Layer
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   └── services/
├── application/               # Application Layer
│   ├── use-cases/
│   ├── dtos/
│   └── ports/
├── infrastructure/            # Infrastructure Layer
│   ├── database/
│   ├── repositories/
│   └── external-services/
└── presentation/              # Presentation Layer
    ├── controllers/
    ├── guards/
    └── middlewares/
```

## 🔧 구현 세부사항

### Domain Layer
**책임**: 비즈니스 엔티티, 값 객체, 도메인 서비스

```typescript
// 예시: User Entity
export class User {
  constructor(
    private readonly _id: number,
    private readonly _googleId: string,
    private _email: Email,
    private _name: string,
    private _avatar?: string,
    private _locale: string = 'en'
  ) {}

  get id(): number { return this._id; }
  get email(): Email { return this._email; }
  
  updateProfile(name: string, avatar?: string): void {
    this.validateName(name);
    this._name = name;
    this._avatar = avatar;
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidDomainDataException('name', name, 'Name cannot be empty');
    }
  }
}
```

### Application Layer
**책임**: Use Cases, DTOs, 비즈니스 로직 조합

```typescript
// 예시: Create User Use Case
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // 중복 체크
    const existingUser = await this.userRepository.findByGoogleId(dto.googleId);
    if (existingUser) {
      throw new DomainConflictException('User', 'Google ID already exists');
    }

    // 사용자 생성
    const user = User.create({
      googleId: dto.googleId,
      email: dto.email,
      name: dto.name,
      avatar: dto.avatar,
      locale: dto.locale,
    });

    const savedUser = await this.userRepository.save(user);
    return UserResponseDto.fromEntity(savedUser);
  }
}
```

### Infrastructure Layer
**책임**: Repository 구현, 데이터베이스 연동, 외부 서비스

```typescript
// 예시: User Repository Implementation
@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByGoogleId(googleId: string): Promise<User | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(users)
        .where(eq(users.googleId, googleId))
        .limit(1);

      return result[0] ? this.toDomainEntity(result[0]) : null;
    } catch (error) {
      throw new DatabaseException('findByGoogleId', error as Error);
    }
  }
}
```

### Presentation Layer
**책임**: HTTP 요청/응답 처리, 인증, 검증

```typescript
// 예시: User Controller
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({ type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(createUserDto);
  }
}
```

## ✅ 인수 기준 (Acceptance Criteria)

### AC-001: 계층 분리
- [ ] Domain Layer는 외부 의존성이 없어야 함
- [ ] Application Layer는 Domain과 Infrastructure의 인터페이스만 의존해야 함
- [ ] Infrastructure Layer는 Domain의 인터페이스를 구현해야 함
- [ ] Presentation Layer는 Application Layer의 Use Cases만 호출해야 함

### AC-002: 의존성 역전
- [ ] 모든 계층은 추상화(인터페이스)에 의존해야 함
- [ ] Repository는 인터페이스로 정의되고 DI로 주입되어야 함
- [ ] 외부 서비스는 어댑터 패턴을 통해 추상화되어야 함

### AC-003: 테스트 가능성
- [ ] Domain Layer 단위 테스트 커버리지 95% 이상
- [ ] Use Cases 단위 테스트 시 모킹 가능해야 함
- [ ] Repository 테스트 시 실제 DB 없이 가능해야 함

### AC-004: 코드 품질
- [ ] 각 클래스는 단일 책임 원칙을 준수해야 함
- [ ] 순환 의존성이 없어야 함
- [ ] ESLint, SonarQube 규칙 통과해야 함

## 📊 성능 요구사항

### 응답 시간
- **API 응답 시간**: 평균 200ms 이하 (95th percentile 500ms 이하)
- **데이터베이스 쿼리**: 평균 50ms 이하
- **메모리 사용량**: 현재 대비 20% 이내 증가 허용

### 처리량
- **동시 사용자**: 1,000명 이상 지원
- **API 요청**: 초당 500 requests 처리 가능

## 🔒 보안 요구사항

### 데이터 보호
- [ ] 민감한 정보는 Domain Layer에서 암호화
- [ ] Repository Layer에서 SQL Injection 방지
- [ ] DTO 검증으로 입력 데이터 검증

### 접근 제어
- [ ] Use Cases 레벨에서 권한 검증
- [ ] 민감한 비즈니스 로직은 Domain Service에서 처리

## 🧪 테스트 전략

### 단위 테스트
```typescript
// Domain Entity 테스트 예시
describe('User Entity', () => {
  it('should update profile with valid data', () => {
    const user = User.create({
      googleId: 'test-123',
      email: 'test@example.com',
      name: 'Test User'
    });

    user.updateProfile('Updated Name', 'new-avatar.jpg');

    expect(user.name).toBe('Updated Name');
    expect(user.avatar).toBe('new-avatar.jpg');
  });

  it('should throw error for invalid name', () => {
    const user = User.create({
      googleId: 'test-123',
      email: 'test@example.com',
      name: 'Test User'
    });

    expect(() => user.updateProfile('')).toThrow(InvalidDomainDataException);
  });
});
```

### 통합 테스트
```typescript
// Use Case 통합 테스트 예시
describe('CreateUserUseCase Integration', () => {
  it('should create user successfully', async () => {
    const useCase = new CreateUserUseCase(mockUserRepository);
    
    const dto: CreateUserDto = {
      googleId: 'new-123',
      email: 'new@example.com',
      name: 'New User'
    };

    const result = await useCase.execute(dto);

    expect(result.id).toBeDefined();
    expect(result.email).toBe(dto.email);
  });
});
```

## 🚀 마이그레이션 계획

### Phase 1: Foundation (Week 1-2)
- [ ] 새로운 디렉토리 구조 생성
- [ ] 공통 예외 처리 시스템 구축
- [ ] 기본 인터페이스 정의

### Phase 2: Domain Layer (Week 3)
- [ ] Domain entities 구현
- [ ] Value objects 구현
- [ ] Repository interfaces 정의

### Phase 3: Application Layer (Week 4-5)
- [ ] Use Cases 구현
- [ ] DTOs 정의
- [ ] 비즈니스 로직 이전

### Phase 4: Infrastructure Layer (Week 6-7)
- [ ] Repository 구현체 개발
- [ ] 데이터베이스 어댑터 구현
- [ ] 외부 서비스 어댑터 구현

### Phase 5: Presentation Layer (Week 8)
- [ ] Controller 리팩토링
- [ ] 미들웨어 및 가드 업데이트
- [ ] API 문서화

### Phase 6: Testing & Integration (Week 9-10)
- [ ] 통합 테스트 구축
- [ ] 성능 테스트 및 최적화
- [ ] 문서화 완료

## 📈 성공 측정

### 정량적 지표
- **코드 복잡도**: Cyclomatic Complexity 10 이하
- **의존성 그래프**: 순환 의존성 0개
- **테스트 커버리지**: 90% 이상
- **빌드 시간**: 현재 대비 30% 단축

### 정성적 지표
- **개발자 만족도**: 설문조사 4.5/5.0 이상
- **코드 리뷰 효율성**: 평균 리뷰 시간 50% 단축
- **온보딩 시간**: 신규 개발자 적응 시간 40% 단축

## 🔗 관련 문서

- [Technical Implementation Guide](../../docs/clean-architecture-plan.md)
- [Phase-by-Phase Implementation Plans](../plans/)
- [Error Handling System PRD](./error-handling-system.md)
- [DTO Validation System PRD](./dto-validation-system.md)

---

*최종 업데이트: 2024년 8월*
*문서 버전: 1.0*
*승인자: System Architect*