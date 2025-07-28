/**
 * 자연스러운 가입 유도 시스템
 * 사용자의 학습 진행 상황에 따라 적절한 타이밍에 가입을 제안
 */

import { TierSystemManager } from './tier-system';

export interface UserLearningProgress {
  lessonsCompleted: number;
  timeSpent: number; // 분 단위
  daysActive: number;
  streakDays: number;
  contentTypesExplored: string[];
  lastActivity: Date;
  roadmapSelected?: string;
  achievementsUnlocked: number;
}

export interface SignupPrompt {
  id: string;
  type: 'progress_save' | 'recommendation' | 'community' | 'achievement' | 'streak';
  title: string;
  message: string;
  benefits: string[];
  urgency: 'low' | 'medium' | 'high';
  showAfterDays?: number;
  triggers: {
    minLessons?: number;
    minTimeSpent?: number;
    minStreakDays?: number;
    contentTypes?: string[];
    achievements?: number;
  };
}

const SIGNUP_PROMPTS: SignupPrompt[] = [
  {
    id: 'first_lesson_complete',
    type: 'progress_save',
    title: '첫 레슨을 완료하셨네요! 🎉',
    message: '진도를 저장하고 이어서 학습해보세요',
    benefits: [
      '학습 진도 자동 저장',
      '중단한 곳부터 이어서 학습',
      '개인별 맞춤 추천'
    ],
    urgency: 'medium',
    triggers: {
      minLessons: 1
    }
  },
  {
    id: 'multiple_lessons',
    type: 'recommendation',
    title: '꾸준히 학습하고 계시는군요! 📚',
    message: '이제 맞춤형 추천을 받아보세요',
    benefits: [
      '실력에 맞는 콘텐츠 추천',
      '취약 부분 집중 학습 제안',
      '학습 계획 자동 생성'
    ],
    urgency: 'medium',
    triggers: {
      minLessons: 5,
      minTimeSpent: 30
    }
  },
  {
    id: 'daily_streak',
    type: 'streak',
    title: '3일 연속 학습하셨어요! 🔥',
    message: '학습 스트릭을 저장하고 동기를 유지하세요',
    benefits: [
      '연속 학습일 기록 보존',
      '스트릭 달성 배지 획득',
      '동기 부여 알림 설정'
    ],
    urgency: 'high',
    triggers: {
      minStreakDays: 3
    }
  },
  {
    id: 'community_invite',
    type: 'community',
    title: '다른 학습자들과 만나보세요! 👥',
    message: '궁금한 점을 질문하고 학습 팁을 공유해보세요',
    benefits: [
      '커뮤니티 질문하기',
      '학습 후기 공유',
      '스터디 그룹 참여'
    ],
    urgency: 'low',
    showAfterDays: 7,
    triggers: {
      minLessons: 10,
      minTimeSpent: 60
    }
  },
  {
    id: 'achievement_unlock',
    type: 'achievement',
    title: '배지를 획득할 준비가 되었어요! 🏆',
    message: '성취도를 기록하고 목표를 설정해보세요',
    benefits: [
      '학습 성취도 배지 획득',
      '목표 설정 및 추적',
      '학습 통계 상세 분석'
    ],
    urgency: 'medium',
    triggers: {
      minLessons: 15,
      achievements: 1
    }
  },
  {
    id: 'diverse_learning',
    type: 'recommendation',
    title: '다양한 콘텐츠를 탐색하고 계시는군요! 🎯',
    message: '학습 패턴을 분석해서 최적의 경로를 추천드릴게요',
    benefits: [
      '학습 패턴 AI 분석',
      '개인화된 학습 경로',
      '효율적인 복습 스케줄'
    ],
    urgency: 'medium',
    triggers: {
      contentTypes: ['wordbook', 'sentence', 'grammar']
    }
  }
];

const STORAGE_KEY = 'polarist_learning_progress';
const PROMPT_HISTORY_KEY = 'polarist_prompt_history';

export class NaturalSignupManager {
  
  /**
   * 학습 진행 상황 업데이트
   */
  static updateProgress(
    lessonsCompleted: number = 0,
    timeSpent: number = 0,
    contentType?: string
  ): void {
    if (typeof window === 'undefined') return;

    const currentProgress = this.getProgress();
    const today = new Date().toDateString();
    const lastActivityDate = currentProgress.lastActivity?.toDateString();
    
    // 연속 학습일 계산
    let streakDays = currentProgress.streakDays;
    let daysActive = currentProgress.daysActive;
    
    if (lastActivityDate !== today) {
      daysActive++;
      
      // 어제였다면 스트릭 유지, 아니면 초기화
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActivityDate === yesterday.toDateString()) {
        streakDays++;
      } else if (lastActivityDate !== today) {
        streakDays = 1; // 새로운 스트릭 시작
      }
    }

    const updatedProgress: UserLearningProgress = {
      ...currentProgress,
      lessonsCompleted: currentProgress.lessonsCompleted + lessonsCompleted,
      timeSpent: currentProgress.timeSpent + timeSpent,
      daysActive,
      streakDays,
      contentTypesExplored: contentType && !currentProgress.contentTypesExplored.includes(contentType)
        ? [...currentProgress.contentTypesExplored, contentType]
        : currentProgress.contentTypesExplored,
      lastActivity: new Date()
    };

    this.saveProgress(updatedProgress);

