import { LearningProgress, StudySession, ContentType, LearningContent } from './types';

export interface StudyAction {
  contentId: string;
  contentType: ContentType;
  itemId: number; // wordId or sentenceId
  action: 'view' | 'flip' | 'toggle_mode' | 'complete' | 'skip';
  timestamp: Date;
  mode?: 'korean-only' | 'full-info' | 'grammar-focus';
}

// 콘텐츠별 진도 추적
export interface ContentProgress {
  contentId: string;
  contentType: ContentType;
  isCompleted: boolean;
  completedAt?: Date;
  startedAt: Date;
  lastAccessedAt: Date;
  totalTimeSpent: number; // 분
  itemsCompleted: number;
  totalItems: number;
  completionPercentage: number;
}

export interface TestResult {
  wordId: number;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  timestamp: Date;
  timeSpent: number; // milliseconds
}

// Learning progress management
export class LearningTracker {
  private static PROGRESS_KEY = 'polarist-learning-progress';
  private static SESSIONS_KEY = 'polarist-study-sessions';
  private static ACTIONS_KEY = 'polarist-study-actions';
  private static CONTENT_PROGRESS_KEY = 'polarist-content-progress';

  // Get current learning progress for all words
  static getLearningProgress(): LearningProgress[] {
    if (typeof window === 'undefined') return []; // 서버 사이드에서는 빈 배열 반환
    const saved = localStorage.getItem(this.PROGRESS_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  // Get progress for a specific word
  static getWordProgress(wordId: number): LearningProgress | null {
    const allProgress = this.getLearningProgress();
    return allProgress.find(p => p.wordId === wordId) || null;
  }

  // Update progress for a specific word
  static updateWordProgress(wordId: number, updates: Partial<LearningProgress>): void {
    const allProgress = this.getLearningProgress();
    const existingIndex = allProgress.findIndex(p => p.wordId === wordId);
    
    if (existingIndex >= 0) {
      // Update existing progress
      allProgress[existingIndex] = {
        ...allProgress[existingIndex],
        ...updates,
        lastStudied: new Date()
      };
    } else {
      // Create new progress entry
      const newProgress: LearningProgress = {
        wordId,
        isLearned: false,
        attempts: 0,
        lastStudied: new Date(),
        confidence: 1,
        ...updates
      };
      allProgress.push(newProgress);
    }
    
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(allProgress));
  }

  // Record study action (card view, flip, etc.)
  static recordStudyAction(action: StudyAction): void {
    const actions = this.getStudyActions();
    actions.push(action);
    
    // Keep only last 1000 actions to prevent localStorage bloat
    if (actions.length > 1000) {
      actions.splice(0, actions.length - 1000);
    }
    
    localStorage.setItem(this.ACTIONS_KEY, JSON.stringify(actions));
    
    // Update word progress based on action
    this.updateProgressFromAction(action);
  }

  // Record test result and update learning progress
  static recordTestResult(result: TestResult): void {
    const currentProgress = this.getWordProgress(result.wordId);
    const newAttempts = (currentProgress?.attempts || 0) + 1;
    
    let newConfidence = currentProgress?.confidence || 1;
    if (result.isCorrect) {
      newConfidence = Math.min(5, newConfidence + 0.5);
    } else {
      newConfidence = Math.max(1, newConfidence - 0.3);
    }
    
    // Consider a word "learned" if confidence >= 3 and at least 3 correct attempts
    const correctAttempts = this.getCorrectAttempts(result.wordId) + (result.isCorrect ? 1 : 0);
    const isLearned = newConfidence >= 3 && correctAttempts >= 3;
    
    this.updateWordProgress(result.wordId, {
      attempts: newAttempts,
      confidence: newConfidence,
      isLearned
    });
  }

  // Get study actions
  static getStudyActions(): StudyAction[] {
    const saved = localStorage.getItem(this.ACTIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  // Get number of correct test attempts for a word
  private static getCorrectAttempts(wordId: number): number {
    // This would ideally come from stored test results
    // For now, we'll estimate based on confidence
    const progress = this.getWordProgress(wordId);
    return progress ? Math.floor(progress.confidence) : 0;
  }

  // Update progress based on study action
  private static updateProgressFromAction(action: StudyAction): void {
    const currentProgress = this.getWordProgress(action.wordId);
    
    // Increment attempts for meaningful interactions
    if (action.action === 'flip' || action.action === 'toggle_mode') {
      const newAttempts = (currentProgress?.attempts || 0) + 1;
      const currentConfidence = currentProgress?.confidence || 1;
      
      // Slight confidence boost for studying (smaller than test success)
      const newConfidence = Math.min(5, currentConfidence + 0.1);
      
      this.updateWordProgress(action.wordId, {
        attempts: newAttempts,
        confidence: newConfidence
      });
    }
  }

  // Get study statistics
  static getStudyStats() {
    const progress = this.getLearningProgress();
    const actions = this.getStudyActions();
    
    const totalWords = 100; // Korean words count
    const studiedWords = progress.length;
    const learnedWords = progress.filter(p => p.isLearned).length;
    const averageConfidence = progress.length > 0 
      ? progress.reduce((sum, p) => sum + p.confidence, 0) / progress.length 
      : 0;
    
    // Recent activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentActions = actions.filter(a => new Date(a.timestamp) > weekAgo);
    
    return {
      totalWords,
      studiedWords,
      learnedWords,
      progressPercentage: Math.round((learnedWords / totalWords) * 100),
      averageConfidence: Math.round(averageConfidence * 10) / 10,
      recentActivityCount: recentActions.length,
      lastStudied: progress.length > 0 
        ? new Date(Math.max(...progress.map(p => new Date(p.lastStudied).getTime())))
        : null
    };
  }

  // Get category-wise progress
  static getCategoryProgress(words: { id: number; category: string }[]) {
    const progress = this.getLearningProgress();
    const progressMap = new Map(progress.map(p => [p.wordId, p]));
    
    const categoryStats: Record<string, { total: number; learned: number; studied: number }> = {};
    
    words.forEach(word => {
      if (!categoryStats[word.category]) {
        categoryStats[word.category] = { total: 0, learned: 0, studied: 0 };
      }
      
      categoryStats[word.category].total++;
      
      const wordProgress = progressMap.get(word.id);
      if (wordProgress) {
        categoryStats[word.category].studied++;
        if (wordProgress.isLearned) {
          categoryStats[word.category].learned++;
        }
      }
    });
    
    return categoryStats;
  }

  // Get difficulty-wise progress
  static getDifficultyProgress(words: { id: number; difficulty: string }[]) {
    const progress = this.getLearningProgress();
    const progressMap = new Map(progress.map(p => [p.wordId, p]));
    
    const difficultyStats: Record<string, { total: number; learned: number; studied: number }> = {};
    
    words.forEach(word => {
      if (!difficultyStats[word.difficulty]) {
        difficultyStats[word.difficulty] = { total: 0, learned: 0, studied: 0 };
      }
      
      difficultyStats[word.difficulty].total++;
      
      const wordProgress = progressMap.get(word.id);
      if (wordProgress) {
        difficultyStats[word.difficulty].studied++;
        if (wordProgress.isLearned) {
          difficultyStats[word.difficulty].learned++;
        }
      }
    });
    
    return difficultyStats;
  }

  // === 새로운 콘텐츠 추적 메서드들 ===
  
  // 콘텐츠 진도 조회
  static getContentProgress(): ContentProgress[] {
    if (typeof window === 'undefined') return []; // 서버 사이드에서는 빈 배열 반환
    const saved = localStorage.getItem(this.CONTENT_PROGRESS_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  // 특정 콘텐츠 진도 조회
  static getContentProgressById(contentId: string): ContentProgress | null {
    const allProgress = this.getContentProgress();
    return allProgress.find(p => p.contentId === contentId) || null;
  }

  // 콘텐츠 진도 업데이트
  static updateContentProgress(contentId: string, updates: Partial<ContentProgress>): void {
    const allProgress = this.getContentProgress();
    const existingIndex = allProgress.findIndex(p => p.contentId === contentId);
    
    if (existingIndex >= 0) {
      allProgress[existingIndex] = { ...allProgress[existingIndex], ...updates };
    } else {
      const newProgress: ContentProgress = {
        contentId,
        contentType: updates.contentType || 'wordbook',
        isCompleted: false,
        startedAt: new Date(),
        lastAccessedAt: new Date(),
        totalTimeSpent: 0,
        itemsCompleted: 0,
        totalItems: 0,
        completionPercentage: 0,
        ...updates
      };
      allProgress.push(newProgress);
    }
    
    localStorage.setItem(this.CONTENT_PROGRESS_KEY, JSON.stringify(allProgress));
  }

  // 콘텐츠 완료 상태 확인
  static isContentCompleted(contentId: string): boolean {
    const progress = this.getContentProgressById(contentId);
    return progress?.isCompleted || false;
  }

  // 콘텐츠 시작
  static startContent(contentId: string, contentType: ContentType, totalItems: number): void {
    const existing = this.getContentProgressById(contentId);
    if (!existing) {
      this.updateContentProgress(contentId, {
        contentType,
        totalItems,
        startedAt: new Date(),
        lastAccessedAt: new Date()
      });
    } else {
      this.updateContentProgress(contentId, {
        lastAccessedAt: new Date()
      });
    }
  }

  // 콘텐츠 아이템 완료 처리
  static completeContentItem(contentId: string): void {
    const progress = this.getContentProgressById(contentId);
    if (progress) {
      const newItemsCompleted = progress.itemsCompleted + 1;
      const newCompletionPercentage = Math.round((newItemsCompleted / progress.totalItems) * 100);
      const isCompleted = newCompletionPercentage >= 100;
      
      this.updateContentProgress(contentId, {
        itemsCompleted: newItemsCompleted,
        completionPercentage: newCompletionPercentage,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
        lastAccessedAt: new Date()
      });
    }
  }

  // 필터링된 콘텐츠 조회 (완료 상태 기반)
  static getFilteredContent(contentIds: string[], filter: { excludeCompleted?: boolean; onlyCompleted?: boolean } = {}): string[] {
    if (!filter.excludeCompleted && !filter.onlyCompleted) {
      return contentIds;
    }

    const progress = this.getContentProgress();
    const progressMap = new Map(progress.map(p => [p.contentId, p]));

    return contentIds.filter(contentId => {
      const contentProgress = progressMap.get(contentId);
      const isCompleted = contentProgress?.isCompleted || false;

      if (filter.excludeCompleted && isCompleted) {
        return false;
      }
      if (filter.onlyCompleted && !isCompleted) {
        return false;
      }
      return true;
    });
  }

  // 학습 통계 (콘텐츠별)
  static getContentStats() {
    const progress = this.getContentProgress();
    const totalContent = progress.length;
    const completedContent = progress.filter(p => p.isCompleted).length;
    const inProgressContent = progress.filter(p => !p.isCompleted && p.itemsCompleted > 0).length;
    
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.totalTimeSpent, 0);
    const averageCompletion = totalContent > 0 
      ? progress.reduce((sum, p) => sum + p.completionPercentage, 0) / totalContent 
      : 0;

    return {
      totalContent,
      completedContent,
      inProgressContent,
      notStartedContent: Math.max(0, totalContent - completedContent - inProgressContent),
      totalTimeSpent,
      averageCompletion: Math.round(averageCompletion)
    };
  }

  // Clear all data (for testing/reset)
  static clearAllData(): void {
    localStorage.removeItem(this.PROGRESS_KEY);
    localStorage.removeItem(this.SESSIONS_KEY);
    localStorage.removeItem(this.ACTIONS_KEY);
    localStorage.removeItem(this.CONTENT_PROGRESS_KEY);
  }
}