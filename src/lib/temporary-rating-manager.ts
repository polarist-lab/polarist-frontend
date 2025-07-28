/**
 * 임시 레이팅 관리 시스템
 * 사용자의 진단 결과를 임시 레이팅으로 관리하고, 재평가 및 히스토리를 추적
 */

import { AssessmentResult } from './enhanced-level-assessment';

export interface TemporaryRating {
  id: string;
  result: AssessmentResult;
  createdAt: Date;
  isActive: boolean; // 현재 활성 레이팅인지
  learningProgress?: {
    lessonsCompleted: number;
    timeSpent: number; // 분 단위
    lastActivity: Date;
  };
}

export interface RatingHistory {
  ratings: TemporaryRating[];
  totalAssessments: number;
  lastAssessmentDate?: Date;
  improvementTrend?: 'improving' | 'stable' | 'declining';
}

const RATING_STORAGE_KEY = 'polarist_temporary_ratings';
const MIN_REASSESSMENT_INTERVAL = 24 * 60 * 60 * 1000; // 24시간 (밀리초)

export class TemporaryRatingManager {
  
  /**
   * 새로운 임시 레이팅 저장
   */
  static saveRating(result: AssessmentResult): string {
    const ratingId = this.generateRatingId();
    const newRating: TemporaryRating = {
      id: ratingId,
      result: {
        ...result,
        isTemporary: true
      },
      createdAt: new Date(),
      isActive: true
    };

    const history = this.getRatingHistory();
    
    // 기존 활성 레이팅 비활성화
    history.ratings.forEach(rating => {
      rating.isActive = false;
    });

    // 새 레이팅 추가
    history.ratings.unshift(newRating);
    history.totalAssessments++;
    history.lastAssessmentDate = new Date();

    // 최대 10개 레이팅만 보관
    if (history.ratings.length > 10) {
      history.ratings = history.ratings.slice(0, 10);
    }

    // 개선 추세 계산
    history.improvementTrend = this.calculateImprovementTrend(history.ratings);

    this.saveRatingHistory(history);
    return ratingId;
  }

  /**
   * 현재 활성 레이팅 가져오기
   */
  static getCurrentRating(): TemporaryRating | null {
    const history = this.getRatingHistory();
    return history.ratings.find(rating => rating.isActive) || null;
  }

