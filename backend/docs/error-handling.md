# 통일된 에러 처리 전략

## 개요
Clean Architecture에서 각 계층별로 발생하는 예외를 체계적으로 분류하고 처리하여 일관된 에러 응답과 로깅을 제공합니다.

## 예외 계층 구조

### 1. 기본 예외 클래스
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
    
    // Error 스택 트레이스 유지
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

### 2. 도메인 계층 예외
```typescript
// 도메인 비즈니스 룰 위반
export class DomainException extends BaseException {
  readonly code = 'DOMAIN_ERROR';
  readonly statusCode = 400;
}

// 엔티티를 찾을 수 없음
export class EntityNotFoundDomainException extends DomainException {
  readonly code = 'ENTITY_NOT_FOUND';
  readonly statusCode = 404;
  
  constructor(entityName: string, identifier: string | number) {
    super(`${entityName} with identifier ${identifier} not found`);
    this.context = { entityName, identifier };
  }
}

// 도메인 데이터 검증 실패
export class InvalidDomainDataException extends DomainException {
  readonly code = 'INVALID_DOMAIN_DATA';
  
  constructor(fieldName: string, value: any, reason?: string) {
    const message = `Invalid data for field ${fieldName}: ${value}${reason ? `. ${reason}` : ''}`;
    super(message);
    this.context = { fieldName, value, reason };
  }
}

// 비즈니스 규칙 위반
export class BusinessRuleViolationException extends DomainException {
  readonly code = 'BUSINESS_RULE_VIOLATION';
  
  constructor(rule: string, details?: Record<string, any>) {
    super(`Business rule violation: ${rule}`);
    this.context = { rule, ...details };
  }
}

// 도메인 상태 충돌
export class DomainConflictException extends DomainException {
  readonly code = 'DOMAIN_CONFLICT';
  readonly statusCode = 409;
  
  constructor(resource: string, conflictReason: string) {
    super(`Conflict in ${resource}: ${conflictReason}`);
    this.context = { resource, conflictReason };
  }
}
```

### 3. 애플리케이션 계층 예외
```typescript
// 애플리케이션 서비스 오류
export class ApplicationException extends BaseException {
  readonly code = 'APPLICATION_ERROR';
  readonly statusCode = 500;
}

// 입력 검증 실패
export class ValidationException extends ApplicationException {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  
  constructor(errors: Record<string, string[]>) {
    super('Input validation failed');
    this.context = { validationErrors: errors };
  }
}

// 인증 실패
export class UnauthorizedException extends ApplicationException {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;
  
  constructor(reason?: string) {
    super(reason || 'Authentication required');
    this.context = { reason };
  }
}

// 권한 부족
export class ForbiddenException extends ApplicationException {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;
  
  constructor(resource?: string, action?: string) {
    const message = resource && action 
      ? `Access denied to ${action} ${resource}`
      : 'Access denied';
    super(message);
    this.context = { resource, action };
  }
}

// 사용 사례 실행 실패
export class UseCaseException extends ApplicationException {
  readonly code = 'USE_CASE_ERROR';
  
  constructor(useCaseName: string, originalError: Error) {
    super(`Use case ${useCaseName} failed: ${originalError.message}`);
    this.context = { 
      useCaseName, 
      originalError: originalError.message,
      stack: originalError.stack 
    };
  }
}

// 외부 의존성 오류
export class ExternalDependencyException extends ApplicationException {
  readonly code = 'EXTERNAL_DEPENDENCY_ERROR';
  readonly statusCode = 503;
  
  constructor(serviceName: string, operation: string, originalError?: Error) {
    super(`External service ${serviceName} failed during ${operation}`);
    this.context = { 
      serviceName, 
      operation,
      originalError: originalError?.message 
    };
  }
}
```

