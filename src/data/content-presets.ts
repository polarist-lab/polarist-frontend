import { LearningContent, WordbookMetadata, SentenceMetadata, RoadmapMetadata, CharacterMetadata, GrammarMetadata } from '@/lib/types';

// 통합 학습 콘텐츠 프리셋들
export const CONTENT_PRESETS: LearningContent[] = [
  // === 단어장 콘텐츠 ===
  {
    id: 'wordbook-absolute-beginner',
    type: 'wordbook',
    authorType: 'official',
    title: 'Absolute Beginner',
    description: 'Perfect for complete beginners. Start with the most basic and essential Korean words.',
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
    id: 'wordbook-beginner',
    type: 'wordbook',
    authorType: 'official',
    title: 'Beginner Essentials',
    description: 'Build a solid foundation with essential vocabulary for everyday situations.',
    difficulty: 'beginner',
    categories: ['basic', 'daily-life'],
    isPublished: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    tags: ['beginner', 'essential', 'daily-life'],
    estimatedDuration: 60,
    prerequisites: ['wordbook-absolute-beginner'],
    icon: '📚',
    color: 'bg-blue-500',
    metadata: {
      wordCount: 100,
      minFrequency: 50,
      difficulties: ['beginner']
    } as WordbookMetadata
  },
  {
    id: 'wordbook-intermediate',
    type: 'wordbook',
    authorType: 'official',
    title: 'Intermediate Core',
    description: 'Expand your vocabulary with more complex words and expressions.',
    difficulty: 'intermediate',
    categories: ['daily-life', 'emotions', 'business'],
    isPublished: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    tags: ['intermediate', 'expansion', 'complex'],
    estimatedDuration: 90,
    prerequisites: ['wordbook-beginner'],
    icon: '🎯',
    color: 'bg-yellow-500',
    metadata: {
      wordCount: 150,
      minFrequency: 30,
      difficulties: ['intermediate']
    } as WordbookMetadata
  },
  {
    id: 'wordbook-advanced',
    type: 'wordbook',
    authorType: 'official',
    title: 'Advanced Mastery',
    description: 'Master advanced vocabulary for fluent conversations and professional contexts.',
    difficulty: 'advanced',
    categories: ['business', 'culture', 'philosophy'],
    isPublished: true,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
    tags: ['advanced', 'professional', 'fluent'],
    estimatedDuration: 120,
    prerequisites: ['wordbook-intermediate'],
    icon: '🚀',
    color: 'bg-purple-500',
    metadata: {
      wordCount: 200,
      minFrequency: 10,
      difficulties: ['advanced', 'upper-intermediate']
    } as WordbookMetadata
  },

  // === 테마별 단어장 ===
  {
    id: 'wordbook-food-restaurant',
    type: 'wordbook',
    authorType: 'official',
    title: 'Food & Restaurant',
    description: 'Essential vocabulary for dining out and cooking in Korea.',
    difficulty: 'beginner',
    categories: ['food', 'daily-life'],
    isPublished: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    tags: ['food', 'restaurant', 'dining', 'cooking'],
    estimatedDuration: 45,
    prerequisites: ['wordbook-absolute-beginner'],
    icon: '🍜',
    color: 'bg-orange-500',
    metadata: {
      wordCount: 120,
      minFrequency: 40,
      difficulties: ['beginner', 'intermediate']
    } as WordbookMetadata
  },
  {
    id: 'wordbook-travel-transportation',
    type: 'wordbook',
    authorType: 'official',
    title: 'Travel & Transportation',
    description: 'Navigate Korea with confidence using transportation and travel vocabulary.',
    difficulty: 'beginner',
    categories: ['travel', 'transportation'],
    isPublished: true,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
    tags: ['travel', 'transportation', 'navigation', 'tourism'],
    estimatedDuration: 50,
    prerequisites: ['wordbook-absolute-beginner'],
    icon: '✈️',
    color: 'bg-cyan-500',
    metadata: {
      wordCount: 100,
      minFrequency: 30,
      difficulties: ['beginner', 'intermediate']
    } as WordbookMetadata
  },
  {
    id: 'wordbook-family-relationships',
    type: 'wordbook',
    authorType: 'official',
    title: 'Family & Relationships',
    description: 'Learn to talk about family members and personal relationships.',
    difficulty: 'absolute-beginner',
    categories: ['family', 'relationships'],
    isPublished: true,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
    tags: ['family', 'relationships', 'personal', 'social'],
    estimatedDuration: 35,
    icon: '👨‍👩‍👧‍👦',
    color: 'bg-red-500',
    metadata: {
      wordCount: 60,
      minFrequency: 50,
      difficulties: ['absolute-beginner', 'beginner']
    } as WordbookMetadata
  },
  {
    id: 'wordbook-kpop-culture',
    type: 'wordbook',
    authorType: 'official',
    title: 'K-Pop & Korean Culture',
    description: 'Dive into Korean pop culture and entertainment vocabulary.',
    difficulty: 'intermediate',
    categories: ['music', 'culture', 'entertainment'],
    isPublished: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    tags: ['kpop', 'culture', 'entertainment', 'music', 'trendy'],
    estimatedDuration: 55,
    prerequisites: ['wordbook-beginner'],
    icon: '🎵',
    color: 'bg-indigo-500',
    metadata: {
      wordCount: 100,
      minFrequency: 25,
      difficulties: ['beginner', 'intermediate']
    } as WordbookMetadata
  },

  // === 문장집 콘텐츠 ===
  {
    id: 'sentences-greetings-basic',
    type: 'sentence',
    authorType: 'official',
    title: 'Basic Greetings & Politeness',
    description: 'Essential sentences for polite greetings and basic interactions.',
    difficulty: 'absolute-beginner',
    categories: ['greetings', 'basic'],
    isPublished: true,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
    tags: ['greetings', 'politeness', 'basic', 'first-conversations'],
    estimatedDuration: 25,
    icon: '👋',
    color: 'bg-green-400',
    metadata: {
      sentenceCount: 15,
      grammarFocus: ['honorifics', 'basic-verbs'],
      vocabularyLevel: 'absolute-beginner'
    } as SentenceMetadata
  },
  {
    id: 'sentences-daily-conversations',
    type: 'sentence',
    authorType: 'official',
    title: 'Daily Conversations',
    description: 'Common sentences used in everyday Korean conversations.',
    difficulty: 'beginner',
    categories: ['daily-life', 'greetings'],
    isPublished: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    tags: ['conversation', 'daily', 'practical', 'useful'],
    estimatedDuration: 40,
    prerequisites: ['wordbook-absolute-beginner', 'sentences-greetings-basic'],
    icon: '💬',
    color: 'bg-blue-400',
    metadata: {
      sentenceCount: 25,
      grammarFocus: ['present-tense', 'questions', 'responses'],
      vocabularyLevel: 'beginner'
    } as SentenceMetadata
  },
  {
    id: 'sentences-restaurant-ordering',
    type: 'sentence',
    authorType: 'official',
    title: 'Restaurant Ordering',
    description: 'Master the art of ordering food at Korean restaurants.',
    difficulty: 'beginner',
    categories: ['food', 'daily-life'],
    isPublished: true,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
    tags: ['restaurant', 'food', 'ordering', 'dining'],
    estimatedDuration: 35,
    prerequisites: ['wordbook-food-restaurant', 'sentences-daily-conversations'],
    icon: '🍽️',
    color: 'bg-orange-400',
    metadata: {
      sentenceCount: 20,
      grammarFocus: ['polite-requests', 'numbers', 'preferences'],
      vocabularyLevel: 'beginner'
    } as SentenceMetadata
  },
  {
    id: 'sentences-shopping-market',
    type: 'sentence',
    authorType: 'official',
    title: 'Shopping & Market Talk',
    description: 'Navigate Korean markets and shops with confidence.',
    difficulty: 'intermediate',
    categories: ['shopping', 'daily-life'],
    isPublished: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    tags: ['shopping', 'market', 'bargaining', 'commerce'],
    estimatedDuration: 45,
    prerequisites: ['wordbook-beginner', 'sentences-daily-conversations'],
    icon: '🛒',
    color: 'bg-pink-400',
    metadata: {
      sentenceCount: 30,
      grammarFocus: ['price-negotiation', 'comparisons', 'past-tense'],
      vocabularyLevel: 'intermediate'
    } as SentenceMetadata
  }
];