  /**
   * 레이팅 히스토리 가져오기
   */
  static getRatingHistory(): RatingHistory {
    if (typeof window === 'undefined') {
      return { ratings: [], totalAssessments: 0 };
    }

    try {
      const stored = localStorage.getItem(RATING_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Date 객체 복원
        parsed.ratings = parsed.ratings.map((rating: any) => ({
          ...rating,
          createdAt: new Date(rating.createdAt),
          result: {
            ...rating.result,
            completedAt: new Date(rating.result.completedAt)
          },
          learningProgress: rating.learningProgress ? {
            ...rating.learningProgress,
            lastActivity: new Date(rating.learningProgress.lastActivity)
          } : undefined
        }));
        
        if (parsed.lastAssessmentDate) {
          parsed.lastAssessmentDate = new Date(parsed.lastAssessmentDate);
        }
        
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to parse rating history:', error);
    }

    return { ratings: [], totalAssessments: 0 };
  }

  /**
   * 재평가 가능 여부 확인
   */
  static canReassess(): { allowed: boolean; reason?: string; nextAllowedTime?: Date } {
    const currentRating = this.getCurrentRating();
    if (!currentRating) {
      return { allowed: true };
    }

    const timeSinceLastAssessment = Date.now() - currentRating.createdAt.getTime();
    if (timeSinceLastAssessment < MIN_REASSESSMENT_INTERVAL) {
      const nextAllowedTime = new Date(currentRating.createdAt.getTime() + MIN_REASSESSMENT_INTERVAL);
      return {
        allowed: false,
        reason: '재평가는 24시간 후에 가능합니다',
        nextAllowedTime
      };
    }

    return { allowed: true };
  }

  /**
   * 학습 진도 업데이트
   */
  static updateLearningProgress(lessonsCompleted: number, timeSpent: number): void {
    const history = this.getRatingHistory();
    const activeRating = history.ratings.find(rating => rating.isActive);
    
    if (activeRating) {
      if (!activeRating.learningProgress) {
        activeRating.learningProgress = {
          lessonsCompleted: 0,
          timeSpent: 0,
          lastActivity: new Date()
        };
      }

      activeRating.learningProgress.lessonsCompleted += lessonsCompleted;
      activeRating.learningProgress.timeSpent += timeSpent;
      activeRating.learningProgress.lastActivity = new Date();

      this.saveRatingHistory(history);
    }
  }

  /**
   * 자동 재평가 제안 여부 확인
   */
  static shouldSuggestReassessment(): { suggest: boolean; reason?: string } {
    const currentRating = this.getCurrentRating();
    if (!currentRating || !currentRating.learningProgress) {
      return { suggest: false };
    }

    const { lessonsCompleted, timeSpent } = currentRating.learningProgress;
    const daysSinceAssessment = (Date.now() - currentRating.createdAt.getTime()) / (24 * 60 * 60 * 1000);

    // 제안 조건들
    if (lessonsCompleted >= 20) {
      return { 
        suggest: true, 
        reason: '20개 이상의 레슨을 완료하셨네요! 실력이 향상되었을 수 있습니다.' 
      };
    }

    if (timeSpent >= 300) { // 5시간
      return { 
        suggest: true, 
        reason: '5시간 이상 학습하셨네요! 레벨 재측정을 권장합니다.' 
      };
    }

    if (daysSinceAssessment >= 30) {
      return { 
        suggest: true, 
        reason: '한 달이 지났습니다. 현재 실력을 다시 확인해보세요!' 
      };
    }

    return { suggest: false };
  }

  /**
   * 레이팅 비교 분석
   */
  static compareRatings(ratingId1: string, ratingId2: string): {
    overallImprovement: number;
    skillImprovements: Record<string, number>;
    summary: string;
  } | null {
    const history = this.getRatingHistory();
    const rating1 = history.ratings.find(r => r.id === ratingId1);
    const rating2 = history.ratings.find(r => r.id === ratingId2);

    if (!rating1 || !rating2) return null;

    const overallImprovement = rating2.result.overallScore - rating1.result.overallScore;
    
    const skillImprovements: Record<string, number> = {};
    Object.keys(rating1.result.skillScores).forEach(skill => {
      skillImprovements[skill] = rating2.result.skillScores[skill as keyof typeof rating2.result.skillScores] - 
                                rating1.result.skillScores[skill as keyof typeof rating1.result.skillScores];
    });

    let summary: string;
    if (overallImprovement > 10) {
      summary = '상당한 향상을 보이고 있습니다! 🎉';
    } else if (overallImprovement > 5) {
      summary = '꾸준히 실력이 늘고 있어요! 📈';
    } else if (overallImprovement > -5) {
      summary = '현재 수준을 잘 유지하고 있습니다. ✅';
    } else {
      summary = '다시 한번 체크해보시는 것이 좋겠어요. 🔄';
    }

    return {
      overallImprovement,
      skillImprovements,
      summary
    };
  }

  /**
   * 임시 레이팅 초기화 (테스트용)
   */
  static clearAllRatings(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(RATING_STORAGE_KEY);
  }

  /**
   * 특정 레이팅을 활성화
   */
  static activateRating(ratingId: string): boolean {
    const history = this.getRatingHistory();
    const targetRating = history.ratings.find(r => r.id === ratingId);
    
    if (!targetRating) return false;

    // 모든 레이팅 비활성화
    history.ratings.forEach(rating => {
      rating.isActive = false;
    });

    // 대상 레이팅 활성화
    targetRating.isActive = true;

    this.saveRatingHistory(history);
    return true;
  }

  // === Private Methods ===

  private static generateRatingId(): string {
    return `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static saveRatingHistory(history: RatingHistory): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save rating history:', error);
    }
  }

  private static calculateImprovementTrend(ratings: TemporaryRating[]): 'improving' | 'stable' | 'declining' {
    if (ratings.length < 2) return 'stable';

    const recentRatings = ratings.slice(0, 3).reverse(); // 최신 3개를 시간순으로
    let improvementSum = 0;
    let comparisons = 0;

    for (let i = 1; i < recentRatings.length; i++) {
      const improvement = recentRatings[i].result.overallScore - recentRatings[i-1].result.overallScore;
      improvementSum += improvement;
      comparisons++;
    }

    if (comparisons === 0) return 'stable';

    const averageImprovement = improvementSum / comparisons;
    
    if (averageImprovement > 5) return 'improving';
    if (averageImprovement < -5) return 'declining';
    return 'stable';
  }

  /**
   * 레벨 배지 정보 가져오기
   */
  static getLevelBadgeInfo(level: string): { icon: string; color: string; name: string; description: string } {
    const badges = {
      'absolute-beginner': {
        icon: '🌱',
        color: 'bg-green-500',
        name: '새싹',
        description: '한국어 여정을 시작하셨네요!'
      },
      'beginner': {
        icon: '🌿',
        color: 'bg-green-600',
        name: '기초',
        description: '기본기를 잘 다지고 계세요!'
      },
      'intermediate': {
        icon: '🌳',
        color: 'bg-blue-500',
        name: '중급',
        description: '실력이 많이 늘었어요!'
      },
      'upper-intermediate': {
        icon: '🏔️',
        color: 'bg-blue-600',
        name: '중상급',
        description: '고급 단계가 보이네요!'
      },
      'advanced': {
        icon: '🏆',
        color: 'bg-purple-600',
        name: '고급',
        description: '훌륭한 실력이에요!'
      },
      'expert': {
        icon: '👑',
        color: 'bg-yellow-500',
        name: '전문가',
        description: '완벽한 한국어 실력!'
      }
    };

    return badges[level as keyof typeof badges] || badges['beginner'];
  }

  /**
   * 다음 레벨까지의 진행률 계산
   */
  static getProgressToNextLevel(currentScore: number): { nextLevel: string; progressPercent: number; pointsNeeded: number } {
    const levelThresholds = [
      { level: 'absolute-beginner', min: 0, max: 24 },
      { level: 'beginner', min: 25, max: 44 },
      { level: 'intermediate', min: 45, max: 59 },
      { level: 'upper-intermediate', min: 60, max: 74 },
      { level: 'advanced', min: 75, max: 89 },
      { level: 'expert', min: 90, max: 100 }
    ];

    const currentThreshold = levelThresholds.find(t => currentScore >= t.min && currentScore <= t.max);
    if (!currentThreshold) {
      return { nextLevel: 'expert', progressPercent: 100, pointsNeeded: 0 };
    }

    const currentIndex = levelThresholds.indexOf(currentThreshold);
    const nextThreshold = levelThresholds[currentIndex + 1];
    
    if (!nextThreshold) {
      return { nextLevel: 'expert', progressPercent: 100, pointsNeeded: 0 };
    }

    const progressPercent = Math.round(((currentScore - currentThreshold.min) / (currentThreshold.max - currentThreshold.min)) * 100);
    const pointsNeeded = nextThreshold.min - currentScore;

    return {
      nextLevel: nextThreshold.level,
      progressPercent,
      pointsNeeded
    };
  }
}