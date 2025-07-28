/**
 * 한국어 학습 티어 시스템
 * Iron -> Bronze -> Silver -> Gold -> Platinum -> Diamond
 * 각 티어당 5개 서브레벨 (5, 4, 3, 2, 1)
 */

export type TierName = 'iron' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type SubLevel = 5 | 4 | 3 | 2 | 1;

export interface TierInfo {
  name: TierName;
  displayName: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  topikLevel?: string;
  requiredPoints: number;
  promotionRequirements: {
    minLessons: number;
    minTestScore: number;
    requiredSkills: string[];
  };
}

export interface UserTier {
  tier: TierName;
  subLevel: SubLevel;
  currentPoints: number;
  pointsToNext: number;
  totalPoints: number;
  promotionProgress: number; // 0-100
}

export interface TierProgress {
  tier: TierName;
  subLevel: SubLevel;
  skillBreakdown: {
    listening: number;    // 0-100
    reading: number;      // 0-100
    speaking: number;     // 0-100
    writing: number;      // 0-100
    grammar: number;      // 0-100
    vocabulary: number;   // 0-100
  };
  lessonsCompleted: number;
  testScores: number[];
  lastPromotionAttempt?: Date;
}

// 티어 정보 정의
export const TIER_CONFIG: Record<TierName, TierInfo> = {
  iron: {
    name: 'iron',
    displayName: 'Iron',
    icon: '⚫',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    description: 'Starting your Korean learning journey. Learn Hangul step by step!',
    requiredPoints: 0,
    promotionRequirements: {
      minLessons: 20,
      minTestScore: 60,
      requiredSkills: ['hangul_reading', 'basic_vocabulary']
    }
  },
  bronze: {
    name: 'bronze',
    displayName: 'Bronze',
    icon: '🥉',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    description: 'Can read Hangul and know basic vocabulary.',
    topikLevel: 'TOPIK I Preparation',
    requiredPoints: 1000,
    promotionRequirements: {
      minLessons: 50,
      minTestScore: 65,
      requiredSkills: ['basic_grammar', 'daily_vocabulary', 'simple_sentences']
    }
  },
  silver: {
    name: 'silver',
    displayName: 'Silver',
    icon: '🥈',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-400',
    description: 'Can have basic conversations and use everyday expressions.',
    topikLevel: 'TOPIK I (Level 1-2)',
    requiredPoints: 3000,
    promotionRequirements: {
      minLessons: 100,
      minTestScore: 70,
      requiredSkills: ['conversation_basics', 'listening_comprehension', 'reading_simple_texts']
    }
  },
  gold: {
    name: 'gold',
    displayName: 'Gold',
    icon: '🥇',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    description: 'Can freely engage in daily conversations and understand complex grammar.',
    topikLevel: 'TOPIK II (Level 3-4)',
    requiredPoints: 6000,
    promotionRequirements: {
      minLessons: 200,
      minTestScore: 75,
      requiredSkills: ['advanced_grammar', 'fluent_conversation', 'media_comprehension']
    }
  },
  platinum: {
    name: 'platinum',
    displayName: 'Platinum',
    icon: '💠',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-400',
    description: 'Can use advanced Korean and understand professional content.',
    topikLevel: 'TOPIK II (Level 5)',
    requiredPoints: 10000,
    promotionRequirements: {
      minLessons: 300,
      minTestScore: 80,
      requiredSkills: ['professional_korean', 'complex_texts', 'cultural_nuances']
    }
  },
  diamond: {
    name: 'diamond',
    displayName: 'Diamond',
    icon: '💎',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    description: 'Near-native proficiency with perfect Korean in all situations.',
    topikLevel: 'TOPIK II (Level 6)',
    requiredPoints: 15000,
    promotionRequirements: {
      minLessons: 500,
      minTestScore: 85,
      requiredSkills: ['native_level', 'academic_korean', 'creative_expression']
    }
  }
};

// 서브레벨별 포인트 계산
export const SUB_LEVEL_POINTS: Record<SubLevel, number> = {
  5: 0,    // 해당 티어 시작
  4: 20,   // 20% 진행
  3: 40,   // 40% 진행  
  2: 60,   // 60% 진행
  1: 80    // 80% 진행, 다음 티어까지 20%
};

export class TierSystemManager {
  private static readonly STORAGE_KEY = 'polarist_user_tier';

