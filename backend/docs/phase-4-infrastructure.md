# Phase 4: Infrastructure Layer (인프라스트럭처 계층)

## 목표
Repository 구현체와 데이터베이스 어댑터를 작성하여 도메인 계층과 외부 시스템 간의 연결을 구현합니다.

## 범위
- Repository 구현체 작성 (Drizzle ORM 기반)
- 데이터베이스 어댑터 리팩토링
- 외부 서비스 어댑터 구현 (Google OAuth, JWT)
- 설정 관리 개선

## 구현할 파일 목록

### 1. 데이터베이스 설정 (`src/infrastructure/database/`)

#### `drizzle/config.ts`
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

export function createDrizzleDatabase(databaseUrl: string) {
  const sqlite = new Database(databaseUrl);
  return drizzle(sqlite, { schema });
}

export type DrizzleDatabase = ReturnType<typeof createDrizzleDatabase>;
```

#### `database.module.ts`
```typescript
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDrizzleDatabase, DrizzleDatabase } from './drizzle/config';
import { DatabaseService } from './database.service';

export const DRIZZLE_DATABASE = Symbol('DRIZZLE_DATABASE');

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_DATABASE,
      useFactory: (configService: ConfigService): DrizzleDatabase => {
        const databaseUrl = configService.get<string>('DATABASE_URL', 'data/sqlite.db');
        return createDrizzleDatabase(databaseUrl);
      },
      inject: [ConfigService],
    },
    DatabaseService,
  ],
  exports: [DRIZZLE_DATABASE, DatabaseService],
})
export class DatabaseModule {}
```

#### `database.service.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { DrizzleDatabase, DRIZZLE_DATABASE } from './drizzle/config';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(DRIZZLE_DATABASE)
    public readonly db: DrizzleDatabase,
  ) {}

  async healthCheck(): Promise<boolean> {
    try {
      await this.db.select().from(this.db.schema.users).limit(1);
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}
```

### 2. Repository 구현 (`src/infrastructure/repositories/`)

#### `user.repository.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
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

#### `progress.repository.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { WordProgress } from '../../domain/entities/word-progress.entity';
import { StudySession } from '../../domain/entities/study-session.entity';
import { ProgressRepository } from '../../domain/repositories/progress.repository.interface';
import { WordId } from '../../domain/value-objects/word-id.vo';
import { DatabaseService } from '../database/database.service';
import { userProgress, studySessions } from '../database/drizzle/schema';
import { DatabaseException } from '../../shared/exceptions/infrastructure.exception';
import { EntityNotFoundDomainException } from '../../shared/exceptions/domain.exception';

@Injectable()
export class DrizzleProgressRepository implements ProgressRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  // Word Progress Methods
  async findWordProgress(userId: number, wordId: WordId): Promise<WordProgress | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.wordId, wordId.value)))
        .limit(1);

      return result[0] ? this.toWordProgressEntity(result[0]) : null;
    } catch (error) {
      throw new DatabaseException('findWordProgress', error as Error);
    }
  }

  async findUserProgress(userId: number): Promise<WordProgress[]> {
    try {
      const results = await this.databaseService.db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId))
        .orderBy(desc(userProgress.lastStudied));

      return results.map(record => this.toWordProgressEntity(record));
    } catch (error) {
      throw new DatabaseException('findUserProgress', error as Error);
    }
  }

  async findProgressByIds(userId: number, wordIds: WordId[]): Promise<WordProgress[]> {
    try {
      const wordIdStrings = wordIds.map(id => id.value);
      const results = await this.databaseService.db
        .select()
        .from(userProgress)
        .where(and(
          eq(userProgress.userId, userId),
          // Note: Drizzle doesn't have a direct 'in' operator for arrays
          // This would need to be implemented with a more complex query
        ));

      return results
        .filter(record => wordIdStrings.includes(record.wordId))
        .map(record => this.toWordProgressEntity(record));
    } catch (error) {
      throw new DatabaseException('findProgressByIds', error as Error);
    }
  }

  async saveWordProgress(progress: WordProgress): Promise<WordProgress> {
    try {
      const progressData = this.toWordProgressDbRecord(progress);
      const result = await this.databaseService.db
        .insert(userProgress)
        .values(progressData)
        .returning();

      return this.toWordProgressEntity(result[0]);
    } catch (error) {
      throw new DatabaseException('saveWordProgress', error as Error);
    }
  }

  async updateWordProgress(progress: WordProgress): Promise<WordProgress> {
    if (!progress.id) {
      throw new EntityNotFoundDomainException('WordProgress', 'undefined');
    }

    try {
      const progressData = this.toWordProgressDbRecord(progress);
      const result = await this.databaseService.db
        .update(userProgress)
        .set({ ...progressData, updatedAt: new Date() })
        .where(eq(userProgress.id, progress.id))
        .returning();

      if (result.length === 0) {
        throw new EntityNotFoundDomainException('WordProgress', progress.id);
      }

      return this.toWordProgressEntity(result[0]);
    } catch (error) {
      if (error instanceof EntityNotFoundDomainException) {
        throw error;
      }
      throw new DatabaseException('updateWordProgress', error as Error);
    }
  }

  async deleteWordProgress(userId: number, wordId: WordId): Promise<void> {
    try {
      const result = await this.databaseService.db
        .delete(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.wordId, wordId.value)))
        .returning({ id: userProgress.id });

      if (result.length === 0) {
        throw new EntityNotFoundDomainException('WordProgress', `${userId}-${wordId.value}`);
      }
    } catch (error) {
      if (error instanceof EntityNotFoundDomainException) {
        throw error;
      }
      throw new DatabaseException('deleteWordProgress', error as Error);
    }
  }

  // Study Session Methods
  async findActiveSession(userId: number): Promise<StudySession | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(studySessions)
        .where(and(eq(studySessions.userId, userId), eq(studySessions.endTime, null)))
        .limit(1);

      return result[0] ? this.toStudySessionEntity(result[0]) : null;
    } catch (error) {
      throw new DatabaseException('findActiveSession', error as Error);
    }
  }

  async findSessionById(sessionId: string): Promise<StudySession | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(studySessions)
        .where(eq(studySessions.sessionId, sessionId))
        .limit(1);

      return result[0] ? this.toStudySessionEntity(result[0]) : null;
    } catch (error) {
      throw new DatabaseException('findSessionById', error as Error);
    }
  }

  async findUserSessions(userId: number, limit = 20): Promise<StudySession[]> {
    try {
      const results = await this.databaseService.db
        .select()
        .from(studySessions)
        .where(eq(studySessions.userId, userId))
        .orderBy(desc(studySessions.createdAt))
        .limit(limit);

      return results.map(record => this.toStudySessionEntity(record));
    } catch (error) {
      throw new DatabaseException('findUserSessions', error as Error);
    }
  }

  async saveStudySession(session: StudySession): Promise<StudySession> {
    try {
      const sessionData = this.toStudySessionDbRecord(session);
      const result = await this.databaseService.db
        .insert(studySessions)
        .values(sessionData)
        .returning();

      return this.toStudySessionEntity(result[0]);
    } catch (error) {
      throw new DatabaseException('saveStudySession', error as Error);
    }
  }

  async updateStudySession(session: StudySession): Promise<StudySession> {
    if (!session.id) {
      throw new EntityNotFoundDomainException('StudySession', 'undefined');
    }

    try {
      const sessionData = this.toStudySessionDbRecord(session);
      const result = await this.databaseService.db
        .update(studySessions)
        .set(sessionData)
        .where(eq(studySessions.id, session.id))
        .returning();

      if (result.length === 0) {
        throw new EntityNotFoundDomainException('StudySession', session.id);
      }

      return this.toStudySessionEntity(result[0]);
    } catch (error) {
      if (error instanceof EntityNotFoundDomainException) {
        throw error;
      }
      throw new DatabaseException('updateStudySession', error as Error);
    }
  }

  // Analytics Methods
  async getUserStats(userId: number): Promise<{
    totalWordsStudied: number;
    totalSessions: number;
    averageAccuracy: number;
    totalStudyTime: number;
    streak: number;
  }> {
    try {
      // Get progress stats
      const progressResults = await this.databaseService.db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId));

      // Get session stats
      const sessionResults = await this.databaseService.db
        .select()
        .from(studySessions)
        .where(eq(studySessions.userId, userId))
        .orderBy(desc(studySessions.createdAt));

      const totalWordsStudied = progressResults.length;
      const totalSessions = sessionResults.length;

      // Calculate average accuracy
      const totalAttempts = progressResults.reduce((sum, p) => sum + (p.attempts ?? 0), 0);
      const totalCorrect = progressResults.reduce((sum, p) => sum + (p.correctAnswers ?? 0), 0);
      const averageAccuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;

      // Calculate total study time
      const totalStudyTime = sessionResults
        .filter(s => s.duration)
        .reduce((sum, s) => sum + (s.duration || 0), 0);

      // Calculate streak (simplified)
      const streak = this.calculateStreak(sessionResults);

      return {
        totalWordsStudied,
        totalSessions,
        averageAccuracy,
        totalStudyTime,
        streak,
      };
    } catch (error) {
      throw new DatabaseException('getUserStats', error as Error);
    }
  }

  async getLearnedWords(userId: number): Promise<WordId[]> {
    try {
      const results = await this.databaseService.db
        .select({ wordId: userProgress.wordId })
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.isLearned, true)));

      return results.map(r => WordId.from(r.wordId));
    } catch (error) {
      throw new DatabaseException('getLearnedWords', error as Error);
    }
  }

  // Private helper methods
  private toWordProgressEntity(dbRecord: any): WordProgress {
    return new WordProgress({
      id: dbRecord.id,
      userId: dbRecord.userId,
      wordId: dbRecord.wordId,
      isLearned: dbRecord.isLearned,
      attempts: dbRecord.attempts,
      correctAnswers: dbRecord.correctAnswers,
      confidence: dbRecord.confidence,
      lastStudied: dbRecord.lastStudied,
      createdAt: dbRecord.createdAt,
      updatedAt: dbRecord.updatedAt,
    });
  }

  private toWordProgressDbRecord(progress: WordProgress): any {
    return {
      id: progress.id,
      userId: progress.userId,
      wordId: progress.wordId.value,
      isLearned: progress.isLearned,
      attempts: progress.attempts,
      correctAnswers: progress.correctAnswers,
      confidence: progress.confidence.value,
      lastStudied: progress.lastStudied,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }

  private toStudySessionEntity(dbRecord: any): StudySession {
    return new StudySession({
      id: dbRecord.id,
      userId: dbRecord.userId,
      sessionId: dbRecord.sessionId,
      wordsStudied: dbRecord.wordsStudied,
      correctAnswers: dbRecord.correctAnswers,
      totalAttempts: dbRecord.totalAttempts,
      duration: dbRecord.duration,
      metadata: dbRecord.metadata ? JSON.parse(dbRecord.metadata) : undefined,
      startTime: dbRecord.startTime,
      endTime: dbRecord.endTime,
      createdAt: dbRecord.createdAt,
    });
  }

  private toStudySessionDbRecord(session: StudySession): any {
    return {
      id: session.id,
      userId: session.userId,
      sessionId: session.sessionId,
      wordsStudied: session.wordsStudied,
      correctAnswers: session.correctAnswers,
      totalAttempts: session.totalAttempts,
      duration: session.duration,
      metadata: session.metadata ? JSON.stringify(session.metadata) : null,
      startTime: session.startTime,
      endTime: session.endTime,
      createdAt: session.createdAt,
    };
  }

  private calculateStreak(sessions: any[]): number {
    if (sessions.length === 0) return 0;

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

#### `wordbook.repository.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { eq, like, and } from 'drizzle-orm';
import { Wordbook } from '../../domain/entities/wordbook.entity';
import { WordbookRepository } from '../../domain/repositories/wordbook.repository.interface';
import { DatabaseService } from '../database/database.service';
import { customWordbooks } from '../database/drizzle/schema';
import { DatabaseException } from '../../shared/exceptions/infrastructure.exception';
import { EntityNotFoundDomainException } from '../../shared/exceptions/domain.exception';

@Injectable()
export class DrizzleWordbookRepository implements WordbookRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: number): Promise<Wordbook | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(eq(customWordbooks.id, id))
        .limit(1);

      return result[0] ? this.toDomainEntity(result[0]) : null;
    } catch (error) {
      throw new DatabaseException('findById', error as Error);
    }
  }

  async findByUserId(userId: number): Promise<Wordbook[]> {
    try {
      const results = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(eq(customWordbooks.userId, userId));

      return results.map(record => this.toDomainEntity(record));
    } catch (error) {
      throw new DatabaseException('findByUserId', error as Error);
    }
  }

  async findByShareCode(shareCode: string): Promise<Wordbook | null> {
    try {
      const result = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(eq(customWordbooks.shareCode, shareCode))
        .limit(1);

      return result[0] ? this.toDomainEntity(result[0]) : null;
    } catch (error) {
      throw new DatabaseException('findByShareCode', error as Error);
    }
  }

  async findPublicWordbooks(limit = 20, offset = 0): Promise<Wordbook[]> {
    try {
      const results = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(eq(customWordbooks.isPublic, true))
        .limit(limit)
        .offset(offset);

      return results.map(record => this.toDomainEntity(record));
    } catch (error) {
      throw new DatabaseException('findPublicWordbooks', error as Error);
    }
  }

  async save(wordbook: Wordbook): Promise<Wordbook> {
    try {
      const wordbookData = this.toDbRecord(wordbook);
      const result = await this.databaseService.db
        .insert(customWordbooks)
        .values(wordbookData)
        .returning();

      return this.toDomainEntity(result[0]);
    } catch (error) {
      throw new DatabaseException('save', error as Error);
    }
  }

  async update(wordbook: Wordbook): Promise<Wordbook> {
    if (!wordbook.id) {
      throw new EntityNotFoundDomainException('Wordbook', 'undefined');
    }

    try {
      const wordbookData = this.toDbRecord(wordbook);
      const result = await this.databaseService.db
        .update(customWordbooks)
        .set({ ...wordbookData, updatedAt: new Date() })
        .where(eq(customWordbooks.id, wordbook.id))
        .returning();

      if (result.length === 0) {
        throw new EntityNotFoundDomainException('Wordbook', wordbook.id);
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
        .delete(customWordbooks)
        .where(eq(customWordbooks.id, id))
        .returning({ id: customWordbooks.id });

      if (result.length === 0) {
        throw new EntityNotFoundDomainException('Wordbook', id);
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
        .select({ id: customWordbooks.id })
        .from(customWordbooks)
        .where(eq(customWordbooks.id, id))
        .limit(1);

      return result.length > 0;
    } catch (error) {
      throw new DatabaseException('exists', error as Error);
    }
  }

  async findByTags(tags: string[], limit = 20): Promise<Wordbook[]> {
    try {
      // Note: This is a simplified implementation
      // In a real scenario, you'd want to implement proper JSON querying
      const results = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(eq(customWordbooks.isPublic, true))
        .limit(limit);

      return results
        .map(record => this.toDomainEntity(record))
        .filter(wordbook => {
          return tags.some(tag => wordbook.tags.includes(tag.toLowerCase()));
        });
    } catch (error) {
      throw new DatabaseException('findByTags', error as Error);
    }
  }

  async findByCategory(category: string, limit = 20): Promise<Wordbook[]> {
    try {
      const results = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(eq(customWordbooks.isPublic, true))
        .limit(limit);

      return results
        .map(record => this.toDomainEntity(record))
        .filter(wordbook => wordbook.categories.includes(category));
    } catch (error) {
      throw new DatabaseException('findByCategory', error as Error);
    }
  }

  async search(query: string, limit = 20): Promise<Wordbook[]> {
    try {
      const results = await this.databaseService.db
        .select()
        .from(customWordbooks)
        .where(
          and(
            eq(customWordbooks.isPublic, true),
            like(customWordbooks.name, `%${query}%`)
          )
        )
        .limit(limit);

      return results.map(record => this.toDomainEntity(record));
    } catch (error) {
      throw new DatabaseException('search', error as Error);
    }
  }

  private toDomainEntity(dbRecord: any): Wordbook {
    return new Wordbook({
      id: dbRecord.id,
      userId: dbRecord.userId,
      name: dbRecord.name,
      description: dbRecord.description,
      wordIds: JSON.parse(dbRecord.wordIds || '[]'),
      categories: JSON.parse(dbRecord.categories || '[]'),
      difficulties: JSON.parse(dbRecord.difficulties || '[]'),
      tags: JSON.parse(dbRecord.tags || '[]'),
      isPublic: dbRecord.isPublic,
      isShared: dbRecord.isShared,
      shareCode: dbRecord.shareCode,
      totalWords: dbRecord.totalWords,
      studyCount: dbRecord.studyCount,
      createdAt: dbRecord.createdAt,
      updatedAt: dbRecord.updatedAt,
    });
  }

  private toDbRecord(wordbook: Wordbook): any {
    return {
      id: wordbook.id,
      userId: wordbook.userId,
      name: wordbook.name,
      description: wordbook.description,
      wordIds: JSON.stringify(wordbook.wordIds),
      categories: JSON.stringify(wordbook.categories),
      difficulties: JSON.stringify(wordbook.difficulties),
      tags: JSON.stringify(wordbook.tags),
      isPublic: wordbook.isPublic,
      isShared: wordbook.isShared,
      shareCode: wordbook.shareCode,
      totalWords: wordbook.totalWords,
      studyCount: wordbook.studyCount,
      createdAt: wordbook.createdAt,
      updatedAt: wordbook.updatedAt,
    };
  }
}
```

### 3. 외부 서비스 어댑터 (`src/infrastructure/external/`)

#### `google-auth.adapter.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleLoginDto } from '../../application/dtos/auth/google-login.dto';
import { ExternalServiceException } from '../../shared/exceptions/infrastructure.exception';

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable()
export class GoogleAuthAdapter {
  constructor(private readonly configService: ConfigService) {}

  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      // In a real implementation, you would verify the ID token with Google
      // This is a simplified version for demonstration
      
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      
      if (!response.ok) {
        throw new Error('Invalid token');
      }
      
