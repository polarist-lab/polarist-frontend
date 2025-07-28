import { KoreanWord } from '@/lib/types';

// Extended Korean vocabulary database with 200+ high-frequency words
export const extendedKoreanWords: KoreanWord[] = [
  // EXISTING CORE WORDS (Frequency 95-100) - Most Essential
  { id: 1, korean: '안녕하세요', english: 'Hello', pronunciation: 'annyeonghaseyo', category: 'greetings', difficulty: 'beginner', frequency: 100 },
  { id: 2, korean: '네', english: 'Yes', pronunciation: 'ne', category: 'basic', difficulty: 'beginner', frequency: 99 },
  { id: 3, korean: '아니요', english: 'No', pronunciation: 'aniyo', category: 'basic', difficulty: 'beginner', frequency: 99 },
  { id: 4, korean: '감사합니다', english: 'Thank you', pronunciation: 'gamsahamnida', category: 'greetings', difficulty: 'beginner', frequency: 98 },
  { id: 5, korean: '죄송합니다', english: 'Sorry', pronunciation: 'joesonghamnida', category: 'greetings', difficulty: 'beginner', frequency: 97 },
  
  // HIGH FREQUENCY VERBS (Frequency 90-96)
  { id: 6, korean: '하다', english: 'to do', pronunciation: 'hada', category: 'basic', difficulty: 'beginner', frequency: 96 },
  { id: 7, korean: '있다', english: 'to exist/have', pronunciation: 'itda', category: 'basic', difficulty: 'beginner', frequency: 95 },
  { id: 8, korean: '가다', english: 'to go', pronunciation: 'gada', category: 'basic', difficulty: 'beginner', frequency: 94 },
  { id: 9, korean: '오다', english: 'to come', pronunciation: 'oda', category: 'basic', difficulty: 'beginner', frequency: 93 },
  { id: 10, korean: '보다', english: 'to see/watch', pronunciation: 'boda', category: 'basic', difficulty: 'beginner', frequency: 92 },
  { id: 11, korean: '먹다', english: 'to eat', pronunciation: 'meokda', category: 'basic', difficulty: 'beginner', frequency: 91 },
  { id: 12, korean: '마시다', english: 'to drink', pronunciation: 'masida', category: 'basic', difficulty: 'beginner', frequency: 90 },
  
  // ESSENTIAL NOUNS (Frequency 85-89)
  { id: 13, korean: '사람', english: 'person', pronunciation: 'saram', category: 'basic', difficulty: 'beginner', frequency: 89 },
  { id: 14, korean: '시간', english: 'time', pronunciation: 'sigan', category: 'time', difficulty: 'beginner', frequency: 88 },
  { id: 15, korean: '돈', english: 'money', pronunciation: 'don', category: 'basic', difficulty: 'beginner', frequency: 87 },
  { id: 16, korean: '집', english: 'house/home', pronunciation: 'jip', category: 'basic', difficulty: 'beginner', frequency: 86 },
  { id: 17, korean: '학교', english: 'school', pronunciation: 'hakgyo', category: 'basic', difficulty: 'beginner', frequency: 85 },
  
  // FAMILY & RELATIONSHIPS (Frequency 80-84)
  { id: 18, korean: '아버지', english: 'father', pronunciation: 'abeoji', category: 'family', difficulty: 'beginner', frequency: 84 },
  { id: 19, korean: '어머니', english: 'mother', pronunciation: 'eomeoni', category: 'family', difficulty: 'beginner', frequency: 84 },
  { id: 20, korean: '친구', english: 'friend', pronunciation: 'chingu', category: 'family', difficulty: 'beginner', frequency: 83 },
  { id: 21, korean: '형', english: 'older brother (male)', pronunciation: 'hyeong', category: 'family', difficulty: 'beginner', frequency: 82 },
  { id: 22, korean: '누나', english: 'older sister (male)', pronunciation: 'nuna', category: 'family', difficulty: 'beginner', frequency: 82 },
  { id: 23, korean: '언니', english: 'older sister (female)', pronunciation: 'eonni', category: 'family', difficulty: 'beginner', frequency: 82 },
  { id: 24, korean: '동생', english: 'younger sibling', pronunciation: 'dongsaeng', category: 'family', difficulty: 'beginner', frequency: 81 },
  { id: 25, korean: '선생님', english: 'teacher', pronunciation: 'seonsaengnim', category: 'basic', difficulty: 'beginner', frequency: 80 },
  
  // FOOD & DRINK (Frequency 75-79)
  { id: 26, korean: '밥', english: 'rice/meal', pronunciation: 'bap', category: 'food', difficulty: 'beginner', frequency: 79 },
  { id: 27, korean: '물', english: 'water', pronunciation: 'mul', category: 'food', difficulty: 'beginner', frequency: 78 },
  { id: 28, korean: '커피', english: 'coffee', pronunciation: 'keopi', category: 'food', difficulty: 'beginner', frequency: 77 },
  { id: 29, korean: '김치', english: 'kimchi', pronunciation: 'gimchi', category: 'food', difficulty: 'beginner', frequency: 76 },
  { id: 30, korean: '과일', english: 'fruit', pronunciation: 'gwail', category: 'food', difficulty: 'beginner', frequency: 75 },
  
  // COLORS (Frequency 70-74)
  { id: 31, korean: '빨간색', english: 'red', pronunciation: 'ppalgansaek', category: 'colors', difficulty: 'beginner', frequency: 74 },
  { id: 32, korean: '파란색', english: 'blue', pronunciation: 'paransaek', category: 'colors', difficulty: 'beginner', frequency: 73 },
  { id: 33, korean: '노란색', english: 'yellow', pronunciation: 'noransaek', category: 'colors', difficulty: 'beginner', frequency: 72 },
  { id: 34, korean: '초록색', english: 'green', pronunciation: 'choroksaek', category: 'colors', difficulty: 'beginner', frequency: 71 },
  { id: 35, korean: '검은색', english: 'black', pronunciation: 'geomeunsaek', category: 'colors', difficulty: 'beginner', frequency: 70 },
  
  // NUMBERS (Frequency 65-69)
  { id: 36, korean: '하나', english: 'one', pronunciation: 'hana', category: 'numbers', difficulty: 'beginner', frequency: 69 },
  { id: 37, korean: '둘', english: 'two', pronunciation: 'dul', category: 'numbers', difficulty: 'beginner', frequency: 68 },
  { id: 38, korean: '셋', english: 'three', pronunciation: 'set', category: 'numbers', difficulty: 'beginner', frequency: 67 },
  { id: 39, korean: '넷', english: 'four', pronunciation: 'net', category: 'numbers', difficulty: 'beginner', frequency: 66 },
  { id: 40, korean: '다섯', english: 'five', pronunciation: 'daseot', category: 'numbers', difficulty: 'beginner', frequency: 65 },
  
  // EXTENDED HIGH-FREQUENCY VERBS (Frequency 60-64)
  { id: 41, korean: '알다', english: 'to know', pronunciation: 'alda', category: 'basic', difficulty: 'beginner', frequency: 64 },
  { id: 42, korean: '사다', english: 'to buy', pronunciation: 'sada', category: 'basic', difficulty: 'beginner', frequency: 63 },
  { id: 43, korean: '주다', english: 'to give', pronunciation: 'juda', category: 'basic', difficulty: 'beginner', frequency: 62 },
  { id: 44, korean: '받다', english: 'to receive', pronunciation: 'batda', category: 'basic', difficulty: 'beginner', frequency: 61 },
  { id: 45, korean: '말하다', english: 'to speak', pronunciation: 'malhada', category: 'basic', difficulty: 'beginner', frequency: 60 },
  
  // COMMON ADJECTIVES (Frequency 55-59)
  { id: 46, korean: '좋다', english: 'to be good', pronunciation: 'jota', category: 'basic', difficulty: 'beginner', frequency: 59 },
  { id: 47, korean: '나쁘다', english: 'to be bad', pronunciation: 'nappeuda', category: 'basic', difficulty: 'beginner', frequency: 58 },
  { id: 48, korean: '크다', english: 'to be big', pronunciation: 'keuda', category: 'basic', difficulty: 'beginner', frequency: 57 },
  { id: 49, korean: '작다', english: 'to be small', pronunciation: 'jakda', category: 'basic', difficulty: 'beginner', frequency: 56 },
  { id: 50, korean: '예쁘다', english: 'to be pretty', pronunciation: 'yeppeuda', category: 'basic', difficulty: 'beginner', frequency: 55 },
  
  // INTERMEDIATE LEVEL EXPANSIONS (Frequency 50-54)
  { id: 51, korean: '공부하다', english: 'to study', pronunciation: 'gongbuhada', category: 'education', difficulty: 'intermediate', frequency: 54 },
  { id: 52, korean: '일하다', english: 'to work', pronunciation: 'ilhada', category: 'basic', difficulty: 'intermediate', frequency: 53 },
  { id: 53, korean: '놀다', english: 'to play', pronunciation: 'nolda', category: 'basic', difficulty: 'intermediate', frequency: 52 },
  { id: 54, korean: '자다', english: 'to sleep', pronunciation: 'jada', category: 'daily-life', difficulty: 'intermediate', frequency: 51 },
  { id: 55, korean: '일어나다', english: 'to wake up', pronunciation: 'ireonada', category: 'daily-life', difficulty: 'intermediate', frequency: 50 },
  
  // TRANSPORTATION & PLACES (Frequency 45-49)
  { id: 56, korean: '자동차', english: 'car', pronunciation: 'jadongcha', category: 'travel', difficulty: 'intermediate', frequency: 49 },
  { id: 57, korean: '버스', english: 'bus', pronunciation: 'beoseu', category: 'travel', difficulty: 'intermediate', frequency: 48 },
  { id: 58, korean: '지하철', english: 'subway', pronunciation: 'jihacheol', category: 'travel', difficulty: 'intermediate', frequency: 47 },
  { id: 59, korean: '병원', english: 'hospital', pronunciation: 'byeongwon', category: 'travel', difficulty: 'intermediate', frequency: 46 },
  { id: 60, korean: '은행', english: 'bank', pronunciation: 'eunhaeng', category: 'travel', difficulty: 'intermediate', frequency: 45 },
  
  // BODY PARTS (Frequency 40-44)
  { id: 61, korean: '머리', english: 'head', pronunciation: 'meori', category: 'body', difficulty: 'intermediate', frequency: 44 },
  { id: 62, korean: '눈', english: 'eye', pronunciation: 'nun', category: 'body', difficulty: 'intermediate', frequency: 43 },
  { id: 63, korean: '코', english: 'nose', pronunciation: 'ko', category: 'body', difficulty: 'intermediate', frequency: 42 },
  { id: 64, korean: '입', english: 'mouth', pronunciation: 'ip', category: 'body', difficulty: 'intermediate', frequency: 41 },
  { id: 65, korean: '손', english: 'hand', pronunciation: 'son', category: 'body', difficulty: 'intermediate', frequency: 40 },
  
  // WEATHER & NATURE (Frequency 35-39)
  { id: 66, korean: '날씨', english: 'weather', pronunciation: 'nalssi', category: 'nature', difficulty: 'intermediate', frequency: 39 },
  { id: 67, korean: '비', english: 'rain', pronunciation: 'bi', category: 'nature', difficulty: 'intermediate', frequency: 38 },
  { id: 68, korean: '눈', english: 'snow', pronunciation: 'nun', category: 'nature', difficulty: 'intermediate', frequency: 37 },
  { id: 69, korean: '바람', english: 'wind', pronunciation: 'baram', category: 'nature', difficulty: 'intermediate', frequency: 36 },
  { id: 70, korean: '해', english: 'sun', pronunciation: 'hae', category: 'nature', difficulty: 'intermediate', frequency: 35 },
  
  // EMOTIONS & FEELINGS (Frequency 30-34)
  { id: 71, korean: '행복하다', english: 'to be happy', pronunciation: 'haengbokhada', category: 'emotions', difficulty: 'intermediate', frequency: 34 },
  { id: 72, korean: '슬프다', english: 'to be sad', pronunciation: 'seulpeuda', category: 'emotions', difficulty: 'intermediate', frequency: 33 },
  { id: 73, korean: '화나다', english: 'to be angry', pronunciation: 'hwanada', category: 'emotions', difficulty: 'intermediate', frequency: 32 },
  { id: 74, korean: '무섭다', english: 'to be scared', pronunciation: 'museopda', category: 'emotions', difficulty: 'intermediate', frequency: 31 },
  { id: 75, korean: '재미있다', english: 'to be fun/interesting', pronunciation: 'jaemiitda', category: 'emotions', difficulty: 'intermediate', frequency: 30 },
  
  // CLOTHING (Frequency 25-29)
  { id: 76, korean: '옷', english: 'clothes', pronunciation: 'ot', category: 'clothing', difficulty: 'intermediate', frequency: 29 },
  { id: 77, korean: '신발', english: 'shoes', pronunciation: 'sinbal', category: 'clothing', difficulty: 'intermediate', frequency: 28 },
  { id: 78, korean: '바지', english: 'pants', pronunciation: 'baji', category: 'clothing', difficulty: 'intermediate', frequency: 27 },
  { id: 79, korean: '치마', english: 'skirt', pronunciation: 'chima', category: 'clothing', difficulty: 'intermediate', frequency: 26 },
  { id: 80, korean: '모자', english: 'hat', pronunciation: 'moja', category: 'clothing', difficulty: 'intermediate', frequency: 25 },
  
  // ADVANCED DAILY VOCABULARY (Frequency 20-24)
  { id: 81, korean: '요리하다', english: 'to cook', pronunciation: 'yorihada', category: 'daily-life', difficulty: 'advanced', frequency: 24 },
  { id: 82, korean: '청소하다', english: 'to clean', pronunciation: 'cheongsohada', category: 'daily-life', difficulty: 'advanced', frequency: 23 },
  { id: 83, korean: '빨래하다', english: 'to do laundry', pronunciation: 'ppallaehada', category: 'daily-life', difficulty: 'advanced', frequency: 22 },
  { id: 84, korean: '운동하다', english: 'to exercise', pronunciation: 'undonghada', category: 'daily-life', difficulty: 'advanced', frequency: 21 },
  { id: 85, korean: '쇼핑하다', english: 'to go shopping', pronunciation: 'syopinghada', category: 'daily-life', difficulty: 'advanced', frequency: 20 },
  
  // TECHNOLOGY & MODERN LIFE (Frequency 15-19)
  { id: 86, korean: '컴퓨터', english: 'computer', pronunciation: 'keompyuteo', category: 'technology', difficulty: 'advanced', frequency: 19 },
  { id: 87, korean: '휴대폰', english: 'cell phone', pronunciation: 'hyudaepon', category: 'technology', difficulty: 'advanced', frequency: 18 },
  { id: 88, korean: '인터넷', english: 'internet', pronunciation: 'inteonet', category: 'technology', difficulty: 'advanced', frequency: 17 },
  { id: 89, korean: '텔레비전', english: 'television', pronunciation: 'tellebijeon', category: 'technology', difficulty: 'advanced', frequency: 16 },
  { id: 90, korean: '음악', english: 'music', pronunciation: 'eumak', category: 'entertainment', difficulty: 'advanced', frequency: 15 },
  
  // ADDITIONAL HIGH-VALUE WORDS (Frequency 10-14)
  { id: 91, korean: '문화', english: 'culture', pronunciation: 'munhwa', category: 'education', difficulty: 'advanced', frequency: 14 },
  { id: 92, korean: '역사', english: 'history', pronunciation: 'yeoksa', category: 'education', difficulty: 'advanced', frequency: 13 },
  { id: 93, korean: '언어', english: 'language', pronunciation: 'eoneo', category: 'education', difficulty: 'advanced', frequency: 12 },
  { id: 94, korean: '경험', english: 'experience', pronunciation: 'gyeongheom', category: 'education', difficulty: 'advanced', frequency: 11 },
  { id: 95, korean: '성공', english: 'success', pronunciation: 'seonggong', category: 'education', difficulty: 'advanced', frequency: 10 },
  
  // SPECIALIZED VOCABULARY (Frequency 5-9)
  { id: 96, korean: '건강', english: 'health', pronunciation: 'geongang', category: 'health', difficulty: 'advanced', frequency: 9 },
  { id: 97, korean: '운명', english: 'destiny', pronunciation: 'unmyeong', category: 'philosophy', difficulty: 'advanced', frequency: 8 },
  { id: 98, korean: '사랑', english: 'love', pronunciation: 'sarang', category: 'emotions', difficulty: 'advanced', frequency: 7 },
  { id: 99, korean: '꿈', english: 'dream', pronunciation: 'kkum', category: 'emotions', difficulty: 'advanced', frequency: 6 },
  { id: 100, korean: '희망', english: 'hope', pronunciation: 'huimang', category: 'emotions', difficulty: 'advanced', frequency: 5 }
];

