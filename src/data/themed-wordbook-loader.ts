import { KoreanWord, Difficulty } from '@/lib/types';

// 테마 기반 단어장 데이터 로더
interface ThemedWord {
  korean: string;
  pronunciation: string;
  english: string;
  category: string;
  difficulty: Difficulty;
  frequency: number;
  example?: string;
  exampleTranslation?: string;
  notes?: string;
  audioUrl?: string;
}

export interface ThemedWordbookData {
  id: string;
  title: string;
  description: string;
  totalWords: number;
  words: ThemedWord[];
}

// Helper to create a simple hash for ID
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Convert themed word to the main KoreanWord type
function convertThemedWord(themedWord: ThemedWord, index: number): KoreanWord {
  return {
    id: simpleHash(`${themedWord.korean}-${index}`),
    korean: themedWord.korean,
    english: themedWord.english,
    pronunciation: themedWord.pronunciation,
    category: themedWord.category,
    difficulty: themedWord.difficulty,
    frequency: themedWord.frequency,
    isHanjaOrigin: false, // Default for themed words
    audioUrl: themedWord.audioUrl || '',
    // Optional fields from ThemedWord can be added here if needed in KoreanWord
  };
}

// 테마별 단어장 데이터 로드
export async function loadThemedWordbook(themeId: string): Promise<ThemedWordbookData | null> {
  try {
    // 동적 import로 JSON 파일 로드
    const wordbookData = await import(`./themed-wordbooks/${themeId}.json`);
    return wordbookData.default || wordbookData;
  } catch (error) {
    console.error(`Failed to load themed wordbook: ${themeId}`, error);
    return null;
  }
}

// 난이도별 필터링된 단어 반환
export function filterWordsByDifficulty(
  words: KoreanWord[], 
  difficulties: Difficulty[]
): KoreanWord[] {
  if (!difficulties || difficulties.length === 0) {
    return words;
  }
  
  return words.filter(word => difficulties.includes(word.difficulty));
}

// 단어 개수별 무작위 선택
export function getRandomWords(words: KoreanWord[], count?: number): KoreanWord[] {
  if (!count || count >= words.length) {
    return words;
  }
  
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 테마 단어장에서 조건에 맞는 단어 세트 가져오기
export async function getThemedWordSet(
  themeId: string,
  difficulties?: Difficulty[],
  wordCount?: number
): Promise<KoreanWord[]> {
  const wordbook = await loadThemedWordbook(themeId);
  
  if (!wordbook) {
    return [];
  }
  
  // Convert all words to the consistent KoreanWord type
  let convertedWords = wordbook.words.map(convertThemedWord);

  // 난이도별 필터링
  if (difficulties && difficulties.length > 0) {
    convertedWords = filterWordsByDifficulty(convertedWords, difficulties);
  }
  
  // 단어 개수 제한
  if (wordCount) {
    convertedWords = getRandomWords(convertedWords, wordCount);
  }
  
  return convertedWords;
}

// 사용 가능한 테마 목록
export const AVAILABLE_THEMES = [
  'fruits',
  'animals', 
  'colors',
  'family',
  'food-dishes',
  'transportation',
  'home-furniture',
  'clothing',
  'jobs',
  'health-body'
];

// 테마가 유효한지 확인
export function isValidTheme(themeId: string): boolean {
  return AVAILABLE_THEMES.includes(themeId);
}