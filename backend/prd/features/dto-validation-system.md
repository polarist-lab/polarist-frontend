# DTO Validation System Feature PRD

## 📋 기능 개요

### 목적
타입 안전한 입출력 검증 시스템을 구축하여 API의 신뢰성을 높이고, Clean Architecture의 의존성 역전 원칙을 준수하면서 강력한 데이터 검증을 제공합니다.

### 비즈니스 가치
- **데이터 무결성 보장**: 잘못된 데이터 입력으로 인한 시스템 오류 방지
- **개발 생산성 향상**: 자동화된 검증으로 수동 검증 코드 작성 시간 절약
- **사용자 경험 개선**: 명확한 검증 에러 메시지로 사용자 가이드
- **시스템 안정성**: 런타임 에러 발생률 최소화

## 🎯 사용자 스토리

### As a Backend Developer
- **US-001**: API 개발 시, 입력 데이터 검증을 자동화하여 보일러플레이트 코드를 줄이고 싶다
- **US-002**: Domain 로직과 API 검증 로직을 분리하여 Domain의 순수성을 유지하고 싶다
- **US-003**: 커스텀 검증 규칙을 쉽게 추가하고 재사용하고 싶다

### As a Frontend Developer
- **US-004**: API 호출 시, 어떤 필드가 필수인지, 어떤 형식이어야 하는지 명확히 알고 싶다
- **US-005**: 검증 실패 시, 필드별로 구체적인 에러 메시지를 받아서 사용자에게 안내하고 싶다
- **US-006**: TypeScript 타입 정의와 런타임 검증이 일치하여 타입 안전성을 보장받고 싶다

### As a Product Manager
- **US-007**: 사용자 입력 오류로 인한 이슈를 최소화하여 고객 만족도를 높이고 싶다
- **US-008**: 데이터 품질 문제로 인한 비즈니스 로직 오류를 방지하고 싶다

## 🏗️ 기술 요구사항

### 아키텍처 설계
```
┌─────────────────────────────────────────────────────────────┐
│                    DTO Validation System                    │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  Domain DTOs    │    │  API Schema     │                │
│  │  (Pure Types)   │◄──►│  DTOs           │                │
│  │                 │    │  (Validation)   │                │
│  └─────────────────┘    └─────────────────┘                │
│           ▲                       ▲                        │
│           │                       │                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Use Cases     │    │  Controllers    │                │
│  │                 │    │  (HTTP Layer)   │                │
│  └─────────────────┘    └─────────────────┘                │
│                                   ▲                        │
│                                   │                        │
│                         ┌─────────────────┐                │
│                         │   Validation    │                │
│                         │   Pipeline      │                │
│                         └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### 핵심 컴포넌트

#### 1. 이중 DTO 패턴
```typescript
// Domain DTO (순수 타입, 검증 로직 없음)
export interface CreateUserDomainDto {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  locale?: string;
}

// API Schema DTO (검증 로직 포함)
export class CreateUserApiDto {
  @ApiProperty({ description: 'Google OAuth ID', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  googleId: string;

  @ApiProperty({ description: 'User email', format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User name', minLength: 1, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Avatar URL', maxLength: 255 })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  avatar?: string;

  @ApiPropertyOptional({ 
    description: 'User locale',
    enum: ['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt']
  })
  @IsOptional()
  @IsIn(['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'])
  locale?: string;
}
```

#### 2. 커스텀 검증 데코레이터
```typescript
export function IsValidWordId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidWordId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return /^[가-힣a-zA-Z0-9-_\s]+$/.test(value) && 
                 value.length > 0 && 
                 value.length <= 50;
        },
        defaultMessage() {
          return 'Word ID must contain only Korean, English, numbers, hyphens, underscores (1-50 characters)';
        },
      },
    });
  };
}
```

#### 3. DTO 변환 시스템
```typescript
export class UserDtoMapper {
  static apiToDomain(apiDto: CreateUserApiDto): CreateUserDomainDto {
    return {
      googleId: apiDto.googleId,
      email: apiDto.email,
      name: apiDto.name,
      avatar: apiDto.avatar,
      locale: apiDto.locale || 'en',
    };
  }