// 로드맵 프리셋들
export const ROADMAP_PRESETS: LearningContent[] = [
  {
    id: 'roadmap-iron5-foundation',
    type: 'roadmap',
    authorType: 'official',
    title: 'Iron5 Foundation Path',
    description: 'Complete beginner roadmap starting with Hangul history and philosophy. Learn the story behind Korean writing before diving into characters.',
    difficulty: 'absolute-beginner',
    categories: ['hangul', 'basic', 'foundation', 'history'],
    isPublished: true,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    tags: ['roadmap', 'iron5', 'foundation', 'beginner', 'complete-course', 'story'],
    estimatedDuration: 300, // 5시간
    icon: '🛤️',
    color: 'bg-gradient-to-r from-gray-600 to-gray-800',
    metadata: {
      contentIds: [
        'hangul-story-introduction',
        'characters-basic-vowels-grouped',
        'characters-basic-consonants-grouped', 
        'characters-basic-combinations',
        'wordbook-absolute-beginner',
        'sentences-greetings-basic'
      ],
      totalDuration: 300,
      completionCriteria: 'all',
      tierRequirement: 'Iron5',
      nextTier: 'Iron4'
    } as RoadmapMetadata
  },
  {
    id: 'roadmap-korean-beginner-path',
    type: 'roadmap',
    authorType: 'official',
    title: '한국어 입문 완전정복',
    description: '한국어를 처음 시작하는 분들을 위한 체계적인 학습 로드맵입니다. 단어부터 문장까지 단계별로 학습하세요.',
    difficulty: 'beginner',
    categories: ['basic', 'daily-life', 'greetings'],
    isPublished: true,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    tags: ['roadmap', 'beginner', 'complete-course', 'structured'],
    estimatedDuration: 180, // 3시간
    icon: '🗺️',
    color: 'bg-gradient-to-r from-green-400 to-blue-500',
    metadata: {
      contentIds: [
        'wordbook-absolute-beginner',
        'sentences-greetings-basic',
        'wordbook-beginner',
        'sentences-daily-conversations',
        'wordbook-family-relationships'
      ],
      totalDuration: 180,
      completionCriteria: 'all',
    } as RoadmapMetadata
  },
  {
    id: 'roadmap-practical-korean',
    type: 'roadmap',
    authorType: 'official',
    title: '실용 한국어 마스터',
    description: '한국 여행이나 일상생활에서 바로 사용할 수 있는 실용적인 한국어를 배우는 로드맵입니다.',
    difficulty: 'intermediate',
    categories: ['travel', 'food', 'shopping', 'daily-life'],
    isPublished: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    tags: ['roadmap', 'practical', 'travel', 'daily-use'],
    estimatedDuration: 220, // 3시간 40분
    prerequisites: ['roadmap-korean-beginner-path'],
    icon: '🎯',
    color: 'bg-gradient-to-r from-orange-400 to-pink-500',
    metadata: {
      contentIds: [
        'wordbook-food-restaurant',
        'sentences-restaurant-ordering',
        'wordbook-travel-transportation',
        'sentences-shopping-market'
      ],
      totalDuration: 220,
      completionCriteria: 'percentage',
      requiredPercentage: 80
    } as RoadmapMetadata
  }
];

