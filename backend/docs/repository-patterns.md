# Repository 구현 패턴

## 개요
Repository 패턴의 구현 가이드라인을 통해 데이터 액세스 로직을 캡슐화하고, Clean Architecture의 의존성 역전 원칙을 준수합니다.

## 기본 원칙

### 1. 인터페이스 우선 설계
- Domain 계층에서 Repository 인터페이스 정의
- Infrastructure 계층에서 구체적 구현
- 비즈니스 로직은 인터페이스에만 의존

### 2. 단일 책임 원칙
- 각 Repository는 하나의 Aggregate Root만 담당
- CRUD 연산과 관련 쿼리만 포함
- 비즈니스 로직은 Domain Service나 Use Case에서 처리

### 3. 기술 독립성
- 특정 ORM이나 데이터베이스에 의존하지 않는 인터페이스
- 구현체는 기술 스택에 따라 교체 가능

## Repository 인터페이스 설계

### 1. 기본 CRUD 인터페이스
```typescript
// Domain Layer - 추상 인터페이스
export interface BaseRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
  exists(id: ID): Promise<boolean>;
}
```

### 2. 도메인별 확장 인터페이스
```typescript
import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';

export interface UserRepository extends BaseRepository<User, number> {
  // 도메인 특화 쿼리 메서드
  findByGoogleId(googleId: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findActiveUsers(limit?: number): Promise<User[]>;
  
  // 집계 메서드
  countByLocale(locale: string): Promise<number>;
  findUsersCreatedAfter(date: Date): Promise<User[]>;
}

// 의존성 주입을 위한 토큰
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
```

### 3. 복잡한 쿼리 인터페이스
```typescript
export interface ProgressRepository extends BaseRepository<WordProgress, number> {
  // 단일 진도 조회
  findWordProgress(userId: number, wordId: WordId): Promise<WordProgress | null>;
  
  // 다중 진도 조회
  findUserProgress(userId: number): Promise<WordProgress[]>;
  findProgressByIds(userId: number, wordIds: WordId[]): Promise<WordProgress[]>;
  
  // 필터링된 조회
  findProgressByDateRange(userId: number, from: Date, to: Date): Promise<WordProgress[]>;
  findLearnedWords(userId: number): Promise<WordId[]>;
  findWordsNeedingReview(userId: number, date?: Date): Promise<WordProgress[]>;
  
  // 집계 쿼리
  getUserStats(userId: number): Promise<UserStats>;
  getProgressSummary(userId: number, period: 'week' | 'month' | 'year'): Promise<ProgressSummary>;
  
  // 세션 관련
  findActiveSession(userId: number): Promise<StudySession | null>;
  findUserSessions(userId: number, limit?: number): Promise<StudySession[]>;
  saveStudySession(session: StudySession): Promise<StudySession>;
  updateStudySession(session: StudySession): Promise<StudySession>;
}
```

## Repository 구현 패턴

