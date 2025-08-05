import { Difficulty, Category } from '@/lib/types';
import { SENTENCE_PRESETS, getSentencesByCategory, getSentencesByDifficulty } from './sentence-presets';

// 문장 컬렉션 프리셋 인터페이스
export interface SentenceCollectionPreset {
  id: string;
  titleKey: string; // 번역 키
  descriptionKey: string; // 번역 키
  icon: string;
  color: string;
  difficulty: Difficulty;
  category: Category;
  sentenceCount: number;
  grammarFocus?: string[];
  vocabularyLevel?: string;
}

export const SENTENCE_COLLECTION_PRESETS: SentenceCollectionPreset[] = [
  // 기본 인사 및 예의
  {
    id: 'greetings-basic',
    titleKey: 'sentences.greetingsBasic',
    descriptionKey: 'sentences.greetingsBasicDesc',
    icon: '🙏',
    color: 'bg-green-500',
    difficulty: 'absolute-beginner',
    category: 'greetings',
    sentenceCount: getSentencesByCategory('greetings').length,
    grammarFocus: ['honorifics', 'greetings', 'departures'],
    vocabularyLevel: 'Essential'
  },

  // 일상 대화
  {
    id: 'daily-conversations',
    titleKey: 'sentences.dailyConversations',
    descriptionKey: 'sentences.dailyConversationsDesc',
    icon: '💭',
    color: 'bg-blue-500',
    difficulty: 'beginner',
    category: 'basic',
    sentenceCount: 8, // estimate based on common daily conversation sentences
    grammarFocus: ['questions', 'responses', 'personal-info'],
    vocabularyLevel: 'Basic'
  },

  // 레스토랑 주문
  {
    id: 'restaurant-ordering',
    titleKey: 'sentences.restaurantOrdering',
    descriptionKey: 'sentences.restaurantOrderingDesc',
    icon: '🍜',
    color: 'bg-orange-500',
    difficulty: 'beginner',
    category: 'food',
    sentenceCount: getSentencesByCategory('food').length,
    grammarFocus: ['polite-requests', 'food-ordering', 'service-requests'],
    vocabularyLevel: 'Food & Restaurant'
  },

  // 쇼핑 및 시장
  {
    id: 'shopping-market',
    titleKey: 'sentences.shoppingMarket',
    descriptionKey: 'sentences.shoppingMarketDesc',
    icon: '🛒',
    color: 'bg-purple-500',
    difficulty: 'intermediate',
    category: 'shopping',
    sentenceCount: getSentencesByCategory('shopping').length,
    grammarFocus: ['questions', 'prices', 'alternatives', 'adjectives'],
    vocabularyLevel: 'Shopping'
  },

  // 여행 및 교통
  {
    id: 'travel-transportation',
    titleKey: 'sentences.travelTransportation',
    descriptionKey: 'sentences.travelTransportationDesc',
    icon: '🚌',
    color: 'bg-cyan-500',
    difficulty: 'intermediate',
    category: 'travel',
    sentenceCount: 6, // estimate for travel sentences
    grammarFocus: ['directions', 'transportation', 'locations'],
    vocabularyLevel: 'Travel'
  },

  // 학교 및 업무
  {
    id: 'school-work',
    titleKey: 'sentences.schoolWork',
    descriptionKey: 'sentences.schoolWorkDesc',
    icon: '📚',
    color: 'bg-indigo-500',
    difficulty: 'intermediate',
    category: 'basic',
    sentenceCount: 5, // estimate for school/work sentences
    grammarFocus: ['formal-speech', 'schedules', 'descriptions'],
    vocabularyLevel: 'Academic'
  },

  // 건강 및 병원
  {
    id: 'health-medical',
    titleKey: 'sentences.healthMedical',
    descriptionKey: 'sentences.healthMedicalDesc',
    icon: '🏥',
    color: 'bg-red-500',
    difficulty: 'advanced',
    category: 'health',
    sentenceCount: 4, // estimate for health sentences
    grammarFocus: ['symptoms', 'medical-terms', 'formal-requests'],
    vocabularyLevel: 'Medical'
  },

  // 감정 및 의견
  {
    id: 'emotions-opinions',
    titleKey: 'sentences.emotionsOpinions',
    descriptionKey: 'sentences.emotionsOpinionsDesc',
    icon: '😊',
    color: 'bg-pink-500',
    difficulty: 'advanced',
    category: 'emotions',
    sentenceCount: 3, // estimate for emotion sentences
    grammarFocus: ['emotions', 'opinions', 'complex-expressions'],
    vocabularyLevel: 'Advanced'
  }
];

// 난이도별로 그룹화
export const SENTENCE_DIFFICULTY_GROUPS = [
  {
    id: 'beginner-sentences',
    titleKey: 'sentences.beginnerLevel',
    presets: SENTENCE_COLLECTION_PRESETS.filter(preset => 
      preset.difficulty === 'absolute-beginner' || 
      preset.difficulty === 'beginner'
    ),
  },
  {
    id: 'intermediate-sentences', 
    titleKey: 'sentences.intermediateLevel',
    presets: SENTENCE_COLLECTION_PRESETS.filter(preset => 
      preset.difficulty === 'intermediate'
    ),
  },
  {
    id: 'advanced-sentences',
    titleKey: 'sentences.advancedLevel', 
    presets: SENTENCE_COLLECTION_PRESETS.filter(preset => 
      preset.difficulty === 'advanced' || 
      preset.difficulty === 'upper-intermediate'
    ),
  },
];

// 실제 문장 데이터 가져오기 함수들
export const getSentencesByCollectionId = (collectionId: string) => {
  const collection = SENTENCE_COLLECTION_PRESETS.find(preset => preset.id === collectionId);
  if (!collection) return [];

  switch (collectionId) {
    case 'greetings-basic':
      return getSentencesByCategory('greetings');
    case 'restaurant-ordering':
      return getSentencesByCategory('food');
    case 'shopping-market':
      return getSentencesByCategory('shopping');
    case 'daily-conversations':
      return SENTENCE_PRESETS.filter(s => 
        s.grammar?.some(g => ['questions', 'responses', 'personal-info'].includes(g))
      );
    case 'travel-transportation':
      return getSentencesByCategory('travel');
    case 'school-work':
      return SENTENCE_PRESETS.filter(s => 
        s.grammar?.some(g => ['formal-speech', 'schedules', 'descriptions'].includes(g))
      );
    case 'health-medical':
      return getSentencesByCategory('health');
    case 'emotions-opinions':
      return getSentencesByCategory('emotions');
    default:
      return [];
  }
};