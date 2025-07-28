import { ContentManager } from './content-manager';
import { ALL_CONTENT_PRESETS } from '@/data/content-presets';

// 앱 초기화 함수
export class AppInitializer {
  private static INIT_KEY = 'polarist-app-initialized';
  private static VERSION_KEY = 'polarist-app-version';
  private static CURRENT_VERSION = '2.1.0'; // 문자 학습 시스템 추가

  // 앱 초기화 (한 번만 실행)
  static async initialize(): Promise<void> {
    try {
      const isInitialized = localStorage.getItem(this.INIT_KEY);
      const currentVersion = localStorage.getItem(this.VERSION_KEY);

      // 처음 실행이거나 버전이 업데이트된 경우
      if (!isInitialized || currentVersion !== this.CURRENT_VERSION) {
        console.log('Initializing Polarist App...');
        
        await this.initializeContentDatabase();
        await this.migrateUserData();
        
        localStorage.setItem(this.INIT_KEY, 'true');
        localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
        
        console.log('App initialization completed!');
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }

  // 콘텐츠 데이터베이스 초기화
  private static async initializeContentDatabase(): Promise<void> {
    console.log('Loading content presets...');
    
    // 기존 콘텐츠 확인
    const existingContent = ContentManager.getAllContent();
    
    // 프리셋 콘텐츠가 없거나 부족한 경우 로드
    if (existingContent.length < ALL_CONTENT_PRESETS.length) {
      ALL_CONTENT_PRESETS.forEach(preset => {
        const existing = ContentManager.getContentById(preset.id);
        if (!existing) {
          ContentManager.saveContent(preset);
          console.log(`Loaded preset: ${preset.title}`);
        }
      });
      
      console.log(`Loaded ${ALL_CONTENT_PRESETS.length} content presets`);
    }
  }

  // 사용자 데이터 마이그레이션 (기존 시스템에서 새 시스템으로)
  private static async migrateUserData(): Promise<void> {
    console.log('Checking for data migration...');
    
    try {
      // 기존 단어 진도 데이터를 새로운 콘텐츠 진도로 변환
      const oldProgressKey = 'polarist-learning-progress';
      const newProgressKey = 'polarist-content-progress';
      
      const oldProgress = localStorage.getItem(oldProgressKey);
      const newProgress = localStorage.getItem(newProgressKey);
      
      if (oldProgress && !newProgress) {
        console.log('Migrating learning progress data...');
        
        // 기존 단어 기반 진도를 콘텐츠 기반 진도로 변환
        const wordProgress = JSON.parse(oldProgress);
        const contentProgress: any[] = [];
        
        // 단어장별로 그룹화하여 콘텐츠 진도 생성
        const wordbookGroups = new Map();
        
        wordProgress.forEach((word: any) => {
          // 단어의 카테고리나 난이도를 기반으로 어떤 단어장에 속하는지 추정
          const wordbookId = this.estimateWordbookFromWord(word);
          
          if (!wordbookGroups.has(wordbookId)) {
            wordbookGroups.set(wordbookId, []);
          }
          wordbookGroups.get(wordbookId).push(word);
        });
        
        // 각 단어장에 대한 콘텐츠 진도 생성
        wordbookGroups.forEach((words, wordbookId) => {
          const learnedWords = words.filter((w: any) => w.isLearned).length;
          const totalWords = words.length;
          const completionPercentage = Math.round((learnedWords / totalWords) * 100);
          
          contentProgress.push({
            contentId: wordbookId,
            contentType: 'wordbook',
            isCompleted: completionPercentage >= 100,
            completedAt: completionPercentage >= 100 ? new Date().toISOString() : undefined,
            startedAt: new Date(Math.min(...words.map((w: any) => new Date(w.lastStudied || Date.now()).getTime()))).toISOString(),
            lastAccessedAt: new Date(Math.max(...words.map((w: any) => new Date(w.lastStudied || Date.now()).getTime()))).toISOString(),
            totalTimeSpent: words.reduce((sum: number, w: any) => sum + (w.attempts || 0) * 2, 0), // 추정
            itemsCompleted: learnedWords,
            totalItems: totalWords,
            completionPercentage
          });
        });
        
        localStorage.setItem(newProgressKey, JSON.stringify(contentProgress));
        console.log(`Migrated progress for ${contentProgress.length} content items`);
      }
    } catch (error) {
      console.warn('Data migration failed, but app will continue:', error);
    }
  }

  // 단어에서 단어장 ID 추정 (간단한 휴리스틱)
  private static estimateWordbookFromWord(word: any): string {
    if (!word.difficulty) return 'wordbook-beginner';
    
    switch (word.difficulty) {
      case 'absolute-beginner':
        return 'wordbook-absolute-beginner';
      case 'beginner':
        return word.category === 'family' ? 'wordbook-family-relationships' :
               word.category === 'food' ? 'wordbook-food-restaurant' :
               'wordbook-beginner';
      case 'intermediate':
        return word.category === 'music' ? 'wordbook-kpop-culture' :
               word.category === 'travel' ? 'wordbook-travel-transportation' :
               'wordbook-intermediate';
      case 'advanced':
        return 'wordbook-advanced';
      default:
        return 'wordbook-beginner';
    }
  }

  // 개발용: 데이터베이스 리셋
  static resetDatabase(): void {
    ContentManager.clearAllData();
    localStorage.removeItem(this.INIT_KEY);
    localStorage.removeItem(this.VERSION_KEY);
    console.log('Database reset completed');
  }

  // 앱 상태 확인
  static getAppStatus() {
    const isInitialized = localStorage.getItem(this.INIT_KEY);
    const version = localStorage.getItem(this.VERSION_KEY);
    const contentCount = ContentManager.getAllContent().length;
    
    return {
      isInitialized: !!isInitialized,
      version: version || 'unknown',
      currentVersion: this.CURRENT_VERSION,
      needsUpdate: version !== this.CURRENT_VERSION,
      contentCount
    };
  }
}