### 4. 인프라스트럭처 계층 예외
```typescript
// 인프라스트럭처 오류
export class InfrastructureException extends BaseException {
  readonly code = 'INFRASTRUCTURE_ERROR';
  readonly statusCode = 500;
}

// 데이터베이스 오류
export class DatabaseException extends InfrastructureException {
  readonly code = 'DATABASE_ERROR';
  
  constructor(operation: string, originalError: Error) {
    super(`Database ${operation} failed: ${originalError.message}`);
    this.context = { 
      operation, 
      originalError: originalError.message,
      sqlState: (originalError as any).code, // DB 특정 에러 코드
    };
  }
}

// 외부 서비스 오류
export class ExternalServiceException extends InfrastructureException {
  readonly code = 'EXTERNAL_SERVICE_ERROR';
  readonly statusCode = 502;
  
  constructor(service: string, error: Error, statusCode?: number) {
    super(`External service ${service} failed: ${error.message}`);
    this.context = { 
      service, 
      originalError: error.message,
      externalStatusCode: statusCode 
    };
  }
}

// 파일 시스템 오류
export class FileSystemException extends InfrastructureException {
  readonly code = 'FILE_SYSTEM_ERROR';
  
  constructor(operation: string, path: string, originalError: Error) {
    super(`File system ${operation} failed for ${path}: ${originalError.message}`);
    this.context = { operation, path, originalError: originalError.message };
  }
}

// 네트워크 오류
export class NetworkException extends InfrastructureException {
  readonly code = 'NETWORK_ERROR';
  
  constructor(url: string, method: string, originalError: Error) {
    super(`Network ${method} request to ${url} failed: ${originalError.message}`);
    this.context = { url, method, originalError: originalError.message };
  }
}
```

## 글로벌 예외 필터

### 1. 통합 예외 필터
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
import { ValidationException } from '../../shared/exceptions/application.exception';
import { ApiResponse } from '../../shared/types/api-response.type';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const exceptionData = this.parseException(exception);
    
    // 로깅
    this.logException(exception, request, exceptionData);

    // 응답 생성
    const errorResponse = this.createErrorResponse(request, exceptionData);
    
    response.status(exceptionData.statusCode).json(errorResponse);
  }

  private parseException(exception: unknown): {
    statusCode: number;
    code: string;
    message: string;
    details?: any;
  } {
    // 커스텀 예외
    if (exception instanceof BaseException) {
      return {
        statusCode: exception.statusCode,
        code: exception.code,
        message: exception.message,
        details: exception.context,
      };
    }

    // Validation 예외 특별 처리
    if (exception instanceof ValidationException) {
      return {
        statusCode: exception.statusCode,
        code: exception.code,
        message: exception.message,
        details: exception.context,
      };
    }

    // NestJS HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      
      return {
        statusCode: status,
        code: this.getHttpExceptionCode(status),
        message: typeof response === 'string' ? response : (response as any).message,
        details: typeof response === 'object' ? response : undefined,
      };
    }

    // 예상치 못한 오류
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' 
        ? { originalError: exception instanceof Error ? exception.message : String(exception) }
        : undefined,
    };
  }

  private logException(
    exception: unknown, 
    request: Request, 
    exceptionData: { statusCode: number; code: string; message: string; details?: any }
  ): void {
    const { method, url, headers, body, query, params } = request;
    const userAgent = headers['user-agent'] || '';
    const ip = request.ip || headers['x-forwarded-for'] || 'unknown';

    const logContext = {
      statusCode: exceptionData.statusCode,
      code: exceptionData.code,
      method,
      url,
      ip,
      userAgent,
      requestBody: this.sanitizeData(body),
      query,
      params,
      details: exceptionData.details,
    };

    const logMessage = `${method} ${url} - ${exceptionData.statusCode} - ${exceptionData.message}`;

    // 로그 레벨 결정
    if (exceptionData.statusCode >= 500) {
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : undefined,
        logContext
      );
    } else if (exceptionData.statusCode >= 400) {
      this.logger.warn(logMessage, logContext);
    } else {
      this.logger.log(logMessage, logContext);
    }
  }

  private createErrorResponse(
    request: Request,
    exceptionData: { statusCode: number; code: string; message: string; details?: any }
  ): ApiResponse {
    return {
      success: false,
      error: {
        code: exceptionData.code,
        message: exceptionData.message,
        details: exceptionData.details,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
      traceId: this.generateTraceId(),
    };
  }

  private getHttpExceptionCode(statusCode: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED', 
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
      504: 'GATEWAY_TIMEOUT',
    };
    
    return codeMap[statusCode] || 'HTTP_EXCEPTION';
  }

  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    const sanitized = { ...data };

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    });

    return sanitized;
  }

  private generateTraceId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### 2. 특화된 예외 필터
