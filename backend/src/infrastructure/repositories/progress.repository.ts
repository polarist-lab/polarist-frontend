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