// Community Data Manager - Local Storage Based
import { Post, Comment, StudySession, StudyGoal, CommunityProfile, SearchFilter, SearchResult } from './types';

const STORAGE_KEYS = {
  POSTS: 'community_posts',
  COMMENTS: 'community_comments',
  STUDY_SESSIONS: 'study_sessions',
  STUDY_GOALS: 'study_goals',
  USER_PROFILE: 'community_profile',
  USER_INTERACTIONS: 'user_interactions', // likes, bookmarks, etc.
} as const;

// Sample data for development
const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    title: '한국어 존댓말 완전 정복하기',
    content: `# 한국어 존댓말의 이해

한국어를 배우면서 가장 어려운 부분 중 하나가 바로 **존댓말**입니다. 

## 기본 존댓말 형태

### 1. -습니다/-ㅂ니다
- 가장 정중한 형태
- 공식적인 자리에서 사용
- 예: 안녕하십니다, 감사합니다

### 2. -어요/-아요
- 일상적인 존댓말
- 친근하면서도 정중한 표현
- 예: 안녕하세요, 고마워요

## 상황별 사용법

존댓말 사용은 단순히 나이가 많다고 해서 쓰는 것이 아닙니다:

1. **직장에서**: 상사에게는 반드시 존댓말
2. **처음 만나는 사람**: 나이 관계없이 존댓말
3. **서비스업**: 고객에게는 항상 존댓말
4. **가족 관계**: 부모님, 조부모님께는 존댓말

> 💡 **팁**: 확실하지 않으면 존댓말을 사용하는 것이 안전합니다!

언어는 문화를 반영합니다. 한국어의 존댓말 체계는 한국 사회의 위계질서와 상호존중 문화를 나타내죠.`,
    excerpt: '한국어 존댓말 체계에 대한 완전한 가이드. 기본 형태부터 상황별 사용법까지!',
    authorId: 'user_1',
    authorName: '김선생',
    authorAvatar: undefined,
    category: 'grammar',
    type: 'text',
    difficulty: 'intermediate',
    tags: [
      { id: 'tag_1', name: '존댓말', category: 'grammar' },
      { id: 'tag_2', name: '문법', category: 'grammar' },
      { id: 'tag_3', name: '한국문화', category: 'culture' }
    ],
    media: [],
    interactions: {
      likes: 127,
      dislikes: 3,
      comments: 24,
      bookmarks: 89,
      shares: 15,
      views: 1247
    },
    isBookmarked: false,
    userLiked: false,
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    publishedAt: new Date('2024-01-15T10:30:00Z'),
    isPublished: true,
    language: 'ko',
    estimatedReadTime: 5,
    koreanLevel: '중급'
  },
  {
    id: '2',
    title: 'Korean Food Vocabulary Guide',
    content: `# Korean Food Vocabulary 🍜

Learning food vocabulary is essential for anyone visiting or living in Korea!

## Basic Foods (기본 음식)

### Rice Dishes (밥류)
- **밥** (bap) - rice
- **비빔밥** (bibimbap) - mixed rice
- **볶음밥** (bokkeumbap) - fried rice
- **김밥** (gimbap) - rice roll

### Soups (국물 요리)
- **김치찌개** (kimchi-jjigae) - kimchi stew
- **된장찌개** (doenjang-jjigae) - soybean paste stew
- **미역국** (miyeok-guk) - seaweed soup
- **삼계탕** (samgyetang) - ginseng chicken soup

## At a Restaurant (식당에서)

**Useful phrases:**
- 메뉴 좀 주세요 (menyu jom juseyo) - "Menu, please"
- 주문하겠습니다 (jumunhagesseumnida) - "I'd like to order"
- 계산해 주세요 (gyesanhae juseyo) - "Check, please"

## Cultural Tips 🥢

1. **반찬** (banchan) - side dishes come automatically
2. Don't tip - it's not customary in Korea
3. **건배!** (geonbae!) - "Cheers!" when drinking

Try visiting a Korean restaurant and practicing these words!`,
    excerpt: 'Essential Korean food vocabulary for ordering at restaurants and understanding menus.',
    authorId: 'user_2',
    authorName: 'Sarah Kim',
    authorAvatar: undefined,
    category: 'vocabulary',
    type: 'text',
    difficulty: 'beginner',
    tags: [
      { id: 'tag_4', name: 'food', category: 'vocabulary' },
      { id: 'tag_5', name: 'restaurant', category: 'vocabulary' },
      { id: 'tag_6', name: 'culture', category: 'culture' }
    ],
    media: [],
    interactions: {
      likes: 89,
      dislikes: 1,
      comments: 16,
      bookmarks: 67,
      shares: 8,
      views: 892
    },
    isBookmarked: true,
    userLiked: true,
    createdAt: new Date('2024-01-14T15:45:00Z'),
    updatedAt: new Date('2024-01-14T15:45:00Z'),
    publishedAt: new Date('2024-01-14T15:45:00Z'),
    isPublished: true,
    language: 'en',
    estimatedReadTime: 3,
    koreanLevel: '초급'
  },
  {
    id: '3',
    title: 'TOPIK 시험 준비 전략',
    content: `# TOPIK 시험 완벽 대비법 📚

TOPIK(한국어능력시험) 준비하시나요? 효과적인 공부 방법을 공유합니다!

## TOPIK I vs TOPIK II

### TOPIK I (1~2급)
- **듣기**: 30문항 (40분)
- **읽기**: 40문항 (60분)
- 총 200점 만점

### TOPIK II (3~6급)
- **듣기**: 50문항 (60분)
- **읽기**: 50문항 (70분)
- **쓰기**: 4문항 (50분)
- 총 300점 만점

## 영역별 공부법

### 1. 듣기 (Listening)
- ✅ 매일 30분 이상 한국어 듣기
- ✅ 뉴스, 드라마, 팟캐스트 활용
- ✅ 받아쓰기 연습

### 2. 읽기 (Reading)
- ✅ 다양한 장르의 글 읽기
- ✅ 시간 내에 문제 풀기 연습
- ✅ 문맥으로 어휘 추측하기

### 3. 쓰기 (Writing) - TOPIK II만
- ✅ 문장 구조 연습
- ✅ 주제별 에세이 쓰기
- ✅ 시간 배분 연습 (50분)

## 추천 공부 스케줄

### 3개월 계획
1. **1개월차**: 기초 어휘/문법 정리
2. **2개월차**: 실전 문제 풀이
3. **3개월차**: 모의고사 + 약점 보완

### 시험 전 일주일
- 매일 모의고사 1회
- 틀린 문제 복습
- 충분한 휴식

> 💪 **격려**: 꾸준히 하면 반드시 좋은 결과가 있을 것입니다!`,
    excerpt: 'TOPIK 시험 준비를 위한 체계적인 공부 전략과 실전 팁을 제공합니다.',
    authorId: 'user_3',
    authorName: 'TOPIK 전문가',
    authorAvatar: undefined,
    category: 'exam',
    type: 'text',
    difficulty: 'intermediate',
    tags: [
      { id: 'tag_7', name: 'TOPIK', category: 'exam' },
      { id: 'tag_8', name: '시험준비', category: 'exam' },
      { id: 'tag_9', name: '공부법', category: 'general' }
    ],
    media: [],
    interactions: {
      likes: 203,
      dislikes: 5,
      comments: 42,
      bookmarks: 156,
      shares: 28,
      views: 1893
    },
    isBookmarked: false,
    userLiked: false,
    createdAt: new Date('2024-01-13T09:15:00Z'),
    updatedAt: new Date('2024-01-13T09:15:00Z'),
    publishedAt: new Date('2024-01-13T09:15:00Z'),
    isPublished: true,
    language: 'ko',
    estimatedReadTime: 7,
    koreanLevel: '중급'
  },
  {
    id: '4',
    title: 'Korean Pronunciation Tips for English Speakers',
    content: `# Korean Pronunciation Mastery 🗣️

Korean pronunciation can be tricky for English speakers. Here are the most important tips!

## Challenging Sounds

### 1. ㅓ vs ㅗ
- **ㅓ** (eo): More like "uh" in "hut"
- **ㅗ** (o): Like "o" in "boat"
- Practice: 거 vs 고, 서 vs 소

### 2. ㅡ (eu)
- No direct English equivalent
- Like "oo" but with spread lips
- Practice: 으, 크, 블랙

### 3. Double Consonants
- **ㄲ, ㄸ, ㅃ, ㅆ, ㅉ**
- More tense, not just louder
- Hold your breath briefly before release

## Consonant Position Matters

### Initial vs Final
- **ㅂ** initial: [b] sound
- **ㅂ** final: [p] sound (unreleased)
- **ㄱ** initial: [g] sound  
- **ㄱ** final: [k] sound (unreleased)

## Intonation Patterns

Korean has relatively flat intonation compared to English:
- Questions: slight rise at the end
- Statements: flat or slight fall
- Emphasis: longer vowel duration

## Practice Exercises

1. **Minimal Pairs**: 갈 vs 걸, 말 vs 멀
2. **Tongue Twisters**: 간장공장공장장 (ganjang gongjang gongjangjang)
3. **Record Yourself**: Compare with native speakers

## Tools for Practice
- Forvo (pronunciation dictionary)
- Naver Dictionary (audio)
- Speechling (feedback from natives)

Remember: perfection isn't necessary for communication!`,
    excerpt: 'Essential pronunciation tips for English speakers learning Korean, focusing on the most challenging sounds.',
    authorId: 'user_4',
    authorName: 'Dr. Park',
    authorAvatar: undefined,
    category: 'pronunciation',
    type: 'text',
    difficulty: 'beginner',
    tags: [
      { id: 'tag_10', name: 'pronunciation', category: 'pronunciation' },
      { id: 'tag_11', name: 'speaking', category: 'pronunciation' },
      { id: 'tag_12', name: 'phonetics', category: 'pronunciation' }
    ],
    media: [],
    interactions: {
      likes: 142,
      dislikes: 2,
      comments: 31,
      bookmarks: 98,
      shares: 19,
      views: 1156
    },
    isBookmarked: true,
    userLiked: false,
    createdAt: new Date('2024-01-12T14:20:00Z'),
    updatedAt: new Date('2024-01-12T14:20:00Z'),
    publishedAt: new Date('2024-01-12T14:20:00Z'),
    isPublished: true,
    language: 'en',
    estimatedReadTime: 4,
    koreanLevel: '초급'
  }
];