```typescript
// 도메인 예외만 처리하는 필터
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 도메인 예외는 비즈니스 로직 위반이므로 WARNING 레벨로 로깅
    this.logger.warn(
      `Domain exception: ${exception.code} - ${exception.message}`,
      {
        code: exception.code,
        context: exception.context,
        path: request.url,
        method: request.method,
      }
    );

    const errorResponse: ApiResponse = {
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
        details: exception.context,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(exception.statusCode).json(errorResponse);
  }
}

// 검증 예외 필터
@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 검증 오류는 클라이언트 입력 문제이므로 DEBUG 레벨로 로깅
    this.logger.debug(
      `Validation failed for ${request.method} ${request.url}`,
      exception.context
    );

    const errorResponse: ApiResponse = {
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
        details: {
          validationErrors: exception.context?.validationErrors,
          fields: Object.keys(exception.context?.validationErrors || {}),
        },
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(exception.statusCode).json(errorResponse);
  }
}
```

## 에러 응답 표준화

### 1. API 응답 타입 정의
```typescript
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

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
  path: string;
  traceId?: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
```

### 2. 에러 코드 상수
```typescript
export const ERROR_CODES = {
  // Domain Errors (400)
  ENTITY_NOT_FOUND: 'ENTITY_NOT_FOUND',
  INVALID_DOMAIN_DATA: 'INVALID_DOMAIN_DATA',
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  DOMAIN_CONFLICT: 'DOMAIN_CONFLICT',
  
  // Application Errors (400-403)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  USE_CASE_ERROR: 'USE_CASE_ERROR',
  
  // Infrastructure Errors (500-503)
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  FILE_SYSTEM_ERROR: 'FILE_SYSTEM_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  
  // System Errors (500)
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.ENTITY_NOT_FOUND]: 'The requested resource was not found',
  [ERROR_CODES.INVALID_DOMAIN_DATA]: 'The provided data is invalid',
  [ERROR_CODES.BUSINESS_RULE_VIOLATION]: 'Business rule violation occurred',
  [ERROR_CODES.DOMAIN_CONFLICT]: 'Resource conflict detected',
  [ERROR_CODES.VALIDATION_ERROR]: 'Input validation failed',
  [ERROR_CODES.UNAUTHORIZED]: 'Authentication is required',
  [ERROR_CODES.FORBIDDEN]: 'Access is denied',
  [ERROR_CODES.USE_CASE_ERROR]: 'Use case execution failed',
  [ERROR_CODES.DATABASE_ERROR]: 'Database operation failed',
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 'External service is unavailable',
  [ERROR_CODES.FILE_SYSTEM_ERROR]: 'File system operation failed',
  [ERROR_CODES.NETWORK_ERROR]: 'Network operation failed',
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'An unexpected error occurred',
} as const;
```

## Use Case 레벨 에러 처리

### 1. 에러 래핑 패턴
```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // 중복 체크
      const existingUser = await this.userRepository.findByGoogleId(dto.googleId);
      if (existingUser) {
        throw new DomainConflictException('User', 'Google ID already exists');
      }

      const existingEmail = await this.userRepository.findByEmail(Email.from(dto.email));
      if (existingEmail) {
        throw new DomainConflictException('User', 'Email already in use');
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

    } catch (error) {
      // 도메인/인프라스트럭처 예외는 그대로 전파
      if (error instanceof BaseException) {
        throw error;
      }

      // 예상치 못한 에러는 Use Case 에러로 래핑
      throw new UseCaseException('CreateUser', error as Error);
    }
  }
}
```

### 2. 에러 변환 패턴
```typescript
@Injectable()
export class UpdateWordProgressUseCase {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(userId: number, dto: UpdateWordProgressDto): Promise<WordProgressResponseDto> {
    try {
      const wordId = WordId.from(dto.wordId);
      
      let progress = await this.progressRepository.findWordProgress(userId, wordId);
      
      if (!progress) {
        progress = WordProgress.create({
          userId,
          wordId: dto.wordId,
        });
      }

      progress.recordAttempt(dto.isCorrect);

      const savedProgress = progress.id
        ? await this.progressRepository.updateWordProgress(progress)
        : await this.progressRepository.saveWordProgress(progress);

      return WordProgressResponseDto.fromEntity(savedProgress);

    } catch (error) {
      if (error instanceof InvalidDomainDataException) {
        // 도메인 검증 오류를 더 구체적인 메시지로 변환
        throw new ValidationException({
          wordId: [`Invalid word ID format: ${dto.wordId}`]
        });
      }

      if (error instanceof DatabaseException) {
        // 데이터베이스 오류를 애플리케이션 오류로 변환
        throw new ExternalDependencyException('Database', 'update word progress', error);
      }

      if (error instanceof BaseException) {
        throw error;
      }

      throw new UseCaseException('UpdateWordProgress', error as Error);
    }
  }
}
```

## Repository 레벨 에러 처리

