// 한자 정보 인터페이스
export interface HanjaInfo {
  traditional: string;  // 번체
  simplified: string;   // 간체
  meaning: string;      // 한자 개별 의미
  etymology?: string;   // 어원 설명
}

export interface KoreanWord {
  id: number;
  korean: string;
  english: string;
  pronunciation: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  frequency: number; // Higher number = more frequently used
  hanja?: HanjaInfo;   // 한자 정보 (한자어인 경우만)
  isHanjaOrigin: boolean; // 한자어 여부
}

export interface LearningProgress {
  wordId: number;
  isLearned: boolean;
  attempts: number;
  lastStudied: Date;
  confidence: number; // 0-5 scale
}

export interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  wordsStudied: number;
  correctAnswers: number;
  totalAttempts: number;
}

export type Category = 
  | 'basic'
  | 'food'
  | 'family'
  | 'colors'
  | 'numbers'
  | 'greetings'
  | 'time'
  | 'travel'
  | 'emotions'
  | 'daily-life'
  | 'grammar'
  | 'body'
  | 'clothing'
  | 'technology'
  | 'nature'
  | 'health'
  | 'philosophy'
  | 'education'
  | 'entertainment'
  | 'business'
  | 'sports'
  | 'culture'
  | 'cooking'
  | 'shopping'
  | 'transportation'
  | 'weather'
  | 'hobbies'
  | 'relationships'
  | 'animals'
  | 'places'
  | 'music'
  | 'art';

export type Difficulty = 'absolute-beginner' | 'beginner' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'expert';

// 새로운 확장 타입들
export type ContentType = 'wordbook' | 'sentence' | 'roadmap' | 'character' | 'grammar';
export type AuthorType = 'official' | 'community' | 'user';