export class CommunityDataManager {
  // Posts Management
  static getAllPosts(): Post[] {
    if (typeof window === 'undefined') return SAMPLE_POSTS;
    
    const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (stored) {
      const posts = JSON.parse(stored);
      return posts.map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
      }));
    }
    
    // Initialize with sample data
    this.savePosts(SAMPLE_POSTS);
    return SAMPLE_POSTS;
  }

  static getPostsByCategory(category: string): Post[] {
    const posts = this.getAllPosts();
    if (category === 'all') return posts;
    return posts.filter(post => post.category === category);
  }

  static getPost(id: string): Post | null {
    const posts = this.getAllPosts();
    return posts.find(post => post.id === id) || null;
  }

  static savePosts(posts: Post[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }

  static addPost(post: Post): void {
    const posts = this.getAllPosts();
    posts.unshift(post); // Add to beginning
    this.savePosts(posts);
  }

  static updatePost(id: string, updates: Partial<Post>): boolean {
    const posts = this.getAllPosts();
    const index = posts.findIndex(post => post.id === id);
    if (index === -1) return false;
    
    posts[index] = { ...posts[index], ...updates, updatedAt: new Date() };
    this.savePosts(posts);
    return true;
  }

  static deletePost(id: string): boolean {
    const posts = this.getAllPosts();
    const filtered = posts.filter(post => post.id !== id);
    if (filtered.length === posts.length) return false;
    
    this.savePosts(filtered);
    return true;
  }

  // Interaction Management
  static getUserInteractions(): Record<string, {likes: string[], bookmarks: string[]}> {
    if (typeof window === 'undefined') return {};
    
    const stored = localStorage.getItem(STORAGE_KEYS.USER_INTERACTIONS);
    return stored ? JSON.parse(stored) : {};
  }

  static saveUserInteractions(interactions: Record<string, {likes: string[], bookmarks: string[]}>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_INTERACTIONS, JSON.stringify(interactions));
  }

  static toggleLike(postId: string, userId: string = 'current_user'): boolean {
    const posts = this.getAllPosts();
    const interactions = this.getUserInteractions();
    
    if (!interactions[userId]) {
      interactions[userId] = { likes: [], bookmarks: [] };
    }

    const userLikes = interactions[userId].likes;
    const isLiked = userLikes.includes(postId);
    
    if (isLiked) {
      interactions[userId].likes = userLikes.filter(id => id !== postId);
    } else {
      interactions[userId].likes.push(postId);
    }

    // Update post like count
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].interactions.likes += isLiked ? -1 : 1;
      posts[postIndex].userLiked = !isLiked;
      this.savePosts(posts);
    }

    this.saveUserInteractions(interactions);
    return !isLiked;
  }

  static toggleBookmark(postId: string, userId: string = 'current_user'): boolean {
    const posts = this.getAllPosts();
    const interactions = this.getUserInteractions();
    
    if (!interactions[userId]) {
      interactions[userId] = { likes: [], bookmarks: [] };
    }

    const userBookmarks = interactions[userId].bookmarks;
    const isBookmarked = userBookmarks.includes(postId);
    
    if (isBookmarked) {
      interactions[userId].bookmarks = userBookmarks.filter(id => id !== postId);
    } else {
      interactions[userId].bookmarks.push(postId);
    }

    // Update post bookmark count
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].interactions.bookmarks += isBookmarked ? -1 : 1;
      posts[postIndex].isBookmarked = !isBookmarked;
      this.savePosts(posts);
    }

    this.saveUserInteractions(interactions);
    return !isBookmarked;
  }

  // Search
  static searchPosts(filter: SearchFilter): SearchResult {
    let posts = this.getAllPosts();

    // Apply filters
    if (filter.query) {
      const query = filter.query.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.name.toLowerCase().includes(query))
      );
    }

    if (filter.categories && filter.categories.length > 0) {
      posts = posts.filter(post => filter.categories!.includes(post.category));
    }

    if (filter.difficulties && filter.difficulties.length > 0) {
      posts = posts.filter(post => filter.difficulties!.includes(post.difficulty));
    }

    if (filter.types && filter.types.length > 0) {
      posts = posts.filter(post => filter.types!.includes(post.type));
    }

    if (filter.language && filter.language !== 'both') {
      posts = posts.filter(post => post.language === filter.language || post.language === 'both');
    }

    // Apply sorting
    switch (filter.sortBy) {
      case 'popular':
        posts.sort((a, b) => b.interactions.likes - a.interactions.likes);
        break;
      case 'trending':
        posts.sort((a, b) => (b.interactions.likes + b.interactions.views) - (a.interactions.likes + a.interactions.views));
        break;
      case 'recent':
      default:
        posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return {
      posts,
      users: [], // TODO: Implement user search
      tags: [], // TODO: Implement tag search
      totalCount: posts.length,
      hasMore: false
    };
  }

  // Initialize user interactions from posts
  static syncUserInteractions(): void {
    const posts = this.getAllPosts();
    const interactions = this.getUserInteractions();
    const userId = 'current_user';

    if (!interactions[userId]) {
      interactions[userId] = { likes: [], bookmarks: [] };
    }

    // Sync based on post userLiked/isBookmarked flags
    posts.forEach(post => {
      if (post.userLiked && !interactions[userId].likes.includes(post.id)) {
        interactions[userId].likes.push(post.id);
      }
      if (post.isBookmarked && !interactions[userId].bookmarks.includes(post.id)) {
        interactions[userId].bookmarks.push(post.id);
      }
    });

    this.saveUserInteractions(interactions);
  }
}

// Initialize data on import
if (typeof window !== 'undefined') {
  CommunityDataManager.syncUserInteractions();
}