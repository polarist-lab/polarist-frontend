# Phase 6: Integration & Optimization (통합 및 최적화)

## 목표
모든 레이어를 통합하고 의존성 주입을 최적화하며, 성능 테스트와 최적화를 통해 완전한 Clean Architecture를 완성합니다.

## 범위
- 모든 모듈 통합 및 의존성 주입 최적화
- 레거시 코드 제거
- 성능 테스트 및 최적화
- 종합 문서화 및 배포 준비

## 구현할 파일 목록

### 1. 통합 App Module (`src/app.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

// Core Modules
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ApplicationModule } from './application/application.module';
import { PresentationModule } from './presentation/presentation.module';

// Global Providers
import { GlobalExceptionFilter } from './presentation/filters/global-exception.filter';
import { RequestLoggingInterceptor } from './presentation/interceptors/request-logging.interceptor';
import { TransformInterceptor } from './presentation/interceptors/transform.interceptor';
import { ValidationPipe } from './shared/pipes/validation.pipe';

// Configuration
import databaseConfig from './infrastructure/config/database.config';
import authConfig from './infrastructure/config/auth.config';
import appConfig from './infrastructure/config/app.config';

@Module({
  imports: [
    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig],
      envFilePath: ['.env.local', '.env'],
      cache: true,
      expandVariables: true,
    }),

    // Core Architecture Layers
    InfrastructureModule,
    ApplicationModule,
    PresentationModule,
  ],
  providers: [
    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    
    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    
    // Global Validation Pipe
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```

### 2. 환경별 설정 파일

#### `config/development.env`
```env
# Development Environment Configuration
NODE_ENV=development
PORT=4000
API_PREFIX=

# Database
DATABASE_URL=data/dev.db

# JWT Configuration
JWT_SECRET=dev-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth
GOOGLE_CLIENT_ID=your-dev-google-client-id
GOOGLE_CLIENT_SECRET=your-dev-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug

# Performance
REQUEST_TIMEOUT=30000
MAX_FILE_SIZE=10485760

# Feature Flags
ENABLE_SWAGGER=true
ENABLE_REQUEST_LOGGING=true
ENABLE_PERFORMANCE_MONITORING=true
```

#### `config/production.env`
```env
# Production Environment Configuration
NODE_ENV=production
PORT=4000
API_PREFIX=api/v1

# Database
DATABASE_URL=${DATABASE_URL}

# JWT Configuration
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
GOOGLE_CALLBACK_URL=${GOOGLE_CALLBACK_URL}

# Frontend
FRONTEND_URL=${FRONTEND_URL}

# Logging
LOG_LEVEL=info

# Performance
REQUEST_TIMEOUT=30000
MAX_FILE_SIZE=10485760

# Feature Flags
ENABLE_SWAGGER=false
ENABLE_REQUEST_LOGGING=true
ENABLE_PERFORMANCE_MONITORING=true

# Security
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### 3. 성능 모니터링 (`src/shared/monitoring/`)

#### `performance.interceptor.ts`
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
import { Request } from 'express';

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  duration: number;
  timestamp: Date;
  memoryBefore: NodeJS.MemoryUsage;
  memoryAfter: NodeJS.MemoryUsage;
  statusCode?: number;
}

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);
  private readonly metrics: PerformanceMetrics[] = [];
  private readonly MAX_METRICS = 1000; // Keep last 1000 requests

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (process.env.ENABLE_PERFORMANCE_MONITORING !== 'true') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    
    const startTime = Date.now();
    const memoryBefore = process.memoryUsage();

    return next.handle().pipe(
      tap({
        next: () => {
          this.recordMetrics(request, response, startTime, memoryBefore);
        },
        error: () => {
          this.recordMetrics(request, response, startTime, memoryBefore);
        },
      })
    );
  }

  private recordMetrics(
    request: Request,
    response: any,
    startTime: number,
    memoryBefore: NodeJS.MemoryUsage
  ) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    const memoryAfter = process.memoryUsage();

    const metrics: PerformanceMetrics = {
      endpoint: request.url,
      method: request.method,
      duration,
      timestamp: new Date(startTime),
      memoryBefore,
      memoryAfter,
      statusCode: response.statusCode,
    };

    this.metrics.push(metrics);

    // Keep only the last MAX_METRICS entries
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }

    // Log slow requests
    if (duration > 1000) {
      this.logger.warn(`Slow request detected: ${request.method} ${request.url} took ${duration}ms`);
    }

    // Log high memory usage
    const memoryDiff = memoryAfter.heapUsed - memoryBefore.heapUsed;
    if (memoryDiff > 10 * 1024 * 1024) { // 10MB
      this.logger.warn(`High memory usage detected: ${memoryDiff / 1024 / 1024}MB for ${request.method} ${request.url}`);
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, metric) => sum + metric.duration, 0);
    return total / this.metrics.length;
  }

  getSlowRequests(threshold = 1000): PerformanceMetrics[] {
    return this.metrics.filter(metric => metric.duration > threshold);
  }
}
```

#### `health-detailed.controller.ts`
```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { PerformanceInterceptor } from '../monitoring/performance.interceptor';

