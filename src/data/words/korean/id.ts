// 인도네시아어 사용자를 위한 한국어 학습 어휘
// Indonesian speakers learning Korean vocabulary

import { KoreanWord } from '@/lib/types';

export const koreanWordsForIndonesian: KoreanWord[] = [
  // TIER S: 기본 인사 (가장 실용적인 표현부터)
  { 
    id: 1, 
    korean: '안녕하세요', 
    english: 'Selamat pagi/siang/sore (sopan)', 
    pronunciation: 'an-nyeong-ha-se-yo', 
    category: 'greetings', 
    difficulty: 'beginner', 
    frequency: 100 
  },
  { 
    id: 2, 
    korean: '안녕', 
    english: 'Halo/Dah (kasual)', 
    pronunciation: 'an-nyeong', 
    category: 'greetings', 
    difficulty: 'beginner', 
    frequency: 99 
  },
  { 
    id: 3, 
    korean: '감사합니다', 
    english: 'Terima kasih', 
    pronunciation: 'gam-sa-ham-ni-da', 
    category: 'greetings', 
    difficulty: 'beginner', 
    frequency: 98 
  },
  { 
    id: 4, 
    korean: '죄송합니다', 
    english: 'Maaf', 
    pronunciation: 'joesonghamnida', 
    category: 'greetings', 
    difficulty: 'beginner', 
    frequency: 97 
  },
  { 
    id: 5, 
    korean: '네', 
    english: 'Ya', 
    pronunciation: 'ne', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 96 
  },
  { 
    id: 6, 
    korean: '아니요', 
    english: 'Tidak', 
    pronunciation: 'aniyo', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 95 
  },

  // TIER A: 기본 동사 (일상 대화에 필수)
  { 
    id: 7, 
    korean: '하다', 
    english: 'melakukan', 
    pronunciation: 'hada', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 94 
  },
  { 
    id: 8, 
    korean: '있다', 
    english: 'ada/punya', 
    pronunciation: 'itda', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 93 
  },
  { 
    id: 9, 
    korean: '없다', 
    english: 'tidak ada/tidak punya', 
    pronunciation: 'eopda', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 92 
  },
  { 
    id: 10, 
    korean: '가다', 
    english: 'pergi', 
    pronunciation: 'gada', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 91 
  },
  { 
    id: 11, 
    korean: '오다', 
    english: 'datang', 
    pronunciation: 'oda', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 90 
  },
  { 
    id: 12, 
    korean: '보다', 
    english: 'melihat/menonton', 
    pronunciation: 'boda', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 89 
  },
  { 
    id: 13, 
    korean: '먹다', 
    english: 'makan', 
    pronunciation: 'meokda', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 88 
  },
  { 
    id: 14, 
    korean: '마시다', 
    english: 'minum', 
    pronunciation: 'masida', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 87 
  },

  // TIER B: 기본 명사 (생활 필수 어휘)
  { 
    id: 15, 
    korean: '사람', 
    english: 'orang', 
    pronunciation: 'saram', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 86 
  },
  { 
    id: 16, 
    korean: '집', 
    english: 'rumah', 
    pronunciation: 'jip', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 85 
  },
  { 
    id: 17, 
    korean: '학교', 
    english: 'sekolah', 
    pronunciation: 'hakgyo', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 84 
  },
  { 
    id: 18, 
    korean: '일', 
    english: 'pekerjaan', 
    pronunciation: 'il', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 83 
  },
  { 
    id: 19, 
    korean: '시간', 
    english: 'waktu', 
    pronunciation: 'sigan', 
    category: 'time', 
    difficulty: 'beginner', 
    frequency: 82 
  },
  { 
    id: 20, 
    korean: '돈', 
    english: 'uang', 
    pronunciation: 'don', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 81 
  },

  // TIER C: 가족 (인도네시아와 유사한 가족 문화)
  { 
    id: 21, 
    korean: '가족', 
    english: 'keluarga', 
    pronunciation: 'gajok', 
    category: 'family', 
    difficulty: 'beginner', 
    frequency: 80 
  },
  { 
    id: 22, 
    korean: '아버지', 
    english: 'ayah', 
    pronunciation: 'abeoji', 
    category: 'family', 
    difficulty: 'beginner', 
    frequency: 79 
  },
  { 
    id: 23, 
    korean: '어머니', 
    english: 'ibu', 
    pronunciation: 'eomeoni', 
    category: 'family', 
    difficulty: 'beginner', 
    frequency: 78 
  },
  { 
    id: 24, 
    korean: '형', 
    english: 'kakak laki-laki (dari laki-laki)', 
    pronunciation: 'hyeong', 
    category: 'family', 
    difficulty: 'intermediate', 
    frequency: 77 
  },
  { 
    id: 25, 
    korean: '오빠', 
    english: 'kakak laki-laki (dari perempuan)', 
    pronunciation: 'oppa', 
    category: 'family', 
    difficulty: 'intermediate', 
    frequency: 76 
  },
  { 
    id: 26, 
    korean: '누나', 
    english: 'kakak perempuan (dari laki-laki)', 
    pronunciation: 'nuna', 
    category: 'family', 
    difficulty: 'intermediate', 
    frequency: 75 
  },
  { 
    id: 27, 
    korean: '언니', 
    english: 'kakak perempuan (dari perempuan)', 
    pronunciation: 'eonni', 
    category: 'family', 
    difficulty: 'intermediate', 
    frequency: 74 
  },
  { 
    id: 28, 
    korean: '동생', 
    english: 'adik', 
    pronunciation: 'dongsaeng', 
    category: 'family', 
    difficulty: 'beginner', 
    frequency: 73 
  },
  { 
    id: 29, 
    korean: '친구', 
    english: 'teman', 
    pronunciation: 'chingu', 
    category: 'family', 
    difficulty: 'beginner', 
    frequency: 72 
  },

  // TIER D: 숫자 (0-5까지 한국어 고유수)
  { 
    id: 30, 
    korean: '하나', 
    english: 'satu', 
    pronunciation: 'hana', 
    category: 'numbers', 
    difficulty: 'beginner', 
    frequency: 71 
  },
  { 
    id: 31, 
    korean: '둘', 
    english: 'dua', 
    pronunciation: 'dul', 
    category: 'numbers', 
    difficulty: 'beginner', 
    frequency: 70 
  },
  { 
    id: 32, 
    korean: '셋', 
    english: 'tiga', 
    pronunciation: 'set', 
    category: 'numbers', 
    difficulty: 'beginner', 
    frequency: 69 
  },
  { 
    id: 33, 
    korean: '넷', 
    english: 'empat', 
    pronunciation: 'net', 
    category: 'numbers', 
    difficulty: 'beginner', 
    frequency: 68 
  },
  { 
    id: 34, 
    korean: '다섯', 
    english: 'lima', 
    pronunciation: 'daseot', 
    category: 'numbers', 
    difficulty: 'beginner', 
    frequency: 67 
  },

  // TIER E: 음식 (인도네시아인에게 친숙한 아시아 음식)
  { 
    id: 35, 
    korean: '밥', 
    english: 'nasi/makanan', 
    pronunciation: 'bap', 
    category: 'food', 
    difficulty: 'beginner', 
    frequency: 66 
  },
  { 
    id: 36, 
    korean: '물', 
    english: 'air', 
    pronunciation: 'mul', 
    category: 'food', 
    difficulty: 'beginner', 
    frequency: 65 
  },
  { 
    id: 37, 
    korean: '음식', 
    english: 'makanan', 
    pronunciation: 'eumsik', 
    category: 'food', 
    difficulty: 'beginner', 
    frequency: 64 
  },
  { 
    id: 38, 
    korean: '차', 
    english: 'teh', 
    pronunciation: 'cha', 
    category: 'food', 
    difficulty: 'beginner', 
    frequency: 63 
  },
  { 
    id: 39, 
    korean: '커피', 
    english: 'kopi', 
    pronunciation: 'keopi', 
    category: 'food', 
    difficulty: 'beginner', 
    frequency: 62 
  },
  { 
    id: 40, 
    korean: '김치', 
    english: 'kimchi', 
    pronunciation: 'gimchi', 
    category: 'food', 
    difficulty: 'beginner', 
    frequency: 61 
  },

  // TIER F: 색깔
  { 
    id: 41, 
    korean: '빨간색', 
    english: 'merah', 
    pronunciation: 'ppalgansaek', 
    category: 'colors', 
    difficulty: 'beginner', 
    frequency: 60 
  },
  { 
    id: 42, 
    korean: '파란색', 
    english: 'biru', 
    pronunciation: 'paransaek', 
    category: 'colors', 
    difficulty: 'beginner', 
    frequency: 59 
  },
  { 
    id: 43, 
    korean: '노란색', 
    english: 'kuning', 
    pronunciation: 'noransaek', 
    category: 'colors', 
    difficulty: 'beginner', 
    frequency: 58 
  },
  { 
    id: 44, 
    korean: '초록색', 
    english: 'hijau', 
    pronunciation: 'choroksaek', 
    category: 'colors', 
    difficulty: 'beginner', 
    frequency: 57 
  },
  { 
    id: 45, 
    korean: '하얀색', 
    english: 'putih', 
    pronunciation: 'hayansaek', 
    category: 'colors', 
    difficulty: 'beginner', 
    frequency: 56 
  },
  { 
    id: 46, 
    korean: '검은색', 
    english: 'hitam', 
    pronunciation: 'geomeunsaek', 
    category: 'colors', 
    difficulty: 'beginner', 
    frequency: 55 
  },

  // TIER G: 기타 중요 표현
  { 
    id: 47, 
    korean: '선생님', 
    english: 'guru/bapak/ibu', 
    pronunciation: 'seonsaengnim', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 54 
  },
  { 
    id: 48, 
    korean: '학생', 
    english: 'murid/siswa', 
    pronunciation: 'haksaeng', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 53 
  },
  { 
    id: 49, 
    korean: '이름', 
    english: 'nama', 
    pronunciation: 'ireum', 
    category: 'basic', 
    difficulty: 'beginner', 
    frequency: 52 
  },
  { 
    id: 50, 
    korean: '나라', 
    english: 'negara', 
    pronunciation: 'nara', 
    category: 'travel', 
    difficulty: 'beginner', 
    frequency: 51 
  },
];