import { KoreanWord, Category, Difficulty } from '@/lib/types';

// Word curation and generation system
export interface WordCurationConfig {
  targetCount: number;
  minFrequency: number;
  maxFrequency: number;
  categories: Category[];
  difficulties: Difficulty[];
  excludeExisting?: boolean;
}

export interface WordSource {
  name: string;
  url?: string;
  type: 'api' | 'scraping' | 'dataset' | 'manual';
  priority: number;
}

// Built-in high-frequency Korean word sources
export class KoreanWordCurator {
  
  // Common Korean word sources for future integration
  static WORD_SOURCES: WordSource[] = [
    {
      name: 'National Institute of Korean Language Frequency Data',
      url: 'https://www.korean.go.kr',
      type: 'dataset',
      priority: 1
    },
    {
      name: 'Sejong Korean Corpus',
      type: 'dataset',
      priority: 2
    },
    {
      name: 'TOPIK Essential Vocabulary',
      type: 'manual',
      priority: 3
    },
    {
      name: 'Naver Korean Dictionary API',
      url: 'https://developers.naver.com/docs/papago/papago-nmt-api-reference.md',
      type: 'api',
      priority: 4
    },
    {
      name: 'Wiktionary Korean Frequency Lists',
      url: 'https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists',
      type: 'scraping',
      priority: 5
    }
  ];

  // Generate high-frequency Korean words based on linguistic patterns
  static generateHighFrequencyWords(config: WordCurationConfig): KoreanWord[] {
    const generatedWords: KoreanWord[] = [];
    
    // Core grammar particles and endings (highest frequency)
    const particles = [
      { korean: '이/가', english: 'subject particle', pronunciation: 'i/ga', frequency: 100 },
      { korean: '을/를', english: 'object particle', pronunciation: 'eul/reul', frequency: 99 },
      { korean: '의', english: 'possessive particle', pronunciation: 'ui', frequency: 98 },
      { korean: '에', english: 'location/time particle', pronunciation: 'e', frequency: 97 },
      { korean: '에서', english: 'from/at particle', pronunciation: 'eseo', frequency: 96 },
    ];
    
    // Essential verbs (conjugated forms)
    const essentialVerbs = [
      { korean: '이다', english: 'to be', pronunciation: 'ida', frequency: 95 },
      { korean: '아니다', english: 'to not be', pronunciation: 'anida', frequency: 94 },
      { korean: '없다', english: 'to not exist', pronunciation: 'eopda', frequency: 93 },
      { korean: '되다', english: 'to become', pronunciation: 'doeda', frequency: 92 },
      { korean: '주다', english: 'to give', pronunciation: 'juda', frequency: 91 },
    ];
    
    // Common question words
    const questionWords = [
      { korean: '뭐', english: 'what', pronunciation: 'mwo', frequency: 90 },
      { korean: '누구', english: 'who', pronunciation: 'nugu', frequency: 89 },
      { korean: '언제', english: 'when', pronunciation: 'eonje', frequency: 88 },
      { korean: '어디', english: 'where', pronunciation: 'eodi', frequency: 87 },
      { korean: '왜', english: 'why', pronunciation: 'wae', frequency: 86 },
      { korean: '어떻게', english: 'how', pronunciation: 'eotteoke', frequency: 85 },
    ];
    
    let idCounter = 1000; // Start high to avoid conflicts
    
    // Add particles
    particles.forEach((word, index) => {
      generatedWords.push({
        id: idCounter++,
        korean: word.korean,
        english: word.english,
        pronunciation: word.pronunciation,
        category: 'grammar',
        difficulty: 'beginner',
        frequency: word.frequency
      });
    });
    
    // Add essential verbs
    essentialVerbs.forEach((word, index) => {
      generatedWords.push({
        id: idCounter++,
        korean: word.korean,
        english: word.english,
        pronunciation: word.pronunciation,
        category: 'basic',
        difficulty: 'beginner',
        frequency: word.frequency
      });
    });
    
    // Add question words
    questionWords.forEach((word, index) => {
      generatedWords.push({
        id: idCounter++,
        korean: word.korean,
        english: word.english,
        pronunciation: word.pronunciation,
        category: 'basic',
        difficulty: 'beginner',
        frequency: word.frequency
      });
    });
    
    return generatedWords.slice(0, config.targetCount);
  }

  // Future: Scrape words from online sources
  static async scrapeWordsFromSource(source: WordSource): Promise<KoreanWord[]> {
    // This would implement actual web scraping or API calls
    console.log(`Would scrape from ${source.name}`);
    return [];
  }

  // Merge and deduplicate word lists
  static mergeWordLists(lists: KoreanWord[][]): KoreanWord[] {
    const merged = lists.flat();
    const seenKorean = new Set<string>();
    const seenEnglish = new Set<string>();
    const deduped: KoreanWord[] = [];
    
    // Sort by frequency descending first
    merged.sort((a, b) => b.frequency - a.frequency);
    
    for (const word of merged) {
      if (!seenKorean.has(word.korean) && !seenEnglish.has(word.english)) {
        seenKorean.add(word.korean);
        seenEnglish.add(word.english);
        deduped.push(word);
      }
    }
    
    return deduped;
  }