@ApiTags('Health')
@Controller('health')
export class HealthDetailedController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly performanceInterceptor: PerformanceInterceptor,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service health status' })
  async check() {
    const dbHealthy = await this.databaseService.healthCheck();
    
    return {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'up' : 'down',
        api: 'up',
      },
    };
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check with metrics' })
  @ApiResponse({ status: 200, description: 'Detailed service health and metrics' })
  async detailedCheck() {
    const dbHealthy = await this.databaseService.healthCheck();
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    const avgResponseTime = this.performanceInterceptor.getAverageResponseTime();

    return {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'up' : 'down',
        api: 'up',
      },
      metrics: {
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        },
        performance: {
          averageResponseTime: `${Math.round(avgResponseTime)}ms`,
        },
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance metrics' })
  async getMetrics() {
    const metrics = this.performanceInterceptor.getMetrics();
    const slowRequests = this.performanceInterceptor.getSlowRequests();
    
    return {
      totalRequests: metrics.length,
      averageResponseTime: this.performanceInterceptor.getAverageResponseTime(),
      slowRequests: slowRequests.length,
      recentRequests: metrics.slice(-10), // Last 10 requests
      slowRequestsSample: slowRequests.slice(-5), // Last 5 slow requests
    };
  }
}
```

### 4. 캐싱 시스템 (`src/shared/cache/`)

#### `cache.service.ts`
```typescript
import { Injectable, Logger } from '@nestjs/common';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  maxSize?: number; // Maximum number of entries
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly cache = new Map<string, CacheEntry<any>>();
  private readonly defaultTTL = 300; // 5 minutes
  private readonly maxSize = 1000;

  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const ttl = (options.ttl || this.defaultTTL) * 1000; // Convert to milliseconds
    const maxSize = options.maxSize || this.maxSize;

    // Clean up expired entries if cache is getting too large
    if (this.cache.size >= maxSize) {
      this.cleanupExpired();
      
      // If still too large, remove oldest entries
      if (this.cache.size >= maxSize) {
        const sortedEntries = Array.from(this.cache.entries())
          .sort(([, a], [, b]) => a.timestamp - b.timestamp);
        
        const toRemove = sortedEntries.slice(0, Math.floor(maxSize * 0.1)); // Remove 10%
        toRemove.forEach(([key]) => this.cache.delete(key));
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });

    this.logger.debug(`Cache SET: ${key}`);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.logger.debug(`Cache MISS: ${key}`);
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.logger.debug(`Cache EXPIRED: ${key}`);
      return null;
    }

    this.logger.debug(`Cache HIT: ${key}`);
    return entry.value;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.logger.debug(`Cache DELETE: ${key}`);
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.logger.debug('Cache CLEARED');
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  size(): number {
    return this.cache.size;
  }

  getStats(): { size: number; hitRate: number; memoryUsage: string } {
    // This is a simplified implementation
    // In a real scenario, you'd want to track hits/misses
    const memoryUsage = JSON.stringify(Array.from(this.cache.entries())).length;
    
    return {
      size: this.cache.size,
      hitRate: 0, // TODO: Implement hit rate tracking
      memoryUsage: `${Math.round(memoryUsage / 1024)}KB`,
    };
  }

  private cleanupExpired(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} expired cache entries`);
    }
  }
}
```

