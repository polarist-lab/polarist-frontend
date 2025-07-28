import { KoreanWord, Category, Difficulty } from '@/lib/types';
import { koreanWordPool, WORD_POOL_STATS } from '@/data/korean-word-pool';
import { enhanceWordsWithHanja } from './word-hanja-enhancer';

// Configuration for word extraction
export interface ExtractionConfig {
  count: number;
  minFrequency?: number;
  maxFrequency?: number;
  categories?: Category[];
  difficulties?: Difficulty[];
  excludeIds?: number[];
  balanceCategories?: boolean;
  balanceDifficulties?: boolean;
  prioritizeHighFreq?: boolean;
}

// Result of word extraction with metadata
export interface ExtractionResult {
  words: KoreanWord[];
  metadata: {
    totalAvailable: number;
    extracted: number;
    averageFrequency: number;
    categoryDistribution: Record<string, number>;
    difficultyDistribution: Record<string, number>;
    frequencyRange: { min: number; max: number };
  };
}

// Advanced word extraction system for optimal learning sets
export class WordExtractor {
  private static pool: KoreanWord[] = koreanWordPool;

  // Extract words by frequency range
  static extractByFrequency(
    count: number, 
    minFreq: number = 0, 
    maxFreq: number = 100
  ): ExtractionResult {
    const filtered = this.pool.filter(
      word => word.frequency >= minFreq && word.frequency <= maxFreq
    );
    
    // Sort by frequency descending
    const sorted = filtered.sort((a, b) => b.frequency - a.frequency);
    const selected = sorted.slice(0, count);
    
    return this.createResult(selected, filtered.length);
  }

  // Extract words by difficulty level
  static extractByDifficulty(
    difficulty: Difficulty, 
    count: number,
    prioritizeFrequency: boolean = true
  ): ExtractionResult {
    const filtered = this.pool.filter(word => word.difficulty === difficulty);
    
    const sorted = prioritizeFrequency 
      ? filtered.sort((a, b) => b.frequency - a.frequency)
      : filtered.sort(() => Math.random() - 0.5);
    
    const selected = sorted.slice(0, count);
    return this.createResult(selected, filtered.length);
  }

  // Extract words by category
  static extractByCategory(
    category: Category, 
    count: number,
    prioritizeFrequency: boolean = true
  ): ExtractionResult {
    const filtered = this.pool.filter(word => word.category === category);
    
    const sorted = prioritizeFrequency 
      ? filtered.sort((a, b) => b.frequency - a.frequency)
      : filtered.sort(() => Math.random() - 0.5);
    
    const selected = sorted.slice(0, count);
    return this.createResult(selected, filtered.length);
  }

  // Extract words with multiple categories
  static extractByCategories(
    categories: Category[], 
    count: number,
    balanceCategories: boolean = true
  ): ExtractionResult {
    if (!balanceCategories) {
      const filtered = this.pool.filter(word => categories.includes(word.category as Category));
      const sorted = filtered.sort((a, b) => b.frequency - a.frequency);
      const selected = sorted.slice(0, count);
      return this.createResult(selected, filtered.length);
    }

    // Balanced extraction
    const wordsPerCategory = Math.ceil(count / categories.length);
    const selected: KoreanWord[] = [];
    
    for (const category of categories) {
      const categoryWords = this.pool
        .filter(word => word.category === category)
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, wordsPerCategory);
      
      selected.push(...categoryWords);
    }
    