  static domainToApi(domainDto: UserResponseDomainDto): UserResponseApiDto {
    return {
      id: domainDto.id,
      googleId: domainDto.googleId,
      email: domainDto.email,
      name: domainDto.name,
      avatar: domainDto.avatar,
      locale: domainDto.locale,
      createdAt: domainDto.createdAt.toISOString(),
      updatedAt: domainDto.updatedAt.toISOString(),
    };
  }
}
```

## 🔧 구현 세부사항

### 글로벌 검증 파이프
```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // DTO에 없는 속성 제거
  forbidNonWhitelisted: true, // 정의되지 않은 속성 발견시 에러
  transform: true,           // 자동 타입 변환
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (errors: ValidationError[]) => {
    const formattedErrors = formatValidationErrors(errors);
    return new ValidationException(formattedErrors);
  },
}));
```

### 검증 에러 포맷터
```typescript
function formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  
  errors.forEach(error => {
    if (error.constraints) {
      result[error.property] = Object.values(error.constraints);
    }
    
    if (error.children && error.children.length > 0) {
      const nestedErrors = formatValidationErrors(error.children);
      Object.keys(nestedErrors).forEach(key => {
        result[`${error.property}.${key}`] = nestedErrors[key];
      });
    }
  });
  
  return result;
}
```

### 조건부 검증
```typescript
export class CreateWordbookApiDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isPublic: boolean;

  // isPublic이 true일 때만 shareCode 검증
  @ValidateIf(o => o.isPublic === true)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]{10,30}$/, {
    message: 'Share code must be 10-30 alphanumeric characters'
  })
  shareCode?: string;

  // isPublic이 false일 때만 description 필수
  @ValidateIf(o => o.isPublic === false)
  @IsString()
  @IsNotEmpty()
  description?: string;
}
```

### 네스트된 객체 검증
```typescript
class WordItemDto {
  @IsString()
  @IsNotEmpty()
  @IsValidWordId()
  wordId: string;

  @IsString()
  @IsNotEmpty()
  korean: string;

  @IsString()
  @IsNotEmpty()
  english: string;

  @IsOptional()
  @IsString()
  pronunciation?: string;
}

export class CreateBulkWordbookApiDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  @Type(() => WordItemDto)
  words: WordItemDto[];
}
```

## ✅ 인수 기준 (Acceptance Criteria)

### AC-001: DTO 분리
- [ ] Domain DTO는 검증 로직이 없어야 함
- [ ] API Schema DTO는 완전한 검증 규칙을 가져야 함
- [ ] 매퍼를 통한 변환이 타입 안전해야 함

### AC-002: 검증 완성도
- [ ] 모든 API 입력에 대한 검증 규칙이 정의되어야 함
- [ ] 커스텀 비즈니스 규칙 검증이 가능해야 함
- [ ] 에러 메시지가 사용자 친화적이어야 함

### AC-003: 성능
- [ ] 검증 처리 시간이 10ms 이하여야 함
- [ ] 메모리 사용량이 합리적이어야 함
- [ ] 대용량 배열 검증이 효율적이어야 함

### AC-004: 국제화
- [ ] 에러 메시지가 다국어를 지원해야 함
- [ ] 한국어 입력 검증이 올바르게 작동해야 함

## 📊 성능 요구사항

### 검증 성능
- **단일 DTO 검증**: 5ms 이하
- **배열 DTO 검증 (100개)**: 50ms 이하
- **네스트된 객체 검증**: 10ms 이하

### 메모리 사용
- **검증 메타데이터**: DTO당 1KB 이하
- **검증 인스턴스**: 요청당 5KB 이하

## 🔒 보안 요구사항

### 입력 데이터 보안
- [ ] SQL Injection 방지를 위한 입력 sanitization
- [ ] XSS 방지를 위한 HTML 태그 필터링
- [ ] 파일 업로드 시 타입 및 크기 제한
- [ ] 특수 문자 및 스크립트 입력 차단

### 데이터 검증 보안
- [ ] 검증 우회 공격 방지
- [ ] 과도한 데이터 입력으로 인한 DoS 방지
- [ ] 민감한 정보 로깅 방지

## 🧪 테스트 전략

### DTO 검증 테스트
```typescript
describe('CreateUserApiDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = plainToClass(CreateUserApiDto, {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      locale: 'en',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid email', async () => {
    const dto = plainToClass(CreateUserApiDto, {
      googleId: 'google-123',
      email: 'invalid-email',
      name: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints?.isEmail).toBeDefined();
  });

  it('should handle optional fields correctly', async () => {
    const dto = plainToClass(CreateUserApiDto, {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      // avatar와 locale는 선택적
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
```

### 커스텀 검증자 테스트
```typescript
describe('IsValidWordId', () => {
  class TestDto {
    @IsValidWordId()
    wordId: string;
  }

  it('should accept valid Korean word ID', async () => {
    const dto = plainToClass(TestDto, { wordId: '안녕하세요' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should accept valid English word ID', async () => {
    const dto = plainToClass(TestDto, { wordId: 'hello-world_123' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject special characters', async () => {
    const dto = plainToClass(TestDto, { wordId: 'hello@world' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
  });

  it('should reject too long word ID', async () => {
    const dto = plainToClass(TestDto, { 
      wordId: 'a'.repeat(51) 
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
  });
});
```

### 매퍼 테스트
```typescript
describe('UserDtoMapper', () => {
  it('should map API DTO to Domain DTO correctly', () => {
    const apiDto: CreateUserApiDto = {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      locale: 'ko',
    };

    const domainDto = UserDtoMapper.apiToDomain(apiDto);

    expect(domainDto).toEqual({
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      locale: 'ko',
    });
  });

  it('should handle missing optional fields', () => {
    const apiDto: CreateUserApiDto = {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
    };

    const domainDto = UserDtoMapper.apiToDomain(apiDto);

    expect(domainDto.locale).toBe('en'); // 기본값
    expect(domainDto.avatar).toBeUndefined();
  });
});
```

## 🚀 구현 단계

### Phase 1: 기본 설정 (Week 1)
- [ ] class-validator, class-transformer 설정
- [ ] 글로벌 검증 파이프 구성
- [ ] 기본 에러 포맷터 구현

### Phase 2: 이중 DTO 구조 (Week 2)
- [ ] Domain DTO 인터페이스 정의
- [ ] API Schema DTO 클래스 구현
- [ ] 매퍼 함수 구현

### Phase 3: 커스텀 검증자 (Week 3)
- [ ] 비즈니스 규칙 검증자 구현
- [ ] 한국어 특화 검증자 구현
- [ ] 조건부 검증 로직 구현

### Phase 4: 고급 검증 (Week 4)
- [ ] 네스트된 객체 검증
- [ ] 배열 및 대용량 데이터 검증
- [ ] 파일 업로드 검증

### Phase 5: 최적화 및 테스트 (Week 5)
- [ ] 성능 최적화
- [ ] 완전한 테스트 커버리지 달성
- [ ] 에러 메시지 다국화

## 📈 성공 측정

### 정량적 지표
- **검증 커버리지**: 100% API 엔드포인트 검증 적용
- **에러 감소율**: 입력 데이터 관련 버그 80% 감소
- **성능**: 검증 처리 시간 10ms 이하 달성
- **테스트 커버리지**: DTO 관련 코드 95% 이상

### 정성적 지표
- **개발자 생산성**: DTO 작성 시간 60% 단축
- **사용자 경험**: 명확한 검증 에러 메시지로 사용자 만족도 향상
- **코드 품질**: 런타임 타입 에러 발생률 90% 감소

## 🔗 관련 문서

- [Technical Implementation Guide](../../docs/dto-patterns.md)
- [Error Handling System PRD](./error-handling-system.md)
- [Swagger Integration PRD](./swagger-integration.md)
- [Clean Architecture Migration PRD](./clean-architecture-migration.md)

## 📋 체크리스트

### 개발 완료 기준
- [ ] 모든 API 엔드포인트에 DTO 검증 적용
- [ ] 이중 DTO 패턴 완전 구현
- [ ] 커스텀 검증자 라이브러리 완성
- [ ] 매퍼 시스템 구현 완료
- [ ] 테스트 커버리지 95% 이상 달성

### 품질 보증 기준
- [ ] 성능 요구사항 충족
- [ ] 보안 요구사항 충족
- [ ] 다국어 지원 완료
- [ ] 문서화 완료

---

*최종 업데이트: 2024년 8월*
*문서 버전: 1.0*
*승인자: System Architect*