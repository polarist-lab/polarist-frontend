import { Injectable } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { userProgress, studySessions, UserProgress, NewUserProgress, StudySession, NewStudySession } from '../database/schema';

export interface WordProgress {
  wordId: string;
  isLearned: boolean;
  attempts: number;
  correctAnswers: number;
  confidence: number;
  lastStudied: Date | null;
}

export interface StudyStats {
  totalWordsStudied: number;
  totalSessions: number;
  averageAccuracy: number;
  totalStudyTime: number;
  streak: number;
}

@Injectable()
export class ProgressService {
  constructor(private db: DatabaseService) {}

  async getWordProgress(userId: number, wordId: string): Promise<WordProgress | null> {
    const result = await this.db.db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.wordId, wordId)))
      .limit(1);

    if (!result[0]) return null;

    const progress = result[0];
    return {
      wordId: progress.wordId,
      isLearned: progress.isLearned ?? false,
      attempts: progress.attempts ?? 0,
      correctAnswers: progress.correctAnswers ?? 0,
      confidence: progress.confidence ?? 0,
      lastStudied: progress.lastStudied,
    };
  }

  async getUserProgress(userId: number): Promise<WordProgress[]> {
    const results = await this.db.db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.lastStudied));

    return results.map(progress => ({
      wordId: progress.wordId,
      isLearned: progress.isLearned ?? false,
      attempts: progress.attempts ?? 0,
      correctAnswers: progress.correctAnswers ?? 0,
      confidence: progress.confidence ?? 0,
      lastStudied: progress.lastStudied,
    }));
  }

  async updateWordProgress(userId: number, wordId: string, isCorrect: boolean): Promise<WordProgress> {
    const existing = await this.getWordProgress(userId, wordId);

    if (existing) {
      // Update existing progress
      const newAttempts = existing.attempts + 1;
      const newCorrectAnswers = existing.correctAnswers + (isCorrect ? 1 : 0);
      const accuracy = newCorrectAnswers / newAttempts;
      const newConfidence = Math.min(5, Math.floor(accuracy * 5));
      const isLearned = accuracy >= 0.8 && newAttempts >= 3;

      const updated = await this.db.db
        .update(userProgress)
        .set({
          attempts: newAttempts,
          correctAnswers: newCorrectAnswers,
          confidence: newConfidence,
          isLearned,
          lastStudied: new Date(),
          updatedAt: new Date(),
        })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.wordId, wordId)))
        .returning();

      return {
        wordId: updated[0].wordId,
        isLearned: updated[0].isLearned ?? false,
        attempts: updated[0].attempts ?? 0,
        correctAnswers: updated[0].correctAnswers ?? 0,
        confidence: updated[0].confidence ?? 0,
        lastStudied: updated[0].lastStudied,
      };
    } else {
      // Create new progress entry
      const newProgress: NewUserProgress = {
        userId,
        wordId,
        attempts: 1,
        correctAnswers: isCorrect ? 1 : 0,
        confidence: isCorrect ? 1 : 0,
        isLearned: false,
        lastStudied: new Date(),
      };

      const created = await this.db.db
        .insert(userProgress)
        .values(newProgress)
        .returning();

      return {
        wordId: created[0].wordId,
        isLearned: created[0].isLearned ?? false,
        attempts: created[0].attempts ?? 0,
        correctAnswers: created[0].correctAnswers ?? 0,
        confidence: created[0].confidence ?? 0,
        lastStudied: created[0].lastStudied,
      };
    }
  }

  async startStudySession(userId: number): Promise<string> {
    const sessionId = `session_${userId}_${Date.now()}`;
    
    const newSession: NewStudySession = {
      userId,
      sessionId,
      wordsStudied: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      startTime: new Date(),
    };

    await this.db.db.insert(studySessions).values(newSession);
    return sessionId;
  }

  async endStudySession(sessionId: string, duration: number, metadata?: any): Promise<StudySession> {
    const updated = await this.db.db
      .update(studySessions)
      .set({
        duration,
        endTime: new Date(),
        metadata: metadata ? JSON.stringify(metadata) : null,
      })
      .where(eq(studySessions.sessionId, sessionId))
      .returning();

    return updated[0];
  }

  async updateSessionProgress(sessionId: string, wordsStudied: number, correctAnswers: number, totalAttempts: number): Promise<void> {
    await this.db.db
      .update(studySessions)
      .set({
        wordsStudied,
        correctAnswers,
        totalAttempts,
      })
      .where(eq(studySessions.sessionId, sessionId));
  }

  async getStudyStats(userId: number): Promise<StudyStats> {
    // Get user progress
    const progressResults = await this.db.db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    // Get study sessions
    const sessionResults = await this.db.db
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

    // Calculate streak (consecutive days with study sessions)
    let streak = 0;
    const today = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    for (let i = 0; i < sessionResults.length; i++) {
      const sessionDate = new Date(sessionResults[i].createdAt);
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / oneDayMs);
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }

    return {
      totalWordsStudied,
      totalSessions,
      averageAccuracy,
      totalStudyTime,
      streak,
    };
  }

  async getLearnedWords(userId: number): Promise<string[]> {
    const results = await this.db.db
      .select({ wordId: userProgress.wordId })
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.isLearned, true)));

    return results.map(r => r.wordId);
  }

  async resetWordProgress(userId: number, wordId: string): Promise<void> {
    await this.db.db
      .delete(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.wordId, wordId)));
  }
}