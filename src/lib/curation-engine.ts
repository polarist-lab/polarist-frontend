import { KoreanWord, Category, Difficulty, LearningProgress } from '@/lib/types';
import { WordExtractor, ExtractionResult } from './word-extractor';
import { LearningTracker } from './learning-tracker';

// Curation criteria for intelligent word selection
export interface CurationCriteria {
  learningGoal: 'speed' | 'depth' | 'balanced' | 'review';
  userLevel: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  timeConstraint: number; // minutes per day available for study
  focusAreas: Category[];
  avoidRecentlyStudied: boolean;
  prioritizeWeakWords: boolean;
  includeReviewWords: boolean;
  maxDifficultyJump: number; // 1-3, how big difficulty jumps to allow
  personalityType: 'systematic' | 'variety' | 'challenge'; // learning style
}

// Result of curation with explanation
export interface CurationResult {
  words: KoreanWord[];
  explanation: {
    strategy: string;
    rationale: string[];
    stats: {
      avgFrequency: number;
      difficultySpread: Record<Difficulty, number>;
      categorySpread: Record<string, number>;
      reviewWordsCount: number;
      newWordsCount: number;
    };
  };
  nextRecommendation: {
    suggestedNextSession: CurationCriteria;
    estimatedProgressTime: string;
  };
}

// User learning profile for personalization
export interface UserProfile {
  level: Difficulty;
  studiedWordIds: number[];
  weakWordIds: number[];
  strongWordIds: number[];
  preferredCategories: Category[];
  learningStyle: 'visual' | 'repetition' | 'context' | 'mixed';
  avgStudyTime: number; // minutes per day
  consistency: number; // 0-1, how consistently they study
}

// Smart curation engine for optimal learning experiences
export class CurationEngine {

  // Main curation method - creates optimal word sets based on criteria
  static curate(criteria: CurationCriteria, maxWords: number = 50): CurationResult {
    const userProgress = LearningTracker.getLearningProgress();
    const userProfile = this.buildUserProfile(userProgress);
    
    let words: KoreanWord[] = [];
    let strategy = '';
    let rationale: string[] = [];

    switch (criteria.learningGoal) {
      case 'speed':
        ({ words, strategy, rationale } = this.curateForSpeed(criteria, userProfile, maxWords));
        break;
      case 'depth':
        ({ words, strategy, rationale } = this.curateForDepth(criteria, userProfile, maxWords));
        break;
      case 'balanced':
        ({ words, strategy, rationale } = this.curateForBalance(criteria, userProfile, maxWords));
        break;
      case 'review':
        ({ words, strategy, rationale } = this.curateForReview(criteria, userProfile, maxWords));
        break;
    }

    return {
      words,
      explanation: {
        strategy,
        rationale,
        stats: this.calculateStats(words, userProgress)
      },
      nextRecommendation: this.generateNextRecommendation(criteria, userProfile, words)
    };
  }

  // Speed-focused curation: High-frequency, essential words
  private static curateForSpeed(
    criteria: CurationCriteria, 
    profile: UserProfile, 
    maxWords: number
  ): { words: KoreanWord[], strategy: string, rationale: string[] } {
    
    const strategy = 'High-Frequency Essentials';
    const rationale = [
      'Focusing on most commonly used words for fastest practical communication',
      'Prioritizing words with frequency score above 70',
      'Emphasizing beginner-friendly vocabulary for immediate use'
    ];

    // Get high-frequency words, prioritizing beginner level
    const highFreqWords = WordExtractor.extractByFrequency(
      Math.floor(maxWords * 0.7), 70, 100
    ).words;

    // Add some user-focused categories if specified
    const categoryWords: KoreanWord[] = [];
    if (criteria.focusAreas.length > 0) {
      const categorized = WordExtractor.extractByCategories(
        criteria.focusAreas, 
        Math.floor(maxWords * 0.3),
        true
      ).words.filter(w => w.frequency >= 50); // Still maintain good frequency
      
      categoryWords.push(...categorized);
    }

    // Combine and deduplicate
    const combined = [...highFreqWords, ...categoryWords];
    const deduped = this.deduplicateWords(combined);
    const final = deduped.slice(0, maxWords);

    return { words: final, strategy, rationale };
  }

  // Depth-focused curation: Comprehensive coverage within specific areas
  private static curateForDepth(
    criteria: CurationCriteria, 
    profile: UserProfile, 
    maxWords: number
  ): { words: KoreanWord[], strategy: string, rationale: string[] } {

    const strategy = 'Comprehensive Area Coverage';
    const rationale = [
      'Deep exploration of specific categories for thorough understanding',
      'Including various difficulty levels within focus areas',
      'Balancing essential and advanced vocabulary in chosen domains'
    ];

    let words: KoreanWord[] = [];
    
    if (criteria.focusAreas.length > 0) {
      // Deep dive into specified categories
      const wordsPerCategory = Math.floor(maxWords / criteria.focusAreas.length);
      
      for (const category of criteria.focusAreas) {
        const categoryWords = WordExtractor.extractByCategory(category, wordsPerCategory, true).words;
        words.push(...categoryWords);
      }
    } else {
      // If no specific areas, do comprehensive beginner coverage
      words = WordExtractor.getBalancedSet(maxWords).words;
    }

    return { words: words.slice(0, maxWords), strategy, rationale };
  }

