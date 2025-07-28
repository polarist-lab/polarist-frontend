/**
 * 사용자 상태 관리 시스템
 * 가입 상태, 체험 모드, 온보딩 상태 등을 관리
 */

export interface UserState {
  isSignedUp: boolean;
  isTrialMode: boolean;
  trialLevel?: 'beginner' | 'intermediate' | 'advanced';
  hasCompletedOnboarding: boolean;
  visitCount: number;
  lastVisit?: Date;
}

const USER_STATE_KEY = 'polarist_user_state';

export class UserStateManager {
  private static defaultState: UserState = {
    isSignedUp: false,
    isTrialMode: false,
    hasCompletedOnboarding: false,
    visitCount: 0
  };

  /**
   * 현재 사용자 상태 가져오기
   */
  static getUserState(): UserState {
    if (typeof window === 'undefined') {
      return this.defaultState;
    }

    try {
      const stored = localStorage.getItem(USER_STATE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...this.defaultState,
          ...parsed,
          lastVisit: parsed.lastVisit ? new Date(parsed.lastVisit) : undefined
        };
      }
    } catch (error) {
      console.warn('Failed to parse user state:', error);
    }

    return this.defaultState;
  }

  /**
   * 사용자 상태 저장
   */
  static saveUserState(state: Partial<UserState>): void {
    if (typeof window === 'undefined') return;

    try {
      const currentState = this.getUserState();
      const newState = { ...currentState, ...state };
      localStorage.setItem(USER_STATE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save user state:', error);
    }
  }

  /**
   * 첫 방문인지 확인
   */
  static isFirstVisit(): boolean {
    const state = this.getUserState();
    return state.visitCount === 0;
  }

  /**
   * 방문 횟수 증가
   */
  static incrementVisitCount(): void {
    const state = this.getUserState();
    this.saveUserState({
      visitCount: state.visitCount + 1,
      lastVisit: new Date()
    });
  }

  /**
   * 회원가입 완료 처리
   */
  static markAsSignedUp(): void {
    this.saveUserState({
      isSignedUp: true,
      isTrialMode: false // 가입하면 체험 모드 해제
    });
  }

  /**
   * 체험 모드 시작
   */
  static startTrialMode(level: 'beginner' | 'intermediate' | 'advanced'): void {
    this.saveUserState({
      isTrialMode: true,
      trialLevel: level
    });
  }

  /**
   * 온보딩 완료 처리
   */
  static completeOnboarding(): void {
    this.saveUserState({
      hasCompletedOnboarding: true
    });
  }

  /**
   * 사용자가 가입해야 하는지 확인
   */
  static shouldShowSignupPrompt(): boolean {
    const state = this.getUserState();
    return !state.isSignedUp && !state.isTrialMode;
  }

  /**
   * 체험 모드인지 확인
   */
  static isInTrialMode(): boolean {
    const state = this.getUserState();
    return state.isTrialMode && !state.isSignedUp;
  }

  /**
   * 완전한 신규 사용자인지 확인 (첫 방문 + 미가입 + 체험 모드 아님)
   */
  static isCompleteNewUser(): boolean {
    const state = this.getUserState();
    return this.isFirstVisit() && !state.isSignedUp && !state.isTrialMode;
  }

  /**
   * 사용자 상태 초기화 (테스트용)
   */
  static resetUserState(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_STATE_KEY);
  }

  /**
   * 사용자 여정 단계 결정
   */
  static getUserJourneyStage(): 'new' | 'trial' | 'signed-up' | 'returning' {
    const state = this.getUserState();
    
    if (state.isSignedUp) {
      return 'signed-up';
    }
    
    if (state.isTrialMode) {
      return 'trial';
    }
    
    if (this.isFirstVisit()) {
      return 'new';
    }
    
    return 'returning';
  }
}