// 문자 학습 프리셋들
export const CHARACTER_PRESETS: LearningContent[] = [
  {
    id: 'hangul-story-introduction',
    type: 'character',
    authorType: 'official',
    title: 'The Story of Hangul',
    description: 'Discover the fascinating history and philosophy behind Korean writing. Learn about King Sejong and the Cheonjiin principle.',
    difficulty: 'absolute-beginner',
    categories: ['history', 'culture', 'foundation'],
    isPublished: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    tags: ['history', 'culture', 'sejong', 'cheonjiin', 'philosophy', 'story'],
    estimatedDuration: 45,
    icon: '📜',
    color: 'bg-purple-500',
    metadata: {
      characterCount: 0,
      characterType: 'vowel',
      hasStrokeOrder: false,
      difficulty: 'absolute-beginner'
    } as CharacterMetadata
  },
  {
    id: 'characters-basic-vowels-grouped',
    type: 'character',
    authorType: 'official',
    title: 'Basic Vowels (Grouped)',
    description: 'Learn the 6 fundamental Korean vowels organized by the Cheonjiin philosophy: basic axes, bright sounds, and dark sounds.',
    difficulty: 'absolute-beginner',
    categories: ['basic', 'grouped'],
    isPublished: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['vowels', 'basic', 'grouped', 'cheonjiin', 'philosophy'],
    estimatedDuration: 40,
    icon: '🔤',
    color: 'bg-red-500',
    metadata: {
      characterCount: 6,
      characterType: 'vowel',
      hasStrokeOrder: true,
      difficulty: 'absolute-beginner'
    } as CharacterMetadata
  },
  {
    id: 'characters-basic-vowels',
    type: 'character',
    authorType: 'official',
    title: 'Basic Vowels',
    description: 'Learn all 10 basic Korean vowels and their sounds.',
    difficulty: 'absolute-beginner',
    categories: ['basic'],
    isPublished: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['vowels', 'basic', 'hangul', 'writing', 'simple', 'y-series'],
    estimatedDuration: 35,
    icon: '',
    color: 'bg-red-500',
    metadata: {
      characterCount: 10,
      characterType: 'vowel',
      hasStrokeOrder: true,
      difficulty: 'absolute-beginner'
    } as CharacterMetadata
  },
  // Complex Vowels는 이제 Basic Vowels에 통합됨
  {
    id: 'characters-basic-consonants-grouped',
    type: 'character',
    authorType: 'official',
    title: 'Basic Consonants (Grouped)',
    description: 'Learn 9 fundamental Korean consonants grouped by pronunciation method: throat, tongue-tip, and lip sounds.',
    difficulty: 'absolute-beginner',
    categories: ['basic', 'grouped'],
    isPublished: true,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    tags: ['consonants', 'basic', 'grouped', 'pronunciation', 'scientific'],
    estimatedDuration: 50,
    prerequisites: ['characters-basic-vowels-grouped'],
    icon: '🗣️',
    color: 'bg-blue-500',
    metadata: {
      characterCount: 9,
      characterType: 'consonant',
      hasStrokeOrder: true,
      difficulty: 'absolute-beginner'
    } as CharacterMetadata
  },
  {
    id: 'characters-basic-consonants',
    type: 'character',
    authorType: 'official',
    title: 'Basic Consonants',
    description: 'Learn all 14 basic Korean consonants and their sounds.',
    difficulty: 'absolute-beginner',
    categories: ['basic'],
    isPublished: true,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    tags: ['consonants', 'basic', 'sounds', 'hangul'],
    estimatedDuration: 40,
    prerequisites: ['characters-basic-vowels'],
    icon: 'ㄱ',
    color: 'bg-blue-500',
    metadata: {
      characterCount: 14,
      characterType: 'consonant',
      hasStrokeOrder: true,
      difficulty: 'absolute-beginner'
    } as CharacterMetadata
  },
  {
    id: 'characters-basic-combinations',
    type: 'character',
    authorType: 'official',
    title: 'Basic Syllables',
    description: 'Learn consonant + vowel combinations to form complete Korean syllables.',
    difficulty: 'beginner',
    categories: ['basic'],
    isPublished: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    tags: ['syllables', 'combinations', 'basic', 'reading'],
    estimatedDuration: 60,
    prerequisites: ['characters-basic-vowels', 'characters-basic-consonants'],
    icon: '가',
    color: 'bg-green-500',
    metadata: {
      characterCount: 140,
      characterType: 'syllable',
      hasStrokeOrder: false,
      difficulty: 'beginner'
    } as CharacterMetadata
  },
  {
    id: 'characters-double-consonants',
    type: 'character',
    authorType: 'official',
    title: 'Double Consonants',
    description: 'Master the 5 double consonants and their stronger sounds.',
    difficulty: 'intermediate',
    categories: ['basic'],
    isPublished: true,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
    tags: ['consonants', 'double', 'tensed', 'advanced'],
    estimatedDuration: 25,
    prerequisites: ['characters-basic-combinations'],
    icon: 'ㄲ',
    color: 'bg-purple-500',
    metadata: {
      characterCount: 5,
      characterType: 'double-consonant',
      hasStrokeOrder: true,
      difficulty: 'intermediate'
    } as CharacterMetadata
  },
  // Vowel Review는 제거됨 - 모든 모음이 Basic Vowels에 통합됨
];