  // Balanced curation: Mix of new learning and review
  private static curateForBalance(
    criteria: CurationCriteria, 
    profile: UserProfile, 
    maxWords: number
  ): { words: KoreanWord[], strategy: string, rationale: string[] } {

    const strategy = 'Balanced New + Review';
    const rationale = [
      'Mixing new vocabulary with review of previously studied words',
      'Balancing different difficulty levels for steady progression',
      'Including variety across multiple categories'
    ];

    const newWordsCount = Math.floor(maxWords * 0.7);
    const reviewWordsCount = maxWords - newWordsCount;

    // Get new words based on user level and preferences
    const newWords = WordExtractor.extractWithConfig({
      count: newWordsCount,
      excludeIds: profile.studiedWordIds,
      difficulties: this.getAppropriatedifficulties(criteria.userLevel),
      categories: criteria.focusAreas.length > 0 ? criteria.focusAreas : undefined,
      balanceCategories: true,
      prioritizeHighFreq: true
    }).words;

    // Get review words from previously studied but weak words
    const reviewWords = this.getReviewWords(profile, reviewWordsCount);

    const combined = [...newWords, ...reviewWords];
    
    return { words: combined, strategy, rationale };
  }

  // Review-focused curation: Reinforcement of previously studied material
  private static curateForReview(
    criteria: CurationCriteria, 
    profile: UserProfile, 
    maxWords: number
  ): { words: KoreanWord[], strategy: string, rationale: string[] } {

    const strategy = 'Spaced Repetition Review';
    const rationale = [
      'Focusing on previously studied words that need reinforcement',
      'Prioritizing words with low confidence scores',
      'Using spaced repetition principles for optimal retention'
    ];

    const reviewWords = this.getReviewWords(profile, maxWords);
    
    return { words: reviewWords, strategy, rationale };
  }

  // Personalized curation based on user's learning history
  static personalizedCuration(
    userProgress: LearningProgress[], 
    targetCount: number,
    preferences?: Partial<CurationCriteria>
  ): CurationResult {
    
    const profile = this.buildUserProfile(userProgress);
    
    const criteria: CurationCriteria = {
      learningGoal: 'balanced',
      userLevel: profile.level,
      timeConstraint: profile.avgStudyTime,
      focusAreas: profile.preferredCategories,
      avoidRecentlyStudied: true,
      prioritizeWeakWords: true,
      includeReviewWords: true,
      maxDifficultyJump: 1,
      personalityType: 'systematic',
      ...preferences
    };

    return this.curate(criteria, targetCount);
  }

  // Build user profile from learning progress data
  private static buildUserProfile(progress: LearningProgress[]): UserProfile {
    if (progress.length === 0) {
      return {
        level: 'beginner',
        studiedWordIds: [],
        weakWordIds: [],
        strongWordIds: [],
        preferredCategories: ['basic', 'greetings'],
        learningStyle: 'mixed',
        avgStudyTime: 15,
        consistency: 0.5
      };
    }

    const studiedWordIds = progress.map(p => p.wordId);
    const weakWordIds = progress.filter(p => p.confidence < 3).map(p => p.wordId);
    const strongWordIds = progress.filter(p => p.confidence >= 4).map(p => p.wordId);
    
    const avgConfidence = progress.reduce((sum, p) => sum + p.confidence, 0) / progress.length;
    const level: Difficulty = avgConfidence >= 4 ? 'advanced' : avgConfidence >= 2.5 ? 'intermediate' : 'beginner';
    
    // Determine preferred categories based on study history
    const categoryAttempts: Record<string, number> = {};
    progress.forEach(p => {
      const word = WordExtractor['pool'].find(w => w.id === p.wordId);
      if (word) {
        categoryAttempts[word.category] = (categoryAttempts[word.category] || 0) + p.attempts;
      }
    });
    
    const preferredCategories = Object.entries(categoryAttempts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category as Category);

    return {
      level,
      studiedWordIds,
      weakWordIds,
      strongWordIds,
      preferredCategories: preferredCategories.length > 0 ? preferredCategories : ['basic'],
      learningStyle: 'mixed',
      avgStudyTime: 15,
      consistency: 0.7
    };
  }

  // Get appropriate difficulty levels based on user level
  private static getAppropriatedifficulties(userLevel: string): Difficulty[] {
    switch (userLevel) {
      case 'beginner':
        return ['beginner'];
      case 'intermediate':
        return ['beginner', 'intermediate'];
      case 'advanced':
        return ['intermediate', 'advanced'];
      case 'mixed':
        return ['beginner', 'intermediate', 'advanced'];
      default:
        return ['beginner'];
    }
  }