    // Sort final selection by frequency and limit to requested count
    const finalSelection = selected
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, count);
    
    return this.createResult(finalSelection, selected.length);
  }

  // Advanced extraction with comprehensive configuration
  static extractWithConfig(config: ExtractionConfig): ExtractionResult {
    let filtered = [...this.pool];

    // Apply frequency filters
    if (config.minFrequency !== undefined) {
      filtered = filtered.filter(word => word.frequency >= config.minFrequency!);
    }
    if (config.maxFrequency !== undefined) {
      filtered = filtered.filter(word => word.frequency <= config.maxFrequency!);
    }

    // Apply category filters
    if (config.categories && config.categories.length > 0) {
      filtered = filtered.filter(word => config.categories!.includes(word.category as Category));
    }

    // Apply difficulty filters
    if (config.difficulties && config.difficulties.length > 0) {
      filtered = filtered.filter(word => config.difficulties!.includes(word.difficulty));
    }

    // Exclude specific words
    if (config.excludeIds && config.excludeIds.length > 0) {
      filtered = filtered.filter(word => !config.excludeIds!.includes(word.id));
    }

    // Handle balanced extraction
    if (config.balanceCategories && config.categories && config.categories.length > 1) {
      return this.extractByCategories(config.categories, config.count, true);
    }

    // Sort based on priority
    if (config.prioritizeHighFreq !== false) {
      filtered.sort((a, b) => b.frequency - a.frequency);
    } else {
      // Shuffle for variety
      filtered.sort(() => Math.random() - 0.5);
    }

    const selected = filtered.slice(0, config.count);
    return this.createResult(selected, filtered.length);
  }

  // Get optimal beginner set (most commonly requested)
  static getBeginnerSet(count: number = 50): ExtractionResult {
    return this.extractWithConfig({
      count,
      difficulties: ['beginner'],
      minFrequency: 30,
      prioritizeHighFreq: true,
      balanceCategories: true,
      categories: ['basic', 'greetings', 'family', 'food', 'numbers']
    });
  }

  // Get intermediate expansion set
  static getIntermediateSet(count: number = 50): ExtractionResult {
    return this.extractWithConfig({
      count,
      difficulties: ['intermediate'],
      minFrequency: 15,
      prioritizeHighFreq: true,
      balanceCategories: true
    });
  }

  // Get advanced vocabulary set
  static getAdvancedSet(count: number = 30): ExtractionResult {
    return this.extractWithConfig({
      count,
      difficulties: ['advanced'],
      minFrequency: 5,
      prioritizeHighFreq: true
    });
  }

  // Get balanced mixed-level set
  static getBalancedSet(count: number = 100): ExtractionResult {
    const beginnerCount = Math.round(count * 0.5);  // 50%
    const intermediateCount = Math.round(count * 0.3); // 30%
    const advancedCount = count - beginnerCount - intermediateCount; // 20%

    const beginnerWords = this.getBeginnerSet(beginnerCount).words;
    const intermediateWords = this.getIntermediateSet(intermediateCount).words;
    const advancedWords = this.getAdvancedSet(advancedCount).words;

    const allWords = [...beginnerWords, ...intermediateWords, ...advancedWords];
    return this.createResult(allWords, allWords.length);
  }

  // Get high-frequency essentials (top tier words)
  static getEssentials(count: number = 30): ExtractionResult {
    return this.extractByFrequency(count, 70, 100);
  }

  // Get words by specific frequency tiers
  static getByFrequencyTier(tier: 'S' | 'A' | 'B' | 'C' | 'D' | 'E', count: number): ExtractionResult {
    const ranges = {
      'S': { min: 95, max: 100 },
      'A': { min: 85, max: 94 },
      'B': { min: 75, max: 84 },
      'C': { min: 65, max: 74 },
      'D': { min: 55, max: 64 },
      'E': { min: 45, max: 54 }
    };

    const range = ranges[tier];
    return this.extractByFrequency(count, range.min, range.max);
  }

  // Get random sample for variety
  static getRandomSample(count: number, config?: Partial<ExtractionConfig>): ExtractionResult {
    return this.extractWithConfig({
      count,
      prioritizeHighFreq: false,
      ...config
    });
  }

  // Get words excluding already learned words (for personalization)
  static getNewWords(
    count: number, 
    learnedWordIds: number[], 
    difficulty?: Difficulty
  ): ExtractionResult {
    return this.extractWithConfig({
      count,
      excludeIds: learnedWordIds,
      difficulties: difficulty ? [difficulty] : undefined,
      prioritizeHighFreq: true
    });
  }

  // Utility method to create standardized results
  private static createResult(words: KoreanWord[], totalAvailable: number): ExtractionResult {
    // 한자 정보를 추가한 단어들로 변환
    const enhancedWords = enhanceWordsWithHanja(words);
    
    const frequencies = enhancedWords.map(w => w.frequency);
    const categoryDist: Record<string, number> = {};
    const difficultyDist: Record<string, number> = {};

    enhancedWords.forEach(word => {
      categoryDist[word.category] = (categoryDist[word.category] || 0) + 1;
      difficultyDist[word.difficulty] = (difficultyDist[word.difficulty] || 0) + 1;
    });

    return {
      words: enhancedWords,
      metadata: {
        totalAvailable,
        extracted: words.length,
        averageFrequency: frequencies.length > 0 
          ? Math.round(frequencies.reduce((a, b) => a + b, 0) / frequencies.length) 
          : 0,
        categoryDistribution: categoryDist,
        difficultyDistribution: difficultyDist,
        frequencyRange: {
          min: frequencies.length > 0 ? Math.min(...frequencies) : 0,
          max: frequencies.length > 0 ? Math.max(...frequencies) : 0
        }
      }
    };
  }

  // Get pool statistics
  static getPoolStats() {
    return {
      ...WORD_POOL_STATS,
      totalWords: this.pool.length,
      availableCategories: [...new Set(this.pool.map(w => w.category))],
      availableDifficulties: [...new Set(this.pool.map(w => w.difficulty))],
      frequencyRange: {
        min: Math.min(...this.pool.map(w => w.frequency)),
        max: Math.max(...this.pool.map(w => w.frequency))
      }
    };
  }

  // Validate extraction request
  static validateExtractionConfig(config: ExtractionConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.count <= 0) {
      errors.push('Count must be greater than 0');
    }

    if (config.count > this.pool.length) {
      errors.push(`Requested count (${config.count}) exceeds available words (${this.pool.length})`);
    }

    if (config.minFrequency !== undefined && config.maxFrequency !== undefined) {
      if (config.minFrequency > config.maxFrequency) {
        errors.push('minFrequency cannot be greater than maxFrequency');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Preview extraction without actually extracting
  static previewExtraction(config: ExtractionConfig): { 
    estimatedCount: number; 
    availableWords: number; 
    wouldSucceed: boolean;
    recommendations?: string[];
  } {
    const validation = this.validateExtractionConfig(config);
    if (!validation.valid) {
      return {
        estimatedCount: 0,
        availableWords: 0,
        wouldSucceed: false,
        recommendations: validation.errors
      };
    }

    // Count available words matching criteria
    let availableWords = this.pool.length;

    if (config.minFrequency !== undefined) {
      availableWords = this.pool.filter(w => w.frequency >= config.minFrequency!).length;
    }
    if (config.maxFrequency !== undefined) {
      availableWords = this.pool.filter(w => w.frequency <= config.maxFrequency!).length;
    }
    if (config.categories) {
      availableWords = this.pool.filter(w => config.categories!.includes(w.category as Category)).length;
    }
    if (config.difficulties) {
      availableWords = this.pool.filter(w => config.difficulties!.includes(w.difficulty)).length;
    }

    const estimatedCount = Math.min(config.count, availableWords);
    const recommendations: string[] = [];

    if (estimatedCount < config.count) {
      recommendations.push(`Only ${estimatedCount} words available matching criteria, requested ${config.count}`);
      recommendations.push('Consider relaxing frequency requirements or adding more categories');
    }

    return {
      estimatedCount,
      availableWords,
      wouldSucceed: estimatedCount > 0,
      recommendations: recommendations.length > 0 ? recommendations : undefined
    };
  }
}