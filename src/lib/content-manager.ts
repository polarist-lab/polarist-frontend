import { 
  LearningContent, 
  ContentType, 
  AuthorType, 
  ContentFilter,
  WordbookMetadata,
  SentenceMetadata,
  RoadmapMetadata,
  Difficulty,
  Category 
} from './types';
import { LearningTracker } from './learning-tracker';
import { ALL_CONTENT_PRESETS } from '@/data/content-presets';

// 콘텐츠 관리 클래스
export class ContentManager {
  private static CONTENT_KEY = 'polarist-content-database';
  
  // 모든 콘텐츠 조회
  static getAllContent(): LearningContent[] {
    if (typeof window === 'undefined') return ALL_CONTENT_PRESETS; // 서버 사이드에서는 프리셋 반환
    const saved = localStorage.getItem(this.CONTENT_KEY);
    const userContent = saved ? JSON.parse(saved) : [];
    
    // 프리셋과 사용자 콘텐츠 병합 (프리셋이 우선, 중복 ID는 사용자 콘텐츠가 덮어씀)
    const allContent = [...ALL_CONTENT_PRESETS];
    userContent.forEach((userItem: LearningContent) => {
      const existingIndex = allContent.findIndex(preset => preset.id === userItem.id);
      if (existingIndex >= 0) {
        allContent[existingIndex] = userItem; // 사용자가 수정한 것으로 덮어씀
      } else {
        allContent.push(userItem); // 새로운 사용자 콘텐츠 추가
      }
    });
    
    return allContent;
  }

  // ID로 콘텐츠 조회
  static getContentById(id: string): LearningContent | null {
    const allContent = this.getAllContent();
    const found = allContent.find(c => c.id === id);
    if (!found) {
      // 프리셋에서 직접 조회해보기 (서버/클라이언트 동기화 이슈 대응)
      const presetFound = ALL_CONTENT_PRESETS.find(c => c.id === id);
      return presetFound || null;
    }
    return found;
  }

  // 콘텐츠 저장
  static saveContent(content: LearningContent): void {
    if (typeof window === 'undefined') return; // 서버 사이드에서는 실행하지 않음
    const allContent = this.getAllContent();
    const existingIndex = allContent.findIndex(c => c.id === content.id);
    
    if (existingIndex >= 0) {
      allContent[existingIndex] = { ...content, updatedAt: new Date() };
    } else {
      allContent.push({ ...content, createdAt: new Date(), updatedAt: new Date() });
    }
    
    localStorage.setItem(this.CONTENT_KEY, JSON.stringify(allContent));
  }

  // 콘텐츠 삭제
  static deleteContent(id: string): void {
    if (typeof window === 'undefined') return; // 서버 사이드에서는 실행하지 않음
    const allContent = this.getAllContent();
    const filtered = allContent.filter(c => c.id !== id);
    localStorage.setItem(this.CONTENT_KEY, JSON.stringify(filtered));
  }

