import { KoreanWord } from '@/lib/types';

// Korean vocabulary data from crawled dataset
interface CrawledKoreanWord {
  id: number;
  word: string;
  pos: string;
  frequency_rank: number;
  level: 1 | 2 | 3;
  meanings: Array<{
    definition: string;
    category?: string;
  }>;
  source: string;
  tags: string[];
  audioUrl?: string;
}

interface KoreanVocabularyData {
  metadata: {
    title: string;
    source: string;
    last_updated: string;
    total_count: number;
    version: string;
    methodology: string;
    license: string;
  };
  words: CrawledKoreanWord[];
}

// Convert crawled word to app format
function convertCrawledWord(crawledWord: CrawledKoreanWord): KoreanWord {
  const categoryMap: Record<string, string> = {
    '명사': 'basic',
    '동사': 'basic', 
    '형용사': 'basic',
    '부사': 'basic',
    '관형사': 'basic',
    '의존명사': 'basic',
    '조사': 'basic',
    '접사': 'basic',
    '대명사': 'basic',
    '접속부사': 'basic'
  };

  const difficultyMap: Record<number, 'absolute-beginner' | 'beginner' | 'intermediate'> = {
    1: 'absolute-beginner',
    2: 'beginner', 
    3: 'intermediate'
  };

  return {
    id: crawledWord.id,
    korean: crawledWord.word,
    english: crawledWord.meanings[0]?.definition || `${crawledWord.word} (${crawledWord.pos})`,
    pronunciation: '', // Not available in crawled data
    category: categoryMap[crawledWord.pos] || 'basic',
    difficulty: difficultyMap[crawledWord.level] || 'beginner',
    frequency: crawledWord.frequency_rank,
    partOfSpeech: crawledWord.pos,
    tags: crawledWord.tags,
    source: crawledWord.source,
    audioUrl: crawledWord.audioUrl, // Add this line
  };
}

// Load Korean vocabulary from JSON file
export async function loadKoreanVocabulary(): Promise<KoreanWord[]> {
  try {
    // Import the crawled vocabulary data
    const response = await fetch('/data/korean-vocabulary-200-final.json');
    if (!response.ok) {
      throw new Error('Failed to load vocabulary data');
    }
    
    const data: KoreanVocabularyData = await response.json();
    
    // Convert crawled words to app format
    return data.words.map(convertCrawledWord);
  } catch (error) {
    console.error('Error loading Korean vocabulary:', error);
    // Return empty array as fallback
    return [];
  }
}

// Get vocabulary with filters
export async function getKoreanVocabulary(
  limit?: number,
  categories?: string[],
  difficulties?: string[],
  minFrequency?: number
): Promise<KoreanWord[]> {
  const allWords = await loadKoreanVocabulary();
  
  let filteredWords = allWords;
  
  // Apply filters
  if (categories && categories.length > 0) {
    filteredWords = filteredWords.filter(word => categories.includes(word.category));
  }
  
  if (difficulties && difficulties.length > 0) {
    filteredWords = filteredWords.filter(word => difficulties.includes(word.difficulty));
  }
  
  if (minFrequency) {
    filteredWords = filteredWords.filter(word => word.frequency <= minFrequency);
  }
  
  // Sort by frequency (lower number = higher frequency)
  filteredWords.sort((a, b) => a.frequency - b.frequency);
  
  // Apply limit
  if (limit) {
    filteredWords = filteredWords.slice(0, limit);
  }
  
  return filteredWords;
}

// Get random word set from vocabulary
export async function getRandomKoreanWordSet(
  count: number = 20,
  categories?: string[],
  difficulties?: string[],
  minFrequency?: number
): Promise<KoreanWord[]> {
  const filteredWords = await getKoreanVocabulary(undefined, categories, difficulties, minFrequency);
  
  if (filteredWords.length === 0) {
    return [];
  }
  
  // Shuffle and take requested count
  const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}