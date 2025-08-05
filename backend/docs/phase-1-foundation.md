# Phase 1: Foundation Setup (기반 구조 설정)

## 목표
Clean Architecture의 기본 구조와 공통 모듈을 설정하여 후속 단계의 기반을 마련합니다.

## 범위
- 새로운 디렉토리 구조 생성
- 공통 예외 처리 시스템 구축
- 기본 타입 및 상수 정의
- Validation 파이프라인 구성

## 구현할 파일 목록

### 1. 디렉토리 구조 생성
```bash
mkdir -p src/application/{dtos,interfaces,use-cases,services}
mkdir -p src/domain/{entities,value-objects,repositories,services}
mkdir -p src/infrastructure/{database,repositories,external,config}
mkdir -p src/presentation/{controllers,guards,interceptors,filters}
mkdir -p src/shared/{constants,exceptions,types,utils}
```

### 2. 공통 예외 클래스 (`src/shared/exceptions/`)

#### `base.exception.ts`
```typescript
export abstract class BaseException extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  
  constructor(
    message: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
```

#### `domain.exception.ts`
```typescript
import { BaseException } from './base.exception';

export class DomainException extends BaseException {
  readonly code = 'DOMAIN_ERROR';
  readonly statusCode = 400;
}

export class EntityNotFoundDomainException extends DomainException {
  readonly code = 'ENTITY_NOT_FOUND';
  readonly statusCode = 404;
  
  constructor(entityName: string, identifier: string | number) {
    super(`${entityName} with identifier ${identifier} not found`);
  }
}

export class InvalidDomainDataException extends DomainException {
  readonly code = 'INVALID_DOMAIN_DATA';
  
  constructor(fieldName: string, value: any, reason?: string) {
    super(`Invalid data for field ${fieldName}: ${value}${reason ? `. ${reason}` : ''}`);
  }
}
```

#### `application.exception.ts`
```typescript
import { BaseException } from './base.exception';

export class ApplicationException extends BaseException {
  readonly code = 'APPLICATION_ERROR';
  readonly statusCode = 500;
}

export class ValidationException extends ApplicationException {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  
  constructor(errors: Record<string, string[]>) {
    super('Validation failed');
    this.context = { errors };
  }
}

export class UnauthorizedException extends ApplicationException {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;
}

export class ForbiddenException extends ApplicationException {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;
}
```

#### `infrastructure.exception.ts`
```typescript
import { BaseException } from './base.exception';

export class InfrastructureException extends BaseException {
  readonly code = 'INFRASTRUCTURE_ERROR';
  readonly statusCode = 500;
}

export class DatabaseException extends InfrastructureException {
  readonly code = 'DATABASE_ERROR';
  
  constructor(operation: string, error: Error) {
    super(`Database ${operation} failed: ${error.message}`);
    this.context = { originalError: error.message };
  }
}

export class ExternalServiceException extends InfrastructureException {
  readonly code = 'EXTERNAL_SERVICE_ERROR';
  
  constructor(service: string, error: Error) {
    super(`External service ${service} failed: ${error.message}`);
    this.context = { service, originalError: error.message };
  }
}
```

### 3. 공통 타입 정의 (`src/shared/types/`)

#### `api-response.type.ts`
```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

#### `pagination.type.ts`
```typescript
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

### 4. 상수 정의 (`src/shared/constants/`)

#### `api.constants.ts`
```typescript
export const API_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_SORT_ORDER: 'DESC' as const,
  CACHE_TTL: 300, // 5 minutes
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
```