### 1. 데이터베이스 에러 변환
```typescript
@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: number): Promise<User | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      return result[0] ? this.toDomainEntity(result[0]) : null;
    } catch (error) {
      // 데이터베이스 에러를 도메인 예외로 변환
      if ((error as any).code === 'SQLITE_BUSY') {
        throw new DatabaseException('findById', new Error('Database is busy, please try again'));
      }
      
      if ((error as any).code === 'SQLITE_CORRUPT') {
        throw new DatabaseException('findById', new Error('Database corruption detected'));
      }

      throw new DatabaseException('findById', error as Error);
    }
  }

  async save(user: User): Promise<User> {
    try {
      const userData = this.toDbRecord(user);
      const result = await this.databaseService.db
        .insert(users)
        .values(userData)
        .returning();

      return this.toDomainEntity(result[0]);
    } catch (error) {
      // 제약 조건 위반 처리
      if ((error as any).code === 'SQLITE_CONSTRAINT_UNIQUE') {
        const constraintField = this.extractConstraintField(error as Error);
        throw new DomainConflictException('User', `${constraintField} already exists`);
      }

      throw new DatabaseException('save', error as Error);
    }
  }

  private extractConstraintField(error: Error): string {
    const message = error.message.toLowerCase();
    if (message.includes('email')) return 'email';
    if (message.includes('google_id')) return 'googleId';
    return 'field';
  }
}
```

### 2. 외부 서비스 에러 처리
```typescript
@Injectable()
export class GoogleAuthAdapter {
  constructor(private readonly configService: ConfigService) {}

  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      
      if (!response.ok) {
        throw new ExternalServiceException(
          'Google OAuth',
          new Error(`Token verification failed: ${response.statusText}`),
          response.status
        );
      }
      
      const tokenInfo = await response.json();
      
      return {
        id: tokenInfo.sub,
        email: tokenInfo.email,
        name: tokenInfo.name,
        picture: tokenInfo.picture,
      };
    } catch (error) {
      if (error instanceof ExternalServiceException) {
        throw error;
      }

      // 네트워크 오류
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkException(
          'https://oauth2.googleapis.com/tokeninfo',
          'GET',
          error as Error
        );
      }

      throw new ExternalServiceException('Google OAuth', error as Error);
    }
  }
}
```

## 클라이언트 대응 가이드

### 1. JavaScript/TypeScript 클라이언트
```typescript
// 클라이언트 타입 정의
interface ApiErrorResponse {
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

// 에러 처리 함수
export class ApiClient {
  async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!data.success) {
      const error = data as ApiErrorResponse;
      throw new ApiError(error.error.code, error.error.message, error.error.details);
    }
    
    return data.data;
  }
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  isValidationError(): boolean {
    return this.code === 'VALIDATION_ERROR';
  }

  isAuthenticationError(): boolean {
    return this.code === 'UNAUTHORIZED';
  }

  isNotFoundError(): boolean {
    return this.code === 'ENTITY_NOT_FOUND';
  }

  getValidationErrors(): Record<string, string[]> {
    return this.details?.validationErrors || {};
  }
}
```

### 2. 프론트엔드 에러 처리 예시
```typescript
// React 컴포넌트에서의 에러 처리
export const UserForm: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: CreateUserDto) => {
    try {
      setLoading(true);
      setErrors({});
      
      await apiClient.createUser(formData);
      
      // 성공 처리
      toast.success('User created successfully');
      
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.code) {
          case 'VALIDATION_ERROR':
            setErrors(error.getValidationErrors());
            break;
            
          case 'DOMAIN_CONFLICT':
            toast.error('User already exists with this email or Google ID');
            break;
            
          case 'UNAUTHORIZED':
            // 로그인 페이지로 리다이렉트
            router.push('/login');
            break;
            
          default:
            toast.error(error.message);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        name="email"
        error={errors.email?.[0]}
        // ... other props
      />
      <Input 
        name="name"
        error={errors.name?.[0]}
        // ... other props
      />
      <Button type="submit" loading={loading}>
        Create User
      </Button>
    </form>
  );
};
```

## 모니터링 및 알림