    // 티어 시스템에 포인트 추가
    const pointsEarned = lessonsCompleted * 50 + Math.floor(timeSpent / 5) * 10; // 레슨당 50점, 5분당 10점
    if (pointsEarned > 0) {
      TierSystemManager.addPoints(pointsEarned);
    }
  }

  /**
   * 로드맵 선택 기록
   */
  static setRoadmap(roadmapId: string): void {
    const currentProgress = this.getProgress();
    this.saveProgress({
      ...currentProgress,
      roadmapSelected: roadmapId
    });
  }

  /**
   * 성취도 증가
   */
  static incrementAchievements(): void {
    const currentProgress = this.getProgress();
    this.saveProgress({
      ...currentProgress,
      achievementsUnlocked: currentProgress.achievementsUnlocked + 1
    });
  }

  /**
   * 가입 제안이 필요한지 확인
   */
  static shouldShowSignupPrompt(): SignupPrompt | null {
    if (typeof window === 'undefined') return null;

    const progress = this.getProgress();
    const promptHistory = this.getPromptHistory();
    const daysSinceFirstUse = this.getDaysSinceFirstUse();

    // 이미 가입했으면 제안하지 않음
    if (this.isSignedUp()) return null;

    for (const prompt of SIGNUP_PROMPTS) {
      // 이미 보여준 프롬프트는 다시 보여주지 않음
      if (promptHistory.includes(prompt.id)) continue;

      // 날짜 조건 확인
      if (prompt.showAfterDays && daysSinceFirstUse < prompt.showAfterDays) continue;

      // 트리거 조건 확인
      if (this.checkTriggers(prompt.triggers, progress)) {
        this.markPromptShown(prompt.id);
        return prompt;
      }
    }

    return null;
  }

  /**
   * 가입 상태 확인
   */
  static isSignedUp(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('user_signed_up') === 'true';
  }

  /**
   * 가입 완료 표시
   */
  static markAsSignedUp(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user_signed_up', 'true');
  }

  /**
   * 현재 학습 진행 상황 가져오기
   */
  static getProgress(): UserLearningProgress {
    if (typeof window === 'undefined') {
      return this.getDefaultProgress();
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...this.getDefaultProgress(),
          ...parsed,
          lastActivity: parsed.lastActivity ? new Date(parsed.lastActivity) : new Date()
        };
      }
    } catch (error) {
      console.warn('Failed to parse learning progress:', error);
    }

    return this.getDefaultProgress();
  }

  /**
   * 학습 통계 요약
   */
  static getProgressSummary(): {
    totalLessons: number;
    totalHours: number;
    streakDays: number;
    contentTypes: number;
    level: string;
  } {
    const progress = this.getProgress();
    return {
      totalLessons: progress.lessonsCompleted,
      totalHours: Math.round(progress.timeSpent / 60 * 10) / 10,
      streakDays: progress.streakDays,
      contentTypes: progress.contentTypesExplored.length,
      level: this.calculateLevel(progress)
    };
  }

  // === Private Methods ===

  private static getDefaultProgress(): UserLearningProgress {
    return {
      lessonsCompleted: 0,
      timeSpent: 0,
      daysActive: 0,
      streakDays: 0,
      contentTypesExplored: [],
      lastActivity: new Date(),
      achievementsUnlocked: 0
    };
  }

  private static saveProgress(progress: UserLearningProgress): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save learning progress:', error);
    }
  }

  private static checkTriggers(triggers: SignupPrompt['triggers'], progress: UserLearningProgress): boolean {
    if (triggers.minLessons && progress.lessonsCompleted < triggers.minLessons) {
      return false;
    }

    if (triggers.minTimeSpent && progress.timeSpent < triggers.minTimeSpent) {
      return false;
    }

    if (triggers.minStreakDays && progress.streakDays < triggers.minStreakDays) {
      return false;
    }

    if (triggers.achievements && progress.achievementsUnlocked < triggers.achievements) {
      return false;
    }

    if (triggers.contentTypes) {
      const hasAllTypes = triggers.contentTypes.every(type => 
        progress.contentTypesExplored.includes(type)
      );
      if (!hasAllTypes) return false;
    }

    return true;
  }

  private static getPromptHistory(): string[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(PROMPT_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to parse prompt history:', error);
      return [];
    }
  }

  private static markPromptShown(promptId: string): void {
    if (typeof window === 'undefined') return;

    const history = this.getPromptHistory();
    if (!history.includes(promptId)) {
      history.push(promptId);
      localStorage.setItem(PROMPT_HISTORY_KEY, JSON.stringify(history));
    }
  }

  private static getDaysSinceFirstUse(): number {
    const progress = this.getProgress();
    if (!progress.lastActivity) return 0;

    const firstUse = new Date(progress.lastActivity);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - firstUse.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private static calculateLevel(progress: UserLearningProgress): string {
    const { lessonsCompleted, timeSpent, daysActive } = progress;
    const score = lessonsCompleted * 2 + Math.floor(timeSpent / 30) + daysActive * 3;

    if (score < 10) return '입문자';
    if (score < 30) return '초급자';
    if (score < 60) return '중급자';
    return '고급자';
  }

  /**
   * 테스트용 데이터 초기화
   */
  static resetProgress(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROMPT_HISTORY_KEY);
    localStorage.removeItem('user_signed_up');
  }
}