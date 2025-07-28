// 일본어 사용자를 위한 한국어 학습 어휘
// Japanese speakers learning Korean vocabulary

import { KoreanWord } from '@/lib/types';

// 일본어 사용자에게 특화된 어휘 (한자어가 많아 이해하기 쉬운 단어 우선 배치)
export const koreanWordsForJapanese: KoreanWord[] = [
  // TIER S: 한자어 위주 (일본인이 이해하기 쉬운 단어)
  { 
    id: 1, 
    korean: '학교', 
    english: '学校 (がっこう)', 
    pronunciation: 'ハッキョ', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 100 
  },
  { 
    id: 2, 
    korean: '선생님', 
    english: '先生 (せんせい)', 
    pronunciation: 'ソンセンニム', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 99 
  },
  { 
    id: 3, 
    korean: '학생', 
    english: '学生 (がくせい)', 
    pronunciation: 'ハクセン', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 98 
  },
  { 
    id: 4, 
    korean: '시간', 
    english: '時間 (じかん)', 
    pronunciation: 'sigan', 
    category: 'time', 
    difficulty: 'beginner', 
    frequency: 97 
  },
  { 
    id: 5, 
    korean: '친구', 
    english: '友達 (ともだち)', 
    pronunciation: 'chingu', 
    category: 'family', 
    difficulty: 'beginner', 
    frequency: 96 
  },
  { 
    id: 6, 
    korean: '가족', 
    english: '家族 (かぞく)', 
    pronunciation: 'gajok', 
    category: 'family', 
    difficulty: 'beginner', 
    frequency: 95 
  },
  { 
    id: 7, 
    korean: '음식', 
    english: '食べ物 (たべもの)', 
    pronunciation: 'eumsik', 
    category: 'food', 
    difficulty: 'beginner', 
    frequency: 94 
  },

  // TIER A: 기본 인사 (한국어 특유 표현)
  { 
    id: 8, 
    korean: '안녕하세요', 
    english: 'こんにちは (丁寧)', 
    pronunciation: 'アンニョンハセヨ', 
    category: 'greetings', 
    difficulty: 'beginner', 
    frequency: 93 
  },
  { 
    id: 9, 
    korean: '안녕', 
    english: 'やあ / バイバイ (カジュアル)', 
    pronunciation: 'アンニョン', 
    category: 'greetings', 
    difficulty: 'beginner', 
    frequency: 92 
  },
  { 
    id: 10, 
    korean: '감사합니다', 
    english: 'ありがとうございます', 
    pronunciation: 'カムサハムニダ', 
    category: 'greetings', 
    difficulty: 'beginner', 
    frequency: 91 
  },
  { 
    id: 11, 
    korean: '죄송합니다', 
    english: 'すみません', 
    pronunciation: 'joesonghamnida', 
    category: 'greetings', 
    difficulty: 'beginner', 
    frequency: 90 
  },

  // TIER B: 기본 동사 (일본어와 어순이 같아 이해하기 쉬움)
  { 
    id: 12, 
    korean: '있다', 
    english: 'ある/いる (存在)', 
    pronunciation: 'itda', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 89 
  },
  { 
    id: 13, 
    korean: '없다', 
    english: 'ない (非存在)', 
    pronunciation: 'eopda', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 88 
  },
  { 
    id: 14, 
    korean: '하다', 
    english: 'する', 
    pronunciation: 'hada', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 87 
  },
  { 
    id: 15, 
    korean: '가다', 
    english: '行く (いく)', 
    pronunciation: 'gada', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 86 
  },
  { 
    id: 16, 
    korean: '오다', 
    english: '来る (くる)', 
    pronunciation: 'oda', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 85 
  },
  { 
    id: 17, 
    korean: '보다', 
    english: '見る (みる)', 
    pronunciation: 'boda', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 84 
  },
  { 
    id: 18, 
    korean: '먹다', 
    english: '食べる (たべる)', 
    pronunciation: 'meokda', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 83 
  },
  { 
    id: 19, 
    korean: '마시다', 
    english: '飲む (のむ)', 
    pronunciation: 'masida', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 82 
  },

  // TIER C: 가족 호칭 (한국어 특유의 복잡한 호칭 체계)
  { 
    id: 20, 
    korean: '아버지', 
    english: 'お父さん', 
    pronunciation: 'abeoji', 
    category: 'family', 
    difficulty: 'beginner', 
    frequency: 81 
  },
  { 
    id: 21, 
    korean: '어머니', 
    english: 'お母さん', 
    pronunciation: 'eomeoni', 
    category: 'family', 
    difficulty: 'beginner', 
    frequency: 80 
  },
  { 
    id: 22, 
    korean: '형', 
    english: 'お兄さん (男性から)', 
    pronunciation: 'hyeong', 
    category: 'family', 
    difficulty: 'intermediate', 
    frequency: 79 
  },
  { 
    id: 23, 
    korean: '오빠', 
    english: 'お兄さん (女性から)', 
    pronunciation: 'oppa', 
    category: 'family', 
    difficulty: 'intermediate', 
    frequency: 78 
  },
  { 
    id: 24, 
    korean: '누나', 
    english: 'お姉さん (男性から)', 
    pronunciation: 'nuna', 
    category: 'family', 
    difficulty: 'intermediate', 
    frequency: 77 
  },
  { 
    id: 25, 
    korean: '언니', 
    english: 'お姉さん (女性から)', 
    pronunciation: 'eonni', 
    category: 'family', 
    difficulty: 'intermediate', 
    frequency: 76 
  },
  { 
    id: 26, 
    korean: '동생', 
    english: '弟・妹', 
    pronunciation: 'dongsaeng', 
    category: 'family', 
    difficulty: 'beginner', 
    frequency: 75 
  },

  // TIER D: 기본 대답과 일상 표현
  { 
    id: 27, 
    korean: '네', 
    english: 'はい', 
    pronunciation: 'ne', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 74 
  },
  { 
    id: 28, 
    korean: '아니요', 
    english: 'いいえ', 
    pronunciation: 'aniyo', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 73 
  },
  { 
    id: 29, 
    korean: '사람', 
    english: '人 (ひと)', 
    pronunciation: 'saram', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 72 
  },
  { 
    id: 30, 
    korean: '집', 
    english: '家 (いえ)', 
    pronunciation: 'jip', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 71 
  },

  // TIER E: 숫자 (한자 숫자와 고유 숫자 병행)
  { 
    id: 31, 
    korean: '하나', 
    english: '一つ (ひとつ)', 
    pronunciation: 'hana', 
    category: 'numbers', 
    difficulty: 'beginner', 
    frequency: 70 
  },
  { 
    id: 32, 
    korean: '둘', 
    english: '二つ (ふたつ)', 
    pronunciation: 'dul', 
    category: 'numbers', 
    difficulty: 'beginner', 
    frequency: 69 
  },
  { 
    id: 33, 
    korean: '셋', 
    english: '三つ (みっつ)', 
    pronunciation: 'set', 
    category: 'numbers', 
    difficulty: 'beginner', 
    frequency: 68 
  },
  { 
    id: 34, 
    korean: '일', 
    english: '一 (いち) / 仕事', 
    pronunciation: 'il', 
    category: 'numbers', 
    difficulty: 'beginner', 
    frequency: 67 
  },
  { 
    id: 35, 
    korean: '이', 
    english: '二 (に)', 
    pronunciation: 'i', 
    category: 'numbers', 
    difficulty: 'beginner', 
    frequency: 66 
  },

  // TIER F: 색깔
  { 
    id: 36, 
    korean: '빨간색', 
    english: '赤 (あか)', 
    pronunciation: 'ppalgansaek', 
    category: 'colors', 
    difficulty: 'beginner', 
    frequency: 65 
  },
  { 
    id: 37, 
    korean: '파란색', 
    english: '青 (あお)', 
    pronunciation: 'paransaek', 
    category: 'colors', 
    difficulty: 'beginner', 
    frequency: 64 
  },
  { 
    id: 38, 
    korean: '하얀색', 
    english: '白 (しろ)', 
    pronunciation: 'hayansaek', 
    category: 'colors', 
    difficulty: 'beginner', 
    frequency: 63 
  },
  { 
    id: 39, 
    korean: '검은색', 
    english: '黒 (くろ)', 
    pronunciation: 'geomeunsaek', 
    category: 'colors', 
    difficulty: 'beginner', 
    frequency: 62 
  },
  { 
    id: 40, 
    korean: '노란색', 
    english: '黄色 (きいろ)', 
    pronunciation: 'noransaek', 
    category: 'colors', 
    difficulty: 'beginner', 
    frequency: 61 
  },

  // TIER G: 음식 (한일 공통 문화)
  { 
    id: 41, 
    korean: '밥', 
    english: 'ご飯 (ごはん)', 
    pronunciation: 'bap', 
    category: 'food', 
    difficulty: 'beginner', 
    frequency: 60 
  },
  { 
    id: 42, 
    korean: '물', 
    english: '水 (みず)', 
    pronunciation: 'mul', 
    category: 'food', 
    difficulty: 'beginner', 
    frequency: 59 
  },
  { 
    id: 43, 
    korean: '차', 
    english: 'お茶 (おちゃ)', 
    pronunciation: 'cha', 
    category: 'food', 
    difficulty: 'beginner', 
    frequency: 58 
  },
  { 
    id: 44, 
    korean: '커피', 
    english: 'コーヒー', 
    pronunciation: 'keopi', 
    category: 'food', 
    difficulty: 'beginner', 
    frequency: 57 
  },
  { 
    id: 45, 
    korean: '김치', 
    english: 'キムチ', 
    pronunciation: 'gimchi', 
    category: 'food', 
    difficulty: 'beginner', 
    frequency: 56 
  },

  // TIER H: 기타 중요 표현
  { 
    id: 46, 
    korean: '돈', 
    english: 'お金 (おかね)', 
    pronunciation: 'don', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 55 
  },
  { 
    id: 47, 
    korean: '나라', 
    english: '国 (くに)', 
    pronunciation: 'nara', 
    category: 'travel', 
    difficulty: 'beginner', 
    frequency: 54 
  },
  { 
    id: 48, 
    korean: '이름', 
    english: '名前 (なまえ)', 
    pronunciation: 'ireum', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 53 
  },
  { 
    id: 49, 
    korean: '나이', 
    english: '年齢 (ねんれい)', 
    pronunciation: 'nai', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 52 
  },
  { 
    id: 50, 
    korean: '한국', 
    english: '韓国 (かんこく)', 
    pronunciation: 'hanguk', 
    category: 'travel', 
    difficulty: 'beginner', 
    frequency: 51 
  },
];