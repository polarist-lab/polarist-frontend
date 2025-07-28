// 다국어 지원 타입 정의

import { Locale } from './config';

export interface Translation {
  // 공통 UI 텍스트
  common: {
    home: string;
    study: string;
    test: string;
    progress: string;
    startOver: string;
    next: string;
    previous: string;
    congratulations: string;
    studyAgain: string;
    signUp: string;
    signIn: string;
    totalWordsCount: string;
    words: string;
  };

  // 단어장 선택
  wordbooks: {
    selectWordbook: string;
    selectWordbookDesc: string;
    allWordbooks: string;
    byDifficulty: string;
    createCustom: string;
    createCustomDesc: string;
    beginnerLevel: string;
    intermediateLevel: string;
    advancedLevel: string;
    
    // 단어장 타이틀들
    absoluteBeginner: string;
    beginner: string;
    intermediate: string;
    advanced: string;
    dailyConversation: string;
    foodRestaurant: string;
    travelTransportation: string;
    familyRelationships: string;
    businessWork: string;
    kPopCulture: string;
    healthBody: string;
    technologyModern: string;
    
    // 단어장 설명들
    absoluteBeginnerDesc: string;
    beginnerDesc: string;
    intermediateDesc: string;
    advancedDesc: string;
    dailyConversationDesc: string;
    foodRestaurantDesc: string;
    travelTransportationDesc: string;
    familyRelationshipsDesc: string;
    businessWorkDesc: string;
    kPopCultureDesc: string;
    healthBodyDesc: string;
    technologyModernDesc: string;
  };

  // 메인 페이지
  home: {
    title: string;
    subtitle: string;
    welcome: string;
    description: string;
    totalWords: string;
    wordsMastered: string;
    wordsStudied: string;
    overallProgress: string;
    progressByCategory: string;
    progressByDifficulty: string;
    continueStudying: string;
    takeTest: string;
    startJourney: string;
    mostCommonWords: string;
    interactiveCards: string;
    mobileFriendly: string;
    mostCommonWordsDesc: string;
    interactiveCardsDesc: string;
    mobileFriendlyDesc: string;
  };

  // 학습 페이지
  study: {
    title: string;
    loading: string;
    instructions: string;
    wordOf: string;
    clickToSeeFullInfo: string;
    clickToSwitchToKoreanOnly: string;
    keyboardShortcuts: string;
    toggleInfo: string;
    restart: string;
    toggleView: string;
    youHaveSeen: string;
    words: string;
  };

  // 진행 상황 페이지
  progress: {
    title: string;
    subtitle: string;
  };

  // 인증 관련
  auth: {
    welcome: string;
    signupSubtitle: string;
    signinSubtitle: string;
    continueWithGoogle: string;
    continueWithApple: string;
    comingSoon: string;
    cancel: string;
    signupProcessing: string;
    signinProcessing: string;
    signupComplete: string;
    signinComplete: string;
    redirectingHome: string;
    authError: string;
    login: string;
    profile: string;
    learningProgress: string;
    settings: string;
    logout: string;
    loginRequired: string;
  };

  // 단어 검색 및 필터링
  wordSearch: {
    placeholder: string;
    useAllResults: string;
    noResults: string;
    searchInstructions: string;
  };

  wordFilter: {
    wordSelection: string;
    easy10: string;
    select50: string;
    select100: string;
    wordCount: string;
    difficultySelection: string;
    categorySelection: string;
    categoryOptional: string;
    minFrequency: string;
    allWords: string;
    frequentlyUsed: string;
    apply: string;
    close: string;
    saveCustomWordbook: string;
    wordbookNamePrompt: string;
    wordbookDescPrompt: string;
    wordbookSaved: string;
    wordbookSaveFailed: string;
    wordbookSaveError: string;
  };

  categories: {
    basic: string;
    greetings: string;
    family: string;
    food: string;
    colors: string;
    numbers: string;
    time: string;
    weather: string;
    body: string;
    clothing: string;
    animals: string;
    nature: string;
    transportation: string;
    shopping: string;
    restaurant: string;
    school: string;
    work: string;
    hobbies: string;
    sports: string;
    music: string;
    movies: string;
    travel: string;
    health: string;
    emotions: string;
    house: string;
    technology: string;
    business: string;
    culture: string;
    holidays: string;
    religion: string;
    politics: string;
  };

  difficulty: {
    absoluteBeginner: string;
    beginner: string;
    intermediate: string;
    upperIntermediate: string;
    advanced: string;
    expert: string;
  };

  // 메타 정보
  meta: {
    title: string;
    description: string;
    keywords: string;
  };

  // 언어별 특화 정보
  targetLanguage: {
    name: string;        // "Korean", "일본어", "bahasa Korea"
    nativeName: string;  // "한국어", "조선어", "bahasa Korea" 
    flag: string;        // "🇰🇷"
    direction: 'ltr' | 'rtl';
  };
}

// 언어별 단어 학습 방향
export interface LanguagePair {
  from: Locale;      // 사용자 언어 (en, jp, id)
  to: 'ko' | 'jp' | 'id';  // 학습할 언어 (한국어, 일본어, 인도네시아어)
  label: string;     // "English → Korean", "日本語 → 한국어"
}

// 지원하는 학습 조합
export const SUPPORTED_LANGUAGE_PAIRS: LanguagePair[] = [
  { from: 'en', to: 'ko', label: 'English → Korean' },
  { from: 'jp', to: 'ko', label: '日本語 → 한국어' },
  { from: 'id', to: 'ko', label: 'Indonesia → Korean' },
  // 향후 확장 가능
  // { from: 'en', to: 'jp', label: 'English → Japanese' },
  // { from: 'en', to: 'id', label: 'English → Indonesian' },
];