#### `cache.decorator.ts`
```typescript
import { CacheService } from './cache.service';

export function Cacheable(keyPrefix: string, ttl = 300) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService: CacheService = this.cacheService;
      
      if (!cacheService) {
        // If no cache service available, execute method normally
        return method.apply(this, args);
      }

      // Generate cache key from method arguments
      const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`;
      
      // Try to get from cache first
      const cachedResult = cacheService.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute method and cache result
      const result = await method.apply(this, args);
      cacheService.set(cacheKey, result, { ttl });
      
      return result;
    };

    return descriptor;
  };
}
```

### 5. 데이터베이스 최적화 (`src/infrastructure/database/`)

#### `query-optimizer.service.ts`
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from './database.service';

interface QueryStats {
  query: string;
  executionTime: number;
  timestamp: Date;
}

@Injectable()
export class QueryOptimizerService {
  private readonly logger = new Logger(QueryOptimizerService.name);
  private readonly queryStats: QueryStats[] = [];
  private readonly slowQueryThreshold = 100; // ms

  constructor(private readonly databaseService: DatabaseService) {}

  async executeWithStats<T>(
    queryFn: () => Promise<T>,
    queryDescription: string
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await queryFn();
      const executionTime = Date.now() - startTime;

      this.recordQueryStats(queryDescription, executionTime);
      
      if (executionTime > this.slowQueryThreshold) {
        this.logger.warn(`Slow query detected: ${queryDescription} took ${executionTime}ms`);
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error(`Query failed: ${queryDescription} (${executionTime}ms)`, error);
      throw error;
    }
  }

  private recordQueryStats(query: string, executionTime: number): void {
    this.queryStats.push({
      query,
      executionTime,
      timestamp: new Date(),
    });

    // Keep only the last 1000 queries
    if (this.queryStats.length > 1000) {
      this.queryStats.shift();
    }
  }

  getSlowQueries(threshold = this.slowQueryThreshold): QueryStats[] {
    return this.queryStats.filter(stat => stat.executionTime > threshold);
  }

  getAverageQueryTime(): number {
    if (this.queryStats.length === 0) return 0;
    const total = this.queryStats.reduce((sum, stat) => sum + stat.executionTime, 0);
    return total / this.queryStats.length;
  }

  getQueryStats(): {
    totalQueries: number;
    averageTime: number;
    slowQueries: number;
    recentQueries: QueryStats[];
  } {
    return {
      totalQueries: this.queryStats.length,
      averageTime: this.getAverageQueryTime(),
      slowQueries: this.getSlowQueries().length,
      recentQueries: this.queryStats.slice(-10),
    };
  }
}
```

### 6. 보안 강화 (`src/shared/security/`)

#### `rate-limiter.guard.ts`
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ForbiddenException } from '../exceptions/application.exception';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMIT_KEY = 'rateLimit';
export const RateLimit = (Reflector as any).createDecorator<RateLimitOptions>(RATE_LIMIT_KEY);

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private readonly requests = new Map<string, number[]>();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rateLimitOptions = this.reflector.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rateLimitOptions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const clientId = this.getClientId(request);
    const now = Date.now();
    const { windowMs, maxRequests } = rateLimitOptions;

    // Get or create request timestamps for this client
    let timestamps = this.requests.get(clientId) || [];
    
    // Remove timestamps outside the current window
    timestamps = timestamps.filter(timestamp => now - timestamp < windowMs);
    
    // Check if client has exceeded the limit
    if (timestamps.length >= maxRequests) {
      throw new ForbiddenException('Rate limit exceeded. Please try again later.');
    }

    // Add current timestamp
    timestamps.push(now);
    this.requests.set(clientId, timestamps);

    return true;
  }

  private getClientId(request: Request): string {
    // Use IP address as client identifier
    // In production, you might want to use user ID for authenticated requests
    return request.ip || request.connection.remoteAddress || 'unknown';
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    const maxAge = 15 * 60 * 1000; // 15 minutes

    for (const [clientId, timestamps] of this.requests.entries()) {
      const recentTimestamps = timestamps.filter(timestamp => now - timestamp < maxAge);
      
      if (recentTimestamps.length === 0) {
        this.requests.delete(clientId);
      } else {
        this.requests.set(clientId, recentTimestamps);
      }
    }
  }
}
```

#### `security-headers.interceptor.ts`
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class SecurityHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        // Security headers
        response.header('X-Content-Type-Options', 'nosniff');
        response.header('X-Frame-Options', 'DENY');
        response.header('X-XSS-Protection', '1; mode=block');
        response.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        response.header('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        
        // Remove sensitive headers
        response.removeHeader('X-Powered-By');
        response.removeHeader('Server');
      })
    );
  }
}
```