      const tokenInfo = await response.json();
      
      return {
        id: tokenInfo.sub,
        email: tokenInfo.email,
        name: tokenInfo.name,
        picture: tokenInfo.picture,
      };
    } catch (error) {
      throw new ExternalServiceException('Google Auth', error as Error);
    }
  }

  validateGoogleUser(userInfo: GoogleUserInfo): GoogleLoginDto {
    if (!userInfo.id || !userInfo.email || !userInfo.name) {
      throw new ExternalServiceException('Google Auth', new Error('Incomplete user information'));
    }

    return {
      googleId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      avatar: userInfo.picture,
    };
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      
      return {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };
    } catch (error) {
      throw new ExternalServiceException('Google Auth', error as Error);
    }
  }
}
```

#### `jwt.adapter.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ExternalServiceException } from '../../shared/exceptions/infrastructure.exception';

export interface JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtAdapter {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: { userId: number; email: string }): string {
    try {
      const jwtPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
        sub: payload.userId,
        email: payload.email,
      };

      return this.nestJwtService.sign(jwtPayload);
    } catch (error) {
      throw new ExternalServiceException('JWT Service', error as Error);
    }
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return this.nestJwtService.verify<JwtPayload>(token);
    } catch (error) {
      throw new ExternalServiceException('JWT Service', error as Error);
    }
  }

  generateRefreshToken(payload: { userId: number }): string {
    try {
      const refreshPayload = {
        sub: payload.userId,
        type: 'refresh',
      };

      return this.nestJwtService.sign(refreshPayload, {
        expiresIn: '30d',
      });
    } catch (error) {
      throw new ExternalServiceException('JWT Service', error as Error);
    }
  }

  verifyRefreshToken(token: string): { userId: number } {
    try {
      const payload = this.nestJwtService.verify(token);
      
      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return { userId: payload.sub };
    } catch (error) {
      throw new ExternalServiceException('JWT Service', error as Error);
    }
  }

  getTokenExpirationTime(token: string): Date | null {
    try {
      const payload = this.nestJwtService.decode(token) as JwtPayload;
      return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch (error) {
      return null;
    }
  }
}
```

### 4. 설정 관리 (`src/infrastructure/config/`)

#### `database.config.ts`
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL || 'data/sqlite.db',
  type: 'sqlite',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  migrations: {
    dir: 'src/infrastructure/database/drizzle/migrations',
  },
}));
```