### 1. Drizzle ORM 기반 구현
```typescript
import { Injectable } from '@nestjs/common';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.vo';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/drizzle/schema';
import { DatabaseException } from '../../shared/exceptions/infrastructure.exception';
import { EntityNotFoundDomainException } from '../../shared/exceptions/domain.exception';

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

  async findByEmail(email: Email): Promise<User | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(users)
        .where(eq(users.email, email.value))
        .limit(1);

      return result[0] ? this.toDomainEntity(result[0]) : null;
    } catch (error) {
      throw new DatabaseException('findByEmail', error as Error);
    }
  }

  async save(user: User): Promise<User> {
    try {
      const userData = this.toDbRecord(user);
      
      const result = await this.databaseService.db
        .insert(users)
        .values(userData)
        .returning();

      const savedUser = this.toDomainEntity(result[0]);
      return savedUser;
    } catch (error) {
      throw new DatabaseException('save', error as Error);
    }
  }

  async update(user: User): Promise<User> {
    if (!user.id) {
      throw new EntityNotFoundDomainException('User', 'undefined');
    }

    try {
      const userData = this.toDbRecord(user);
      
      const result = await this.databaseService.db
        .update(users)
        .set({ ...userData, updatedAt: new Date() })
        .where(eq(users.id, user.id))
        .returning();

      if (result.length === 0) {
        throw new EntityNotFoundDomainException('User', user.id);
      }

      return this.toDomainEntity(result[0]);
    } catch (error) {
      if (error instanceof EntityNotFoundDomainException) {
        throw error;
      }
      throw new DatabaseException('update', error as Error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.databaseService.db
        .delete(users)
        .where(eq(users.id, id))
        .returning({ id: users.id });

      if (result.length === 0) {
        throw new EntityNotFoundDomainException('User', id);
      }
    } catch (error) {
      if (error instanceof EntityNotFoundDomainException) {
        throw error;
      }
      throw new DatabaseException('delete', error as Error);
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const result = await this.databaseService.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      return result.length > 0;
    } catch (error) {
      throw new DatabaseException('exists', error as Error);
    }
  }

  async findActiveUsers(limit = 50): Promise<User[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const results = await this.databaseService.db
        .select()
        .from(users)
        .where(gte(users.updatedAt, thirtyDaysAgo))
        .orderBy(desc(users.updatedAt))
        .limit(limit);

      return results.map(record => this.toDomainEntity(record));
    } catch (error) {
      throw new DatabaseException('findActiveUsers', error as Error);
    }
  }

  async countByLocale(locale: string): Promise<number> {
    try {
      const result = await this.databaseService.db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(eq(users.locale, locale));

      return Number(result[0].count);
    } catch (error) {
      throw new DatabaseException('countByLocale', error as Error);
    }
  }

  async findUsersCreatedAfter(date: Date): Promise<User[]> {
    try {
      const results = await this.databaseService.db
        .select()
        .from(users)
        .where(gte(users.createdAt, date))
        .orderBy(desc(users.createdAt));

      return results.map(record => this.toDomainEntity(record));
    } catch (error) {
      throw new DatabaseException('findUsersCreatedAfter', error as Error);
    }
  }

  // 도메인 엔티티와 DB 레코드 간 변환
  private toDomainEntity(dbRecord: any): User {
    return new User({
      id: dbRecord.id,
      googleId: dbRecord.googleId,
      email: dbRecord.email,
      name: dbRecord.name,
      avatar: dbRecord.avatar,
      locale: dbRecord.locale,
      createdAt: dbRecord.createdAt,
      updatedAt: dbRecord.updatedAt,
    });
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

### 2. 복잡한 쿼리 구현
```typescript
@Injectable()
export class DrizzleProgressRepository implements ProgressRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly queryOptimizer: QueryOptimizerService,
  ) {}

  async findUserProgress(userId: number): Promise<WordProgress[]> {
    return this.queryOptimizer.executeWithStats(
      async () => {
        const results = await this.databaseService.db
          .select()
          .from(userProgress)
          .where(eq(userProgress.userId, userId))
          .orderBy(desc(userProgress.lastStudied));

        return results.map(record => this.toWordProgressEntity(record));
      },
      `findUserProgress(${userId})`
    );
  }

  async findProgressByDateRange(
    userId: number, 
    from: Date, 
    to: Date
  ): Promise<WordProgress[]> {
    return this.queryOptimizer.executeWithStats(
      async () => {
        const results = await this.databaseService.db
          .select()
          .from(userProgress)
          .where(
            and(
              eq(userProgress.userId, userId),
              gte(userProgress.lastStudied, from),
              lte(userProgress.lastStudied, to)
            )
          )
          .orderBy(desc(userProgress.lastStudied));

        return results.map(record => this.toWordProgressEntity(record));
      },
      `findProgressByDateRange(${userId}, ${from.toISOString()}, ${to.toISOString()})`
    );
  }

  async getUserStats(userId: number): Promise<UserStats> {
    return this.queryOptimizer.executeWithStats(
      async () => {
        // 진도 통계
        const progressResults = await this.databaseService.db
          .select({
            totalWords: sql`count(*)`,
            learnedWords: sql`count(case when ${userProgress.isLearned} = true then 1 end)`,
            averageConfidence: sql`avg(${userProgress.confidence})`,
            totalAttempts: sql`sum(${userProgress.attempts})`,
            totalCorrect: sql`sum(${userProgress.correctAnswers})`,
          })
          .from(userProgress)
          .where(eq(userProgress.userId, userId));

        // 세션 통계
        const sessionResults = await this.databaseService.db
          .select({
            totalSessions: sql`count(*)`,
            totalStudyTime: sql`sum(${studySessions.duration})`,
            averageSessionTime: sql`avg(${studySessions.duration})`,
          })
          .from(studySessions)
          .where(eq(studySessions.userId, userId));

        const progressStats = progressResults[0];
        const sessionStats = sessionResults[0];

        return {
          totalWordsStudied: Number(progressStats.totalWords),
          learnedWords: Number(progressStats.learnedWords),
          averageConfidence: Number(progressStats.averageConfidence) || 0,
          totalSessions: Number(sessionStats.totalSessions),
          totalStudyTime: Number(sessionStats.totalStudyTime) || 0,
          averageAccuracy: Number(progressStats.totalAttempts) > 0 
            ? Number(progressStats.totalCorrect) / Number(progressStats.totalAttempts)
            : 0,
          streak: await this.calculateStreak(userId),
        };
      },
      `getUserStats(${userId})`
    );
  }

  private async calculateStreak(userId: number): Promise<number> {
    const sessions = await this.databaseService.db
      .select({ createdAt: studySessions.createdAt })
      .from(studySessions)
      .where(eq(studySessions.userId, userId))
      .orderBy(desc(studySessions.createdAt))
      .limit(100); // 최근 100개 세션만 확인

    let streak = 0;
    const today = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].createdAt);
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / oneDayMs);

      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }

    return streak;
  }
}
```

### 3. 트랜잭션 처리
```typescript
@Injectable()
export class TransactionalProgressRepository extends DrizzleProgressRepository {
  async updateProgressWithSession(
    userId: number,
    wordId: WordId,
    isCorrect: boolean,
    sessionId: string
  ): Promise<{ progress: WordProgress; session: StudySession }> {
    return this.databaseService.db.transaction(async (tx) => {
      // 1. 단어 진도 업데이트
      let progress = await this.findWordProgressInTransaction(tx, userId, wordId);
      
      if (!progress) {
        progress = WordProgress.create({ userId, wordId: wordId.value });
      }
      
      progress.recordAttempt(isCorrect);
      
      const savedProgress = progress.id
        ? await this.updateWordProgressInTransaction(tx, progress)
        : await this.saveWordProgressInTransaction(tx, progress);

      // 2. 세션 통계 업데이트
      const session = await this.findSessionByIdInTransaction(tx, sessionId);
      if (!session) {
        throw new EntityNotFoundDomainException('StudySession', sessionId);
      }

      session.recordWordStudy(isCorrect);
      const updatedSession = await this.updateStudySessionInTransaction(tx, session);

      return {
        progress: savedProgress,
        session: updatedSession,
      };
    });
  }