  // 필터링된 콘텐츠 조회
  static getFilteredContent(filter: ContentFilter = {}): LearningContent[] {
    let content = this.getAllContent().filter(c => c.isPublished);

    // 콘텐츠 타입 필터
    if (filter.contentType && filter.contentType.length > 0) {
      content = content.filter(c => filter.contentType!.includes(c.type));
    }

    // 작성자 타입 필터
    if (filter.authorType && filter.authorType.length > 0) {
      content = content.filter(c => filter.authorType!.includes(c.authorType));
    }

    // 난이도 필터
    if (filter.difficulty && filter.difficulty.length > 0) {
      content = content.filter(c => filter.difficulty!.includes(c.difficulty));
    }

    // 카테고리 필터
    if (filter.category && filter.category.length > 0) {
      content = content.filter(c => 
        c.categories.some(cat => filter.category!.includes(cat))
      );
    }

    // 태그 필터
    if (filter.tags && filter.tags.length > 0) {
      content = content.filter(c => 
        c.tags.some(tag => filter.tags!.includes(tag))
      );
    }

    // 공식 콘텐츠만 필터
    if (filter.officialOnly) {
      content = content.filter(c => c.authorType === 'official');
    }

    // 완료 상태 필터
    if (filter.completionStatus) {
      const completedIds = LearningTracker.getContentProgress()
        .filter(p => p.isCompleted)
        .map(p => p.contentId);
      const inProgressIds = LearningTracker.getContentProgress()
        .filter(p => !p.isCompleted && p.itemsCompleted > 0)
        .map(p => p.contentId);

      switch (filter.completionStatus) {
        case 'completed':
          content = content.filter(c => completedIds.includes(c.id));
          break;
        case 'in-progress':
          content = content.filter(c => inProgressIds.includes(c.id));
          break;
        case 'not-started':
          content = content.filter(c => 
            !completedIds.includes(c.id) && !inProgressIds.includes(c.id)
          );
          break;
      }
    }

    // 완료된 콘텐츠 제외
    if (filter.excludeCompleted) {
      const completedIds = LearningTracker.getContentProgress()
        .filter(p => p.isCompleted)
        .map(p => p.contentId);
      content = content.filter(c => !completedIds.includes(c.id));
    }

    // 선행 요구사항 필터
    if (filter.prerequisites === 'met') {
      content = content.filter(c => {
        if (!c.prerequisites || c.prerequisites.length === 0) return true;
        return c.prerequisites.every(prereqId => 
          LearningTracker.isContentCompleted(prereqId)
        );
      });
    } else if (filter.prerequisites === 'not-met') {
      content = content.filter(c => {
        if (!c.prerequisites || c.prerequisites.length === 0) return false;
        return !c.prerequisites.every(prereqId => 
          LearningTracker.isContentCompleted(prereqId)
        );
      });
    }

    // 정렬
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'difficulty':
          const difficultyOrder: Difficulty[] = [
            'absolute-beginner', 'beginner', 'intermediate', 
            'upper-intermediate', 'advanced', 'expert'
          ];
          content.sort((a, b) => 
            difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty)
          );
          break;
        case 'recent':
          content.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          break;
        case 'alphabetical':
          content.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'roadmap-order':
          content.sort((a, b) => (a.order || 0) - (b.order || 0));
          break;
        case 'popularity':
          // TODO: 추후 조회수/좋아요 기반 정렬 구현
          break;
      }
    }

    return content;
  }

  // 콘텐츠 타입별 조회
  static getContentByType(type: ContentType): LearningContent[] {
    return this.getFilteredContent({ contentType: [type] });
  }

  // 작성자 타입별 조회
  static getContentByAuthor(authorType: AuthorType): LearningContent[] {
    return this.getFilteredContent({ authorType: [authorType] });
  }

  // 문자 학습 콘텐츠 특화 조회
  static getCharacterContent(): LearningContent[] {
    return this.getContentByType('character');
  }

  // 추천 콘텐츠 조회 (기본 알고리즘)
  static getRecommendedContent(limit: number = 5): LearningContent[] {
    const userProgress = LearningTracker.getContentProgress();
    const completedIds = userProgress.filter(p => p.isCompleted).map(p => p.contentId);
    
    // 1. 공식 콘텐츠 우선
    // 2. 아직 시작하지 않은 콘텐츠
    // 3. 선행 요구사항이 충족된 콘텐츠
    const candidates = this.getFilteredContent({
      officialOnly: true,
      excludeCompleted: true,
      prerequisites: 'met'
    });

    return candidates.slice(0, limit);
  }

  // 검색
  static searchContent(query: string): LearningContent[] {
    const allContent = this.getAllContent().filter(c => c.isPublished);
    const lowercaseQuery = query.toLowerCase();
    
    return allContent.filter(c => 
      c.title.toLowerCase().includes(lowercaseQuery) ||
      c.description.toLowerCase().includes(lowercaseQuery) ||
      c.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // 데이터 초기화
  static clearAllData(): void {
    if (typeof window === 'undefined') return; // 서버 사이드에서는 실행하지 않음
    localStorage.removeItem(this.CONTENT_KEY);
  }

  // 개발용: 더미 데이터 생성
  static generateSampleData(): void {
    const sampleContent: LearningContent[] = [
      {
        id: 'wordbook-absolute-beginner',
        type: 'wordbook',
        authorType: 'official',
        title: 'Absolute Beginner Wordbook',
        description: 'Perfect for complete beginners starting their Korean journey',
        difficulty: 'absolute-beginner',
        categories: ['basic', 'greetings'],
        isPublished: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        tags: ['beginner', 'essential', 'first-words'],
        estimatedDuration: 30,
        icon: '🌱',
        color: 'bg-green-500',
        metadata: {
          wordCount: 50,
          minFrequency: 70,
          difficulties: ['absolute-beginner']
        } as WordbookMetadata
      },
      {
        id: 'sentences-daily-conversations',
        type: 'sentence',
        authorType: 'official',
        title: 'Daily Conversations',
        description: 'Essential sentences for everyday Korean conversations',
        difficulty: 'beginner',
        categories: ['basic', 'daily-life'],
        isPublished: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        tags: ['conversation', 'daily', 'practical'],
        estimatedDuration: 45,
        prerequisites: ['wordbook-absolute-beginner'],
        icon: '💬',
        color: 'bg-blue-500',
        metadata: {
          sentenceCount: 25,
          grammarFocus: ['present-tense', 'questions'],
          vocabularyLevel: 'beginner'
        } as SentenceMetadata
      }
    ];

    sampleContent.forEach(content => this.saveContent(content));
  }
}