### 7. 데이터베이스 마이그레이션 스크립트

#### `scripts/migrate.ts`
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL || 'data/sqlite.db';
  const sqlite = new Database(databaseUrl);
  const db = drizzle(sqlite);

  console.log('🔄 Running database migrations...');

  try {
    await migrate(db, {
      migrationsFolder: resolve(__dirname, '../src/infrastructure/database/drizzle/migrations'),
    });
    
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

if (require.main === module) {
  runMigrations();
}
```

#### `scripts/seed.ts`
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as dotenv from 'dotenv';
import { users, userProgress, customWordbooks } from '../src/infrastructure/database/drizzle/schema';

dotenv.config();

async function seedDatabase() {
  const databaseUrl = process.env.DATABASE_URL || 'data/sqlite.db';
  const sqlite = new Database(databaseUrl);
  const db = drizzle(sqlite);

  console.log('🌱 Seeding database...');

  try {
    // Seed test user
    const testUser = await db.insert(users).values({
      googleId: 'test-google-id',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://via.placeholder.com/32',
      locale: 'en',
    }).returning();

    console.log(`✅ Created test user: ${testUser[0].email}`);

    // Seed test wordbook
    const testWordbook = await db.insert(customWordbooks).values({
      userId: testUser[0].id,
      name: 'Basic Korean Words',
      description: 'Essential Korean vocabulary for beginners',
      wordIds: JSON.stringify(['안녕하세요', '감사합니다', '죄송합니다', '사랑해요', '좋아요']),
      categories: JSON.stringify(['basic', 'greetings']),
      difficulties: JSON.stringify(['beginner']),
      tags: JSON.stringify(['essential', 'daily']),
      isPublic: true,
      totalWords: 5,
    }).returning();

    console.log(`✅ Created test wordbook: ${testWordbook[0].name}`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

if (require.main === module) {
  seedDatabase();
}
```

### 8. E2E 테스트 설정 (`test/`)

#### `app.e2e-spec.ts`
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/presentation/filters/global-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same configuration as in main.ts
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    app.useGlobalFilters(new GlobalExceptionFilter());
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.status).toBeDefined();
        });
    });
  });

  describe('Authentication Flow', () => {
    it('should handle mock login', () => {
      return request(app.getHttpServer())
        .get('/auth/mock-login')
        .expect(302); // Redirect
    });
  });

  describe('/users (Protected Routes)', () => {
    beforeAll(async () => {
      // Create a test user and get auth token
      const createUserResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          googleId: 'test-google-id-e2e',
          email: 'e2e-test@example.com',
          name: 'E2E Test User',
          locale: 'en',
        })
        .expect(201);

      // Mock getting auth token (in real e2e, you'd use the auth flow)
      // For now, we'll skip the protected route tests
      authToken = 'mock-token';
    });

    it('should create user successfully', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          googleId: 'test-google-id-unique',
          email: 'unique-test@example.com',
          name: 'Unique Test User',
          locale: 'en',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.email).toBe('unique-test@example.com');
        });
    });

    it('should validate user input', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          googleId: '',
          email: 'invalid-email',
          name: '',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.error.code).toBe('VALIDATION_ERROR');
        });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 routes', () => {
      return request(app.getHttpServer())
        .get('/non-existent-route')
        .expect(404);
    });

    it('should handle validation errors', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.error).toBeDefined();
        });
    });
  });
});
```

### 9. Docker 설정

#### `Dockerfile`
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --chown=nestjs:nodejs package*.json ./

# Create data directory for SQLite
RUN mkdir -p /app/data && chown nestjs:nodejs /app/data

USER nestjs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

#### `docker-compose.yml`
```yaml
version: '3.8'

