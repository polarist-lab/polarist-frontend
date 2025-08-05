import { WordProgress } from '../entities/word-progress.entity';
import { StudySession } from '../entities/study-session.entity';
import { WordId } from '../value-objects/word-id.vo';

export interface ProgressRepository {
  // Word Progress
  findWordProgress(userId: number, wordId: WordId): Promise<WordProgress | null>;
  findUserProgress(userId: number): Promise<WordProgress[]>;
  findProgressByIds(userId: number, wordIds: WordId[]): Promise<WordProgress[]>;
  saveWordProgress(progress: WordProgress): Promise<WordProgress>;
  updateWordProgress(progress: WordProgress): Promise<WordProgress>;
  deleteWordProgress(userId: number, wordId: WordId): Promise<void>;
  
  // Study Sessions
  findActiveSession(userId: number): Promise<StudySession | null>;
  findSessionById(sessionId: string): Promise<StudySession | null>;
  findUserSessions(userId: number, limit?: number): Promise<StudySession[]>;
  saveStudySession(session: StudySession): Promise<StudySession>;
  updateStudySession(session: StudySession): Promise<StudySession>;
  
  // Analytics
  getUserStats(userId: number): Promise<{
    totalWordsStudied: number;
    totalSessions: number;
    averageAccuracy: number;
    totalStudyTime: number;
    streak: number;
  }>;
  getLearnedWords(userId: number): Promise<WordId[]>;
}

export const PROGRESS_REPOSITORY = Symbol('PROGRESS_REPOSITORY');