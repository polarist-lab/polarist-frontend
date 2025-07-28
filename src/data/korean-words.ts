import { KoreanWord, Category } from '@/lib/types';
import { WordExtractor } from '@/lib/word-extractor';
import { CurationEngine } from '@/lib/curation-engine';

// Dynamic Korean vocabulary - curated from our 200+ word pool
// This provides smart, personalized word selection based on user progress
export const koreanWords: KoreanWord[] = getDefaultWordSet();

// Get default word set using smart curation
function getDefaultWordSet(): KoreanWord[] {
  try {
    // Try to get personalized set first, fallback to balanced beginner set
    const result = WordExtractor.getBalancedSet(100);
    return result.words;
  } catch {
    console.warn('Failed to load curated word set, using fallback');
    return getFallbackWords();
  }
}

// Fallback word set (essential core words)
function getFallbackWords(): KoreanWord[] {
  return [
  // TIER 1: ESSENTIAL GREETINGS & BASICS (Frequency 95-100)
  {
    id: 1,
    korean: '안녕하세요',
    english: 'Hello',
    pronunciation: 'annyeonghaseyo',
    category: 'greetings',
    difficulty: 'beginner',
    frequency: 100
  },
  {
    id: 2,
    korean: '네',
    english: 'Yes',
    pronunciation: 'ne',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 99
  },
  {
    id: 3,
    korean: '아니요',
    english: 'No',
    pronunciation: 'aniyo',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 98
  },
  {
    id: 4,
    korean: '감사합니다',
    english: 'Thank you',
    pronunciation: 'gamsahamnida',
    category: 'greetings',
    difficulty: 'beginner',
    frequency: 97
  },
  {
    id: 5,
    korean: '죄송합니다',
    english: 'Sorry',
    pronunciation: 'joesonghamnida',
    category: 'greetings',
    difficulty: 'beginner',
    frequency: 96
  },

  // TIER 2: CORE VERBS (Frequency 90-95)
  {
    id: 6,
    korean: '하다',
    english: 'to do',
    pronunciation: 'hada',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 95
  },
  {
    id: 7,
    korean: '있다',
    english: 'to exist/have',
    pronunciation: 'itda',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 94
  },
  {
    id: 8,
    korean: '가다',
    english: 'to go',
    pronunciation: 'gada',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 93
  },
  {
    id: 9,
    korean: '오다',
    english: 'to come',
    pronunciation: 'oda',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 92
  },
  {
    id: 10,
    korean: '보다',
    english: 'to see/watch',
    pronunciation: 'boda',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 91
  },
  {
    id: 11,
    korean: '먹다',
    english: 'to eat',
    pronunciation: 'meokda',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 90
  },

  // TIER 3: ESSENTIAL NOUNS (Frequency 85-89)
  {
    id: 12,
    korean: '사람',
    english: 'person',
    pronunciation: 'saram',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 89
  },
  {
    id: 13,
    korean: '시간',
    english: 'time',
    pronunciation: 'sigan',
    category: 'time',
    difficulty: 'beginner',
    frequency: 88
  },
  {
    id: 14,
    korean: '돈',
    english: 'money',
    pronunciation: 'don',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 87
  },
  {
    id: 15,
    korean: '집',
    english: 'house/home',
    pronunciation: 'jip',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 86
  },
  {
    id: 16,
    korean: '학교',
    english: 'school',
    pronunciation: 'hakgyo',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 85
  },

  // TIER 4: FAMILY & RELATIONSHIPS (Frequency 80-84)
  {
    id: 17,
    korean: '아버지',
    english: 'father',
    pronunciation: 'abeoji',
    category: 'family',
    difficulty: 'beginner',
    frequency: 84
  },
  {
    id: 18,
    korean: '어머니',
    english: 'mother',
    pronunciation: 'eomeoni',
    category: 'family',
    difficulty: 'beginner',
    frequency: 84
  },
  {
    id: 19,
    korean: '친구',
    english: 'friend',
    pronunciation: 'chingu',
    category: 'family',
    difficulty: 'beginner',
    frequency: 83
  },
  {
    id: 20,
    korean: '형',
    english: 'older brother (male speaker)',
    pronunciation: 'hyeong',
    category: 'family',
    difficulty: 'beginner',
    frequency: 82
  },
  {
    id: 21,
    korean: '누나',
    english: 'older sister (male speaker)',
    pronunciation: 'nuna',
    category: 'family',
    difficulty: 'beginner',
    frequency: 82
  },
  {
    id: 22,
    korean: '언니',
    english: 'older sister (female speaker)',
    pronunciation: 'eonni',
    category: 'family',
    difficulty: 'beginner',
    frequency: 82
  },
  {
    id: 23,
    korean: '동생',
    english: 'younger sibling',
    pronunciation: 'dongsaeng',
    category: 'family',
    difficulty: 'beginner',
    frequency: 81
  },
  {
    id: 24,
    korean: '선생님',
    english: 'teacher',
    pronunciation: 'seonsaengnim',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 80
  },

  // TIER 5: FOOD & DRINK (Frequency 75-79)
  {
    id: 25,
    korean: '밥',
    english: 'rice/meal',
    pronunciation: 'bap',
    category: 'food',
    difficulty: 'beginner',
    frequency: 79
  },
  {
    id: 26,
    korean: '물',
    english: 'water',
    pronunciation: 'mul',
    category: 'food',
    difficulty: 'beginner',
    frequency: 78
  },
  {
    id: 27,
    korean: '커피',
    english: 'coffee',
    pronunciation: 'keopi',
    category: 'food',
    difficulty: 'beginner',
    frequency: 77
  },
  {
    id: 28,
    korean: '김치',
    english: 'kimchi',
    pronunciation: 'gimchi',
    category: 'food',
    difficulty: 'beginner',
    frequency: 76
  },
  {
    id: 29,
    korean: '과일',
    english: 'fruit',
    pronunciation: 'gwail',
    category: 'food',
    difficulty: 'beginner',
    frequency: 75
  },

  // TIER 6: COLORS (Frequency 70-74)
  {
    id: 30,
    korean: '빨간색',
    english: 'red',
    pronunciation: 'ppalgansaek',
    category: 'colors',
    difficulty: 'beginner',
    frequency: 74
  },
  {
    id: 31,
    korean: '파란색',
    english: 'blue',
    pronunciation: 'paransaek',
    category: 'colors',
    difficulty: 'beginner',
    frequency: 73
  },
  {
    id: 32,
    korean: '노란색',
    english: 'yellow',
    pronunciation: 'noransaek',
    category: 'colors',
    difficulty: 'beginner',
    frequency: 72
  },
  {
    id: 33,
    korean: '초록색',
    english: 'green',
    pronunciation: 'choroksaek',
    category: 'colors',
    difficulty: 'beginner',
    frequency: 71
  },
  {
    id: 34,
    korean: '검은색',
    english: 'black',
    pronunciation: 'geomeunsaek',
    category: 'colors',
    difficulty: 'beginner',
    frequency: 70
  },

  // TIER 7: NUMBERS (Frequency 65-69)
  {
    id: 35,
    korean: '하나',
    english: 'one',
    pronunciation: 'hana',
    category: 'numbers',
    difficulty: 'beginner',
    frequency: 69
  },
  {
    id: 36,
    korean: '둘',
    english: 'two',
    pronunciation: 'dul',
    category: 'numbers',
    difficulty: 'beginner',
    frequency: 68
  },
  {
    id: 37,
    korean: '셋',
    english: 'three',
    pronunciation: 'set',
    category: 'numbers',
    difficulty: 'beginner',
    frequency: 67
  },
  {
    id: 38,
    korean: '넷',
    english: 'four',
    pronunciation: 'net',
    category: 'numbers',
    difficulty: 'beginner',
    frequency: 66
  },
  {
    id: 39,
    korean: '다섯',
    english: 'five',
    pronunciation: 'daseot',
    category: 'numbers',
    difficulty: 'beginner',
    frequency: 65
  },

  // TIER 8: EXTENDED VERBS (Frequency 60-64)
  {
    id: 40,
    korean: '알다',
    english: 'to know',
    pronunciation: 'alda',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 64
  },
  {
    id: 41,
    korean: '사다',
    english: 'to buy',
    pronunciation: 'sada',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 63
  },
  {
    id: 42,
    korean: '주다',
    english: 'to give',
    pronunciation: 'juda',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 62
  },
  {
    id: 43,
    korean: '받다',
    english: 'to receive',
    pronunciation: 'batda',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 61
  },
  {
    id: 44,
    korean: '말하다',
    english: 'to speak',
    pronunciation: 'malhada',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 60
  },

  // TIER 9: ADJECTIVES (Frequency 55-59)
  {
    id: 45,
    korean: '좋다',
    english: 'to be good',
    pronunciation: 'jota',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 59
  },
  {
    id: 46,
    korean: '나쁘다',
    english: 'to be bad',
    pronunciation: 'nappeuda',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 58
  },
  {
    id: 47,
    korean: '크다',
    english: 'to be big',
    pronunciation: 'keuda',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 57
  },
  {
    id: 48,
    korean: '작다',
    english: 'to be small',
    pronunciation: 'jakda',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 56
  },
  {
    id: 49,
    korean: '예쁘다',
    english: 'to be pretty',
    pronunciation: 'yeppeuda',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 55
  },

  // TIER 10: INTERMEDIATE LEVEL (Frequency 50-54)
  {
    id: 50,
    korean: '공부하다',
    english: 'to study',
    pronunciation: 'gongbuhada',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 54
  },
  {
    id: 51,
    korean: '일하다',
    english: 'to work',
    pronunciation: 'ilhada',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 53
  },
  {
    id: 52,
    korean: '놀다',
    english: 'to play',
    pronunciation: 'nolda',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 52
  },
  {
    id: 53,
    korean: '자다',
    english: 'to sleep',
    pronunciation: 'jada',
    category: 'daily-life',
    difficulty: 'intermediate',
    frequency: 51
  },
  {
    id: 54,
    korean: '일어나다',
    english: 'to wake up',
    pronunciation: 'ireonada',
    category: 'daily-life',
    difficulty: 'intermediate',
    frequency: 50
  },

  // TIER 11: TRANSPORTATION (Frequency 45-49)
  {
    id: 55,
    korean: '자동차',
    english: 'car',
    pronunciation: 'jadongcha',
    category: 'travel',
    difficulty: 'intermediate',
    frequency: 49
  },
  {
    id: 56,
    korean: '버스',
    english: 'bus',
    pronunciation: 'beoseu',
    category: 'travel',
    difficulty: 'intermediate',
    frequency: 48
  },
  {
    id: 57,
    korean: '지하철',
    english: 'subway',
    pronunciation: 'jihacheol',
    category: 'travel',
    difficulty: 'intermediate',
    frequency: 47
  },
  {
    id: 58,
    korean: '병원',
    english: 'hospital',
    pronunciation: 'byeongwon',
    category: 'travel',
    difficulty: 'intermediate',
    frequency: 46
  },
  {
    id: 59,
    korean: '은행',
    english: 'bank',
    pronunciation: 'eunhaeng',
    category: 'travel',
    difficulty: 'intermediate',
    frequency: 45
  },

  // TIER 12: BODY PARTS (Frequency 40-44)
  {
    id: 60,
    korean: '머리',
    english: 'head',
    pronunciation: 'meori',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 44
  },
  {
    id: 61,
    korean: '눈',
    english: 'eye',
    pronunciation: 'nun',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 43
  },
  {
    id: 62,
    korean: '코',
    english: 'nose',
    pronunciation: 'ko',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 42
  },
  {
    id: 63,
    korean: '입',
    english: 'mouth',
    pronunciation: 'ip',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 41
  },
  {
    id: 64,
    korean: '손',
    english: 'hand',
    pronunciation: 'son',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 40
  },

  // TIER 13: WEATHER & NATURE (Frequency 35-39)
  {
    id: 65,
    korean: '날씨',
    english: 'weather',
    pronunciation: 'nalssi',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 39
  },
  {
    id: 66,
    korean: '비',
    english: 'rain',
    pronunciation: 'bi',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 38
  },
  {
    id: 67,
    korean: '눈',
    english: 'snow',
    pronunciation: 'nun',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 37
  },
  {
    id: 68,
    korean: '바람',
    english: 'wind',
    pronunciation: 'baram',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 36
  },
  {
    id: 69,
    korean: '해',
    english: 'sun',
    pronunciation: 'hae',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 35
  },

  // TIER 14: EMOTIONS (Frequency 30-34)
  {
    id: 70,
    korean: '행복하다',
    english: 'to be happy',
    pronunciation: 'haengbokhada',
    category: 'emotions',
    difficulty: 'intermediate',
    frequency: 34
  },
  {
    id: 71,
    korean: '슬프다',
    english: 'to be sad',
    pronunciation: 'seulpeuda',
    category: 'emotions',
    difficulty: 'intermediate',
    frequency: 33
  },
  {
    id: 72,
    korean: '화나다',
    english: 'to be angry',
    pronunciation: 'hwanada',
    category: 'emotions',
    difficulty: 'intermediate',
    frequency: 32
  },
  {
    id: 73,
    korean: '무섭다',
    english: 'to be scared',
    pronunciation: 'museopda',
    category: 'emotions',
    difficulty: 'intermediate',
    frequency: 31
  },
  {
    id: 74,
    korean: '재미있다',
    english: 'to be fun/interesting',
    pronunciation: 'jaemiitda',
    category: 'emotions',
    difficulty: 'intermediate',
    frequency: 30
  },

  // TIER 15: CLOTHING (Frequency 25-29)
  {
    id: 75,
    korean: '옷',
    english: 'clothes',
    pronunciation: 'ot',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 29
  },
  {
    id: 76,
    korean: '신발',
    english: 'shoes',
    pronunciation: 'sinbal',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 28
  },
  {
    id: 77,
    korean: '바지',
    english: 'pants',
    pronunciation: 'baji',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 27
  },
  {
    id: 78,
    korean: '치마',
    english: 'skirt',
    pronunciation: 'chima',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 26
  },
  {
    id: 79,
    korean: '모자',
    english: 'hat',
    pronunciation: 'moja',
    category: 'basic',
    difficulty: 'intermediate',
    frequency: 25
  },

  // TIER 16: DAILY ACTIVITIES (Frequency 20-24)
  {
    id: 80,
    korean: '요리하다',
    english: 'to cook',
    pronunciation: 'yorihada',
    category: 'daily-life',
    difficulty: 'advanced',
    frequency: 24
  },
  {
    id: 81,
    korean: '청소하다',
    english: 'to clean',
    pronunciation: 'cheongsohada',
    category: 'daily-life',
    difficulty: 'advanced',
    frequency: 23
  },
  {
    id: 82,
    korean: '빨래하다',
    english: 'to do laundry',
    pronunciation: 'ppallaehada',
    category: 'daily-life',
    difficulty: 'advanced',
    frequency: 22
  },
  {
    id: 83,
    korean: '운동하다',
    english: 'to exercise',
    pronunciation: 'undonghada',
    category: 'daily-life',
    difficulty: 'advanced',
    frequency: 21
  },
  {
    id: 84,
    korean: '쇼핑하다',
    english: 'to go shopping',
    pronunciation: 'syopinghada',
    category: 'daily-life',
    difficulty: 'advanced',
    frequency: 20
  },

  // TIER 17: TECHNOLOGY (Frequency 15-19)
  {
    id: 85,
    korean: '컴퓨터',
    english: 'computer',
    pronunciation: 'keompyuteo',
    category: 'basic',
    difficulty: 'advanced',
    frequency: 19
  },
  {
    id: 86,
    korean: '휴대폰',
    english: 'cell phone',
    pronunciation: 'hyudaepon',
    category: 'basic',
    difficulty: 'advanced',
    frequency: 18
  },
  {
    id: 87,
    korean: '인터넷',
    english: 'internet',
    pronunciation: 'inteonet',
    category: 'basic',
    difficulty: 'advanced',
    frequency: 17
  },
  {
    id: 88,
    korean: '텔레비전',
    english: 'television',
    pronunciation: 'tellebijeon',
    category: 'basic',
    difficulty: 'advanced',
    frequency: 16
  },
  {
    id: 89,
    korean: '음악',
    english: 'music',
    pronunciation: 'eumak',
    category: 'basic',
    difficulty: 'advanced',
    frequency: 15
  },

  // TIER 18: ADVANCED CONCEPTS (Frequency 10-14)
  {
    id: 90,
    korean: '문화',
    english: 'culture',
    pronunciation: 'munhwa',
    category: 'basic',
    difficulty: 'advanced',
    frequency: 14
  },
  {
    id: 91,
    korean: '역사',
    english: 'history',
    pronunciation: 'yeoksa',
    category: 'basic',
    difficulty: 'advanced',
    frequency: 13
  },
  {
    id: 92,
    korean: '언어',
    english: 'language',
    pronunciation: 'eoneo',
    category: 'basic',
    difficulty: 'advanced',
    frequency: 12
  },
  {
    id: 93,
    korean: '경험',
    english: 'experience',
    pronunciation: 'gyeongheom',
    category: 'basic',
    difficulty: 'advanced',
    frequency: 11
  },
  {
    id: 94,
    korean: '성공',
    english: 'success',
    pronunciation: 'seonggong',
    category: 'basic',
    difficulty: 'advanced',
    frequency: 10
  },

  // TIER 19: PHILOSOPHICAL CONCEPTS (Frequency 5-9)
  {
    id: 95,
    korean: '건강',
    english: 'health',
    pronunciation: 'geongang',
    category: 'basic',
    difficulty: 'advanced',
    frequency: 9
  },
  {
    id: 96,
    korean: '운명',
    english: 'destiny',
    pronunciation: 'unmyeong',
    category: 'basic',
    difficulty: 'advanced',
    frequency: 8
  },
  {
    id: 97,
    korean: '사랑',
    english: 'love',
    pronunciation: 'sarang',
    category: 'emotions',
    difficulty: 'advanced',
    frequency: 7
  },
  {
    id: 98,
    korean: '꿈',
    english: 'dream',
    pronunciation: 'kkum',
    category: 'emotions',
    difficulty: 'advanced',
    frequency: 6
  },
  {
    id: 99,
    korean: '희망',
    english: 'hope',
    pronunciation: 'huimang',
    category: 'emotions',
    difficulty: 'advanced',
    frequency: 5
  },

  // BONUS TIER: QUESTION WORDS (Frequency 1-4) - High utility despite lower frequency
  {
    id: 100,
    korean: '뭐',
    english: 'what',
    pronunciation: 'mwo',
    category: 'basic',
    difficulty: 'beginner',
    frequency: 4
  }
];
}

