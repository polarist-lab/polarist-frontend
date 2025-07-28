import { KoreanWord } from './types';
import { getHanjaInfo, isHanjaWord } from '@/data/hanja-words';

// 기존 KoreanWord 객체에 한자 정보를 추가하는 유틸리티
export function enhanceWordWithHanja(word: KoreanWord): KoreanWord {
  // 이미 한자 정보가 있다면 그대로 반환
  if ('hanja' in word && 'isHanjaOrigin' in word) {
    return word;
  }

  const hanjaInfo = getHanjaInfo(word.korean);
  
  return {
    ...word,
    hanja: hanjaInfo,
    isHanjaOrigin: isHanjaWord(word.korean)
  };
}

// 단어 배열 전체에 한자 정보 추가
export function enhanceWordsWithHanja(words: KoreanWord[]): KoreanWord[] {
  return words.map(enhanceWordWithHanja);
}

// 런타임에서 단어가 한자어인지 확인하고 정보 추가
export function getEnhancedWord(word: KoreanWord): KoreanWord {
  // 캐시된 정보가 있으면 사용
  if ('isHanjaOrigin' in word) {
    return word;
  }

  return enhanceWordWithHanja(word);
}

// 한자어 통계 계산
export function getHanjaWordStats(words: KoreanWord[]) {
  const enhancedWords = enhanceWordsWithHanja(words);
  const hanjaWords = enhancedWords.filter(w => w.isHanjaOrigin);
  
  return {
    totalWords: words.length,
    hanjaWords: hanjaWords.length,
    pureKoreanWords: words.length - hanjaWords.length,
    hanjaPercentage: Math.round((hanjaWords.length / words.length) * 100),
    categoryBreakdown: getCategoryHanjaBreakdown(enhancedWords)
  };
}

// 카테고리별 한자어 분석
function getCategoryHanjaBreakdown(words: KoreanWord[]) {
  const breakdown: Record<string, { total: number; hanja: number; percentage: number }> = {};
  
  words.forEach(word => {
    if (!breakdown[word.category]) {
      breakdown[word.category] = { total: 0, hanja: 0, percentage: 0 };
    }
    
    breakdown[word.category].total++;
    if (word.isHanjaOrigin) {
      breakdown[word.category].hanja++;
    }
  });
  
  // 백분율 계산
  Object.keys(breakdown).forEach(category => {
    const stats = breakdown[category];
    stats.percentage = Math.round((stats.hanja / stats.total) * 100);
  });
  
  return breakdown;
}

// 학습 우선순위 기반 단어 정렬 (한자어 고려)
export function sortWordsByHanjaLearningPriority(
  words: KoreanWord[], 
  userLocale: string = 'en'
): KoreanWord[] {
  const enhancedWords = enhanceWordsWithHanja(words);
  
  // 언어별 우선순위 설정
  const hanjaFriendlyLocales = ['ja', 'zh-CN', 'zh-TW', 'ko'];
  const prioritizeHanja = hanjaFriendlyLocales.includes(userLocale);
  
  return enhancedWords.sort((a, b) => {
    // 기본 우선순위: 빈도수
    let priorityA = a.frequency;
    let priorityB = b.frequency;
    
    // 한자 친숙 언어라면 한자어에 보너스
    if (prioritizeHanja) {
      if (a.isHanjaOrigin) priorityA += 10;
      if (b.isHanjaOrigin) priorityB += 10;
    }
    // 한자 생소 언어라면 순우리말에 보너스
    else {
      if (!a.isHanjaOrigin) priorityA += 5;
      if (!b.isHanjaOrigin) priorityB += 5;
    }
    
    return priorityB - priorityA;
  });
}