#### `auth.config.ts`
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/auth/google/callback',
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
}));
```

#### `app.config.ts`
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'Polarist Backend',
  version: process.env.APP_VERSION || '1.0.0',
  port: parseInt(process.env.PORT, 10) || 4000,
  environment: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  apiPrefix: process.env.API_PREFIX || '',
}));
```

### 5. Infrastructure Module (`src/infrastructure/infrastructure.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Database
import { DatabaseModule } from './database/database.module';

// Repositories
import { DrizzleUserRepository } from './repositories/user.repository';
import { DrizzleProgressRepository } from './repositories/progress.repository';
import { DrizzleWordbookRepository } from './repositories/wordbook.repository';

// Repository Tokens
import { USER_REPOSITORY } from '../domain/repositories/user.repository.interface';
import { PROGRESS_REPOSITORY } from '../domain/repositories/progress.repository.interface';
import { WORDBOOK_REPOSITORY } from '../domain/repositories/wordbook.repository.interface';

// External Services
import { GoogleAuthAdapter } from './external/google-auth.adapter';
import { JwtAdapter } from './external/jwt.adapter';

// Configurations
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(appConfig),
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'default-secret',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [
    // Repository Implementations
    {
      provide: USER_REPOSITORY,
      useClass: DrizzleUserRepository,
    },
    {
      provide: PROGRESS_REPOSITORY,
      useClass: DrizzleProgressRepository,
    },
    {
      provide: WORDBOOK_REPOSITORY,
      useClass: DrizzleWordbookRepository,
    },

    // External Service Adapters
    GoogleAuthAdapter,
    JwtAdapter,
  ],
  exports: [
    // Repository Tokens
    USER_REPOSITORY,
    PROGRESS_REPOSITORY,
    WORDBOOK_REPOSITORY,

    // External Service Adapters
    GoogleAuthAdapter,
    JwtAdapter,

    // Database Module
    DatabaseModule,
  ],
})
export class InfrastructureModule {}
```

### 6. 헬스 체크 개선 (`src/presentation/controllers/health.controller.ts`)

```typescript
import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../../infrastructure/database/database.service';

