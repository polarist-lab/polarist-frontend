import { 
  OnboardingState, 
  OnboardingStep, 
  UserProfile, 
  LevelAssessmentResult, 
  SelfAssessmentResult,
  MiniTestResult,
  Difficulty
} from './types';

export class OnboardingManager {
  private static readonly ONBOARDING_KEY = 'korean-learning-onboarding';
  private static readonly USER_PROFILE_KEY = 'korean-learning-user-profile';

  // 첫 방문 확인
  static isFirstVisit(): boolean {
    if (typeof window === 'undefined') return true;
    
    try {
      const onboardingState = this.getOnboardingState();
      return onboardingState.isFirstVisit;
    } catch {
      return true;
    }
  }

  // 온보딩 상태 가져오기
  static getOnboardingState(): OnboardingState {
    if (typeof window === 'undefined') {
      return this.getDefaultOnboardingState();
    }

    try {
      const saved = localStorage.getItem(this.ONBOARDING_KEY);
      if (!saved) {
        return this.getDefaultOnboardingState();
      }

      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        startedAt: parsed.startedAt ? new Date(parsed.startedAt) : undefined,
        completedAt: parsed.completedAt ? new Date(parsed.completedAt) : undefined,
        assessmentResult: parsed.assessmentResult ? {
          ...parsed.assessmentResult,
          completedAt: new Date(parsed.assessmentResult.completedAt)
        } : undefined
      };
    } catch (error) {
      console.warn('Failed to load onboarding state:', error);
      return this.getDefaultOnboardingState();
    }
  }

  // 온보딩 상태 저장
  static saveOnboardingState(state: OnboardingState): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.ONBOARDING_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  }

  // 온보딩 시작
  static startOnboarding(): OnboardingState {
    const state: OnboardingState = {
      isFirstVisit: false,
      currentStep: 'welcome',
      hasCompletedOnboarding: false,
      skipOnboarding: false,
      startedAt: new Date()
    };

    this.saveOnboardingState(state);
    return state;
  }

  // 다음 단계로 이동
  static proceedToStep(step: OnboardingStep): void {
    const currentState = this.getOnboardingState();
    const updatedState: OnboardingState = {
      ...currentState,
      currentStep: step,
      isFirstVisit: false
    };

    this.saveOnboardingState(updatedState);
  }

  // 온보딩 완료
  static completeOnboarding(assessmentResult?: LevelAssessmentResult): void {
    const currentState = this.getOnboardingState();
    const updatedState: OnboardingState = {
      ...currentState,
      currentStep: 'complete',
      hasCompletedOnboarding: true,
      assessmentResult: assessmentResult,
      completedAt: new Date()
    };

    this.saveOnboardingState(updatedState);

    // 사용자 프로필 업데이트
    if (assessmentResult) {
      this.updateUserProfile({
        level: assessmentResult.finalLevel,
        onboardingCompleted: true
      });
    }
  }

  // 온보딩 건너뛰기
  static skipOnboarding(): void {
    const currentState = this.getOnboardingState();
    const updatedState: OnboardingState = {
      ...currentState,
      skipOnboarding: true,
      hasCompletedOnboarding: true,
      currentStep: 'complete',
      completedAt: new Date(),
      isFirstVisit: false
    };

    this.saveOnboardingState(updatedState);
  }

  // 사용자 프로필 가져오기
  static getUserProfile(): UserProfile | null {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(this.USER_PROFILE_KEY);
      if (!saved) return null;

      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        lastActiveAt: new Date(parsed.lastActiveAt),
        onboardingState: {
          ...parsed.onboardingState,
          startedAt: parsed.onboardingState.startedAt ? new Date(parsed.onboardingState.startedAt) : undefined,
          completedAt: parsed.onboardingState.completedAt ? new Date(parsed.onboardingState.completedAt) : undefined
        }
      };
    } catch (error) {
      console.warn('Failed to load user profile:', error);
      return null;
    }
  }

  // 사용자 프로필 업데이트
  static updateUserProfile(updates: Partial<{ level: Difficulty; onboardingCompleted: boolean }>): void {
    if (typeof window === 'undefined') return;

    try {
      let profile = this.getUserProfile();
      
      if (!profile) {
        // 새 프로필 생성
        profile = {
          id: this.generateUserId(),
          level: updates.level || 'absolute-beginner',
          onboardingState: this.getOnboardingState(),
          preferences: {
            learningStyle: 'mixed',
            studyTimeGoal: 30, // 30분/일
            notifications: true,
            hanjaSettings: {
              enabled: false,
              script: 'traditional',
              showEtymology: true,
              hintsSeen: 0
            }
          },
          createdAt: new Date(),
          lastActiveAt: new Date()
        };
      } else {
        // 기존 프로필 업데이트
        profile = {
          ...profile,
          level: updates.level || profile.level,
          lastActiveAt: new Date()
        };
      }

      localStorage.setItem(this.USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  }

  // 평가 결과 저장
  static saveAssessmentResult(
    selfAssessment: SelfAssessmentResult,
    miniTest: MiniTestResult
  ): LevelAssessmentResult {
    // 최종 레벨 계산 (자가진단 50% + 미니테스트 50%)
    const finalLevel = this.calculateFinalLevel(selfAssessment, miniTest);
    
    // 신뢰도 계산
    const confidence = this.calculateConfidence(selfAssessment, miniTest);

    // 추천 콘텐츠 생성
    const { recommendedPath, recommendedContent } = this.generateRecommendations(finalLevel, selfAssessment, miniTest);

    const result: LevelAssessmentResult = {
      selfAssessment,
      miniTest,
      finalLevel,
      confidence,
      recommendedPath,
      recommendedContent,
      completedAt: new Date()
    };

    return result;
  }

  // 온보딩 재설정 (디버깅/테스트용)
  static resetOnboarding(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.ONBOARDING_KEY);
      localStorage.removeItem(this.USER_PROFILE_KEY);
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  }

  // Private helper methods
  private static getDefaultOnboardingState(): OnboardingState {
    return {
      isFirstVisit: true,
      currentStep: 'welcome',
      hasCompletedOnboarding: false,
      skipOnboarding: false
    };
  }

  private static generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private static calculateFinalLevel(
    selfAssessment: SelfAssessmentResult,
    miniTest: MiniTestResult
  ): Difficulty {
    // 자가진단 점수 (0-5)
    let selfScore = 0;
    if (selfAssessment.canReadHangul) selfScore += 1;
    
    switch (selfAssessment.koreanExperience) {
      case 'basic': selfScore += 1; break;
      case 'intermediate': selfScore += 2; break;
      case 'advanced': selfScore += 3; break;
    }

    // 미니테스트 점수 (0-5)
    const testAccuracy = miniTest.correctAnswers / miniTest.totalQuestions;
    const testScore = Math.floor(testAccuracy * 5);

    // 가중 평균 (자가진단 40%, 테스트 60%)
    const finalScore = (selfScore * 0.4) + (testScore * 0.6);

    // 점수를 레벨로 변환
    if (finalScore < 1) return 'absolute-beginner';
    if (finalScore < 2) return 'beginner';
    if (finalScore < 3) return 'intermediate';
    if (finalScore < 4) return 'upper-intermediate';
    if (finalScore < 4.5) return 'advanced';
    return 'expert';
  }

  private static calculateConfidence(
    selfAssessment: SelfAssessmentResult,
    miniTest: MiniTestResult
  ): number {
    // 테스트 일관성과 답변 시간을 기반으로 신뢰도 계산
    const accuracy = miniTest.correctAnswers / miniTest.totalQuestions;
    const timePerQuestion = miniTest.timeSpent / miniTest.totalQuestions;
    
    // 적절한 시간 (너무 빠르지도 느리지도 않음) = 높은 신뢰도
    const idealTimePerQuestion = 15; // 초
    const timeFactor = Math.min(1, idealTimePerQuestion / Math.abs(timePerQuestion - idealTimePerQuestion + 1));
    
    return Math.min(1, (accuracy * 0.7) + (timeFactor * 0.3));
  }

  private static generateRecommendations(
    level: Difficulty,
    selfAssessment: SelfAssessmentResult,
    miniTest: MiniTestResult
  ): { recommendedPath: string[]; recommendedContent: string[] } {
    const recommendedPath: string[] = [];
    const recommendedContent: string[] = [];

    // 레벨별 기본 로드맵
    switch (level) {
      case 'absolute-beginner':
        recommendedPath.push('roadmap-korean-absolute-beginner');
        if (!selfAssessment.canReadHangul) {
          recommendedContent.push('characters-basic-vowels', 'characters-basic-consonants');
        }
        recommendedContent.push('wordbook-absolute-beginner');
        break;

      case 'beginner':
        recommendedPath.push('roadmap-korean-beginner-path');
        recommendedContent.push('wordbook-beginner', 'sentences-greetings-basic');
        break;

      case 'intermediate':
        recommendedPath.push('roadmap-practical-korean');
        recommendedContent.push('wordbook-intermediate', 'sentences-daily-conversation');
        break;

      case 'upper-intermediate':
      case 'advanced':
        recommendedPath.push('roadmap-advanced-korean');
        recommendedContent.push('wordbook-advanced', 'sentences-formal-situations');
        break;

      case 'expert':
        recommendedContent.push('wordbook-expert', 'sentences-business-korean');
        break;
    }

    // 약점 기반 추가 추천
    if (miniTest.weaknesses.includes('character-recognition')) {
      recommendedContent.unshift('characters-basic-vowels', 'characters-basic-consonants');
    }

    if (miniTest.weaknesses.includes('word-recognition')) {
      recommendedContent.push('wordbook-food-restaurant', 'wordbook-family-relationships');
    }

    return { recommendedPath, recommendedContent };
  }
}