  /**
   * 사용자 현재 티어 정보 가져오기
   */
  static getCurrentTier(): UserTier {
    if (typeof window === 'undefined') {
      return this.getDefaultTier();
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...this.getDefaultTier(),
          ...parsed
        };
      }
    } catch (error) {
      console.warn('Failed to parse tier data:', error);
    }

    return this.getDefaultTier();
  }

  /**
   * 기본 티어 (Iron 5) 반환
   */
  private static getDefaultTier(): UserTier {
    return {
      tier: 'iron',
      subLevel: 5,
      currentPoints: 0,
      pointsToNext: 200, // Iron 5 -> Iron 4까지 필요한 포인트
      totalPoints: 0,
      promotionProgress: 0
    };
  }

  /**
   * 포인트 추가 및 티어 업데이트
   */
  static addPoints(points: number): { 
    leveledUp: boolean; 
    newTier: UserTier; 
    promotionAvailable: boolean 
  } {
    const currentTier = this.getCurrentTier();
    const newTotalPoints = currentTier.totalPoints + points;
    const newTier = this.calculateTierFromPoints(newTotalPoints);
    
    const leveledUp = (
      newTier.tier !== currentTier.tier || 
      newTier.subLevel !== currentTier.subLevel
    );

    const promotionAvailable = this.checkPromotionEligibility(newTier);

    this.saveTier(newTier);

    return {
      leveledUp,
      newTier,
      promotionAvailable
    };
  }

  /**
   * 총 포인트로부터 티어 계산
   */
  private static calculateTierFromPoints(totalPoints: number): UserTier {
    const tiers: TierName[] = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
    
    let currentTier: TierName = 'iron';
    let remainingPoints = totalPoints;

    // 어느 티어에 속하는지 찾기
    for (const tierName of tiers) {
      const tierInfo = TIER_CONFIG[tierName];
      const tierTotalPoints = this.getTierTotalPoints(tierName);
      
      if (totalPoints >= tierInfo.requiredPoints && totalPoints < tierTotalPoints) {
        currentTier = tierName;
        remainingPoints = totalPoints - tierInfo.requiredPoints;
        break;
      }
    }

    // 서브레벨 계산
    const tierPointRange = this.getTierPointRange(currentTier);
    const subLevelProgress = remainingPoints / (tierPointRange / 5);
    const subLevel = Math.max(1, 5 - Math.floor(subLevelProgress)) as SubLevel;
    
    const pointsInCurrentSubLevel = remainingPoints % (tierPointRange / 5);
    const pointsToNext = (tierPointRange / 5) - pointsInCurrentSubLevel;

    return {
      tier: currentTier,
      subLevel,
      currentPoints: remainingPoints,
      pointsToNext: Math.ceil(pointsToNext),
      totalPoints,
      promotionProgress: this.calculatePromotionProgress(currentTier, remainingPoints)
    };
  }

  /**
   * 티어별 총 포인트 범위 계산
   */
  private static getTierTotalPoints(tier: TierName): number {
    const tiers: TierName[] = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const tierIndex = tiers.indexOf(tier);
    
    if (tierIndex === tiers.length - 1) {
      return Infinity; // Diamond는 최고 티어
    }
    
    return TIER_CONFIG[tiers[tierIndex + 1]].requiredPoints;
  }

  /**
   * 티어 내 포인트 범위 계산
   */
  private static getTierPointRange(tier: TierName): number {
    const nextTierPoints = this.getTierTotalPoints(tier);
    const currentTierPoints = TIER_CONFIG[tier].requiredPoints;
    
    if (nextTierPoints === Infinity) {
      return 5000; // Diamond 티어는 임의로 5000 포인트 범위
    }
    
    return nextTierPoints - currentTierPoints;
  }

  /**
   * 승급 진행률 계산
   */
  private static calculatePromotionProgress(tier: TierName, pointsInTier: number): number {
    const tierRange = this.getTierPointRange(tier);
    return Math.min(100, (pointsInTier / tierRange) * 100);
  }

  /**
   * 승급 자격 확인
   */
  private static checkPromotionEligibility(userTier: UserTier): boolean {
    return userTier.subLevel === 1 && userTier.promotionProgress >= 100;
  }

  /**
   * 티어 정보 저장
   */
  private static saveTier(tierData: UserTier): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tierData));
    } catch (error) {
      console.error('Failed to save tier data:', error);
    }
  }

  /**
   * 티어 정보 초기화 (개발/테스트용)
   */
  static resetTier(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 특정 티어의 표시 정보 가져오기
   */
  static getTierDisplayInfo(tier: TierName, subLevel: SubLevel): string {
    const tierInfo = TIER_CONFIG[tier];
    return `${tierInfo.icon} ${tierInfo.displayName} ${subLevel}`;
  }

  /**
   * 다음 레벨까지 필요한 정보
   */
  static getNextLevelInfo(userTier: UserTier): {
    nextTier: TierName | null;
    nextSubLevel: SubLevel | null;
    description: string;
  } {
    if (userTier.subLevel > 1) {
      return {
        nextTier: userTier.tier,
        nextSubLevel: (userTier.subLevel - 1) as SubLevel,
        description: `${TIER_CONFIG[userTier.tier].displayName} ${userTier.subLevel - 1}`
      };
    }

    // 다음 티어로 승급
    const tiers: TierName[] = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const currentIndex = tiers.indexOf(userTier.tier);
    
    if (currentIndex < tiers.length - 1) {
      const nextTier = tiers[currentIndex + 1];
      return {
        nextTier,
        nextSubLevel: 5,
        description: `${TIER_CONFIG[nextTier].displayName} 5`
      };
    }

    return {
      nextTier: null,
      nextSubLevel: null,
      description: '최고 레벨 달성!'
    };
  }
}