@Controller('health')
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
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

  @Get('database')
  async checkDatabase() {
    const isHealthy = await this.databaseService.healthCheck();
    
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      service: 'database',
      timestamp: new Date().toISOString(),
    };
  }
}
```

## 테스트 작성

### Repository 테스트 (`src/infrastructure/repositories/__tests__/`)

#### `user.repository.spec.ts`
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleUserRepository } from '../user.repository';
import { DatabaseService } from '../../database/database.service';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { DatabaseException } from '../../../shared/exceptions/infrastructure.exception';

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

    it('should throw DatabaseException on save error', async () => {
      const user = User.create({
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
      });

      const mockQuery = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockRejectedValue(new Error('Save failed')),
      };

      databaseService.db.insert.mockReturnValue(mockQuery);

      await expect(repository.save(user)).rejects.toThrow(DatabaseException);
    });
  });
});
```

### External Service 테스트 (`src/infrastructure/external/__tests__/`)

#### `google-auth.adapter.spec.ts`
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthAdapter } from '../google-auth.adapter';
import { ExternalServiceException } from '../../../shared/exceptions/infrastructure.exception';

// Mock fetch globally
global.fetch = jest.fn();

describe('GoogleAuthAdapter', () => {
  let adapter: GoogleAuthAdapter;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleAuthAdapter,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    adapter = module.get<GoogleAuthAdapter>(GoogleAuthAdapter);
    configService = module.get(ConfigService);

    jest.clearAllMocks();
  });

  describe('verifyIdToken', () => {
    it('should verify token successfully', async () => {
      const mockTokenInfo = {
        sub: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockTokenInfo),
      });

      const result = await adapter.verifyIdToken('valid-token');

      expect(result).toEqual({
        id: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      });
    });

    it('should throw ExternalServiceException for invalid token', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(adapter.verifyIdToken('invalid-token'))
        .rejects.toThrow(ExternalServiceException);
    });

    it('should throw ExternalServiceException on network error', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(adapter.verifyIdToken('token'))
        .rejects.toThrow(ExternalServiceException);
    });
  });

  describe('validateGoogleUser', () => {
    it('should validate complete user info', () => {
      const userInfo = {
        id: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      };

      const result = adapter.validateGoogleUser(userInfo);

      expect(result).toEqual({
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
      });
    });

    it('should throw ExternalServiceException for incomplete info', () => {
      const incompleteUserInfo = {
        id: 'google-123',
        email: 'test@example.com',
        // missing name
      };

      expect(() => adapter.validateGoogleUser(incompleteUserInfo as any))
        .toThrow(ExternalServiceException);
    });
  });
});
```

## 환경 변수 설정

### `.env.example`
```env
# Database
DATABASE_URL=data/sqlite.db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# App Configuration
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
API_PREFIX=

