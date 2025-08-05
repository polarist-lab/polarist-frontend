# Swagger Integration System Feature PRD

## 📋 기능 개요

### 목적
Clean Architecture 환경에서 프레임워크 독립성을 유지하면서 강력한 API 문서화 시스템을 구축합니다. 이중 DTO 패턴을 통해 도메인 순수성과 API 문서화를 모두 만족시킵니다.

### 비즈니스 가치
- **개발자 경험 향상**: 인터랙티브 API 문서로 개발 효율성 극대화
- **클라이언트 개발 가속화**: 자동 생성된 SDK로 프론트엔드 개발 속도 향상
- **API 품질 보장**: 타입 안전한 스키마로 런타임 에러 최소화
- **유지보수 비용 절감**: 코드와 문서 자동 동기화로 문서 관리 부담 제거

## 🎯 사용자 스토리

### As a Backend Developer
- **US-001**: API를 개발할 때, 코드 변경 시 문서가 자동으로 업데이트되기를 원한다
- **US-002**: Domain 로직을 작성할 때, Swagger 의존성 없이 순수한 비즈니스 로직을 구현하고 싶다
- **US-003**: API 응답 스키마를 정의할 때, 타입 안전성이 보장되기를 원한다

### As a Frontend Developer
- **US-004**: API를 호출할 때, 자동 생성된 TypeScript 클라이언트를 사용하고 싶다
- **US-005**: API 테스트 시, Swagger UI에서 실제 요청을 보내서 테스트하고 싶다
- **US-006**: 에러 응답 구조를 미리 알고, 적절한 에러 핸들링을 구현하고 싶다

### As a Product Manager
- **US-007**: API 문서를 통해 개발 진행 상황을 파악하고 싶다
- **US-008**: 외부 파트너에게 API 문서를 제공할 때, 전문적이고 완성도 높은 문서를 원한다

## 🏗️ 기술 요구사항

### 아키텍처 설계
```
┌─────────────────────────────────────────────────────────────┐
│                    Swagger Integration                      │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  Domain DTOs    │    │  API Schema     │                │
│  │  (Pure Types)   │◄──►│  DTOs           │                │
│  │                 │    │  (Swagger)      │                │
│  └─────────────────┘    └─────────────────┘                │
│           ▲                       ▲                        │
│           │                       │                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Use Cases     │    │  Controllers    │                │
│  │                 │    │  (API Layer)    │                │
│  └─────────────────┘    └─────────────────┘                │
│                                   ▲                        │
│                                   │                        │
│                         ┌─────────────────┐                │
│                         │   Swagger UI    │                │
│                         │   Client SDK    │                │
│                         └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### 핵심 컴포넌트

#### 1. 이중 DTO 패턴
```typescript
// Domain DTO (순수 타입)
export interface CreateUserDomainDto {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  locale?: string;
}

// API Schema DTO (Swagger 문서화)
export class CreateUserApiDto {
  @ApiProperty({ description: 'Google OAuth ID' })
  @IsString()
  @IsNotEmpty()
  googleId: string;

  @ApiProperty({ description: 'User email', format: 'email' })
  @IsEmail()
  email: string;
  
  // ... 기타 필드
}
```

#### 2. DTO 매퍼 시스템
```typescript
export class UserDtoMapper {
  static apiToDomain(apiDto: CreateUserApiDto): CreateUserDomainDto {
    return {
      googleId: apiDto.googleId,
      email: apiDto.email,
      name: apiDto.name,
      avatar: apiDto.avatar,
      locale: apiDto.locale,
    };
  }