  // Get words that need review based on user profile
  private static getReviewWords(profile: UserProfile, count: number): KoreanWord[] {
    const pool = WordExtractor['pool'];
    
    // Prioritize weak words for review
    const weakWords = pool.filter(w => profile.weakWordIds.includes(w.id));
    const studiedWords = pool.filter(w => 
      profile.studiedWordIds.includes(w.id) && 
      !profile.strongWordIds.includes(w.id)
    );
    
    const reviewCandidates = [...weakWords, ...studiedWords];
    
    // Sort by frequency (higher frequency = more important to review)
    reviewCandidates.sort((a, b) => b.frequency - a.frequency);
    
    return reviewCandidates.slice(0, count);
  }

  // Remove duplicate words from array
  private static deduplicateWords(words: KoreanWord[]): KoreanWord[] {
    const seen = new Set<number>();
    return words.filter(word => {
      if (seen.has(word.id)) {
        return false;
      }
      seen.add(word.id);
      return true;
    });
  }

  // Calculate statistics for curation result
  private static calculateStats(words: KoreanWord[], userProgress: LearningProgress[]) {
    const studiedIds = new Set(userProgress.map(p => p.wordId));
    
    const difficultySpread: Record<Difficulty, number> = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };
    
    const categorySpread: Record<string, number> = {};
    let totalFreq = 0;
    let reviewWordsCount = 0;
    let newWordsCount = 0;

    words.forEach(word => {
      difficultySpread[word.difficulty]++;
      categorySpread[word.category] = (categorySpread[word.category] || 0) + 1;
      totalFreq += word.frequency;
      
      if (studiedIds.has(word.id)) {
        reviewWordsCount++;
      } else {
        newWordsCount++;
      }
    });

    return {
      avgFrequency: Math.round(totalFreq / words.length),
      difficultySpread,
      categorySpread,
      reviewWordsCount,
      newWordsCount
    };
  }

  // Generate recommendations for next study session
  private static generateNextRecommendation(
    criteria: CurationCriteria, 
    profile: UserProfile, 
    currentWords: KoreanWord[]
  ): { suggestedNextSession: CurationCriteria; estimatedProgressTime: string } {
    
    // Suggest progression based on current session
    let nextGoal = criteria.learningGoal;
    let nextLevel = criteria.userLevel;
    
    // If mostly new words, suggest review next
    const newWordRatio = currentWords.filter(w => !profile.studiedWordIds.includes(w.id)).length / currentWords.length;
    if (newWordRatio > 0.8) {
      nextGoal = 'review';
    }
    
    // Suggest level progression
    if (profile.level === 'beginner' && profile.studiedWordIds.length > 30) {
      nextLevel = 'intermediate';
    } else if (profile.level === 'intermediate' && profile.studiedWordIds.length > 80) {
      nextLevel = 'advanced';
    }

    const suggestedNextSession: CurationCriteria = {
      ...criteria,
      learningGoal: nextGoal,
      userLevel: nextLevel,
      includeReviewWords: true
    };

    const estimatedProgressTime = this.estimateProgressTime(profile, currentWords.length);

    return {
      suggestedNextSession,
      estimatedProgressTime
    };
  }

  // Estimate how long it will take to learn current word set
  private static estimateProgressTime(profile: UserProfile, wordCount: number): string {
    // Base time estimates (in days)
    const baseTimePerWord = profile.level === 'beginner' ? 2 : 
                           profile.level === 'intermediate' ? 1.5 : 1;
    
    const totalDays = Math.ceil(wordCount * baseTimePerWord * (1 / profile.consistency));
    
    if (totalDays < 7) {
      return `${totalDays} days`;
    } else if (totalDays < 30) {
      return `${Math.ceil(totalDays / 7)} weeks`;
    } else {
      return `${Math.ceil(totalDays / 30)} months`;
    }
  }

  // Quick preset curations for common use cases
  static getQuickPresets() {
    return {
      dailyEssentials: () => this.curate({
        learningGoal: 'speed',
        userLevel: 'beginner',
        timeConstraint: 15,
        focusAreas: ['basic', 'greetings', 'food'],
        avoidRecentlyStudied: false,
        prioritizeWeakWords: false,
        includeReviewWords: false,
        maxDifficultyJump: 1,
        personalityType: 'systematic'
      }, 20),

      comprehensiveBeginnerPath: () => this.curate({
        learningGoal: 'balanced',
        userLevel: 'beginner',
        timeConstraint: 30,
        focusAreas: ['basic', 'greetings', 'family', 'food', 'numbers'],
        avoidRecentlyStudied: false,
        prioritizeWeakWords: true,
        includeReviewWords: true,
        maxDifficultyJump: 1,
        personalityType: 'systematic'
      }, 50),

      rapidProgress: () => this.curate({
        learningGoal: 'speed',
        userLevel: 'mixed',
        timeConstraint: 45,
        focusAreas: [],
        avoidRecentlyStudied: true,
        prioritizeWeakWords: false,
        includeReviewWords: false,
        maxDifficultyJump: 2,
        personalityType: 'challenge'
      }, 100)
    };
  }
}