// Utility functions for word management
export function getWordsByCategory(category: string): KoreanWord[] {
  return koreanWords.filter(word => word.category === category);
}

export function getWordsByDifficulty(difficulty: string): KoreanWord[] {
  return koreanWords.filter(word => word.difficulty === difficulty);
}

export function getHighFrequencyWords(minFrequency: number): KoreanWord[] {
  return koreanWords.filter(word => word.frequency >= minFrequency);
}

export function getRandomWords(count: number): KoreanWord[] {
  const shuffled = [...koreanWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function validateNoDuplicates(): { isValid: boolean; duplicates: string[] } {
  const koreanSet = new Set<string>();
  const englishSet = new Set<string>();
  const idSet = new Set<number>();
  const duplicates: string[] = [];

  koreanWords.forEach(word => {
    if (koreanSet.has(word.korean)) {
      duplicates.push(`Korean duplicate: ${word.korean}`);
    } else {
      koreanSet.add(word.korean);
    }

    if (englishSet.has(word.english)) {
      duplicates.push(`English duplicate: ${word.english}`);
    } else {
      englishSet.add(word.english);
    }

    if (idSet.has(word.id)) {
      duplicates.push(`ID duplicate: ${word.id}`);
    } else {
      idSet.add(word.id);
    }
  });

  return {
    isValid: duplicates.length === 0,
    duplicates
  };
}

// ===== NEW SMART CURATION FUNCTIONS =====

// Get personalized word set based on user's learning progress
export function getPersonalizedWords(count: number = 50): KoreanWord[] {
  try {
    const result = CurationEngine.personalizedCuration([], count);
    return result.words;
  } catch {
    console.warn('Personalized curation failed, using high-frequency fallback');
    return WordExtractor.getEssentials(count).words;
  }
}

// Get words by specific criteria
export function getCuratedWords(
  goal: 'speed' | 'depth' | 'balanced' | 'review',
  level: 'beginner' | 'intermediate' | 'advanced' | 'mixed',
  count: number = 50,
  categories?: string[]
): KoreanWord[] {
  try {
    const result = CurationEngine.curate({
      learningGoal: goal,
      userLevel: level,
      timeConstraint: 30,
      focusAreas: categories as Category[] || [],
      avoidRecentlyStudied: false,
      prioritizeWeakWords: true,
      includeReviewWords: goal === 'review',
      maxDifficultyJump: 1,
      personalityType: 'systematic'
    }, count);
    return result.words;
  } catch {
    console.warn('Curation failed, using extractor fallback');
    return WordExtractor.getBalancedSet(count).words;
  }
}

// Quick preset access
export const presetWordSets = {
  // Most essential words for absolute beginners
  dailyEssentials: () => WordExtractor.getEssentials(20).words,
  
  // Comprehensive beginner foundation
  beginnerComplete: () => WordExtractor.getBeginnerSet(50).words,
  
  // Balanced progression set
  balancedProgression: () => WordExtractor.getBalancedSet(100).words,
  
  // High-frequency speed learning
  speedLearning: () => getCuratedWords('speed', 'mixed', 30),
  
  // Category-focused learning
  familyFocused: () => WordExtractor.extractByCategory('family', 25, true).words,
  foodFocused: () => WordExtractor.extractByCategory('food', 25, true).words,
  basicsFocused: () => WordExtractor.extractByCategory('basic', 40, true).words,
  
  // Advanced sets
  intermediateExpansion: () => WordExtractor.getIntermediateSet(50).words,
  advancedVocabulary: () => WordExtractor.getAdvancedSet(30).words,
};

// Export enhanced statistics
export const WORD_STATS = {
  total: koreanWords.length,
  poolSize: WordExtractor.getPoolStats().totalWords,
  byDifficulty: {
    beginner: koreanWords.filter(w => w.difficulty === 'beginner').length,
    intermediate: koreanWords.filter(w => w.difficulty === 'intermediate').length,
    advanced: koreanWords.filter(w => w.difficulty === 'advanced').length
  },
  byCategory: koreanWords.reduce((acc, word) => {
    acc[word.category] = (acc[word.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
  avgFrequency: Math.round(koreanWords.reduce((sum, word) => sum + word.frequency, 0) / koreanWords.length),
  availablePresets: Object.keys(presetWordSets).length,
  curationEngineAvailable: true
};

// Export curation capabilities for external use
export { WordExtractor, CurationEngine };