  // Validate and score word quality
  static scoreWord(word: KoreanWord): number {
    let score = word.frequency;
    
    // Bonus for essential categories
    const essentialCategories = ['basic', 'greetings', 'numbers', 'family'];
    if (essentialCategories.includes(word.category)) {
      score += 10;
    }
    
    // Bonus for beginner difficulty
    if (word.difficulty === 'beginner') {
      score += 5;
    }
    
    // Penalty for very long words (harder to learn)
    if (word.korean.length > 6) {
      score -= 5;
    }
    
    // Bonus for words with clear pronunciation
    if (word.pronunciation.length > 0) {
      score += 2;
    }
    
    return score;
  }

  // Curate optimal word set for learning
  static curateOptimalSet(words: KoreanWord[], targetCount: number): KoreanWord[] {
    // Score all words
    const scoredWords = words.map(word => ({
      ...word,
      score: this.scoreWord(word)
    }));
    
    // Sort by score descending
    scoredWords.sort((a, b) => b.score - a.score);
    
    // Ensure category diversity
    const categoryCount: Record<string, number> = {};
    const selected: KoreanWord[] = [];
    
    for (const word of scoredWords) {
      if (selected.length >= targetCount) break;
      
      const categoryLimit = Math.ceil(targetCount / 10); // Max 10% per category
      if ((categoryCount[word.category] || 0) < categoryLimit) {
        selected.push(word);
        categoryCount[word.category] = (categoryCount[word.category] || 0) + 1;
      }
    }
    
    // Fill remaining slots with highest scored words
    for (const word of scoredWords) {
      if (selected.length >= targetCount) break;
      if (!selected.find(w => w.id === word.id)) {
        selected.push(word);
      }
    }
    
    // Re-assign IDs sequentially
    return selected.slice(0, targetCount).map((word, index) => ({
      ...word,
      id: index + 1
    }));
  }

  // Future: Auto-generate pronunciation using romanization rules
  static generatePronunciation(korean: string): string {
    // This would implement Korean romanization rules (McCune-Reischauer or Revised Romanization)
    // For now, return a placeholder
    return korean.toLowerCase().replace(/[가-힣]/g, 'placeholder');
  }

  // Auto-categorize words based on semantic analysis
  static autoCategorize(word: KoreanWord): Category {
    const korean = word.korean;
    const english = word.english.toLowerCase();
    
    // Rule-based categorization
    if (['안녕', '감사', '죄송', '안녕하세요'].some(greeting => korean.includes(greeting))) {
      return 'greetings';
    }
    
    if (['아버지', '어머니', '형', '누나', '언니', '동생'].includes(korean)) {
      return 'family';
    }
    
    if (['빨간', '파란', '노란', '초록', '검은', '하얀'].some(color => korean.includes(color))) {
      return 'colors';
    }
    
    if (['하나', '둘', '셋', '넷', '다섯'].includes(korean)) {
      return 'numbers';
    }
    
    if (['밥', '물', '커피', '김치', '과일'].includes(korean)) {
      return 'food';
    }
    
    if (english.includes('eat') || english.includes('drink') || english.includes('food')) {
      return 'food';
    }
    
    return 'basic';
  }
}

// Advanced word curation strategies
export class AdvancedWordCurator {
  
  // Spaced repetition optimization
  static optimizeForSRS(words: KoreanWord[]): KoreanWord[] {
    // Sort words optimally for spaced repetition learning
    // Mix difficulties and categories for better retention
    const beginner = words.filter(w => w.difficulty === 'beginner');
    const intermediate = words.filter(w => w.difficulty === 'intermediate');
    const advanced = words.filter(w => w.difficulty === 'advanced');
    
    const optimized: KoreanWord[] = [];
    const maxLength = Math.max(beginner.length, intermediate.length, advanced.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (beginner[i]) optimized.push(beginner[i]);
      if (intermediate[i]) optimized.push(intermediate[i]);
      if (advanced[i]) optimized.push(advanced[i]);
    }
    
    return optimized;
  }
  
  // Generate word pairs for better learning
  static generateWordPairs(words: KoreanWord[]): Array<{primary: KoreanWord, related: KoreanWord[]}> {
    const pairs: Array<{primary: KoreanWord, related: KoreanWord[]}> = [];
    
    words.forEach(word => {
      const related = words.filter(w => 
        w.id !== word.id && 
        (w.category === word.category || 
         w.korean.includes(word.korean.slice(0, 2)) ||
         w.english.split(' ')[0] === word.english.split(' ')[0])
      );
      
      if (related.length > 0) {
        pairs.push({ primary: word, related: related.slice(0, 3) });
      }
    });
    
    return pairs;
  }
}