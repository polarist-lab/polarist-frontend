# Phase 1: Foundation Setup

## 📋 Phase 개요

**목표**: Clean Architecture 리팩토링의 기반이 되는 공통 컴포넌트와 인프라스트럭처를 구축합니다.

**기간**: 1-2 weeks  
**우선순위**: P0 (최고 우선순위)  
**의존성**: 없음

## 🎯 주요 목표

1. **프로젝트 구조 재편성**: Clean Architecture 4계층 구조로 디렉토리 재구성
2. **예외 처리 시스템**: 계층별 예외 클래스 계층구조 구축
3. **공통 컴포넌트**: 글로벌 필터, 인터셉터, 파이프 구현
4. **기본 타입 정의**: 공통 인터페이스 및 타입 정의

## 📚 관련 PRD 문서

- **주요 참조**: [Error Handling System PRD](../features/error-handling-system.md)
- **보조 참조**: [Clean Architecture Migration PRD](../features/clean-architecture-migration.md)

## 🏗️ 구현 범위

### 1. 디렉토리 구조 재편성

#### 목표 구조
```
src/
├── shared/                    # 공통 컴포넌트
│   ├── exceptions/           # 예외 클래스들
│   ├── filters/             # 글로벌 필터들
│   ├── interceptors/        # 인터셉터들
│   ├── pipes/               # 파이프들
│   ├── decorators/          # 커스텀 데코레이터들
│   └── types/               # 공통 타입 정의
├── domain/                   # Domain Layer (준비)
├── application/              # Application Layer (준비)
├── infrastructure/           # Infrastructure Layer (준비)
└── presentation/             # Presentation Layer (준비)
```

#### 작업 항목
- [ ] 새로운 디렉토리 구조 생성
- [ ] 기존 파일들의 임시 보관 디렉토리 생성
- [ ] tsconfig.json path mapping 업데이트
- [ ] 모듈 import 경로 별칭 설정

### 2. 예외 처리 시스템 구축

#### BaseException 구현
```typescript
// src/shared/exceptions/base.exception.ts
export abstract class BaseException extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  
  constructor(
    message: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}
```

#### 계층별 예외 클래스
- [ ] **Domain Exceptions**
  - `DomainException` (기본 클래스)
  - `EntityNotFoundDomainException`
  - `InvalidDomainDataException`
  - `BusinessRuleViolationException`
  - `DomainConflictException`

- [ ] **Application Exceptions**
  - `ApplicationException` (기본 클래스)
  - `ValidationException`
  - `UnauthorizedException`
  - `ForbiddenException`
  - `UseCaseException`
  - `ExternalDependencyException`

- [ ] **Infrastructure Exceptions**
  - `InfrastructureException` (기본 클래스)
  - `DatabaseException`
  - `ExternalServiceException`
  - `FileSystemException`
  - `NetworkException`

### 3. 글로벌 필터 및 미들웨어

#### GlobalExceptionFilter 구현
```typescript
// src/shared/filters/global-exception.filter.ts
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const exceptionData = this.parseException(exception);
    this.logException(exception, request, exceptionData);

    const errorResponse = this.createErrorResponse(request, exceptionData);
    response.status(exceptionData.statusCode).json(errorResponse);
  }
}
```

#### 작업 항목
- [ ] GlobalExceptionFilter 구현
- [ ] LoggingInterceptor 구현
- [ ] ResponseTransformInterceptor 구현
- [ ] ValidationPipe 설정

### 4. 공통 타입 및 인터페이스

#### API 응답 타입
```typescript
// src/shared/types/api-response.type.ts
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
  path: string;
  traceId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
  path: string;
  traceId?: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
```

#### 작업 항목
- [ ] API 응답 타입 정의
- [ ] 페이지네이션 타입 정의
- [ ] 공통 Enum 정의
- [ ] 유틸리티 타입 정의

## ✅ 완료 기준 (Definition of Done)

### 기능적 완료 기준
- [ ] 새로운 디렉토리 구조가 생성되고 설정 완료
- [ ] 모든 예외 클래스가 구현되고 테스트 완료
- [ ] 글로벌 필터가 작동하여 예외를 적절히 처리
- [ ] 공통 타입이 정의되고 문서화 완료

### 품질 완료 기준
- [ ] 테스트 커버리지 90% 이상
- [ ] ESLint/TypeScript 컴파일 에러 없음
- [ ] 모든 클래스와 인터페이스에 JSDoc 주석 작성
- [ ] 코드 리뷰 완료 및 승인

### 통합 완료 기준
- [ ] 기존 모듈과 호환성 유지
- [ ] 개발 서버 정상 동작
- [ ] API 엔드포인트 정상 응답
- [ ] 로그 출력 형식 표준화

## 🧪 테스트 계획

### 단위 테스트
```typescript
// Exception 클래스 테스트
describe('BaseException', () => {
  it('should create exception with correct properties', () => {
    const exception = new TestException('Test message', { key: 'value' });
    
    expect(exception.message).toBe('Test message');
    expect(exception.context).toEqual({ key: 'value' });
    expect(exception.toJSON()).toMatchObject({
      name: 'TestException',
      message: 'Test message',
      context: { key: 'value' },
      timestamp: expect.any(String)
    });
  });
});

// GlobalExceptionFilter 테스트
describe('GlobalExceptionFilter', () => {
  it('should handle BaseException correctly', () => {
    const exception = new DomainException('Domain error');
    const mockResponse = createMockResponse();
    
    filter.catch(exception, createMockArgumentsHost(mockResponse));
    
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'DOMAIN_ERROR',
        message: 'Domain error'
      },
      timestamp: expect.any(String),
      path: expect.any(String)
    });
  });
});
```

### 통합 테스트
- [ ] 전체 예외 처리 플로우 테스트
- [ ] API 엔드포인트 에러 응답 테스트
- [ ] 로깅 시스템 통합 테스트

## 📊 성공 지표

### 정량적 지표
- **코드 구조**: 새로운 디렉토리 구조 100% 적용
- **예외 처리**: 모든 예외가 표준화된 형태로 응답
- **테스트 커버리지**: 90% 이상
- **빌드 성공률**: 100%

### 정성적 지표
- **코드 품질**: ESLint 규칙 준수
- **개발자 경험**: 명확한 에러 메시지 제공
- **유지보수성**: 일관된 코드 구조

## 🔄 다음 단계 준비

### Phase 2 준비사항
- [ ] Domain entities 설계 문서 검토
- [ ] Repository interfaces 목록 작성
- [ ] Value objects 후보 식별

### 전달 사항
- 구축된 예외 처리 시스템 사용법 가이드
- 새로운 디렉토리 구조 가이드라인
- 공통 타입 및 유틸리티 사용법

## 🔗 관련 문서

### 상세 기술 문서
- [Error Handling Implementation Guide](../../docs/error-handling.md)
- [Clean Architecture Plan](../../docs/clean-architecture-plan.md)

### 다음 Phase 문서
- [Phase 2: Domain Layer](./phase-2-domain.md)

---

**Phase Owner**: Backend Lead Developer  
**Reviewers**: System Architect, Senior Developers  
**최종 업데이트**: 2024년 8월