### 1. 에러 추적 서비스 연동
```typescript
import * as Sentry from '@sentry/node';

@Injectable()
export class ErrorTrackingService {
  constructor(private readonly configService: ConfigService) {
    if (this.configService.get('SENTRY_DSN')) {
      Sentry.init({
        dsn: this.configService.get('SENTRY_DSN'),
        environment: this.configService.get('NODE_ENV'),
      });
    }
  }

  captureException(exception: Error, context?: Record<string, any>): void {
    if (exception instanceof BaseException) {
      // 커스텀 예외는 컨텍스트와 함께 전송
      Sentry.withScope((scope) => {
        scope.setTag('error.code', exception.code);
        scope.setLevel('error');
        
        if (exception.context) {
          Object.entries(exception.context).forEach(([key, value]) => {
            scope.setContext(key, value);
          });
        }
        
        if (context) {
          Object.entries(context).forEach(([key, value]) => {
            scope.setContext(key, value);
          });
        }
        
        Sentry.captureException(exception);
      });
    } else {
      // 일반 예외
      Sentry.captureException(exception);
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    Sentry.captureMessage(message, level);
  }
}
```

### 2. 에러 통계 및 알림
```typescript
@Injectable()
export class ErrorMetricsService {
  private readonly errorCounts = new Map<string, number>();
  private readonly logger = new Logger(ErrorMetricsService.name);

  recordError(code: string, statusCode: number): void {
    const key = `${code}:${statusCode}`;
    const count = this.errorCounts.get(key) || 0;
    this.errorCounts.set(key, count + 1);

    // 임계치 초과 시 알림
    if (count > 10 && count % 10 === 0) {
      this.logger.warn(`High error frequency detected: ${key} occurred ${count} times`);
      
      // 슬랙/이메일 알림 등
      this.sendAlert(code, statusCode, count);
    }
  }

  getErrorStats(): Record<string, number> {
    return Object.fromEntries(this.errorCounts);
  }

  private async sendAlert(code: string, statusCode: number, count: number): Promise<void> {
    // 알림 로직 구현
    // 예: Slack webhook, 이메일 전송 등
  }
}
```

## 테스트 패턴

### 1. 예외 테스트
```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // 테스트 설정
  });

  describe('error scenarios', () => {
    it('should throw DomainConflictException when Google ID already exists', async () => {
      const existingUser = User.create({
        googleId: 'existing-google-id',
        email: 'existing@example.com',
        name: 'Existing User',
      });

      userRepository.findByGoogleId.mockResolvedValue(existingUser);

      const dto: CreateUserDto = {
        googleId: 'existing-google-id',
        email: 'new@example.com',
        name: 'New User',
      };

      await expect(useCase.execute(dto)).rejects.toThrow(DomainConflictException);
      await expect(useCase.execute(dto)).rejects.toMatchObject({
        code: 'DOMAIN_CONFLICT',
        statusCode: 409,
        context: {
          resource: 'User',
          conflictReason: 'Google ID already exists',
        },
      });
    });

    it('should throw UseCaseException when repository throws unexpected error', async () => {
      userRepository.findByGoogleId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockRejectedValue(new Error('Unexpected database error'));

      const dto: CreateUserDto = {
        googleId: 'new-google-id',
        email: 'new@example.com',
        name: 'New User',
      };

      await expect(useCase.execute(dto)).rejects.toThrow(UseCaseException);
    });
  });
});
```

### 2. 예외 필터 테스트
```typescript
describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: jest.Mocked<Response>;
  let mockRequest: jest.Mocked<Request>;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    mockRequest = {
      method: 'POST',
      url: '/users',
      ip: '127.0.0.1',
      headers: { 'user-agent': 'test-agent' },
      body: { name: 'Test' },
      query: {},
      params: {},
    } as any;
  });

  it('should handle domain exceptions correctly', () => {
    const exception = new EntityNotFoundDomainException('User', 123);
    const host = createMockArgumentsHost(mockRequest, mockResponse);

    filter.catch(exception, host);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'ENTITY_NOT_FOUND',
        message: 'User with identifier 123 not found',
        details: {
          entityName: 'User',
          identifier: 123,
        },
      },
      timestamp: expect.any(String),
      path: '/users',
      traceId: expect.any(String),
    });
  });

  it('should sanitize sensitive data in logs', () => {
    const mockLogger = jest.spyOn(filter['logger'], 'warn');
    const exception = new ValidationException({ password: ['Password is required'] });
    
    mockRequest.body = { username: 'test', password: 'secret123' };
    
    const host = createMockArgumentsHost(mockRequest, mockResponse);

    filter.catch(exception, host);

    expect(mockLogger).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        requestBody: { username: 'test', password: '***' },
      })
    );
  });
});
```

이 에러 처리 전략을 통해 애플리케이션의 안정성과 디버깅 효율성을 크게 개선할 수 있습니다.