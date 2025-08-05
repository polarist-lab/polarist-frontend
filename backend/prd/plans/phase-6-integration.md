# Phase 6: Integration & Testing

## 📋 Phase 개요

**목표**: 전체 시스템의 통합 테스트, 성능 최적화, 보안 강화를 통해 프로덕션 배포를 위한 최종 준비를 완료합니다.

**기간**: 1-2 weeks  
**우선순위**: P1 (높음)  
**의존성**: Phase 5 완료 (Presentation Layer)

## 🎯 주요 목표

1. **통합 테스트**: 전체 시스템의 End-to-End 테스트 구축
2. **성능 최적화**: 응답 시간 최적화 및 모니터링 시스템 구축
3. **보안 강화**: 인증, 인가, 데이터 보호 강화
4. **배포 준비**: CI/CD 파이프라인 및 프로덕션 환경 설정

## 📚 관련 PRD 문서

- **주요 참조**: [Clean Architecture Migration PRD](../features/clean-architecture-migration.md)
- **보조 참조**: 
  - [Error Handling System PRD](../features/error-handling-system.md)
  - [Swagger Integration PRD](../features/swagger-integration.md)

## 🏗️ 구현 범위

### 1. 통합 테스트 구축

#### E2E 테스트 설정
```typescript
// test/e2e/user-workflow.e2e-spec.ts
describe('User Workflow (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(DATABASE_URL)
    .useValue(':memory:') // 테스트용 인메모리 DB
    .compile();

    app = moduleFixture.createNestApplication();
    
    // 전체 미들웨어 파이프라인 적용
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    
    await app.init();
  });

  describe('Complete User Journey', () => {
    it('should create, update, and delete user successfully', async () => {
      // 1. 사용자 생성
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          googleId: 'e2e-test-123',
          email: 'e2e@example.com',
          name: 'E2E Test User',
          locale: 'en',
        })
        .expect(201);

      expect(createResponse.body.success).toBe(true);
      const userId = createResponse.body.data.id;

      // 2. 사용자 조회
      const getResponse = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(getResponse.body.data.email).toBe('e2e@example.com');

      // 3. 사용자 업데이트
      const updateResponse = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          name: 'Updated E2E User',
          locale: 'ko',
        })
        .expect(200);

      expect(updateResponse.body.data.name).toBe('Updated E2E User');
      expect(updateResponse.body.data.locale).toBe('ko');

      // 4. 사용자 삭제
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      // 5. 삭제된 사용자 조회 시 404 확인
      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle validation errors correctly', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          googleId: '', // 빈 값
          email: 'invalid-email', // 잘못된 형식
          name: 'a'.repeat(101), // 너무 긴 이름
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details.validationErrors).toMatchObject({
        googleId: expect.arrayContaining([expect.stringContaining('empty')]),
        email: expect.arrayContaining([expect.stringContaining('email')]),
        name: expect.arrayContaining([expect.stringContaining('100')]),
      });
    });

    it('should handle duplicate user creation', async () => {
      // 첫 번째 사용자 생성
      await request(app.getHttpServer())
        .post('/users')
        .send({
          googleId: 'duplicate-test',
          email: 'duplicate@example.com',
          name: 'Duplicate User',
        })
        .expect(201);

      // 같은 Google ID로 두 번째 사용자 생성 시도
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          googleId: 'duplicate-test',
          email: 'different@example.com',
          name: 'Another User',
        })
        .expect(409);

      expect(response.body.error.code).toBe('DOMAIN_CONFLICT');
    });
  });
});
```

#### 통합 테스트 헬퍼
```typescript
// test/helpers/test-helpers.ts
export class TestHelpers {
  static async createTestUser(app: INestApplication, userData?: Partial<any>) {
    const defaultUser = {
      googleId: `test-${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      locale: 'en',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ ...defaultUser, ...userData })
      .expect(201);

    return response.body.data;
  }

  static async generateJwtToken(app: INestApplication, userId: number): Promise<string> {
    const authService = app.get(AuthService);
    return authService.generateToken({ userId, sub: userId });
  }

  static async cleanupTestData(app: INestApplication) {
    const databaseService = app.get(DatabaseService);
    // 테스트 데이터 정리
    await databaseService.db.delete(users).where(like(users.email, 'test-%@example.com'));
  }
}
```

### 2. 성능 최적화

#### 응답 시간 모니터링
```typescript
// src/shared/interceptors/performance.interceptor.ts
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        
        // 느린 응답 로깅 (200ms 초과)
        if (duration > 200) {
          this.logger.warn(`Slow response: ${method} ${url} took ${duration}ms`);
        }

        // 메트릭스 수집 (Prometheus 등)
        this.collectMetrics(method, url, duration);
      }),
    );
  }

  private collectMetrics(method: string, url: string, duration: number) {
    // 메트릭스 수집 로직
    // 예: Prometheus metrics, CloudWatch, etc.
  }
}
```

#### 데이터베이스 쿼리 최적화
```typescript
// src/infrastructure/repositories/optimized-user.repository.ts
@Injectable()
export class OptimizedUserRepository extends DrizzleUserRepository {
  // 배치 조회로 N+1 문제 해결
  async findByIds(ids: number[]): Promise<User[]> {
    if (ids.length === 0) return [];

    const results = await this.databaseService.db
      .select()
      .from(users)
      .where(inArray(users.id, ids));

    return results.map(record => this.toDomainEntity(record));
  }