// 문법 프리셋
export const GRAMMAR_PRESETS: LearningContent[] = [
  {
    id: 'grammar-basic-particles',
    type: 'grammar',
    authorType: 'official',
    title: 'Basic Particles (기본 조사)',
    description: 'Learn essential Korean particles: 은/는, 이/가, 을/를, 에, 에서, 의',
    difficulty: 'absolute-beginner',
    categories: ['grammar', 'basic'],
    isPublished: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    tags: ['particles', 'basic', 'grammar', 'essential'],
    estimatedDuration: 45,
    prerequisites: ['characters-basic-consonants', 'characters-basic-vowels'],
    icon: '조',
    color: 'bg-indigo-500',
    metadata: {
      ruleCount: 6,
      grammarType: 'particles',
      practiceExamples: 30,
      difficulty: 'absolute-beginner'
    } as GrammarMetadata
  },
  {
    id: 'grammar-verb-present',
    type: 'grammar',
    authorType: 'official',
    title: 'Present Tense (현재시제)',
    description: 'Master Korean present tense verb conjugations: -아/어요, -ㅂ/습니다',
    difficulty: 'beginner',
    categories: ['grammar', 'basic'],
    isPublished: true,
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21'),
    tags: ['verbs', 'present-tense', 'conjugation', 'politeness'],
    estimatedDuration: 60,
    prerequisites: ['grammar-basic-particles'],
    icon: '해',
    color: 'bg-green-600',
    metadata: {
      ruleCount: 4,
      grammarType: 'verb-conjugation',
      practiceExamples: 40,
      difficulty: 'beginner'
    } as GrammarMetadata
  },
  {
    id: 'grammar-sentence-structure',
    type: 'grammar',
    authorType: 'official',
    title: 'Basic Sentence Structure (기본 문장구조)',
    description: 'Learn Korean SOV word order and basic sentence patterns',
    difficulty: 'beginner',
    categories: ['grammar', 'basic'],
    isPublished: true,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    tags: ['sentence-structure', 'word-order', 'SOV', 'patterns'],
    estimatedDuration: 50,
    prerequisites: ['grammar-basic-particles'],
    icon: '문',
    color: 'bg-blue-600',
    metadata: {
      ruleCount: 5,
      grammarType: 'sentence-structure',
      practiceExamples: 25,
      difficulty: 'beginner'
    } as GrammarMetadata
  },
  {
    id: 'grammar-honorifics-basic',
    type: 'grammar',
    authorType: 'official',
    title: 'Basic Honorifics (기본 높임법)',
    description: 'Introduction to Korean honorific system and polite speech levels',
    difficulty: 'intermediate',
    categories: ['grammar', 'culture'],
    isPublished: true,
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
    tags: ['honorifics', 'politeness', 'respect', 'culture'],
    estimatedDuration: 70,
    prerequisites: ['grammar-verb-present'],
    icon: '높',
    color: 'bg-purple-600',
    metadata: {
      ruleCount: 8,
      grammarType: 'honorifics',
      practiceExamples: 50,
      difficulty: 'intermediate'
    } as GrammarMetadata
  },
  {
    id: 'grammar-past-future',
    type: 'grammar',
    authorType: 'official',
    title: 'Past & Future Tense (과거/미래시제)',
    description: 'Learn past tense (-았/었어요) and future tense (-겠어요, -을/를 거예요)',
    difficulty: 'intermediate',
    categories: ['grammar', 'tenses'],
    isPublished: true,
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
    tags: ['past-tense', 'future-tense', 'conjugation', 'time'],
    estimatedDuration: 65,
    prerequisites: ['grammar-verb-present'],
    icon: '때',
    color: 'bg-orange-600',
    metadata: {
      ruleCount: 6,
      grammarType: 'tenses',
      practiceExamples: 45,
      difficulty: 'intermediate',
      relatedGrammar: ['grammar-verb-present']
    } as GrammarMetadata
  }
];