# Logging
LOG_LEVEL=info

# App Info
APP_NAME=Polarist Backend
APP_VERSION=1.0.0
```

## PR 체크리스트

### Repository 구현
- [ ] 모든 Repository 인터페이스 메서드 구현
- [ ] Entity와 DB 레코드 간 변환 로직 정확성
- [ ] 적절한 예외 처리 (DatabaseException)
- [ ] 트랜잭션 처리 고려

### 외부 서비스 어댑터
- [ ] Google OAuth 토큰 검증 로직 구현
- [ ] JWT 생성/검증 로직 구현
- [ ] 외부 서비스 오류에 대한 적절한 예외 처리
- [ ] 설정값 주입 및 검증

### 데이터베이스 설정
- [ ] Drizzle ORM 설정 정확성
- [ ] 마이그레이션 스크립트 준비
- [ ] 연결 풀 및 성능 설정
- [ ] 헬스 체크 구현

### 테스트 커버리지
- [ ] Repository 메서드 단위 테스트
- [ ] 외부 서비스 어댑터 테스트
- [ ] Mock을 통한 의존성 격리
- [ ] 에러 시나리오 테스트

### 설정 관리
- [ ] 환경별 설정 분리
- [ ] 보안 설정 (JWT secret 등)
- [ ] 설정 검증 로직
- [ ] 기본값 설정

## 다음 단계 준비사항

1. **Controller 리팩토링**: Use Case를 주입받도록 컨트롤러 수정
2. **Integration Test**: 전체 플로우 통합 테스트 작성
3. **Performance Optimization**: 쿼리 최적화 및 캐싱 전략

## 예상 작업 시간

- **Repository 구현**: 2.5일
- **외부 서비스 어댑터**: 1일
- **데이터베이스 설정**: 0.5일
- **설정 관리**: 0.5일
- **단위 테스트 작성**: 2일
- **통합 및 문서화**: 0.5일

**총 예상 시간**: 7일

이 단계를 완료하면 도메인 계층이 실제 데이터베이스 및 외부 서비스와 연결되어 완전한 백엔드 인프라스트럭처가 구축됩니다.