#### `error.constants.ts`
```typescript
export const ERROR_CODES = {
  // Domain Errors
  ENTITY_NOT_FOUND: 'ENTITY_NOT_FOUND',
  INVALID_DOMAIN_DATA: 'INVALID_DOMAIN_DATA',
  
  // Application Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // Infrastructure Errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.ENTITY_NOT_FOUND]: 'The requested resource was not found',
  [ERROR_CODES.INVALID_DOMAIN_DATA]: 'Invalid data provided',
  [ERROR_CODES.VALIDATION_ERROR]: 'Input validation failed',
  [ERROR_CODES.UNAUTHORIZED]: 'Authentication required',
  [ERROR_CODES.FORBIDDEN]: 'Access denied',
  [ERROR_CODES.DATABASE_ERROR]: 'Database operation failed',
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 'External service unavailable',
} as const;
```

### 5. 유틸리티 함수 (`src/shared/utils/`)

#### `validation.util.ts`
```typescript
import { ValidationError } from 'class-validator';
import { ValidationException } from '../exceptions/application.exception';

export class ValidationUtil {
  static formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};
    
    errors.forEach(error => {
      if (error.constraints) {
        formatted[error.property] = Object.values(error.constraints);
      }
    });
    
    return formatted;
  }
  
  static throwValidationException(errors: ValidationError[]): never {
    const formatted = this.formatValidationErrors(errors);
    throw new ValidationException(formatted);
  }
}
```

#### `date.util.ts`
```typescript
export class DateUtil {
  static now(): Date {
    return new Date();
  }
  
  static toISOString(date: Date): string {
    return date.toISOString();
  }
  
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  static diffInDays(from: Date, to: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((to.getTime() - from.getTime()) / msPerDay);
  }
}
```

### 6. 글로벌 예외 필터 (`src/presentation/filters/`)

#### `http-exception.filter.ts`
```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '../../shared/exceptions/base.exception';
import { ApiResponse } from '../../shared/types/api-response.type';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, code, message, details } = this.parseException(exception);

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  private parseException(exception: unknown) {
    if (exception instanceof BaseException) {
      return {
        status: exception.statusCode,
        code: exception.code,
        message: exception.message,
        details: exception.context,
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      
      return {
        status,
        code: 'HTTP_EXCEPTION',
        message: typeof response === 'string' ? response : (response as any).message,
        details: typeof response === 'object' ? response : undefined,
      };
    }

    // Unknown exception
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      details: undefined,
    };
  }
}
```

### 7. 응답 인터셉터 (`src/presentation/interceptors/`)

#### `response.interceptor.ts`
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { ApiResponse } from '../../shared/types/api-response.type';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse> {
    const request = context.switchToHttp().getRequest<Request>();
    
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
      }))
    );
  }
}
```

### 8. 로깅 인터셉터 (`src/presentation/interceptors/`)

#### `logging.interceptor.ts`
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    
    const { method, url, body, query, params } = request;
    const startTime = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${url}`,
      {
        body: this.sanitizeData(body),
        query,
        params,
      }
    );

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        this.logger.log(
          `Outgoing Response: ${method} ${url} - ${response.statusCode} - ${duration}ms`
        );
      })
    );
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const sanitized = { ...data };
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    });
    
    return sanitized;
  }
}
```

### 9. Validation Pipe 설정 (`src/shared/pipes/`)

#### `validation.pipe.ts`
```typescript
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationUtil } from '../utils/validation.util';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    
    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
    
    if (errors.length > 0) {
      ValidationUtil.throwValidationException(errors);
    }
    
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

## 패키지 설치

### 필요한 의존성 추가
```bash
npm install class-validator class-transformer
npm install --save-dev @types/jest
```

### package.json 업데이트
```json
{
  "dependencies": {
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1"
  }
}
```

## main.ts 업데이트

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './presentation/filters/http-exception.filter';
import { ResponseInterceptor } from './presentation/interceptors/response.interceptor';
import { LoggingInterceptor } from './presentation/interceptors/logging.interceptor';
import { ValidationPipe } from './shared/pipes/validation.pipe';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );
  
  // Global pipes
  app.useGlobalPipes(new ValidationPipe());
  
  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Polarist Backend API running on http://localhost:${port}`);
}