// 전체 프리셋 (단어장 + 문장집 + 로드맵 + 문자 + 문법)
export const ALL_CONTENT_PRESETS = [...CONTENT_PRESETS, ...ROADMAP_PRESETS, ...CHARACTER_PRESETS, ...GRAMMAR_PRESETS];

// 타입별 필터링 함수들
export const getWordbookPresets = () => CONTENT_PRESETS.filter(c => c.type === 'wordbook');
export const getSentencePresets = () => CONTENT_PRESETS.filter(c => c.type === 'sentence');
export const getCharacterPresets = () => CHARACTER_PRESETS;
export const getGrammarPresets = () => GRAMMAR_PRESETS;
export const getRoadmapPresets = () => ROADMAP_PRESETS;

// 난이도별 그룹화 (기존 호환성 유지)
export const DIFFICULTY_GROUPS = [
  {
    id: 'beginner-group',
    titleKey: 'content.beginnerLevel',
    presets: CONTENT_PRESETS.filter(preset => 
      preset.difficulty === 'absolute-beginner' || preset.difficulty === 'beginner'
    ),
  },
  {
    id: 'intermediate-group', 
    titleKey: 'content.intermediateLevel',
    presets: CONTENT_PRESETS.filter(preset => 
      preset.difficulty === 'intermediate'
    ),
  },
  {
    id: 'advanced-group',
    titleKey: 'content.advancedLevel', 
    presets: CONTENT_PRESETS.filter(preset => 
      preset.difficulty === 'advanced' || preset.difficulty === 'upper-intermediate'
    ),
  },
];