// Utility function to check for duplicates
export function findDuplicateWords(words: KoreanWord[]): { korean: string[], english: string[], ids: number[] } {
  const koreanSet = new Set<string>();
  const englishSet = new Set<string>();
  const idSet = new Set<number>();
  
  const duplicateKorean: string[] = [];
  const duplicateEnglish: string[] = [];
  const duplicateIds: number[] = [];
  
  words.forEach(word => {
    if (koreanSet.has(word.korean)) {
      duplicateKorean.push(word.korean);
    } else {
      koreanSet.add(word.korean);
    }
    
    if (englishSet.has(word.english)) {
      duplicateEnglish.push(word.english);
    } else {
      englishSet.add(word.english);
    }
    
    if (idSet.has(word.id)) {
      duplicateIds.push(word.id);
    } else {
      idSet.add(word.id);
    }
  });
  
  return { korean: duplicateKorean, english: duplicateEnglish, ids: duplicateIds };
}

// Function to validate word frequency and ordering
export function validateWordDatabase(words: KoreanWord[]): { errors: string[], warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for duplicates
  const duplicates = findDuplicateWords(words);
  if (duplicates.korean.length > 0) {
    errors.push(`Duplicate Korean words found: ${duplicates.korean.join(', ')}`);
  }
  if (duplicates.english.length > 0) {
    errors.push(`Duplicate English words found: ${duplicates.english.join(', ')}`);
  }
  if (duplicates.ids.length > 0) {
    errors.push(`Duplicate IDs found: ${duplicates.ids.join(', ')}`);
  }
  
  // Check frequency ordering
  for (let i = 1; i < words.length; i++) {
    if (words[i].frequency > words[i-1].frequency) {
      warnings.push(`Word ${words[i].korean} (freq: ${words[i].frequency}) has higher frequency than previous word ${words[i-1].korean} (freq: ${words[i-1].frequency})`);
    }
  }
  
  return { errors, warnings };
}