  private async findWordProgressInTransaction(
    tx: any,
    userId: number,
    wordId: WordId
  ): Promise<WordProgress | null> {
    const result = await tx
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.wordId, wordId.value)))
      .limit(1);

    return result[0] ? this.toWordProgressEntity(result[0]) : null;
  }

  // 다른 트랜잭션 메서드들...
}
```

## 성능 최적화 패턴

### 1. 쿼리 최적화
```typescript
@Injectable()
export class OptimizedWordbookRepository extends DrizzleWordbookRepository {
  
  // 배치 조회로 N+1 문제 해결
  async findWithUserNames(wordbookIds: number[]): Promise<(Wordbook & { userName: string })[]> {
    if (wordbookIds.length === 0) return [];

    const results = await this.databaseService.db
      .select({
        // Wordbook 필드들
        id: customWordbooks.id,
        userId: customWordbooks.userId,
        name: customWordbooks.name,
        description: customWordbooks.description,
        wordIds: customWordbooks.wordIds,
        totalWords: customWordbooks.totalWords,
        createdAt: customWordbooks.createdAt,
        updatedAt: customWordbooks.updatedAt,
        // User 정보 조인
        userName: users.name,
      })
      .from(customWordbooks)
      .innerJoin(users, eq(customWordbooks.userId, users.id))
      .where(inArray(customWordbooks.id, wordbookIds));

    return results.map(record => ({
      ...this.toDomainEntity(record),
      userName: record.userName,
    }));
  }

