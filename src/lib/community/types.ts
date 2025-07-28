// Community System Types and Interfaces

export type PostCategory = 
  | 'grammar'      // 문법
  | 'vocabulary'   // 어휘
  | 'pronunciation'// 발음
  | 'culture'      // 문화
  | 'exam'         // 시험 준비
  | 'conversation' // 회화
  | 'writing'      // 쓰기
  | 'listening'    // 듣기
  | 'reading'      // 읽기
  | 'general';     // 일반

export type PostType = 'text' | 'image' | 'audio' | 'video' | 'quiz' | 'study-note';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface PostMedia {
  id: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  thumbnail?: string;
  duration?: number; // for audio/video in seconds
  alt?: string;      // for accessibility
}

export interface PostTag {
  id: string;
  name: string;
  color?: string;
  category?: PostCategory;
}

export interface PostInteraction {
  likes: number;
  dislikes: number;
  comments: number;
  bookmarks: number;
  shares: number;
  views: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;           // Markdown content
  excerpt?: string;          // Short summary
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  category: PostCategory;
  type: PostType;
  difficulty: Difficulty;
  tags: PostTag[];
  media: PostMedia[];
  interactions: PostInteraction;
  isBookmarked?: boolean;    // User-specific
  userLiked?: boolean;       // User-specific
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  isPublished: boolean;
  language: 'ko' | 'en' | 'both';
  estimatedReadTime?: number; // in minutes
  koreanLevel?: string;      // 초급, 중급, 고급
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  parentId?: string;         // For nested comments
  likes: number;
  userLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

// Study Journal Types
export type StudySessionType = 
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing'
  | 'review'
  | 'exam-prep';

export interface StudyNote {
  id: string;
  content: string;          // Markdown content
  tags: string[];
  difficulty: Difficulty;
  relatedPosts?: string[];  // Post IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  userId: string;
  type: StudySessionType;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;        // in minutes
  goals: string[];          // What user planned to achieve
  achievements: string[];   // What user actually achieved
  challenges: string[];     // Difficulties encountered
  notes: StudyNote[];
  mood: 1 | 2 | 3 | 4 | 5;  // 1=매우 나쁨, 5=매우 좋음
  satisfaction: 1 | 2 | 3 | 4 | 5; // Learning satisfaction
  materials: string[];      // Resources used
  newVocabulary: string[];  // New words learned
  reviewItems: string[];    // Items to review later
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: PostCategory;
  difficulty: Difficulty;
  targetDate: Date;
  isCompleted: boolean;
  progress: number;         // 0-100
  milestones: string[];
  completedMilestones: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: Date;
  streakHistory: Date[];
}

// Community User Profile Extension
export interface CommunityProfile {
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  level: Difficulty;
  interests: PostCategory[];
  badges: string[];
  points: number;
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
  following: string[];      // User IDs
  followers: string[];      // User IDs
  joinedAt: Date;
  lastActiveAt: Date;
  isVerified?: boolean;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    blog?: string;
  };
}

// Search and Filter Types
export interface SearchFilter {
  query?: string;
  categories?: PostCategory[];
  types?: PostType[];
  difficulties?: Difficulty[];
  tags?: string[];
  authors?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'recent' | 'popular' | 'trending' | 'relevant';
  language?: 'ko' | 'en' | 'both';
}

export interface SearchResult {
  posts: Post[];
  users: CommunityProfile[];
  tags: PostTag[];
  totalCount: number;
  hasMore: boolean;
}

// Feed and Recommendation Types
export interface FeedItem {
  type: 'post' | 'study-session' | 'achievement' | 'milestone';
  content: Post | StudySession | any;
  timestamp: Date;
  priority: number;
}

export interface RecommendationEngine {
  userInterests: PostCategory[];
  userLevel: Difficulty;
  recentActivity: string[];
  followingUsers: string[];
}

// Analytics and Insights
export interface CommunityStats {
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  popularCategories: { category: PostCategory; count: number }[];
  trendingTags: { tag: string; count: number }[];
}

export interface UserActivity {
  userId: string;
  postsCreated: number;
  commentsPosted: number;
  likesGiven: number;
  studySessionsCompleted: number;
  streakDays: number;
  timeSpent: number;        // in minutes
  favoriteCategories: PostCategory[];
  weeklyStats: {
    week: string;
    posts: number;
    comments: number;
    studyTime: number;
  }[];
}

// API Response Types
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