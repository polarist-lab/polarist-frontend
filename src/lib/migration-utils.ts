import { WordbookPreset } from '@/data/wordbook-presets';
import { LearningContent, WordbookMetadata } from './types';

// 기존 WordbookPreset을 새로운 LearningContent로 변환
export function migrateWordbookPresetToContent(preset: WordbookPreset): LearningContent {
  return {
    id: `wordbook-${preset.id}`,
    type: 'wordbook',
    authorType: 'official',
    title: preset.titleKey, // 추후 번역 키에서 실제 제목으로 변환 필요
    description: preset.descriptionKey, // 추후 번역 키에서 실제 설명으로 변환 필요
    difficulty: preset.difficulties[0], // 첫 번째 난이도를 기본으로 사용
    categories: preset.categories || ['basic'],
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [preset.difficulties[0], 'wordbook'],
    estimatedDuration: Math.round(preset.wordCount / 2), // 단어당 30초 추정
    icon: preset.icon,
    color: preset.color,
    metadata: {
      wordCount: preset.wordCount,
      minFrequency: preset.minFrequency,
      difficulties: preset.difficulties
    } as WordbookMetadata
  };
}

// 기존 단어장 프리셋들을 모두 마이그레이션
export function migrateAllWordbookPresets(presets: WordbookPreset[]): LearningContent[] {
  return presets.map(migrateWordbookPresetToContent);
}

// 번역 키를 실제 텍스트로 변환하는 헬퍼 함수
export function resolveTranslationKeys(
  content: LearningContent, 
  titleMap: Record<string, string>,
  descriptionMap: Record<string, string>
): LearningContent {
  return {
    ...content,
    title: titleMap[content.title] || content.title,
    description: descriptionMap[content.description] || content.description
  };
}

// 기존 워드북 ID를 새로운 콘텐츠 ID로 변환
export function convertWordbookIdToContentId(wordbookId: string): string {
  // 이미 새로운 형식인지 확인
  if (wordbookId.startsWith('wordbook-')) {
    return wordbookId;
  }
  return `wordbook-${wordbookId}`;
}

// 새로운 콘텐츠 ID를 기존 워드북 ID로 변환 (하위 호환성)
export function convertContentIdToWordbookId(contentId: string): string {
  if (contentId.startsWith('wordbook-')) {
    return contentId.replace('wordbook-', '');
  }
  return contentId;
}

// 기존 학습 진도 데이터를 새로운 콘텐츠 시스템에 맞게 마이그레이션
export function migrateLearningProgressToContentProgress() {
  const oldProgressKey = 'polarist-learning-progress';
  const newProgressKey = 'polarist-content-progress';
  
  try {
    const oldProgress = localStorage.getItem(oldProgressKey);
    if (!oldProgress) return;
    
    const existingNewProgress = localStorage.getItem(newProgressKey);
    if (existingNewProgress) return; // 이미 마이그레이션됨
    
    // 기존 단어 기반 진도를 콘텐츠 기반 진도로 변환하는 로직
    // 실제 구현에서는 더 정교한 변환 로직이 필요
    console.log('Migration would happen here - converting word-based progress to content-based progress');
  } catch (error) {
    console.error('Failed to migrate learning progress:', error);
  }
}

// 콘텐츠 데이터베이스 초기 설정
export function initializeContentDatabase() {
  const contentKey = 'polarist-content-database';
  const existing = localStorage.getItem(contentKey);
  
  if (!existing) {
    // 초기 콘텐츠 데이터를 로드
    import('@/data/content-presets').then(({ ALL_CONTENT_PRESETS }) => {
      localStorage.setItem(contentKey, JSON.stringify(ALL_CONTENT_PRESETS));
      console.log('Content database initialized with presets');
    });
  }
}