  // 페이지네이션 최적화
  async findPublicWordbooks(
    page: number,
    limit: number,
    filters?: {
      tags?: string[];
      category?: string;
      search?: string;
    }
  ): Promise<{ wordbooks: Wordbook[]; total: number }> {
    const offset = (page - 1) * limit;
    let query = this.databaseService.db
      .select()
      .from(customWordbooks)
      .where(eq(customWordbooks.isPublic, true));

    // 필터 적용
    if (filters?.search) {
      query = query.where(
        like(customWordbooks.name, `%${filters.search}%`)
      );
    }

    if (filters?.category) {
      query = query.where(
        like(customWordbooks.categories, `%"${filters.category}"%`)
      );
    }

    // 총 개수 조회 (필터 적용된 상태)
    const countQuery = this.databaseService.db
      .select({ count: sql`count(*)` })
      .from(customWordbooks)
      .where(eq(customWordbooks.isPublic, true));

    if (filters?.search) {
      countQuery.where(like(customWordbooks.name, `%${filters.search}%`));
    }

    const [wordbooks, countResult] = await Promise.all([
      query
        .orderBy(desc(customWordbooks.createdAt))
        .limit(limit)
        .offset(offset),
      countQuery
    ]);

    return {
      wordbooks: wordbooks.map(record => this.toDomainEntity(record)),
      total: Number(countResult[0].count),
    };
  }

  // 인덱스 힌트 사용
  async findMostPopularWordbooks(limit = 10): Promise<Wordbook[]> {
    const results = await this.databaseService.db.execute(
      sql`
        SELECT * FROM ${customWordbooks}
        WHERE ${customWordbooks.isPublic} = true
        ORDER BY ${customWordbooks.studyCount} DESC
        LIMIT ${limit}
      `
    );

    return results.map(record => this.toDomainEntity(record));
  }
}
```

### 2. 캐싱 패턴
```typescript
import { CacheService } from '../../shared/cache/cache.service';
import { Cacheable } from '../../shared/cache/cache.decorator';

@Injectable()
export class CachedUserRepository extends DrizzleUserRepository {
  constructor(
    databaseService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {
    super(databaseService);
  }

  @Cacheable('user_by_id', 300) // 5분 캐시
  async findById(id: number): Promise<User | null> {
    return super.findById(id);
  }

  @Cacheable('user_by_google_id', 300)
  async findByGoogleId(googleId: string): Promise<User | null> {
    return super.findByGoogleId(googleId);
  }

  async update(user: User): Promise<User> {
    const result = await super.update(user);
    
    // 캐시 무효화
    if (result.id) {
      this.cacheService.delete(`user_by_id:${result.id}`);
      this.cacheService.delete(`user_by_google_id:${result.googleId}`);
    }
    
    return result;
  }

  async delete(id: number): Promise<void> {
    // 캐시에서 사용자 정보 가져와서 연관된 캐시 무효화
    const user = await this.findById(id);
    
    await super.delete(id);
    
    if (user) {
      this.cacheService.delete(`user_by_id:${id}`);
      this.cacheService.delete(`user_by_google_id:${user.googleId}`);
    }
  }
}
```

### 3. 연결 풀 최적화
```typescript
@Injectable()
export class PooledDatabaseService extends DatabaseService {
  private readonly pool: Pool;