  // 캐싱을 통한 성능 최적화
  @Cacheable('user_by_id', 300) // 5분 캐시
  async findById(id: number): Promise<User | null> {
    return super.findById(id);
  }

  // 페이지네이션 최적화
  async findUsersWithPagination(
    page: number,
    limit: number,
    filters?: UserFilters
  ): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    
    let baseQuery = this.databaseService.db.select().from(users);
    let countQuery = this.databaseService.db.select({ count: sql`count(*)` }).from(users);

    // 필터 적용
    if (filters?.locale) {
      baseQuery = baseQuery.where(eq(users.locale, filters.locale));
      countQuery = countQuery.where(eq(users.locale, filters.locale));
    }

    // 병렬 실행으로 성능 개선
    const [userResults, countResults] = await Promise.all([
      baseQuery
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
      countQuery
    ]);

    return {
      users: userResults.map(record => this.toDomainEntity(record)),
      total: Number(countResults[0].count),
    };
  }
}
```

### 3. 보안 강화

#### JWT 보안 설정
```typescript
// src/infrastructure/auth/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      algorithms: ['HS256'], // 알고리즘 명시
    });
  }

  async validate(payload: any) {
    // 토큰 유효성 추가 검증
    if (!payload.sub || !payload.userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // 사용자 존재 여부 확인
    const userExists = await this.userRepository.exists(payload.userId);
    if (!userExists) {
      throw new UnauthorizedException('User not found');
    }

    return { 
      userId: payload.userId,
      sub: payload.sub,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
```

#### Rate Limiting
```typescript
// src/shared/guards/rate-limit.guard.ts
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly requests = new Map<string, number[]>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = this.getKey(request);
    
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15분
    const maxRequests = 100; // 15분당 100 요청

    const requests = this.requests.get(key) || [];
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    recentRequests.push(now);
    this.requests.set(key, recentRequests);

    return true;
  }

  private getKey(request: any): string {
    // IP 기반 또는 사용자 기반 키 생성
    return request.ip || request.user?.userId || 'anonymous';
  }
}
```

#### 데이터 검증 및 Sanitization
```typescript
// src/shared/pipes/sanitization.pipe.ts
@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'string') {
      // HTML 태그 제거
      value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      value = value.replace(/<[^>]*>/g, '');
      
      // SQL Injection 패턴 제거
      value = value.replace(/('|(\\')|(;)|(\|)|(\*)|(%)|(<)|(>)|(\{)|(\})|(\[)|(\])/g, '');
      
      // XSS 패턴 제거
      value = value.replace(/javascript:/gi, '');
      value = value.replace(/on\w+\s*=/gi, '');
    }

    if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        value[key] = this.transform(value[key]);
      }
    }

    return value;
  }
}
```

### 4. 모니터링 및 로깅

#### Health Check 엔드포인트
```typescript
// src/presentation/controllers/health.controller.ts
@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({
    description: 'Service health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string' },
        uptime: { type: 'number' },
        database: { type: 'string', example: 'connected' },
        cache: { type: 'string', example: 'connected' },
      },
    },
  })
  async check(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      // 데이터베이스 연결 확인
      await this.databaseService.db.select().from(users).limit(1);
      const dbStatus = 'connected';
      
      // 캐시 서비스 확인
      this.cacheService.set('health-check', 'ok', 10);
      const cacheStatus = this.cacheService.get('health-check') ? 'connected' : 'disconnected';

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: Date.now() - startTime,
        database: dbStatus,
        cache: cacheStatus,
        version: process.env.npm_package_version || '1.0.0',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          timestamp: new Date().toISOString(),
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
```

### 5. CI/CD 파이프라인

#### GitHub Actions 워크플로우
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      sqlite:
        image: sqlite:latest
        
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linting
      run: npm run lint
      
    - name: Run type checking
      run: npm run type-check
      
    - name: Run unit tests
      run: npm run test
      
    - name: Run integration tests
      run: npm run test:e2e
      
    - name: Generate test coverage
      run: npm run test:cov
      
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      
    - name: Build Docker image
      run: docker build -t polarist-backend:${{ github.sha }} .
      
  deploy:
    needs: [test, build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to production
      # 배포 스크립트 실행
      run: echo "Deploy to production"
```

## ✅ 완료 기준 (Definition of Done)

### 기능적 완료 기준
- [ ] 전체 시스템 E2E 테스트 통과
- [ ] 성능 요구사항 충족 (평균 응답시간 200ms 이하)
- [ ] 보안 검증 완료 (OWASP Top 10 대응)
- [ ] Health check 엔드포인트 정상 작동

### 품질 완료 기준
- [ ] 통합 테스트 커버리지 80% 이상
- [ ] 부하 테스트 통과 (1000 concurrent users)
- [ ] 메모리 누수 없음
- [ ] 로그 레벨 및 형식 표준화

### 운영 완료 기준
- [ ] CI/CD 파이프라인 구축 완료
- [ ] 모니터링 및 알림 시스템 설정
- [ ] 배포 문서 및 롤백 절차 완료
- [ ] 성능 기준선(baseline) 설정

## 🧪 테스트 계획

### 성능 테스트
```typescript
// test/performance/load-test.spec.ts
describe('Load Testing', () => {
  it('should handle 100 concurrent user creation requests', async () => {
    const concurrentRequests = 100;
    const promises = [];

    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        request(app.getHttpServer())
          .post('/users')
          .send({
            googleId: `load-test-${i}`,
            email: `load-test-${i}@example.com`,
            name: `Load Test User ${i}`,
          })
      );
    }

    const startTime = Date.now();
    const results = await Promise.allSettled(promises);
    const duration = Date.now() - startTime;

    // 95% 이상 성공
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    expect(successCount / concurrentRequests).toBeGreaterThan(0.95);

    // 평균 처리 시간 확인
    expect(duration / concurrentRequests).toBeLessThan(100); // 평균 100ms 이하
  });
});
```

### 보안 테스트
```typescript
// test/security/security.spec.ts
describe('Security Tests', () => {
  it('should reject SQL injection attempts', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        googleId: maliciousInput,
        email: 'test@example.com',
        name: 'Test User',
      })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should reject XSS attempts', async () => {
    const xssPayload = '<script>alert("xss")</script>';
    
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        googleId: 'test-123',
        email: 'test@example.com',
        name: xssPayload,
      })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

## 📊 성공 지표

### 정량적 지표
- **테스트 커버리지**: 전체 90% 이상, 통합 테스트 80% 이상
- **성능**: 평균 응답시간 150ms 이하 (목표: 200ms 이하)
- **가용성**: 99.9% uptime 달성
- **보안**: OWASP Top 10 100% 대응

### 정성적 지표
- **운영 안정성**: 24시간 무중단 운영
- **모니터링 효율성**: 이슈 감지 및 대응 시간 단축
- **배포 안정성**: 무중단 배포 및 빠른 롤백

## 🚀 배포 준비

### 프로덕션 체크리스트
- [ ] 환경 변수 설정 검증
- [ ] 데이터베이스 마이그레이션 검증
- [ ] SSL/TLS 인증서 설정
- [ ] 로드 밸런서 설정
- [ ] 백업 및 복구 절차 테스트
- [ ] 모니터링 대시보드 설정
- [ ] 알림 규칙 설정
- [ ] 롤백 절차 문서화

## 🔗 관련 문서

### 상세 기술 문서
- [Phase 6 Implementation Guide](../../docs/phase-6-integration.md)
- [Clean Architecture Plan - Integration](../../docs/clean-architecture-plan.md#integration)

### 이전 Phase 문서
- [Phase 5: Presentation Layer](./phase-5-presentation.md)

### 운영 문서
- [Deployment Guide](../../docs/deployment-guide.md)
- [Monitoring Guide](../../docs/monitoring-guide.md)

---

**Phase Owner**: DevOps Engineer, QA Lead  
**Reviewers**: System Architect, Security Engineer  
**최종 업데이트**: 2024년 8월