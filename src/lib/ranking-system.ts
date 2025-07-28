/**
 * 랭킹 시스템 - 사용자 순위, 티어 통계, 글로벌 랭킹 관리
 */

import { TierName, SubLevel, TIER_CONFIG, TierSystemManager } from './tier-system';

export interface UserRankingData {
  userId: string;
  username: string;
  tier: TierName;
  subLevel: SubLevel;
  totalPoints: number;
  rank: number;
  avatar?: string;
  country?: string;
  joinDate: Date;
  lastActive: Date;
  badges: string[];
  achievements: {
    lessonsCompleted: number;
    studyStreak: number;
    helpfulAnswers: number;
    contentCreated: number;
  };
}

export interface TierStatistics {
  tier: TierName;
  subLevel?: SubLevel;
  userCount: number;
  percentage: number;
  averagePoints: number;
  topUser?: {
    username: string;
    points: number;
  };
}

export interface GlobalRankingStats {
  totalUsers: number;
  activeUsers: number; // 최근 30일 활동
  averageTier: string;
  tierDistribution: TierStatistics[];
  topPerformers: UserRankingData[];
  recentPromotions: {
    username: string;
    fromTier: string;
    toTier: string;
    date: Date;
  }[];
}

export class RankingSystemManager {
  private static readonly STORAGE_KEY = 'polarist_ranking_data';
  private static readonly MOCK_USERS_KEY = 'polarist_mock_users';

