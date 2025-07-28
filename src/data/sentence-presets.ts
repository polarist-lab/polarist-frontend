import { KoreanSentence, Difficulty, Category } from '@/lib/types';
import { getRandomWordSet } from './expanded-korean-words';

// 한국어 문장 데이터 프리셋들
export const SENTENCE_PRESETS: KoreanSentence[] = [
  // === 기본 인사 및 예의 ===
  {
    id: 1,
    korean: '안녕하세요.',
    english: 'Hello. (formal)',
    pronunciation: 'an-nyeong-ha-se-yo',
    grammar: ['honorifics', 'greetings'],
    vocabulary: getRandomWordSet(1, ['greetings'], ['absolute-beginner'], 90),
    difficulty: 'absolute-beginner',
    category: 'greetings',
    notes: 'Most common formal greeting in Korean'
  },
  {
    id: 2,
    korean: '안녕히 가세요.',
    english: 'Goodbye. (to someone leaving)',
    pronunciation: 'an-nyeong-hi ga-se-yo',
    grammar: ['honorifics', 'departures'],
    vocabulary: getRandomWordSet(2, ['greetings'], ['absolute-beginner'], 90),
    difficulty: 'absolute-beginner',
    category: 'greetings',
    notes: 'Used when you are staying and someone else is leaving'
  },
  {
    id: 3,
    korean: '감사합니다.',
    english: 'Thank you. (formal)',
    pronunciation: 'gam-sa-ham-ni-da',
    grammar: ['honorifics', 'gratitude'],
    vocabulary: getRandomWordSet(1, ['greetings'], ['absolute-beginner'], 90),
    difficulty: 'absolute-beginner',
    category: 'greetings',
    notes: 'Formal way to express gratitude'
  },
  {
    id: 4,
    korean: '죄송합니다.',
    english: 'I\'m sorry. (formal)',
    pronunciation: 'joe-song-ham-ni-da',
    grammar: ['honorifics', 'apologies'],
    vocabulary: getRandomWordSet(1, ['greetings'], ['absolute-beginner'], 90),
    difficulty: 'absolute-beginner',
    category: 'greetings',
    notes: 'Formal apology for mistakes or inconvenience'
  },
  {
    id: 5,
    korean: '실례합니다.',
    english: 'Excuse me. (formal)',
    pronunciation: 'sil-lye-ham-ni-da',
    grammar: ['honorifics', 'politeness'],
    vocabulary: getRandomWordSet(1, ['greetings'], ['absolute-beginner'], 90),
    difficulty: 'absolute-beginner',
    category: 'greetings',
    notes: 'Used to get attention politely or when interrupting'
  },

  // === 일상 대화 ===
  {
    id: 6,
    korean: '이름이 뭐예요?',
    english: 'What is your name?',
    pronunciation: 'i-reum-i mwo-ye-yo',
    grammar: ['questions', 'present-tense', 'polite-form'],
    vocabulary: getRandomWordSet(2, ['basic'], ['beginner'], 80),
    difficulty: 'beginner',
    category: 'basic',
    notes: 'Polite way to ask someone\'s name'
  },
  {
    id: 7,
    korean: '저는 한국어를 배워요.',
    english: 'I am learning Korean.',
    pronunciation: 'jeo-neun han-gug-eo-reul bae-wo-yo',
    grammar: ['present-continuous', 'object-marking', 'humble-form'],
    vocabulary: getRandomWordSet(3, ['basic', 'education'], ['beginner'], 80),
    difficulty: 'beginner',
    category: 'basic',
    notes: 'Useful sentence when introducing yourself to Korean speakers'
  },
  {
    id: 8,
    korean: '어디에 살아요?',
    english: 'Where do you live?',
    pronunciation: 'eo-di-e sa-ra-yo',
    grammar: ['questions', 'location', 'present-tense'],
    vocabulary: getRandomWordSet(2, ['basic', 'places'], ['beginner'], 80),
    difficulty: 'beginner',
    category: 'basic',
    notes: 'Common question in getting-to-know-you conversations'
  },
  {
    id: 9,
    korean: '몇 살이에요?',
    english: 'How old are you?',
    pronunciation: 'myeot sal-i-e-yo',
    grammar: ['questions', 'numbers', 'age'],
    vocabulary: getRandomWordSet(2, ['numbers', 'basic'], ['beginner'], 80),
    difficulty: 'beginner',
    category: 'basic',
    notes: 'Age is commonly asked in Korean culture for appropriate language use'
  },
  {
    id: 10,
    korean: '오늘 날씨가 좋아요.',
    english: 'The weather is nice today.',
    pronunciation: 'o-neul nal-ssi-ga jo-a-yo',
    grammar: ['present-tense', 'adjectives', 'subject-marking'],
    vocabulary: getRandomWordSet(3, ['weather', 'basic'], ['beginner'], 80),
    difficulty: 'beginner',
    category: 'daily-life',
    notes: 'Common small talk about weather'
  },

  // === 식당 주문 ===
  {
    id: 11,
    korean: '메뉴 좀 보여주세요.',
    english: 'Please show me the menu.',
    pronunciation: 'me-nyu jom bo-yeo-ju-se-yo',
    grammar: ['polite-requests', 'object-requests'],
    vocabulary: getRandomWordSet(2, ['food'], ['beginner'], 70),
    difficulty: 'beginner',
    category: 'food',
    notes: 'Essential phrase for dining out'
  },
  {
    id: 12,
    korean: '이거 얼마예요?',
    english: 'How much is this?',
    pronunciation: 'i-geo eol-ma-ye-yo',
    grammar: ['questions', 'demonstratives', 'price'],
    vocabulary: getRandomWordSet(2, ['shopping', 'numbers'], ['beginner'], 70),
    difficulty: 'beginner',
    category: 'shopping',
    notes: 'Useful for asking prices in restaurants and shops'
  },
  {
    id: 13,
    korean: '김치찌개 하나 주세요.',
    english: 'Please give me one kimchi stew.',
    pronunciation: 'gim-chi-jji-gae ha-na ju-se-yo',
    grammar: ['polite-requests', 'counters', 'food-ordering'],
    vocabulary: getRandomWordSet(3, ['food'], ['beginner'], 70),
    difficulty: 'beginner',
    category: 'food',
    notes: 'Standard format for ordering food: [dish] + [quantity] + 주세요'
  },
  {
    id: 14,
    korean: '물 좀 더 주세요.',
    english: 'Please give me some more water.',
    pronunciation: 'mul jom deo ju-se-yo',
    grammar: ['polite-requests', 'quantity-words'],
    vocabulary: getRandomWordSet(2, ['food', 'basic'], ['beginner'], 70),
    difficulty: 'beginner',
    category: 'food',
    notes: 'Useful for requesting refills in restaurants'
  },
  {
    id: 15,
    korean: '계산해 주세요.',
    english: 'Please give me the bill.',
    pronunciation: 'gye-san-hae ju-se-yo',
    grammar: ['polite-requests', 'service-requests'],
    vocabulary: getRandomWordSet(1, ['food', 'shopping'], ['beginner'], 70),
    difficulty: 'beginner',
    category: 'food',
    notes: 'How to ask for the check at restaurants'
  },

  // === 쇼핑 및 시장 ===
  {
    id: 16,
    korean: '이거 더 싸게 안 돼요?',
    english: 'Can\'t you make this cheaper?',
    pronunciation: 'i-geo deo ssa-ge an dwae-yo',
    grammar: ['negotiations', 'comparatives', 'polite-requests'],
    vocabulary: getRandomWordSet(3, ['shopping'], ['intermediate'], 60),
    difficulty: 'intermediate',
    category: 'shopping',
    notes: 'Bargaining phrase commonly used in traditional markets'
  },
  {
    id: 17,
    korean: '카드로 계산할게요.',
    english: 'I\'ll pay by card.',
    pronunciation: 'ka-deu-ro gye-san-hal-ge-yo',
    grammar: ['future-intention', 'payment-methods'],
    vocabulary: getRandomWordSet(2, ['shopping'], ['intermediate'], 60),
    difficulty: 'intermediate', 
    category: 'shopping',
    notes: 'Modern payment method preference'
  },
  {
    id: 18,
    korean: '포장해 주세요.',
    english: 'Please wrap it up (for takeout).',
    pronunciation: 'po-jang-hae ju-se-yo',
    grammar: ['polite-requests', 'service-requests'],
    vocabulary: getRandomWordSet(1, ['shopping', 'food'], ['intermediate'], 60),
    difficulty: 'intermediate',
    category: 'shopping',
    notes: 'Useful for takeout orders or gift wrapping'
  },
  {
    id: 19,
    korean: '사이즈가 좀 커요.',
    english: 'The size is a bit big.',
    pronunciation: 'sa-i-jeu-ga jom keo-yo',
    grammar: ['adjectives', 'size-descriptions', 'degree-adverbs'],
    vocabulary: getRandomWordSet(2, ['clothing', 'shopping'], ['intermediate'], 60),
    difficulty: 'intermediate',
    category: 'shopping',
    notes: 'Useful when trying on clothes or shoes'
  },
  {
    id: 20,
    korean: '다른 색깔 있어요?',
    english: 'Do you have other colors?',
    pronunciation: 'da-reun saek-kkal i-sseo-yo',
    grammar: ['questions', 'existence', 'alternatives'],
    vocabulary: getRandomWordSet(2, ['colors', 'shopping'], ['intermediate'], 60),
    difficulty: 'intermediate',
    category: 'shopping',
    notes: 'Common question when shopping for clothes or accessories'
  }
];

