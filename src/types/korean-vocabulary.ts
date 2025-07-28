/**
 * 한국어 어휘 데이터 타입 정의
 * 국립국어원 기준 한국어 자주 사용되는 단어 5000개 데이터 스키마
 */

export interface KoreanVocabularyMetadata {
  /** 데이터셋 제목 */
  title: string;
  /** 주요 출처 기관 */
  source: string;  
  /** 마지막 업데이트 날짜 (ISO 8601 형식) */
  last_updated: string;
  /** 총 단어 개수 */
  total_count: number;
  /** 데이터 버전 */
  version: string;
  /** 데이터 수집 방법론 */
  methodology: string;
  /** 라이선스 정보 */
  license: string;
}

export interface WordMeaning {
  /** 단어 정의/뜻풀이 */
  definition: string;
  /** 사용 예시 문장 */
  example?: string;
  /** 의미 분류 (필요시) */
  category?: string;
}

export interface RelatedWord {
  /** 관련 단어 */
  word: string;
  /** 관계 유형 (동의어, 반의어, 유의어 등) */
  relation: 'synonym' | 'antonym' | 'related' | 'compound' | 'derivative';
}

export interface KoreanWord {
  /** 고유 식별자 */
  id: number;
  /** 단어 (한글) */
  word: string;
  /** 한자 표기 (있는 경우) */
  hanja?: string;
  /** 품사 */
  pos: string;
  /** 사용 빈도 순위 (1위가 가장 자주 사용) */
  frequency_rank: number;
  /** 학습 단계 (1-3단계, 국립국어원 분류 기준) */
  level: 1 | 2 | 3;
  /** 단어 의미 목록 */
  meanings: WordMeaning[];
  /** 발음 표기 */
  pronunciation?: string;
  /** 어원 정보 */
  etymology?: string;
  /** 관련 단어들 */
  related_words?: RelatedWord[];
  /** 데이터 출처 */
  source: string;
  /** 추가 태그 (난이도, 주제 등) */
  tags?: string[];
  /** TOPIK 등급 (해당하는 경우) */
  topik_level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface KoreanVocabularyData {
  /** 메타데이터 */
  metadata: KoreanVocabularyMetadata;
  /** 단어 목록 */
  words: KoreanWord[];
}

// 품사 목록 (국립국어원 분류 기준)
export const PARTS_OF_SPEECH = [
  '명사',      // 체언
  '대명사',
  '수사',
  '동사',      // 용언  
  '형용사',
  '관형사',    // 수식언
  '부사',
  '감탄사',    // 독립언
  '조사',      // 관계언
  '어미',      // 의존 형태소
  '접사',
  '의존명사',
  '보조동사',
  '보조형용사'
] as const;

export type PartOfSpeech = typeof PARTS_OF_SPEECH[number];

// 학습 단계별 목표 단어 수 (국립국어원 기준)
export const LEARNING_LEVELS = {
  1: { name: '1단계 (초급)', target_count: 982, description: '기초 필수 어휘' },
  2: { name: '2단계 (중급)', target_count: 2111, description: '일상 생활 어휘' },
  3: { name: '3단계 (고급)', target_count: 2872, description: '학술/전문 어휘' }
} as const;

// 데이터 검증을 위한 스키마
export const VOCABULARY_SCHEMA = {
  metadata: {
    title: 'string',
    source: 'string',
    last_updated: 'string', // ISO 8601 날짜
    total_count: 'number',
    version: 'string',
    methodology: 'string',
    license: 'string'
  },
  words: {
    id: 'number',
    word: 'string',
    hanja: 'string?',
    pos: 'string',
    frequency_rank: 'number',
    level: 'number', // 1-3
    meanings: {
      definition: 'string',
      example: 'string?',
      category: 'string?'
    },
    pronunciation: 'string?',
    etymology: 'string?',
    related_words: {
      word: 'string',
      relation: 'string'
    },
    source: 'string',
    tags: 'string[]?',
    topik_level: 'number?' // 1-6
  }
} as const;