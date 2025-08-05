// Korean Learning SNS Types and Interfaces

export type TopikLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type Language = 'en' | 'ko';

export type PostCategory = 
  | 'grammar'         // 문법
  | 'vocabulary'      // 어휘
  | 'pronunciation'   // 발음
  | 'culture'         // 문화
  | 'conversation'    // 회화
  | 'writing'         // 쓰기
  | 'daily-life'      // 일상생활
  | 'business'        // 비즈니스
  | 'travel'          // 여행
  | 'food'            // 음식
  | 'entertainment'   // 엔터테인먼트
  | 'study-tips'      // 학습 팁
  | 'other'           // 기타
  | 'general';        // 일반

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type CorrectionType = 'grammar' | 'vocabulary' | 'pronunciation' | 'natural-expression' | 'spacing';

export type CorrectionSeverity = 'minor' | 'major' | 'critical';

// 기본 사용자 인터페이스
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  nativeLanguage: Language;
  topikLevel: TopikLevel;
  joinedAt: Date;
  lastActiveAt: Date;
}

// 확장된 한국어 학습자 프로필
export interface KoreanLearnerProfile extends User {
  bio?: string;
  learningGoals: string[];
  specialties: string[];
  mentorshipPreference: 'receive' | 'provide' | 'both';
  studyStreak: number;
  totalPoints: number;
  badges: Badge[];
  mentorRating?: number;
  totalCorrectionsGiven: number;
  totalCorrectionsReceived: number;
  helpfulCorrectionsCount: number;
  isVerified: boolean;
}

// 배지 시스템
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'mentoring' | 'community' | 'achievement';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

// 음성 데이터
export interface VoiceData {
  id: string;
  audioUrl: string;
  duration: number; // seconds
  transcription?: string;
  accuracyScore?: number; // 0-100
  waveformData?: number[];
  language: Language;
  isProcessing: boolean;
  uploadedAt: Date;
}

// 텍스트 교정 데이터
export interface TextCorrection {
  id: string;
  startIndex: number;
  endIndex: number;
  originalText: string;
  correctedText: string;
  type: CorrectionType;
  explanation: string;
}

// 이중 언어 포스트
export interface BilingualPost {
  id: string;
  authorId: string;
  author: KoreanLearnerProfile;
  
  // 콘텐츠
  originalText: string;
  originalLanguage: Language;
  translatedText: string;
  translatedLanguage: Language;
  voiceData?: VoiceData;
  
  // 메타데이터
  category: PostCategory;
  difficulty: Difficulty;
  tags: string[];
  needsCorrection: boolean;
  translationQuality?: Difficulty;
  
  // 인터랙션
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  views: number;
  
  // 사용자별 상태
  isLikedByUser?: boolean;
  isBookmarkedByUser?: boolean;
  
  // 교정 관련
  corrections: CorrectionComment[];
  hasUserCorrection?: boolean;
  
  // 날짜
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  isPublished: boolean;
}

// 교정 댓글
export interface CorrectionComment {
  id: string;
  postId: string;
  authorId: string;
  author: KoreanLearnerProfile;
  
  // 교정 내용
  correctionType: CorrectionType;
  severity: CorrectionSeverity;
  corrections: TextCorrection[];
  generalFeedback?: string;
  
  // 커뮤니티 피드백
  helpfulCount: number;
  isMarkedHelpfulByUser?: boolean;
  
  // 답글
  replies: CorrectionReply[];
  
  // 날짜
  createdAt: Date;
  updatedAt: Date;
}

// 교정 댓글 답글
export interface CorrectionReply {
  id: string;
  correctionId: string;
  authorId: string;
  author: KoreanLearnerProfile;
  content: string;
  likes: number;
  isLikedByUser?: boolean;
  createdAt: Date;
}

// 일기 템플릿
export interface JournalTemplate {
  id: string;
  name: string;
  description: string;
  category: 'daily' | 'emotions' | 'goals' | 'reflection' | 'experience' | 'culture';
  difficulty: Difficulty;
  estimatedTime: number; // minutes
  prompts: {
    ko: string;
    en: string;
  }[];
  tags: string[];
  isActive: boolean;
}

// 멘토링 관련
export interface MentorshipRequest {
  id: string;
  menteeId: string;
  mentorId: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: Date;
  respondedAt?: Date;
  completedAt?: Date;
}

// 포인트 및 리워드
export interface PointAction {
  action: string;
  points: number;
  description: string;
  category: 'posting' | 'correcting' | 'helping' | 'streak' | 'social';
}

export interface RewardNotification {
  id: string;
  userId: string;
  type: 'points' | 'badge' | 'streak' | 'level-up' | 'achievement';
  title: string;
  description: string;
  points?: number;
  badge?: Badge;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

// 학습 통계
export interface LearningStats {
  userId: string;
  totalPosts: number;
  totalCorrectionsReceived: number;
  totalCorrectionsGiven: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  averagePostQuality: number;
  improvementRate: number;
  weakAreas: PostCategory[];
  strongAreas: PostCategory[];
  weeklyActivity: {
    week: string;
    posts: number;
    corrections: number;
    studyTime: number;
  }[];
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 검색 및 필터
export interface PostFilter {
  category?: PostCategory;
  difficulty?: Difficulty;
  language?: Language;
  needsCorrection?: boolean;
  authorTopikLevel?: TopikLevel[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'recent' | 'popular' | 'needs-help' | 'trending';
}

// 멘토 매칭 알고리즘용
export interface MentorCompatibility {
  mentorId: string;
  compatibilityScore: number; // 0-100
  sharedInterests: string[];
  levelDifference: number;
  responseTime: string;
  rating: number;
  specialtyMatch: boolean;
}

// 실시간 알림
export interface Notification {
  id: string;
  userId: string;
  type: 'new-correction' | 'helpful-mark' | 'new-follower' | 'post-liked' | 'mentor-request' | 'achievement';
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

// 피드 아이템
export interface FeedItem {
  id: string;
  type: 'post' | 'correction' | 'achievement' | 'milestone';
  content: BilingualPost | CorrectionComment | RewardNotification;
  priority: number;
  timestamp: Date;
  isPromoted?: boolean;
}

// 사용자 활동 로그
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  targetId?: string;
  targetType?: 'post' | 'comment' | 'user';
  metadata?: Record<string, any>;
  timestamp: Date;
}

// 컴포넌트 Props 타입들
export interface PostCardProps {
  post: BilingualPost;
  currentUser?: KoreanLearnerProfile;
  showActions?: boolean;
  showCorrections?: boolean;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onCorrect?: (postId: string) => void;
  className?: string;
}

export interface CorrectionEditorProps {
  postId: string;
  originalText: string;
  translatedText: string;
  onSubmit: (correction: Omit<CorrectionComment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  maxDuration?: number;
  language?: Language;
  showWaveform?: boolean;
  disabled?: boolean;
}

export interface LayoutProps {
  children: React.ReactNode;
  currentUser?: KoreanLearnerProfile;
  showSidebar?: boolean;
  showRightPanel?: boolean;
  className?: string;
}