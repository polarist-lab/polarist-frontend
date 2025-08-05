# Phase 4: Infrastructure Layer Implementation

## 📋 Phase 개요

**목표**: Repository 구현체, 데이터베이스 어댑터, 외부 서비스 연동을 통해 Infrastructure Layer를 완성합니다.

**기간**: 1-2 weeks  
**우선순위**: P0 (최고 우선순위)  
**의존성**: Phase 3 완료 (Application Layer)

## 🎯 주요 목표

1. **Repository 구현**: Drizzle ORM 기반 Repository 구현체 개발
2. **데이터베이스 연동**: 마이그레이션 및 연결 설정
3. **외부 서비스 어댑터**: Google OAuth, 파일 저장소 등 연동
4. **캐싱 시스템**: Redis 기반 캐싱 레이어 구현

## 📚 관련 PRD 문서

- **주요 참조**: [Clean Architecture Migration PRD](../features/clean-architecture-migration.md)
- **보조 참조**: [Error Handling System PRD](../features/error-handling-system.md)

## 🏗️ 구현 범위

### 1. Repository 구현체

#### DrizzleUserRepository 구현
```typescript
// src/infrastructure/repositories/drizzle-user.repository.ts
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
      if ((error as any).code === 'SQLITE_CONSTRAINT_UNIQUE') {
        const field = this.extractConstraintField(error as Error);
        throw new DomainConflictException('User', `${field} already exists`);
      }
      throw new DatabaseException('save', error as Error);
    }
  }

  private toDomainEntity(dbRecord: any): User {
    return new User(
      dbRecord.id,
      dbRecord.googleId,
      Email.from(dbRecord.email),
      dbRecord.name,
      dbRecord.avatar,
      dbRecord.locale,
      dbRecord.createdAt,
      dbRecord.updatedAt,
    );
  }

  private toDbRecord(user: User): any {
    return {
      id: user.id,
      googleId: user.googleId,
      email: user.email.value,
      name: user.name,
      avatar: user.avatar,
      locale: user.locale,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
```

### 2. 데이터베이스 설정

#### Database Service 구현
```typescript
// src/infrastructure/database/database.service.ts
@Injectable()
export class DatabaseService implements OnModuleInit {
  public db: DrizzleDatabase;
  
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    
    if (this.configService.get('NODE_ENV') === 'test') {
      // 테스트 환경: 인메모리 DB
      const sqlite = new Database(':memory:');
      this.db = drizzle(sqlite);
    } else {
      // 개발/프로덕션 환경
      const sqlite = new Database(databaseUrl || 'data/app.db');
      this.db = drizzle(sqlite);
    }

    await this.runMigrations();
  }

  private async runMigrations() {
    try {
      await migrate(this.db, { migrationsFolder: './migrations' });
      console.log('✅ Database migrations completed');
    } catch (error) {
      console.error('❌ Database migration failed:', error);
      throw new DatabaseException('migration', error as Error);
    }
  }
}
```

### 3. 외부 서비스 어댑터

#### Google OAuth Adapter
```typescript
// src/infrastructure/external-services/google-auth.adapter.ts
@Injectable()
export class GoogleAuthAdapter {
  constructor(private readonly configService: ConfigService) {}

  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
      );
      
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

### 4. 캐싱 시스템

#### Cache Service 구현
```typescript
// src/infrastructure/cache/cache.service.ts
@Injectable()
export class CacheService {
  private cache = new Map<string, { value: any; expiry: number }>();

  set(key: string, value: any, ttlSeconds: number = 300): void {
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiry });
  }

  get<T = any>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Cacheable 데코레이터
export function Cacheable(keyPrefix: string, ttlSeconds: number = 300) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = this.cacheService as CacheService;
      const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`;
      
      const cached = cacheService.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      const result = await method.apply(this, args);
      cacheService.set(cacheKey, result, ttlSeconds);
      
      return result;
    };
  };
}
```

## ✅ 완료 기준 (Definition of Done)

### 기능적 완료 기준
- [ ] 모든 Repository 인터페이스 구현 완료
- [ ] 데이터베이스 연결 및 마이그레이션 설정 완료
- [ ] 외부 서비스 어댑터 구현 완료
- [ ] 캐싱 시스템 적용 완료

### 품질 완료 기준
- [ ] Repository 단위 테스트 완료 (커버리지 90% 이상)
- [ ] 통합 테스트 완료 (데이터베이스 포함)
- [ ] 외부 서비스 연동 테스트 완료
- [ ] 에러 시나리오 테스트 완료

### 성능 완료 기준
- [ ] 데이터베이스 쿼리 최적화 완료
- [ ] 캐싱 전략 적용으로 응답 시간 개선
- [ ] 연결 풀 설정으로 동시성 처리 개선

## 🧪 테스트 계획

### Repository 테스트
```typescript
describe('DrizzleUserRepository', () => {
  let repository: DrizzleUserRepository;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    // 테스트용 인메모리 DB 설정
    const testDb = new Database(':memory:');
    const drizzleDb = drizzle(testDb);
    
    databaseService = { db: drizzleDb } as DatabaseService;
    repository = new DrizzleUserRepository(databaseService);
    
    // 테스트 스키마 생성
    await migrate(drizzleDb, { migrationsFolder: './migrations' });
  });

  it('should save and retrieve user', async () => {
    const user = User.create({
      googleId: 'test-123',
      email: 'test@example.com',
      name: 'Test User',
    });

    const savedUser = await repository.save(user);
    expect(savedUser.id).toBeDefined();

    const retrievedUser = await repository.findById(savedUser.id!);
    expect(retrievedUser).toBeTruthy();
    expect(retrievedUser!.googleId).toBe('test-123');
  });
});
```

## 📊 성공 지표

### 정량적 지표
- **Repository 완성도**: 모든 Repository 인터페이스 구현
- **데이터베이스 성능**: 평균 쿼리 시간 50ms 이하
- **캐시 적중률**: 70% 이상
- **테스트 커버리지**: Infrastructure Layer 85% 이상

## 🔄 다음 단계 준비

### Phase 5 준비사항
- [ ] Controller 리팩토링 계획 수립
- [ ] API 엔드포인트 매핑 문서 작성
- [ ] Swagger 문서화 준비

## 🔗 관련 문서

### 상세 기술 문서
- [Repository Patterns Implementation Guide](../../docs/repository-patterns.md)
- [Phase 4 Implementation Guide](../../docs/phase-4-infrastructure.md)

### 이전/다음 Phase 문서
- [Phase 3: Application Layer](./phase-3-application.md)
- [Phase 5: Presentation Layer](./phase-5-presentation.md)

---

**Phase Owner**: Senior Backend Developer  
**Reviewers**: System Architect, DevOps Engineer  
**최종 업데이트**: 2024년 8월