// 언어별 어휘 관리 시스템
// Multi-language vocabulary management system

import { KoreanWord } from '@/lib/types';
import { Locale } from '@/lib/i18n';

// 언어별 한국어 어휘 임포트
import { koreanWordsForEnglish } from './korean/en';
import { koreanWordsForJapanese } from './korean/jp';
import { koreanWordsForIndonesian } from './korean/id';

// 언어별 어휘 맵
const koreanVocabularyMap: Record<Locale, KoreanWord[]> = {
  en: koreanWordsForEnglish,
  jp: koreanWordsForJapanese,
  id: koreanWordsForIndonesian,
};

// 기본 언어 (영어)
const defaultLocale: Locale = 'en';

/**
 * 특정 언어 사용자를 위한 한국어 어휘 가져오기
 * @param locale 사용자 언어 (en, jp, id)
 * @returns 해당 언어에 최적화된 한국어 학습 어휘
 */
export function getKoreanWordsForLocale(locale: Locale): KoreanWord[] {
  return koreanVocabularyMap[locale] || koreanVocabularyMap[defaultLocale];
}

/**
 * 모든 언어의 어휘 통계 정보
 */
export function getVocabularyStats() {
  return {
    en: {
      total: koreanWordsForEnglish.length,
      difficulties: getStatsByDifficulty(koreanWordsForEnglish),
      categories: getStatsByCategory(koreanWordsForEnglish),
      avgFrequency: getAverageFrequency(koreanWordsForEnglish),
    },
    jp: {
      total: koreanWordsForJapanese.length,
      difficulties: getStatsByDifficulty(koreanWordsForJapanese),
      categories: getStatsByCategory(koreanWordsForJapanese),
      avgFrequency: getAverageFrequency(koreanWordsForJapanese),
    },
    id: {
      total: koreanWordsForIndonesian.length,
      difficulties: getStatsByDifficulty(koreanWordsForIndonesian),
      categories: getStatsByCategory(koreanWordsForIndonesian),
      avgFrequency: getAverageFrequency(koreanWordsForIndonesian),
    },
  };
}

// 난이도별 통계
function getStatsByDifficulty(words: KoreanWord[]) {
  return words.reduce((acc, word) => {
    acc[word.difficulty] = (acc[word.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

// 카테고리별 통계  
function getStatsByCategory(words: KoreanWord[]) {
  return words.reduce((acc, word) => {
    acc[word.category] = (acc[word.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

// 평균 빈도
function getAverageFrequency(words: KoreanWord[]) {
  const total = words.reduce((sum, word) => sum + word.frequency, 0);
  return Math.round(total / words.length);
}

/**
 * 특정 언어에서 가장 고빈도 단어들
 * @param locale 사용자 언어
 * @param count 가져올 단어 수
 * @returns 고빈도 순으로 정렬된 단어 배열
 */
export function getHighFrequencyWords(locale: Locale, count: number = 20): KoreanWord[] {
  const words = getKoreanWordsForLocale(locale);
  return words
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, count);
}

/**
 * 특정 언어에서 초급자용 단어들
 * @param locale 사용자 언어  
 * @param count 가져올 단어 수
 * @returns 초급 난이도 단어 배열
 */
export function getBeginnerWords(locale: Locale, count: number = 30): KoreanWord[] {
  const words = getKoreanWordsForLocale(locale);
  return words
    .filter(word => word.difficulty === 'beginner')
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, count);
}

/**
 * 특정 언어에서 카테고리별 단어들
 * @param locale 사용자 언어
 * @param category 카테고리
 * @param count 가져올 단어 수
 * @returns 해당 카테고리의 단어 배열
 */
export function getWordsByCategory(
  locale: Locale, 
  category: string, 
  count?: number
): KoreanWord[] {
  const words = getKoreanWordsForLocale(locale);
  const filtered = words
    .filter(word => word.category === category)
    .sort((a, b) => b.frequency - a.frequency);
    
  return count ? filtered.slice(0, count) : filtered;
}

/**
 * 언어별 학습 추천 순서
 * @param locale 사용자 언어
 * @returns 학습 추천 설명과 함께 정렬된 단어들
 */
export function getRecommendedStudyOrder(locale: Locale) {
  const words = getKoreanWordsForLocale(locale);
  
  switch (locale) {
    case 'jp':
      return {
        description: '일본어 사용자를 위해 한자어를 우선 배치하고, 한국어 특유의 호칭 체계를 체계적으로 학습할 수 있도록 구성했습니다.',
        words: words.slice(0, 20), // 상위 20개
      };
    case 'id':
      return {
        description: '인도네시아어 사용자를 위해 실용적인 일상 표현을 우선하고, 아시아 공통 문화권의 이해를 돕는 어휘를 중심으로 구성했습니다.',
        words: words.slice(0, 20),
      };
    case 'en':
    default:
      return {
        description: '영어 사용자를 위해 빈도수 기반으로 가장 실용적인 한국어 어휘부터 학습할 수 있도록 구성했습니다.',
        words: words.slice(0, 20),
      };
  }
}

// 기존 korean-words.ts와의 호환성을 위한 내보내기
export const koreanWords = koreanWordsForEnglish; // 기본값으로 영어 버전 사용

// 언어별 어휘 내보내기
export { 
  koreanWordsForEnglish,
  koreanWordsForJapanese, 
  koreanWordsForIndonesian 
};