// 통합 학습 콘텐츠
export interface LearningContent {
  id: string;
  type: ContentType;
  authorType: AuthorType;
  authorId?: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  categories: Category[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  estimatedDuration: number; // 분
  prerequisites?: string[]; // 선행 콘텐츠 ID들
  order?: number; // 로드맵 내 순서
  icon?: string;
  color?: string;
  // 타입별 특화 데이터
  metadata?: WordbookMetadata | SentenceMetadata | RoadmapMetadata | CharacterMetadata | GrammarMetadata;
}

// 단어장 메타데이터  
export interface WordbookMetadata {
  wordCount: number;
  minFrequency: number;
  difficulties: Difficulty[];
}

// 문장집 메타데이터
export interface SentenceMetadata {
  sentenceCount: number;
  grammarFocus: string[];
  vocabularyLevel: Difficulty;
}

// 로드맵 메타데이터
export interface RoadmapMetadata {
  contentIds: string[];
  totalDuration: number;
  completionCriteria: 'all' | 'percentage';
  requiredPercentage?: number;
  tierRequirement?: string;
  nextTier?: string;
}

// 문자 메타데이터
export interface CharacterMetadata {
  characterCount: number;
  characterType: 'vowel' | 'consonant' | 'complex-vowel' | 'double-consonant' | 'syllable' | 'vowel-review';
  hasStrokeOrder?: boolean;
  difficulty: Difficulty;
}

// 문법 메타데이터
export interface GrammarMetadata {
  ruleCount: number;
  grammarType: 'particles' | 'verb-conjugation' | 'sentence-structure' | 'honorifics' | 'tenses';
  practiceExamples: number;
  difficulty: Difficulty;
  relatedGrammar?: string[]; // 관련 문법 규칙 ID들
}

// 문장 인터페이스
export interface KoreanSentence {
  id: number;
  korean: string;
  english: string;
  pronunciation?: string;
  grammar?: string[];
  vocabulary: KoreanWord[];
  difficulty: Difficulty;
  category: Category;
  notes?: string;
}

// 로드맵 인터페이스
export interface LearningRoadmap extends LearningContent {
  type: 'roadmap';
  contents: LearningContent[];
  metadata: RoadmapMetadata;
}

// 콘텐츠 필터
export interface ContentFilter {
  contentType?: ContentType[];
  authorType?: AuthorType[];
  difficulty?: Difficulty[];
  category?: Category[];
  completionStatus?: 'completed' | 'in-progress' | 'not-started';
  officialOnly?: boolean;
  excludeCompleted?: boolean;
  sortBy?: 'difficulty' | 'popularity' | 'recent' | 'roadmap-order' | 'alphabetical';
  tags?: string[];
  prerequisites?: 'met' | 'not-met' | 'ignore';
}

// 사용자 생성 콘텐츠
export interface UserContent extends LearningContent {
  authorId: string;
  isPrivate: boolean;
  shareCode?: string;
  likes: number;
  views: number;
  reports: number;
  moderationStatus: 'pending' | 'approved' | 'rejected';
}

// 한글 문자 인터페이스
export interface KoreanCharacter {
  id: number;
  character: string; // ㅏ, ㄱ 등
  characterName: string; // 'a', 'giyeok' 등
  pronunciation: string; // 'ah', 'g/k' 등
  type: 'vowel' | 'consonant' | 'complex-vowel' | 'double-consonant' | 'syllable' | 'vowel-review';
  strokeOrder?: string[]; // 획순 정보
  examples?: string[]; // 예시 단어들
  romanization?: string; // 로마자 표기
  tags?: string[]; // 분류 태그 (simple, y-series, w-series, etc.)
}

// 언어별 한자 설정
export interface LocaleHanjaConfig {
  defaultEnabled: boolean;
  preferredScript: 'traditional' | 'simplified';
  showToggle: boolean;
  showHint: boolean;
  maxHintCount?: number; // 힌트 표시 최대 횟수
}

// 사용자 한자 설정
export interface UserHanjaSettings {
  enabled: boolean;
  script: 'traditional' | 'simplified' | 'both';
  showEtymology: boolean;
  hintsSeen: number;
}

// 온보딩 시스템 타입들
export type OnboardingStep = 'welcome' | 'self-assessment' | 'mini-test' | 'results' | 'recommendations' | 'complete';

export interface SelfAssessmentResult {
  canReadHangul: boolean;
  koreanExperience: 'none' | 'basic' | 'intermediate' | 'advanced';
  learningGoals: string[];
  studyTimePerWeek: number; // 시간/주
  preferredLearningStyle: 'visual' | 'audio' | 'mixed';
}

export interface MiniTestQuestion {
  id: string;
  type: 'character-recognition' | 'word-recognition' | 'sentence-comprehension';
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  category: string;
}

export interface MiniTestResult {
  totalQuestions: number;
  correctAnswers: number;
  categoryScores: Record<string, { correct: number; total: number }>;
  estimatedLevel: Difficulty;
  strengths: string[];
  weaknesses: string[];
  timeSpent: number; // 초
}

export interface LevelAssessmentResult {
  selfAssessment: SelfAssessmentResult;
  miniTest: MiniTestResult;
  finalLevel: Difficulty;
  confidence: number; // 0-1
  recommendedPath: string[]; // 추천 로드맵 ID들
  recommendedContent: string[]; // 추천 콘텐츠 ID들
  completedAt: Date;
}

export interface OnboardingState {
  isFirstVisit: boolean;
  currentStep: OnboardingStep;
  hasCompletedOnboarding: boolean;
  skipOnboarding: boolean;
  assessmentResult?: LevelAssessmentResult;
  startedAt?: Date;
  completedAt?: Date;
}

export interface UserProfile {
  id: string;
  level: Difficulty;
  onboardingState: OnboardingState;
  preferences: {
    learningStyle: 'visual' | 'audio' | 'mixed';
    studyTimeGoal: number; // 분/일
    notifications: boolean;
    hanjaSettings: UserHanjaSettings;
  };
  createdAt: Date;
  lastActiveAt: Date;
}