services:
  polarist-backend:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=/app/data/production.db
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - FRONTEND_URL=${FRONTEND_URL}
    volumes:
      - sqlite_data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - polarist-backend
    restart: unless-stopped

volumes:
  sqlite_data:
    driver: local
```

### 10. Package.json 스크립트 업데이트

```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "db:migrate": "ts-node scripts/migrate.ts",
    "db:seed": "ts-node scripts/seed.ts",
    "db:reset": "rm -f data/*.db && npm run db:migrate && npm run db:seed",
    "docker:build": "docker build -t polarist-backend .",
    "docker:run": "docker run -p 4000:4000 polarist-backend",
    "docker:compose": "docker-compose up -d",
    "performance:test": "artillery run performance-tests/load-test.yml",
    "security:audit": "npm audit && snyk test"
  }
}
```

### 11. 성능 테스트 설정 (`performance-tests/load-test.yml`)

```yaml
config:
  target: 'http://localhost:4000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 20
      name: "Ramp up load"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"

scenarios:
  - name: "Health Check"
    weight: 20
    flow:
      - get:
          url: "/health"

  - name: "User Registration and Actions"
    weight: 60
    flow:
      - post:
          url: "/users"
          json:
            googleId: "load-test-{{ $uuid }}"
            email: "loadtest-{{ $uuid }}@example.com"
            name: "Load Test User {{ $uuid }}"
            locale: "en"
      - think: 1

  - name: "Public Wordbooks"
    weight: 20
    flow:
      - get:
          url: "/wordbooks/public"
          qs:
            limit: 10
```

## 성능 최적화 체크리스트

### 데이터베이스 최적화
- [ ] 인덱스 추가 (이메일, googleId 등)
- [ ] 쿼리 최적화 (N+1 문제 해결)
- [ ] 연결 풀 설정
- [ ] 슬로우 쿼리 모니터링

### 메모리 최적화
- [ ] 메모리 캐싱 구현
- [ ] 가비지 컬렉션 최적화
- [ ] 메모리 누수 모니터링
- [ ] 객체 풀링 고려

### API 최적화
- [ ] Response 압축 (gzip)
- [ ] 응답 시간 모니터링
- [ ] 비동기 처리 최적화
- [ ] 배치 처리 구현

### 보안 최적화
- [ ] Rate limiting 구현
- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] CORS 설정 최적화

## 배포 준비 체크리스트

### 환경 설정
- [ ] 프로덕션 환경 변수 설정
- [ ] SSL 인증서 설정
- [ ] 로그 수준 조정
- [ ] 모니터링 도구 설정

### 데이터베이스
- [ ] 마이그레이션 스크립트 테스트
- [ ] 백업 전략 수립
- [ ] 복구 절차 문서화
- [ ] 데이터 무결성 검증

### 보안
- [ ] 시크릿 키 관리
- [ ] 방화벽 규칙 설정
- [ ] 접근 로그 모니터링
- [ ] 보안 취약점 스캔

### 모니터링
- [ ] 헬스 체크 엔드포인트
- [ ] 메트릭 수집 설정
- [ ] 알림 규칙 설정
- [ ] 로그 집계 설정

## 예상 작업 시간

- **모듈 통합**: 1일
- **성능 모니터링 구현**: 1.5일
- **캐싱 시스템**: 1일
- **보안 강화**: 1일
- **데이터베이스 최적화**: 1일
- **E2E 테스트**: 1.5일
- **Docker 설정**: 0.5일
- **문서화 및 배포 준비**: 1.5일

**총 예상 시간**: 9일

이 단계를 완료하면 프로덕션 환경에서 운영 가능한 완전한 Clean Architecture 기반의 NestJS 백엔드가 완성됩니다.