bootstrap();
```

## 테스트 작성

### 예외 처리 테스트 (`src/shared/exceptions/__tests__/`)

#### `domain.exception.spec.ts`
```typescript
import { EntityNotFoundDomainException, InvalidDomainDataException } from '../domain.exception';

describe('Domain Exceptions', () => {
  describe('EntityNotFoundDomainException', () => {
    it('should create exception with proper message', () => {
      const exception = new EntityNotFoundDomainException('User', 123);
      
      expect(exception.message).toBe('User with identifier 123 not found');
      expect(exception.code).toBe('ENTITY_NOT_FOUND');
      expect(exception.statusCode).toBe(404);
    });
  });

  describe('InvalidDomainDataException', () => {
    it('should create exception with field info', () => {
      const exception = new InvalidDomainDataException('email', 'invalid-email', 'Invalid format');
      
      expect(exception.message).toBe('Invalid data for field email: invalid-email. Invalid format');
      expect(exception.code).toBe('INVALID_DOMAIN_DATA');
      expect(exception.statusCode).toBe(400);
    });
  });
});
```

### 유틸리티 테스트 (`src/shared/utils/__tests__/`)

#### `validation.util.spec.ts`
```typescript
import { ValidationError } from 'class-validator';
import { ValidationUtil } from '../validation.util';
import { ValidationException } from '../../exceptions/application.exception';

describe('ValidationUtil', () => {
  describe('formatValidationErrors', () => {
    it('should format validation errors correctly', () => {
      const errors: ValidationError[] = [
        {
          property: 'email',
          constraints: {
            isEmail: 'email must be an email',
            isNotEmpty: 'email should not be empty',
          },
        } as ValidationError,
      ];

      const result = ValidationUtil.formatValidationErrors(errors);
      
      expect(result).toEqual({
        email: ['email must be an email', 'email should not be empty'],
      });
    });
  });

  describe('throwValidationException', () => {
    it('should throw ValidationException', () => {
      const errors: ValidationError[] = [
        {
          property: 'name',
          constraints: {
            isString: 'name must be a string',
          },
        } as ValidationError,
      ];

      expect(() => ValidationUtil.throwValidationException(errors))
        .toThrow(ValidationException);
    });
  });
});
```

## PR 체크리스트

### 코드 품질
- [ ] 모든 예외 클래스가 BaseException을 상속받음
- [ ] 타입 정의가 명확하고 재사용 가능함
- [ ] 유틸리티 함수가 순수 함수로 작성됨
- [ ] 상수가 적절히 그룹화되고 타입이 안전함

### 테스트
- [ ] 모든 예외 클래스에 대한 단위 테스트 작성
- [ ] 유틸리티 함수에 대한 테스트 작성
- [ ] 테스트 커버리지 80% 이상

### 문서화
- [ ] README에 새로운 구조 설명 추가
- [ ] JSDoc 주석 추가
- [ ] 예외 처리 가이드라인 문서화

### 통합성
- [ ] 기존 API 동작에 영향 없음
- [ ] 로그 형식이 일관성 있음
- [ ] 에러 응답 형식이 표준화됨

## 다음 단계 준비사항

1. **Domain Entity 설계**: User, WordProgress, StudySession, Wordbook 엔티티 구조 설계
2. **Repository Interface 정의**: 각 엔티티에 대한 Repository 인터페이스 명세
3. **Value Object 식별**: Email, WordId, ConfidenceLevel 등 값 객체 후보 정리

## 예상 작업 시간

- **디렉토리 구조 생성**: 0.5일
- **예외 처리 시스템**: 1일
- **공통 타입 및 상수**: 0.5일
- **인터셉터 및 필터**: 1일
- **테스트 작성**: 1일
- **문서화**: 0.5일

**총 예상 시간**: 4.5일

이 단계를 완료하면 Clean Architecture의 견고한 기반이 마련되어 후속 단계를 안전하게 진행할 수 있습니다.