  /**
   * 모든 사용자 랭킹 데이터 가져오기 (모의 데이터 포함)
   */
  static getAllUserRankings(isAuthenticated: boolean = false): UserRankingData[] {
    let allUsers: UserRankingData[];

    if (isAuthenticated) {
      // 로그인한 사용자: 실제 사용자 + 모의 사용자들
      const currentTier = TierSystemManager.getCurrentTier();
      const currentUser: UserRankingData = {
        userId: 'current-user',
        username: 'You',
        tier: currentTier.tier,
        subLevel: currentTier.subLevel,
        totalPoints: currentTier.totalPoints,
        rank: 1,
        joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일 전
        lastActive: new Date(),
        badges: ['🔥', '📚', '🎯'],
        achievements: {
          lessonsCompleted: 45,
          studyStreak: 12,
          helpfulAnswers: 8,
          contentCreated: 3
        }
      };

      // 모의 사용자들 생성
      const mockUsers = this.generateMockUsers(99); // 99명의 모의 사용자
      allUsers = [currentUser, ...mockUsers];
    } else {
      // 비로그인 사용자: 모의 사용자들만
      allUsers = this.generateMockUsers(100); // 100명의 모의 사용자
    }

    // 포인트별로 정렬하고 순위 부여
    return allUsers
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));
  }

  /**
   * 모의 사용자 생성
   */
  private static generateMockUsers(count: number): UserRankingData[] {
    const names = [
      'KoreanMaster', 'SeoulDreamer', 'HangulHero', 'KpopFan2024', 'BTS_Army',
      'DramaLover', 'KimchiEater', 'GangnamStyle', 'TaekwondoKid', 'KoreanFoodie',
      'StudyBuddy', 'LanguageLover', 'KoreanPro', 'TopikMaster', 'FluentSoon',
      'MotivatedLearner', 'ConsistentStudy', 'RapidProgress', 'DedicatedStudent', 'KoreanNinja'
    ];

    const countries = ['🇺🇸', '🇯🇵', '🇨🇳', '🇮🇩', '🇹🇭', '🇻🇳', '🇵🇭', '🇮🇳', '🇧🇷', '🇫🇷'];
    const badges = ['🔥', '📚', '🎯', '⭐', '🏆', '💎', '🚀', '⚡', '🎨', '💪'];

    return Array.from({ length: count }, (_, i) => {
      const basePoints = Math.max(0, 15000 - (i * 50) + Math.random() * 200 - 100);
      const calculatedTier = this.calculateTierFromPoints(basePoints);

      return {
        userId: `user-${i + 1}`,
        username: `${names[i % names.length]}${Math.floor(Math.random() * 1000)}`,
        tier: calculatedTier.tier,
        subLevel: calculatedTier.subLevel,
        totalPoints: Math.floor(basePoints),
        rank: i + 2, // Will be recalculated
        country: countries[Math.floor(Math.random() * countries.length)],
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        badges: this.getRandomBadges(badges, Math.floor(Math.random() * 4) + 1),
        achievements: {
          lessonsCompleted: Math.floor(Math.random() * 200),
          studyStreak: Math.floor(Math.random() * 50),
          helpfulAnswers: Math.floor(Math.random() * 30),
          contentCreated: Math.floor(Math.random() * 10)
        }
      };
    });
  }

  /**
   * 포인트로부터 티어 계산 (tier-system.ts의 로직과 동일)
   */
  private static calculateTierFromPoints(totalPoints: number): { tier: TierName; subLevel: SubLevel } {
    const tiers: TierName[] = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
    
    let currentTier: TierName = 'iron';
    let remainingPoints = totalPoints;

    for (const tierName of tiers) {
      const tierInfo = TIER_CONFIG[tierName];
      const tierTotalPoints = this.getTierTotalPoints(tierName);
      
      if (totalPoints >= tierInfo.requiredPoints && totalPoints < tierTotalPoints) {
        currentTier = tierName;
        remainingPoints = totalPoints - tierInfo.requiredPoints;
        break;
      }
    }

    const tierPointRange = this.getTierPointRange(currentTier);
    const subLevelProgress = remainingPoints / (tierPointRange / 5);
    const subLevel = Math.max(1, 5 - Math.floor(subLevelProgress)) as SubLevel;

    return { tier: currentTier, subLevel };
  }

  private static getTierTotalPoints(tier: TierName): number {
    const tiers: TierName[] = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const tierIndex = tiers.indexOf(tier);
    
    if (tierIndex === tiers.length - 1) {
      return Infinity;
    }
    
    return TIER_CONFIG[tiers[tierIndex + 1]].requiredPoints;
  }

  private static getTierPointRange(tier: TierName): number {
    const nextTierPoints = this.getTierTotalPoints(tier);
    const currentTierPoints = TIER_CONFIG[tier].requiredPoints;
    
    if (nextTierPoints === Infinity) {
      return 5000;
    }
    
    return nextTierPoints - currentTierPoints;
  }

  /**
   * 랜덤 배지 선택
   */
  private static getRandomBadges(badges: string[], count: number): string[] {
    const shuffled = [...badges].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * 티어별 통계 계산
   */
  static getTierStatistics(isAuthenticated: boolean = false): TierStatistics[] {
    const allUsers = this.getAllUserRankings(isAuthenticated);
    const totalUsers = allUsers.length;
    const tiers: TierName[] = ['diamond', 'platinum', 'gold', 'silver', 'bronze', 'iron'];

    return tiers.map(tierName => {
      const tierUsers = allUsers.filter(user => user.tier === tierName);
      const tierCount = tierUsers.length;
      const percentage = (tierCount / totalUsers) * 100;
      
      const averagePoints = tierCount > 0 
        ? tierUsers.reduce((sum, user) => sum + user.totalPoints, 0) / tierCount
        : 0;

      const topUser = tierUsers.length > 0 
        ? tierUsers.reduce((top, user) => 
            user.totalPoints > top.totalPoints ? user : top
          )
        : undefined;

      return {
        tier: tierName,
        userCount: tierCount,
        percentage: Math.round(percentage * 10) / 10,
        averagePoints: Math.round(averagePoints),
        topUser: topUser ? {
          username: topUser.username,
          points: topUser.totalPoints
        } : undefined
      };
    });
  }

  /**
   * 글로벌 랭킹 통계
   */
  static getGlobalStats(isAuthenticated: boolean = false): GlobalRankingStats {
    const allUsers = this.getAllUserRankings(isAuthenticated);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = allUsers.filter(user => user.lastActive > thirtyDaysAgo);

    // 평균 티어 계산
    const totalTierValue = allUsers.reduce((sum, user) => {
      const tiers: TierName[] = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
      const tierIndex = tiers.indexOf(user.tier);
      return sum + (tierIndex * 5 + (6 - user.subLevel));
    }, 0);
    
    const averageTierValue = totalTierValue / allUsers.length;
    const avgTierIndex = Math.floor(averageTierValue / 5);
    const avgSubLevel = Math.ceil(6 - (averageTierValue % 5));
    const tiers: TierName[] = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const averageTier = `${TIER_CONFIG[tiers[avgTierIndex]]?.displayName || 'Iron'} ${avgSubLevel}`;

    // 최근 승급 시뮬레이션
    const recentPromotions = allUsers.slice(0, 5).map((user, i) => ({
      username: user.username,
      fromTier: `Bronze ${Math.floor(Math.random() * 5) + 1}`,
      toTier: `${TIER_CONFIG[user.tier].displayName} ${user.subLevel}`,
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }));

    return {
      totalUsers: allUsers.length,
      activeUsers: activeUsers.length,
      averageTier,
      tierDistribution: this.getTierStatistics(),
      topPerformers: allUsers.slice(0, 10),
      recentPromotions
    };
  }

  /**
   * 현재 사용자 순위 정보 (인증된 사용자만)
   */
  static getCurrentUserRank(): {
    rank: number;
    percentile: number;
    usersAbove: number;
    usersBelow: number;
  } | null {
    // 인증된 사용자만 순위 정보 제공
    const allUsers = this.getAllUserRankings(true);
    const currentUser = allUsers.find(user => user.userId === 'current-user');
    
    if (!currentUser) {
      return null;
    }

    const rank = currentUser.rank;
    const percentile = Math.round(((allUsers.length - rank + 1) / allUsers.length) * 100);
    const usersAbove = rank - 1;
    const usersBelow = allUsers.length - rank;

    return { rank, percentile, usersAbove, usersBelow };
  }

  /**
   * 특정 티어의 사용자 목록
   */
  static getUsersByTier(tier: TierName, limit?: number, isAuthenticated: boolean = false): UserRankingData[] {
    const allUsers = this.getAllUserRankings(isAuthenticated);
    const tierUsers = allUsers.filter(user => user.tier === tier);
    
    return limit ? tierUsers.slice(0, limit) : tierUsers;
  }

  /**
   * 리더보드 (상위 N명)
   */
  static getLeaderboard(limit: number = 50, isAuthenticated: boolean = false): UserRankingData[] {
    return this.getAllUserRankings(isAuthenticated).slice(0, limit);
  }
}