  constructor(configService: ConfigService) {
    super(configService);
    
    this.pool = new Pool({
      connectionString: configService.get('DATABASE_URL'),
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async withConnection<T>(operation: (db: DrizzleDatabase) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    
    try {
      const db = drizzle(client);
      return await operation(db);
    } finally {
      client.release();
    }
  }

  async getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}
```

## 테스트 패턴

### 1. Repository 단위 테스트
```typescript
describe('DrizzleUserRepository', () => {
  let repository: DrizzleUserRepository;
  let databaseService: jest.Mocked<DatabaseService>;

  beforeEach(async () => {
    const mockDatabaseService = {
      db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrizzleUserRepository,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    repository = module.get<DrizzleUserRepository>(DrizzleUserRepository);
    databaseService = module.get(DatabaseService);
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockDbUser = {
        id: 1,
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
        locale: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([mockDbUser]),
      };

      databaseService.db.select.mockReturnValue(mockQuery);

      const result = await repository.findById(1);

      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(1);
      expect(result?.email.value).toBe('test@example.com');
    });

    it('should return null when user not found', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      databaseService.db.select.mockReturnValue(mockQuery);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });

    it('should throw DatabaseException on database error', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      databaseService.db.select.mockReturnValue(mockQuery);

      await expect(repository.findById(1)).rejects.toThrow(DatabaseException);
    });
  });

  describe('save', () => {
    it('should save user successfully', async () => {
      const user = User.create({
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
      });

      const mockDbUser = {
        id: 1,
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
        locale: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockQuery = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockDbUser]),
      };

      databaseService.db.insert.mockReturnValue(mockQuery);

      const result = await repository.save(user);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(databaseService.db.insert).toHaveBeenCalled();
    });
  });
});
```

### 2. 통합 테스트
```typescript
describe('UserRepository Integration', () => {
  let repository: DrizzleUserRepository;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    // 테스트 데이터베이스 설정
    const testDb = new Database(':memory:');
    const drizzleDb = drizzle(testDb);
    
    // 스키마 생성
    await migrate(drizzleDb, { migrationsFolder: './migrations' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrizzleUserRepository,
        {
          provide: DatabaseService,
          useValue: { db: drizzleDb },
        },
      ],
    }).compile();

    repository = module.get<DrizzleUserRepository>(DrizzleUserRepository);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should perform full CRUD operations', async () => {
    // Create
    const user = User.create({
      googleId: 'integration-test-123',
      email: 'integration@example.com',
      name: 'Integration Test User',
    });

    const savedUser = await repository.save(user);
    expect(savedUser.id).toBeDefined();

    // Read
    const foundUser = await repository.findById(savedUser.id!);
    expect(foundUser).toBeTruthy();
    expect(foundUser!.googleId).toBe('integration-test-123');

    // Update
    foundUser!.updateProfile('Updated Name');
    const updatedUser = await repository.update(foundUser!);
    expect(updatedUser.name).toBe('Updated Name');

    // Delete
    await repository.delete(savedUser.id!);
    const deletedUser = await repository.findById(savedUser.id!);
    expect(deletedUser).toBeNull();
  });
});
```

### 3. 성능 테스트
```typescript
describe('Repository Performance', () => {
  let repository: DrizzleUserRepository;

  beforeAll(async () => {
    // 성능 테스트용 데이터베이스 설정
  });

  it('should handle bulk operations efficiently', async () => {
    const startTime = Date.now();
    const users: User[] = [];

    // 1000명의 사용자 생성
    for (let i = 0; i < 1000; i++) {
      const user = User.create({
        googleId: `perf-test-${i}`,
        email: `perf${i}@example.com`,
        name: `Performance Test User ${i}`,
      });
      users.push(user);
    }

    // 배치 저장
    const savedUsers = await Promise.all(
      users.map(user => repository.save(user))
    );

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(savedUsers).toHaveLength(1000);
    expect(duration).toBeLessThan(5000); // 5초 이내
    
    console.log(`Bulk save of 1000 users took ${duration}ms`);
  });

  it('should perform complex queries efficiently', async () => {
    const startTime = Date.now();

    const stats = await repository.getUserStats(1);

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(stats).toBeDefined();
    expect(duration).toBeLessThan(1000); // 1초 이내
    
    console.log(`Complex stats query took ${duration}ms`);
  });
});
```

## 모니터링 및 로깅

### 1. 쿼리 성능 모니터링
```typescript
@Injectable()
export class MonitoredRepository extends DrizzleUserRepository {
  private readonly logger = new Logger(MonitoredRepository.name);

  async findById(id: number): Promise<User | null> {
    const startTime = Date.now();
    
    try {
      const result = await super.findById(id);
      const duration = Date.now() - startTime;
      
      if (duration > 100) { // 100ms 이상
        this.logger.warn(`Slow query: findById(${id}) took ${duration}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`Query failed: findById(${id}) after ${duration}ms`, error);
      throw error;
    }
  }
}
```

### 2. 연결 상태 모니터링
```typescript
@Injectable()
export class HealthCheckRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async checkDatabaseHealth(): Promise<{
    isHealthy: boolean;
    responseTime: number;
    connectionCount?: number;
  }> {
    const startTime = Date.now();
    
    try {
      await this.databaseService.db.select().from(users).limit(1);
      
      return {
        isHealthy: true,
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
      };
    }
  }
}
```

이 가이드를 따라 Repository를 구현하면 데이터 액세스 로직이 깔끔하게 캡슐화되고, 테스트 가능하며, 성능이 최적화된 코드를 작성할 수 있습니다.