// 카테고리별 문장 분류
export const getSentencesByCategory = (category: Category): KoreanSentence[] => {
  return SENTENCE_PRESETS.filter(sentence => sentence.category === category);
};

// 난이도별 문장 분류
export const getSentencesByDifficulty = (difficulty: Difficulty): KoreanSentence[] => {
  return SENTENCE_PRESETS.filter(sentence => sentence.difficulty === difficulty);
};

// 문법 포인트별 문장 분류
export const getSentencesByGrammar = (grammar: string): KoreanSentence[] => {
  return SENTENCE_PRESETS.filter(sentence => 
    sentence.grammar && sentence.grammar.includes(grammar)
  );
};

// 랜덤 문장 선택
export const getRandomSentences = (
  count: number,
  categories?: Category[],
  difficulties?: Difficulty[],
  grammarPoints?: string[]
): KoreanSentence[] => {
  let filtered = SENTENCE_PRESETS;

  if (categories && categories.length > 0) {
    filtered = filtered.filter(s => categories.includes(s.category));
  }

  if (difficulties && difficulties.length > 0) {
    filtered = filtered.filter(s => difficulties.includes(s.difficulty));
  }

  if (grammarPoints && grammarPoints.length > 0) {
    filtered = filtered.filter(s => 
      s.grammar && s.grammar.some(g => grammarPoints.includes(g))
    );
  }

  // 랜덤 셔플 및 선택
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// 문장집 프리셋별 문장 조회
export const getSentencesByPresetId = (presetId: string): KoreanSentence[] => {
  switch (presetId) {
    case 'sentences-greetings-basic':
      return SENTENCE_PRESETS.slice(0, 5); // 기본 인사 5개
    case 'sentences-daily-conversations':
      return SENTENCE_PRESETS.slice(5, 10); // 일상 대화 5개
    case 'sentences-restaurant-ordering':
      return SENTENCE_PRESETS.slice(10, 15); // 식당 주문 5개
    case 'sentences-shopping-market':
      return SENTENCE_PRESETS.slice(15, 20); // 쇼핑 5개
    default:
      return [];
  }
};