  static domainToApi(domainDto: UserResponseDomainDto): UserResponseApiDto {
    return {
      id: domainDto.id,
      email: domainDto.email,
      name: domainDto.name,
      // ... 변환 로직
    };
  }
}
```

## 🔧 구현 세부사항

### Swagger 설정
```typescript
// main.ts
async function setupSwagger(app: any) {
  const config = new DocumentBuilder()
    .setTitle('Polarist API')
    .setDescription('Korean Language Learning Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('wordbooks', 'Wordbook operations')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
    },
  });
}
```

### Controller 문서화
```typescript
@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  @Post()
  @ApiOperation({
    summary: 'Create new user',
    description: 'Register a new user with Google OAuth information'
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserResponseApiDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  async create(@Body() dto: CreateUserApiDto): Promise<UserResponseApiDto> {
    const domainDto = UserDtoMapper.apiToDomain(dto);
    const result = await this.createUserUseCase.execute(domainDto);
    return UserDtoMapper.domainToApi(result);
  }
}
```

### 커스텀 데코레이터
```typescript
// 페이지네이션 응답 데코레이터
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          total: { type: 'number' },
          page: { type: 'number' },
          limit: { type: 'number' },
          hasNext: { type: 'boolean' },
          hasPrev: { type: 'boolean' },
        },
      },
    }),
  );
};
```

## ✅ 인수 기준 (Acceptance Criteria)

### AC-001: Clean Architecture 호환성
- [ ] Domain Layer는 Swagger 의존성이 없어야 함
- [ ] API Schema DTO와 Domain DTO가 명확히 분리되어야 함
- [ ] Controller에서만 Swagger 데코레이터가 사용되어야 함

### AC-002: API 문서 품질
- [ ] 모든 API 엔드포인트가 문서화되어야 함
- [ ] 요청/응답 스키마가 정확하게 정의되어야 함
- [ ] 에러 응답이 표준화되어 문서화되어야 함
- [ ] 예제 데이터가 실제 사용 가능한 형태여야 함

### AC-003: 자동화
- [ ] 코드 변경 시 Swagger 문서가 자동 업데이트되어야 함
- [ ] TypeScript 클라이언트 SDK가 자동 생성되어야 함
- [ ] API 스키마 검증이 런타임에 작동해야 함

### AC-004: 사용성
- [ ] Swagger UI가 직관적이고 사용하기 쉬워야 함
- [ ] API 테스트가 Swagger UI에서 가능해야 함
- [ ] 인증이 필요한 API도 테스트 가능해야 함

## 📊 성능 요구사항

### 문서 생성 성능
- **Swagger 문서 생성 시간**: 5초 이내
- **클라이언트 SDK 생성 시간**: 30초 이내
- **메모리 오버헤드**: 개발 환경에서 50MB 이내

### 런타임 성능
- **DTO 변환 오버헤드**: 5ms 이내
- **스키마 검증 시간**: 10ms 이내

## 🔒 보안 요구사항

### API 문서 보안
- [ ] 프로덕션에서는 Swagger UI 비활성화
- [ ] 민감한 정보는 예제에서 제외
- [ ] API 키나 토큰은 마스킹 처리

### 데이터 검증
- [ ] 입력 데이터는 DTO 레벨에서 검증
- [ ] SQL Injection, XSS 방지를 위한 sanitization
- [ ] 파일 업로드 시 타입 및 크기 제한

## 🧪 테스트 전략

### DTO 검증 테스트
```typescript
describe('CreateUserApiDto', () => {
  it('should validate correct user data', async () => {
    const dto = plainToClass(CreateUserApiDto, {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid email', async () => {
    const dto = plainToClass(CreateUserApiDto, {
      googleId: 'google-123',
      email: 'invalid-email',
      name: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });
});
```

### 매퍼 테스트
```typescript
describe('UserDtoMapper', () => {
  it('should convert API DTO to Domain DTO', () => {
    const apiDto: CreateUserApiDto = {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
    };

    const domainDto = UserDtoMapper.apiToDomain(apiDto);

    expect(domainDto.googleId).toBe(apiDto.googleId);
    expect(domainDto.email).toBe(apiDto.email);
  });
});
```

### Swagger 문서 테스트
```typescript
describe('Swagger Documentation', () => {
  it('should generate valid OpenAPI spec', async () => {
    const app = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    const document = SwaggerModule.createDocument(app, config);
    
    expect(document.paths['/users'].post).toBeDefined();
    expect(document.components.schemas['CreateUserApiDto']).toBeDefined();
  });
});
```

## 🚀 구현 단계

### Phase 1: 기본 설정 (Week 1)
- [ ] Swagger 패키지 설치 및 기본 설정
- [ ] 이중 DTO 구조 설계
- [ ] 기본 매퍼 유틸리티 구현

### Phase 2: DTO 시스템 (Week 2)
- [ ] Domain DTO 정의
- [ ] API Schema DTO 구현
- [ ] 검증 규칙 적용
- [ ] 매퍼 함수 구현

### Phase 3: Controller 문서화 (Week 3)
- [ ] 기존 Controller에 Swagger 데코레이터 적용
- [ ] 응답 스키마 정의
- [ ] 에러 응답 표준화

### Phase 4: 고급 기능 (Week 4)
- [ ] 커스텀 데코레이터 구현
- [ ] 파일 업로드 문서화
- [ ] 페이지네이션 응답 처리

### Phase 5: 자동화 (Week 5)
- [ ] 클라이언트 SDK 자동 생성 스크립트
- [ ] CI/CD 파이프라인 통합
- [ ] 문서 배포 자동화

## 📈 성공 측정

### 정량적 지표
- **API 문서 완성도**: 100% 엔드포인트 문서화
- **클라이언트 SDK 사용률**: 프론트엔드 팀 80% 이상 사용
- **문서 오류율**: 실제 API와 문서 불일치 5% 이하
- **개발 시간 단축**: API 통합 시간 50% 단축

### 정성적 지표
- **개발자 만족도**: Swagger 사용 만족도 4.5/5.0 이상
- **API 이해도**: 새로운 팀원의 API 이해 시간 60% 단축
- **에러 발생률**: 클라이언트-서버 통신 에러 40% 감소

## 🔗 관련 문서

- [Technical Implementation Guide](../../docs/swagger-integration.md)
- [DTO Validation System PRD](./dto-validation-system.md)
- [Clean Architecture Migration PRD](./clean-architecture-migration.md)
- [Error Handling System PRD](./error-handling-system.md)

## 📋 체크리스트

### 개발 완료 기준
- [ ] 모든 API 엔드포인트 Swagger 문서화 완료
- [ ] 이중 DTO 패턴 적용 완료
- [ ] 자동 클라이언트 SDK 생성 가능
- [ ] 에러 응답 표준화 완료
- [ ] 테스트 커버리지 90% 이상
- [ ] 성능 요구사항 충족
- [ ] 보안 요구사항 충족

### 배포 준비 기준
- [ ] 프로덕션 환경에서 Swagger UI 비활성화
- [ ] API 문서 정적 배포 설정
- [ ] 클라이언트 SDK 배포 파이프라인 구축
- [ ] 모니터링 및 알림 설정

---

*최종 업데이트: 2024년 8월*
*문서 버전: 1.0*
*승인자: System Architect*