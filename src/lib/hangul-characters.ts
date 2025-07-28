import { KoreanCharacter } from './types';

// 그룹화된 기본 모음 (6개) - 천지인 철학 기반
export const BASIC_VOWELS_GROUPED: KoreanCharacter[] = [
  // Group A: 기본축 (Basic Axes)
  {
    id: 501,
    character: 'ㅣ',
    characterName: 'i',
    pronunciation: 'i',
    type: 'vowel',
    examples: ['이 (i)', '비 (bi)', '지금 (jigeum)'],
    romanization: 'i',
    tags: ['Basic Axis', 'Heaven']
  },
  {
    id: 502,
    character: 'ㅡ',
    characterName: 'eu',
    pronunciation: 'eu',
    type: 'vowel',
    examples: ['음식 (eumsik)', '그림 (geurim)', '슬프다 (seulpeuda)'],
    romanization: 'eu',
    tags: ['Basic Axis', 'Earth']
  },
  
  // Group B: 양성모음 (Bright Vowels)
  {
    id: 503,
    character: 'ㅏ',
    characterName: 'a',
    pronunciation: 'a',
    type: 'vowel',
    examples: ['아빠 (appa)', '사과 (sagwa)', '나무 (namu)'],
    romanization: 'a',
    tags: ['Bright Sound', 'Yang']
  },
  {
    id: 504,
    character: 'ㅗ',
    characterName: 'o',
    pronunciation: 'o',
    type: 'vowel',
    examples: ['오늘 (oneul)', '고양이 (goyangi)', '소 (so)'],
    romanization: 'o',
    tags: ['Bright Sound', 'Yang']
  },
  
  // Group C: 음성모음 (Dark Vowels)
  {
    id: 505,
    character: 'ㅓ',
    characterName: 'eo',
    pronunciation: 'eo',
    type: 'vowel',
    examples: ['어머니 (eomeoni)', '저 (jeo)', '벌 (beol)'],
    romanization: 'eo',
    tags: ['Dark Sound', 'Yin']
  },
  {
    id: 506,
    character: 'ㅜ',
    characterName: 'u',
    pronunciation: 'u',
    type: 'vowel',
    examples: ['우유 (uyu)', '구름 (gureum)', '누나 (nuna)'],
    romanization: 'u',
    tags: ['Dark Sound', 'Yin']
  }
];

// 그룹화된 기본 자음 (9개) - 발음 기관별 분류
export const BASIC_CONSONANTS_GROUPED: KoreanCharacter[] = [
  // Group 1: 목구멍 소리 (Throat Sounds)
  {
    id: 601,
    character: 'ㄱ',
    characterName: 'giyeok',
    pronunciation: 'g/k',
    type: 'consonant',
    examples: ['가방 (gabang)', '학교 (hakgyo)', '먹다 (meokda)'],
    romanization: 'g/k',
    tags: ['Throat', 'Velar']
  },
  {
    id: 602,
    character: 'ㅇ',
    characterName: 'ieung',
    pronunciation: 'ng/silent',
    type: 'consonant',
    examples: ['아 (a)', '강 (gang)', '영화 (yeonghwa)'],
    romanization: 'ng/silent',
    tags: ['Throat', 'Silent']
  },
  {
    id: 603,
    character: 'ㅎ',
    characterName: 'hieut',
    pronunciation: 'h',
    type: 'consonant',
    examples: ['하늘 (haneul)', '좋다 (jota)', '많다 (manta)'],
    romanization: 'h',
    tags: ['Throat', 'Aspirated']
  },
  
  // Group 2: 혀끝 소리 (Tongue-tip Sounds)
  {
    id: 604,
    character: 'ㄴ',
    characterName: 'nieun',
    pronunciation: 'n',
    type: 'consonant',
    examples: ['나 (na)', '안녕 (annyeong)', '신발 (sinbal)'],
    romanization: 'n',
    tags: ['Tongue-tip', 'Nasal']
  },
  {
    id: 605,
    character: 'ㄷ',
    characterName: 'digeut',
    pronunciation: 'd/t',
    type: 'consonant',
    examples: ['다리 (dari)', '친구 (chingu)', '받다 (batda)'],
    romanization: 'd/t',
    tags: ['Tongue-tip', 'Dental']
  },
  {
    id: 606,
    character: 'ㄹ',
    characterName: 'rieul',
    pronunciation: 'r/l',
    type: 'consonant',
    examples: ['라면 (ramyeon)', '물 (mul)', '별 (byeol)'],
    romanization: 'r/l',
    tags: ['Tongue-tip', 'Liquid']
  },
  
  // Group 3: 입술 소리 (Lip Sounds)
  {
    id: 607,
    character: 'ㅁ',
    characterName: 'mieum',
    pronunciation: 'm',
    type: 'consonant',
    examples: ['마음 (maeum)', '음식 (eumsik)', '감사 (gamsa)'],
    romanization: 'm',
    tags: ['Lip', 'Nasal']
  },
  {
    id: 608,
    character: 'ㅂ',
    characterName: 'bieup',
    pronunciation: 'b/p',
    type: 'consonant',
    examples: ['밥 (bab)', '집 (jip)', '업무 (eopmu)'],
    romanization: 'b/p',
    tags: ['Lip', 'Bilabial']
  },
  {
    id: 609,
    character: 'ㅅ',
    characterName: 'siot',
    pronunciation: 's',
    type: 'consonant',
    examples: ['사람 (saram)', '옷 (ot)', '있다 (itda)'],
    romanization: 's',
    tags: ['Teeth', 'Fricative']
  }
];

// 기본 모음 (Basic Vowels) - 모든 단순/복합 모음 포함
export const BASIC_VOWELS: KoreanCharacter[] = [
  // ㅏ ㅑ ㅓ ㅕ ㅗ ㅛ ㅜ ㅠ ㅡ ㅣ 순서
  {
    id: 1,
    character: 'ㅏ',
    characterName: 'a',
    pronunciation: 'a',
    type: 'vowel',
    examples: ['아빠 (appa)', '사과 (sagwa)', '나무 (namu)'],
    romanization: 'a',
    tags: ['Single Vowel']
  },
  {
    id: 2,
    character: 'ㅑ',
    characterName: 'ya',
    pronunciation: 'ya',
    type: 'vowel',
    examples: ['야구 (yagu)', '갸름하다 (gyareumhada)'],
    romanization: 'ya',
    tags: ['Compound Vowel']
  },
  {
    id: 3,
    character: 'ㅓ',
    characterName: 'eo',
    pronunciation: 'eo',
    type: 'vowel',
    examples: ['어머니 (eomeoni)', '저 (jeo)', '벌 (beol)'],
    romanization: 'eo',
    tags: ['Single Vowel']
  },
  {
    id: 4,
    character: 'ㅕ',
    characterName: 'yeo',
    pronunciation: 'yeo',
    type: 'vowel',
    examples: ['여자 (yeoja)', '편지 (pyeonji)'],
    romanization: 'yeo',
    tags: ['Compound Vowel']
  },
  {
    id: 5,
    character: 'ㅗ',
    characterName: 'o',
    pronunciation: 'o',
    type: 'vowel',
    examples: ['오늘 (oneul)', '고양이 (goyangi)', '소 (so)'],
    romanization: 'o',
    tags: ['Single Vowel']
  },
  {
    id: 6,
    character: 'ㅛ',
    characterName: 'yo',
    pronunciation: 'yo',
    type: 'vowel',
    examples: ['요리 (yori)', '효과 (hyogwa)'],
    romanization: 'yo',
    tags: ['Compound Vowel']
  },
  {
    id: 7,
    character: 'ㅜ',
    characterName: 'u',
    pronunciation: 'u',
    type: 'vowel',
    examples: ['우유 (uyu)', '구름 (gureum)', '누나 (nuna)'],
    romanization: 'u',
    tags: ['Single Vowel']
  },
  {
    id: 8,
    character: 'ㅠ',
    characterName: 'yu',
    pronunciation: 'yu',
    type: 'vowel',
    examples: ['유명하다 (yumyeonghada)', '규칙 (gyuchik)'],
    romanization: 'yu',
    tags: ['Compound Vowel']
  },
  {
    id: 9,
    character: 'ㅡ',
    characterName: 'eu',
    pronunciation: 'eu',
    type: 'vowel',
    examples: ['음식 (eumsik)', '그림 (geurim)', '슬프다 (seulpeuda)'],
    romanization: 'eu',
    tags: ['Single Vowel']
  },
  {
    id: 10,
    character: 'ㅣ',
    characterName: 'i',
    pronunciation: 'i',
    type: 'vowel',
    examples: ['이 (i)', '비 (bi)', '지금 (jigeum)'],
    romanization: 'i',
    tags: ['Single Vowel']
  }
];

// 복합 모음 (Complex Vowels) - 현재 사용하지 않음, 모든 모음이 BASIC_VOWELS에 포함됨
export const COMPLEX_VOWELS: KoreanCharacter[] = [];

// 기본 자음 (Basic Consonants)
export const BASIC_CONSONANTS: KoreanCharacter[] = [
  {
    id: 22,
    character: 'ㄱ',
    characterName: 'giyeok',
    pronunciation: 'g/k',
    type: 'consonant',
    examples: ['가방 (gabang)', '학교 (hakgyo)', '먹다 (meokda)'],
    romanization: 'g/k',
    tags: ['Basic']
  },
  {
    id: 23,
    character: 'ㄴ',
    characterName: 'nieun',
    pronunciation: 'n',
    type: 'consonant',
    examples: ['나 (na)', '안녕 (annyeong)', '신발 (sinbal)'],
    romanization: 'n',
    tags: ['Basic']
  },
  {
    id: 24,
    character: 'ㄷ',
    characterName: 'digeut',
    pronunciation: 'd/t',
    type: 'consonant',
    examples: ['다리 (dari)', '친구 (chingu)', '받다 (batda)'],
    romanization: 'd/t',
    tags: ['Basic']
  },
  {
    id: 25,
    character: 'ㄹ',
    characterName: 'rieul',
    pronunciation: 'r/l',
    type: 'consonant',
    examples: ['라면 (ramyeon)', '물 (mul)', '별 (byeol)'],
    romanization: 'r/l',
    tags: ['Basic']
  },
  {
    id: 26,
    character: 'ㅁ',
    characterName: 'mieum',
    pronunciation: 'm',
    type: 'consonant',
    examples: ['마음 (maeum)', '음식 (eumsik)', '감사 (gamsa)'],
    romanization: 'm',
    tags: ['Basic']
  },
  {
    id: 27,
    character: 'ㅂ',
    characterName: 'bieup',
    pronunciation: 'b/p',
    type: 'consonant',
    examples: ['밥 (bab)', '집 (jip)', '업무 (eopmu)'],
    romanization: 'b/p',
    tags: ['Basic']
  },
  {
    id: 28,
    character: 'ㅅ',
    characterName: 'siot',
    pronunciation: 's',
    type: 'consonant',
    examples: ['사람 (saram)', '옷 (ot)', '있다 (itda)'],
    romanization: 's',
    tags: ['Basic']
  },
  {
    id: 29,
    character: 'ㅇ',
    characterName: 'ieung',
    pronunciation: 'ng/silent',
    type: 'consonant',
    examples: ['아 (a)', '강 (gang)', '영화 (yeonghwa)'],
    romanization: 'ng/silent',
    tags: ['Basic']
  },
  {
    id: 30,
    character: 'ㅈ',
    characterName: 'jieut',
    pronunciation: 'j/ch',
    type: 'consonant',
    examples: ['자동차 (jadongcha)', '밖 (bakk)', '찾다 (chatda)'],
    romanization: 'j/ch',
    tags: ['Basic']
  },
  {
    id: 31,
    character: 'ㅊ',
    characterName: 'chieut',
    pronunciation: 'ch',
    type: 'consonant',
    examples: ['차 (cha)', '찬물 (chanmul)', '맞다 (matda)'],
    romanization: 'ch',
    tags: ['Basic']
  },
  {
    id: 32,
    character: 'ㅋ',
    characterName: 'kieuk',
    pronunciation: 'k',
    type: 'consonant',
    examples: ['코 (ko)', '크다 (keuda)', '책 (chaek)'],
    romanization: 'k',
    tags: ['Basic']
  },
  {
    id: 33,
    character: 'ㅌ',
    characterName: 'tieut',
    pronunciation: 't',
    type: 'consonant',
    examples: ['토끼 (tokki)', '같다 (gatda)', '밭 (bat)'],
    romanization: 't',
    tags: ['Basic']
  },
  {
    id: 34,
    character: 'ㅍ',
    characterName: 'pieup',
    pronunciation: 'p',
    type: 'consonant',
    examples: ['피아노 (piano)', '앞 (ap)', '깊다 (gipda)'],
    romanization: 'p',
    tags: ['Basic']
  },
  {
    id: 35,
    character: 'ㅎ',
    characterName: 'hieut',
    pronunciation: 'h',
    type: 'consonant',
    examples: ['하늘 (haneul)', '좋다 (jota)', '많다 (manta)'],
    romanization: 'h',
    tags: ['Basic']
  }
];

// 쌍자음 (Double Consonants)
export const DOUBLE_CONSONANTS: KoreanCharacter[] = [
  {
    id: 36,
    character: 'ㄲ',
    characterName: 'ssanggiyeok',
    pronunciation: 'kk',
    type: 'double-consonant',
    examples: ['까치 (kkachi)', '빠르다 (ppareuda)', '떡 (tteok)'],
    romanization: 'kk'
  },
  {
    id: 37,
    character: 'ㄸ',
    characterName: 'ssangdigeut',
    pronunciation: 'tt',
    type: 'double-consonant',
    examples: ['따뜻하다 (ttatteuthada)', '뜨다 (tteuda)'],
    romanization: 'tt'
  },
  {
    id: 38,
    character: 'ㅃ',
    characterName: 'ssangbieup',
    pronunciation: 'pp',
    type: 'double-consonant',
    examples: ['빵 (ppang)', '뽀뽀 (ppoppo)'],
    romanization: 'pp'
  },
  {
    id: 39,
    character: 'ㅆ',
    characterName: 'ssangsiot',
    pronunciation: 'ss',
    type: 'double-consonant',
    examples: ['쌀 (ssal)', '씨앗 (ssiat)'],
    romanization: 'ss'
  },
  {
    id: 40,
    character: 'ㅉ',
    characterName: 'ssangjieut',
    pronunciation: 'jj',
    type: 'double-consonant',
    examples: ['찌다 (jjida)', '짜다 (jjada)'],
    romanization: 'jj'
  }
];

// 기본 조합 (Basic Syllables) - 기본 자음 + 기본 모음 (가갸거겨고교구규그기 순)
export const BASIC_COMBINATIONS: KoreanCharacter[] = [
  // ㄱ 시리즈 (가갸거겨고교구규그기)
  { id: 1001, character: '가', characterName: 'ga', pronunciation: 'ga', type: 'syllable', romanization: 'ga', tags: ['Basic Syllable'] },
  { id: 1002, character: '갸', characterName: 'gya', pronunciation: 'gya', type: 'syllable', romanization: 'gya', tags: ['Basic Syllable'] },
  { id: 1003, character: '거', characterName: 'geo', pronunciation: 'geo', type: 'syllable', romanization: 'geo', tags: ['Basic Syllable'] },
  { id: 1004, character: '겨', characterName: 'gyeo', pronunciation: 'gyeo', type: 'syllable', romanization: 'gyeo', tags: ['Basic Syllable'] },
  { id: 1005, character: '고', characterName: 'go', pronunciation: 'go', type: 'syllable', romanization: 'go', tags: ['Basic Syllable'] },
  { id: 1006, character: '교', characterName: 'gyo', pronunciation: 'gyo', type: 'syllable', romanization: 'gyo', tags: ['Basic Syllable'] },
  { id: 1007, character: '구', characterName: 'gu', pronunciation: 'gu', type: 'syllable', romanization: 'gu', tags: ['Basic Syllable'] },
  { id: 1008, character: '규', characterName: 'gyu', pronunciation: 'gyu', type: 'syllable', romanization: 'gyu', tags: ['Basic Syllable'] },
  { id: 1009, character: '그', characterName: 'geu', pronunciation: 'geu', type: 'syllable', romanization: 'geu', tags: ['Basic Syllable'] },
  { id: 1010, character: '기', characterName: 'gi', pronunciation: 'gi', type: 'syllable', romanization: 'gi', tags: ['Basic Syllable'] },

  // ㄴ 시리즈 (나냐너녀노뇨누뉴느니)
  { id: 1011, character: '나', characterName: 'na', pronunciation: 'na', type: 'syllable', romanization: 'na', tags: ['Basic Syllable'] },
  { id: 1012, character: '냐', characterName: 'nya', pronunciation: 'nya', type: 'syllable', romanization: 'nya', tags: ['Basic Syllable'] },
  { id: 1013, character: '너', characterName: 'neo', pronunciation: 'neo', type: 'syllable', romanization: 'neo', tags: ['Basic Syllable'] },
  { id: 1014, character: '녀', characterName: 'nyeo', pronunciation: 'nyeo', type: 'syllable', romanization: 'nyeo', tags: ['Basic Syllable'] },
  { id: 1015, character: '노', characterName: 'no', pronunciation: 'no', type: 'syllable', romanization: 'no', tags: ['Basic Syllable'] },
  { id: 1016, character: '뇨', characterName: 'nyo', pronunciation: 'nyo', type: 'syllable', romanization: 'nyo', tags: ['Basic Syllable'] },
  { id: 1017, character: '누', characterName: 'nu', pronunciation: 'nu', type: 'syllable', romanization: 'nu', tags: ['Basic Syllable'] },
  { id: 1018, character: '뉴', characterName: 'nyu', pronunciation: 'nyu', type: 'syllable', romanization: 'nyu', tags: ['Basic Syllable'] },
  { id: 1019, character: '느', characterName: 'neu', pronunciation: 'neu', type: 'syllable', romanization: 'neu', tags: ['Basic Syllable'] },
  { id: 1020, character: '니', characterName: 'ni', pronunciation: 'ni', type: 'syllable', romanization: 'ni', tags: ['Basic Syllable'] },

  // ㄷ 시리즈 (다댜더뎌도됴두듀드디)
  { id: 1021, character: '다', characterName: 'da', pronunciation: 'da', type: 'syllable', romanization: 'da', tags: ['Basic Syllable'] },
  { id: 1022, character: '댸', characterName: 'dya', pronunciation: 'dya', type: 'syllable', romanization: 'dya', tags: ['Basic Syllable'] },
  { id: 1023, character: '더', characterName: 'deo', pronunciation: 'deo', type: 'syllable', romanization: 'deo', tags: ['Basic Syllable'] },
  { id: 1024, character: '뎌', characterName: 'dyeo', pronunciation: 'dyeo', type: 'syllable', romanization: 'dyeo', tags: ['Basic Syllable'] },
  { id: 1025, character: '도', characterName: 'do', pronunciation: 'do', type: 'syllable', romanization: 'do', tags: ['Basic Syllable'] },
  { id: 1026, character: '됴', characterName: 'dyo', pronunciation: 'dyo', type: 'syllable', romanization: 'dyo', tags: ['Basic Syllable'] },
  { id: 1027, character: '두', characterName: 'du', pronunciation: 'du', type: 'syllable', romanization: 'du', tags: ['Basic Syllable'] },
  { id: 1028, character: '듀', characterName: 'dyu', pronunciation: 'dyu', type: 'syllable', romanization: 'dyu', tags: ['Basic Syllable'] },
  { id: 1029, character: '드', characterName: 'deu', pronunciation: 'deu', type: 'syllable', romanization: 'deu', tags: ['Basic Syllable'] },
  { id: 1030, character: '디', characterName: 'di', pronunciation: 'di', type: 'syllable', romanization: 'di', tags: ['Basic Syllable'] },

  // ㄹ 시리즈 (라랴러려로료루류르리)
  { id: 1031, character: '라', characterName: 'ra', pronunciation: 'ra', type: 'syllable', romanization: 'ra', tags: ['Basic Syllable'] },
  { id: 1032, character: '랴', characterName: 'rya', pronunciation: 'rya', type: 'syllable', romanization: 'rya', tags: ['Basic Syllable'] },
  { id: 1033, character: '러', characterName: 'reo', pronunciation: 'reo', type: 'syllable', romanization: 'reo', tags: ['Basic Syllable'] },
  { id: 1034, character: '려', characterName: 'ryeo', pronunciation: 'ryeo', type: 'syllable', romanization: 'ryeo', tags: ['Basic Syllable'] },
  { id: 1035, character: '로', characterName: 'ro', pronunciation: 'ro', type: 'syllable', romanization: 'ro', tags: ['Basic Syllable'] },
  { id: 1036, character: '료', characterName: 'ryo', pronunciation: 'ryo', type: 'syllable', romanization: 'ryo', tags: ['Basic Syllable'] },
  { id: 1037, character: '루', characterName: 'ru', pronunciation: 'ru', type: 'syllable', romanization: 'ru', tags: ['Basic Syllable'] },
  { id: 1038, character: '류', characterName: 'ryu', pronunciation: 'ryu', type: 'syllable', romanization: 'ryu', tags: ['Basic Syllable'] },
  { id: 1039, character: '르', characterName: 'reu', pronunciation: 'reu', type: 'syllable', romanization: 'reu', tags: ['Basic Syllable'] },
  { id: 1040, character: '리', characterName: 'ri', pronunciation: 'ri', type: 'syllable', romanization: 'ri', tags: ['Basic Syllable'] },

  // ㅁ 시리즈 (마먀머며모묘무뮤므미)
  { id: 1041, character: '마', characterName: 'ma', pronunciation: 'ma', type: 'syllable', romanization: 'ma', tags: ['Basic Syllable'] },
  { id: 1042, character: '먀', characterName: 'mya', pronunciation: 'mya', type: 'syllable', romanization: 'mya', tags: ['Basic Syllable'] },
  { id: 1043, character: '머', characterName: 'meo', pronunciation: 'meo', type: 'syllable', romanization: 'meo', tags: ['Basic Syllable'] },
  { id: 1044, character: '며', characterName: 'myeo', pronunciation: 'myeo', type: 'syllable', romanization: 'myeo', tags: ['Basic Syllable'] },
  { id: 1045, character: '모', characterName: 'mo', pronunciation: 'mo', type: 'syllable', romanization: 'mo', tags: ['Basic Syllable'] },
  { id: 1046, character: '묘', characterName: 'myo', pronunciation: 'myo', type: 'syllable', romanization: 'myo', tags: ['Basic Syllable'] },
  { id: 1047, character: '무', characterName: 'mu', pronunciation: 'mu', type: 'syllable', romanization: 'mu', tags: ['Basic Syllable'] },
  { id: 1048, character: '뮤', characterName: 'myu', pronunciation: 'myu', type: 'syllable', romanization: 'myu', tags: ['Basic Syllable'] },
  { id: 1049, character: '므', characterName: 'meu', pronunciation: 'meu', type: 'syllable', romanization: 'meu', tags: ['Basic Syllable'] },
  { id: 1050, character: '미', characterName: 'mi', pronunciation: 'mi', type: 'syllable', romanization: 'mi', tags: ['Basic Syllable'] },

  // ㅂ 시리즈 (바뱌버벼보뵤부뷰브비)
  { id: 1051, character: '바', characterName: 'ba', pronunciation: 'ba', type: 'syllable', romanization: 'ba', tags: ['Basic Syllable'] },
  { id: 1052, character: '뱌', characterName: 'bya', pronunciation: 'bya', type: 'syllable', romanization: 'bya', tags: ['Basic Syllable'] },
  { id: 1053, character: '버', characterName: 'beo', pronunciation: 'beo', type: 'syllable', romanization: 'beo', tags: ['Basic Syllable'] },
  { id: 1054, character: '벼', characterName: 'byeo', pronunciation: 'byeo', type: 'syllable', romanization: 'byeo', tags: ['Basic Syllable'] },
  { id: 1055, character: '보', characterName: 'bo', pronunciation: 'bo', type: 'syllable', romanization: 'bo', tags: ['Basic Syllable'] },
  { id: 1056, character: '뵤', characterName: 'byo', pronunciation: 'byo', type: 'syllable', romanization: 'byo', tags: ['Basic Syllable'] },
  { id: 1057, character: '부', characterName: 'bu', pronunciation: 'bu', type: 'syllable', romanization: 'bu', tags: ['Basic Syllable'] },
  { id: 1058, character: '뷰', characterName: 'byu', pronunciation: 'byu', type: 'syllable', romanization: 'byu', tags: ['Basic Syllable'] },
  { id: 1059, character: '브', characterName: 'beu', pronunciation: 'beu', type: 'syllable', romanization: 'beu', tags: ['Basic Syllable'] },
  { id: 1060, character: '비', characterName: 'bi', pronunciation: 'bi', type: 'syllable', romanization: 'bi', tags: ['Basic Syllable'] },

  // ㅅ 시리즈 (사샤서셔소쇼수슈스시)
  { id: 1061, character: '사', characterName: 'sa', pronunciation: 'sa', type: 'syllable', romanization: 'sa', tags: ['Basic Syllable'] },
  { id: 1062, character: '샤', characterName: 'sya', pronunciation: 'sya', type: 'syllable', romanization: 'sya', tags: ['Basic Syllable'] },
  { id: 1063, character: '서', characterName: 'seo', pronunciation: 'seo', type: 'syllable', romanization: 'seo', tags: ['Basic Syllable'] },
  { id: 1064, character: '셔', characterName: 'syeo', pronunciation: 'syeo', type: 'syllable', romanization: 'syeo', tags: ['Basic Syllable'] },
  { id: 1065, character: '소', characterName: 'so', pronunciation: 'so', type: 'syllable', romanization: 'so', tags: ['Basic Syllable'] },
  { id: 1066, character: '쇼', characterName: 'syo', pronunciation: 'syo', type: 'syllable', romanization: 'syo', tags: ['Basic Syllable'] },
  { id: 1067, character: '수', characterName: 'su', pronunciation: 'su', type: 'syllable', romanization: 'su', tags: ['Basic Syllable'] },
  { id: 1068, character: '슈', characterName: 'syu', pronunciation: 'syu', type: 'syllable', romanization: 'syu', tags: ['Basic Syllable'] },
  { id: 1069, character: '스', characterName: 'seu', pronunciation: 'seu', type: 'syllable', romanization: 'seu', tags: ['Basic Syllable'] },
  { id: 1070, character: '시', characterName: 'si', pronunciation: 'si', type: 'syllable', romanization: 'si', tags: ['Basic Syllable'] },

  // ㅇ 시리즈 (아야어여오요우유으이)
  { id: 1071, character: '아', characterName: 'a', pronunciation: 'a', type: 'syllable', romanization: 'a', tags: ['Basic Syllable'] },
  { id: 1072, character: '야', characterName: 'ya', pronunciation: 'ya', type: 'syllable', romanization: 'ya', tags: ['Basic Syllable'] },
  { id: 1073, character: '어', characterName: 'eo', pronunciation: 'eo', type: 'syllable', romanization: 'eo', tags: ['Basic Syllable'] },
  { id: 1074, character: '여', characterName: 'yeo', pronunciation: 'yeo', type: 'syllable', romanization: 'yeo', tags: ['Basic Syllable'] },
  { id: 1075, character: '오', characterName: 'o', pronunciation: 'o', type: 'syllable', romanization: 'o', tags: ['Basic Syllable'] },
  { id: 1076, character: '요', characterName: 'yo', pronunciation: 'yo', type: 'syllable', romanization: 'yo', tags: ['Basic Syllable'] },
  { id: 1077, character: '우', characterName: 'u', pronunciation: 'u', type: 'syllable', romanization: 'u', tags: ['Basic Syllable'] },
  { id: 1078, character: '유', characterName: 'yu', pronunciation: 'yu', type: 'syllable', romanization: 'yu', tags: ['Basic Syllable'] },
  { id: 1079, character: '으', characterName: 'eu', pronunciation: 'eu', type: 'syllable', romanization: 'eu', tags: ['Basic Syllable'] },
  { id: 1080, character: '이', characterName: 'i', pronunciation: 'i', type: 'syllable', romanization: 'i', tags: ['Basic Syllable'] },

  // ㅈ 시리즈 (자쟈저져조죠주쥬즈지)
  { id: 1081, character: '자', characterName: 'ja', pronunciation: 'ja', type: 'syllable', romanization: 'ja', tags: ['Basic Syllable'] },
  { id: 1082, character: '쟈', characterName: 'jya', pronunciation: 'jya', type: 'syllable', romanization: 'jya', tags: ['Basic Syllable'] },
  { id: 1083, character: '저', characterName: 'jeo', pronunciation: 'jeo', type: 'syllable', romanization: 'jeo', tags: ['Basic Syllable'] },
  { id: 1084, character: '져', characterName: 'jyeo', pronunciation: 'jyeo', type: 'syllable', romanization: 'jyeo', tags: ['Basic Syllable'] },
  { id: 1085, character: '조', characterName: 'jo', pronunciation: 'jo', type: 'syllable', romanization: 'jo', tags: ['Basic Syllable'] },
  { id: 1086, character: '죠', characterName: 'jyo', pronunciation: 'jyo', type: 'syllable', romanization: 'jyo', tags: ['Basic Syllable'] },
  { id: 1087, character: '주', characterName: 'ju', pronunciation: 'ju', type: 'syllable', romanization: 'ju', tags: ['Basic Syllable'] },
  { id: 1088, character: '쥬', characterName: 'jyu', pronunciation: 'jyu', type: 'syllable', romanization: 'jyu', tags: ['Basic Syllable'] },
  { id: 1089, character: '즈', characterName: 'jeu', pronunciation: 'jeu', type: 'syllable', romanization: 'jeu', tags: ['Basic Syllable'] },
  { id: 1090, character: '지', characterName: 'ji', pronunciation: 'ji', type: 'syllable', romanization: 'ji', tags: ['Basic Syllable'] },

  // ㅊ 시리즈 (차챠처쳐초쵸추츄츠치)
  { id: 1091, character: '차', characterName: 'cha', pronunciation: 'cha', type: 'syllable', romanization: 'cha', tags: ['Basic Syllable'] },
  { id: 1092, character: '챠', characterName: 'chya', pronunciation: 'chya', type: 'syllable', romanization: 'chya', tags: ['Basic Syllable'] },
  { id: 1093, character: '처', characterName: 'cheo', pronunciation: 'cheo', type: 'syllable', romanization: 'cheo', tags: ['Basic Syllable'] },
  { id: 1094, character: '쳐', characterName: 'chyeo', pronunciation: 'chyeo', type: 'syllable', romanization: 'chyeo', tags: ['Basic Syllable'] },
  { id: 1095, character: '초', characterName: 'cho', pronunciation: 'cho', type: 'syllable', romanization: 'cho', tags: ['Basic Syllable'] },
  { id: 1096, character: '쵸', characterName: 'chyo', pronunciation: 'chyo', type: 'syllable', romanization: 'chyo', tags: ['Basic Syllable'] },
  { id: 1097, character: '추', characterName: 'chu', pronunciation: 'chu', type: 'syllable', romanization: 'chu', tags: ['Basic Syllable'] },
  { id: 1098, character: '츄', characterName: 'chyu', pronunciation: 'chyu', type: 'syllable', romanization: 'chyu', tags: ['Basic Syllable'] },
  { id: 1099, character: '츠', characterName: 'cheu', pronunciation: 'cheu', type: 'syllable', romanization: 'cheu', tags: ['Basic Syllable'] },
  { id: 1100, character: '치', characterName: 'chi', pronunciation: 'chi', type: 'syllable', romanization: 'chi', tags: ['Basic Syllable'] },

  // ㅋ 시리즈 (카캬커켜코쿄쿠큐크키)
  { id: 1101, character: '카', characterName: 'ka', pronunciation: 'ka', type: 'syllable', romanization: 'ka', tags: ['Basic Syllable'] },
  { id: 1102, character: '캬', characterName: 'kya', pronunciation: 'kya', type: 'syllable', romanization: 'kya', tags: ['Basic Syllable'] },
  { id: 1103, character: '커', characterName: 'keo', pronunciation: 'keo', type: 'syllable', romanization: 'keo', tags: ['Basic Syllable'] },
  { id: 1104, character: '켜', characterName: 'kyeo', pronunciation: 'kyeo', type: 'syllable', romanization: 'kyeo', tags: ['Basic Syllable'] },
  { id: 1105, character: '코', characterName: 'ko', pronunciation: 'ko', type: 'syllable', romanization: 'ko', tags: ['Basic Syllable'] },
  { id: 1106, character: '쿄', characterName: 'kyo', pronunciation: 'kyo', type: 'syllable', romanization: 'kyo', tags: ['Basic Syllable'] },
  { id: 1107, character: '쿠', characterName: 'ku', pronunciation: 'ku', type: 'syllable', romanization: 'ku', tags: ['Basic Syllable'] },
  { id: 1108, character: '큐', characterName: 'kyu', pronunciation: 'kyu', type: 'syllable', romanization: 'kyu', tags: ['Basic Syllable'] },
  { id: 1109, character: '크', characterName: 'keu', pronunciation: 'keu', type: 'syllable', romanization: 'keu', tags: ['Basic Syllable'] },
  { id: 1110, character: '키', characterName: 'ki', pronunciation: 'ki', type: 'syllable', romanization: 'ki', tags: ['Basic Syllable'] },

  // ㅌ 시리즈 (타탸터텨토툐투튜트티)
  { id: 1111, character: '타', characterName: 'ta', pronunciation: 'ta', type: 'syllable', romanization: 'ta', tags: ['Basic Syllable'] },
  { id: 1112, character: '탸', characterName: 'tya', pronunciation: 'tya', type: 'syllable', romanization: 'tya', tags: ['Basic Syllable'] },
  { id: 1113, character: '터', characterName: 'teo', pronunciation: 'teo', type: 'syllable', romanization: 'teo', tags: ['Basic Syllable'] },
  { id: 1114, character: '텨', characterName: 'tyeo', pronunciation: 'tyeo', type: 'syllable', romanization: 'tyeo', tags: ['Basic Syllable'] },
  { id: 1115, character: '토', characterName: 'to', pronunciation: 'to', type: 'syllable', romanization: 'to', tags: ['Basic Syllable'] },
  { id: 1116, character: '툐', characterName: 'tyo', pronunciation: 'tyo', type: 'syllable', romanization: 'tyo', tags: ['Basic Syllable'] },
  { id: 1117, character: '투', characterName: 'tu', pronunciation: 'tu', type: 'syllable', romanization: 'tu', tags: ['Basic Syllable'] },
  { id: 1118, character: '튜', characterName: 'tyu', pronunciation: 'tyu', type: 'syllable', romanization: 'tyu', tags: ['Basic Syllable'] },
  { id: 1119, character: '트', characterName: 'teu', pronunciation: 'teu', type: 'syllable', romanization: 'teu', tags: ['Basic Syllable'] },
  { id: 1120, character: '티', characterName: 'ti', pronunciation: 'ti', type: 'syllable', romanization: 'ti', tags: ['Basic Syllable'] },

  // ㅍ 시리즈 (파퍄퍼펴포표푸퓨프피)
  { id: 1121, character: '파', characterName: 'pa', pronunciation: 'pa', type: 'syllable', romanization: 'pa', tags: ['Basic Syllable'] },
  { id: 1122, character: '퍄', characterName: 'pya', pronunciation: 'pya', type: 'syllable', romanization: 'pya', tags: ['Basic Syllable'] },
  { id: 1123, character: '퍼', characterName: 'peo', pronunciation: 'peo', type: 'syllable', romanization: 'peo', tags: ['Basic Syllable'] },
  { id: 1124, character: '펴', characterName: 'pyeo', pronunciation: 'pyeo', type: 'syllable', romanization: 'pyeo', tags: ['Basic Syllable'] },
  { id: 1125, character: '포', characterName: 'po', pronunciation: 'po', type: 'syllable', romanization: 'po', tags: ['Basic Syllable'] },
  { id: 1126, character: '표', characterName: 'pyo', pronunciation: 'pyo', type: 'syllable', romanization: 'pyo', tags: ['Basic Syllable'] },
  { id: 1127, character: '푸', characterName: 'pu', pronunciation: 'pu', type: 'syllable', romanization: 'pu', tags: ['Basic Syllable'] },
  { id: 1128, character: '퓨', characterName: 'pyu', pronunciation: 'pyu', type: 'syllable', romanization: 'pyu', tags: ['Basic Syllable'] },
  { id: 1129, character: '프', characterName: 'peu', pronunciation: 'peu', type: 'syllable', romanization: 'peu', tags: ['Basic Syllable'] },
  { id: 1130, character: '피', characterName: 'pi', pronunciation: 'pi', type: 'syllable', romanization: 'pi', tags: ['Basic Syllable'] },

  // ㅎ 시리즈 (하햐허혀호효후휴흐히)
  { id: 1131, character: '하', characterName: 'ha', pronunciation: 'ha', type: 'syllable', romanization: 'ha', tags: ['Basic Syllable'] },
  { id: 1132, character: '햐', characterName: 'hya', pronunciation: 'hya', type: 'syllable', romanization: 'hya', tags: ['Basic Syllable'] },
  { id: 1133, character: '허', characterName: 'heo', pronunciation: 'heo', type: 'syllable', romanization: 'heo', tags: ['Basic Syllable'] },
  { id: 1134, character: '혀', characterName: 'hyeo', pronunciation: 'hyeo', type: 'syllable', romanization: 'hyeo', tags: ['Basic Syllable'] },
  { id: 1135, character: '호', characterName: 'ho', pronunciation: 'ho', type: 'syllable', romanization: 'ho', tags: ['Basic Syllable'] },
  { id: 1136, character: '효', characterName: 'hyo', pronunciation: 'hyo', type: 'syllable', romanization: 'hyo', tags: ['Basic Syllable'] },
  { id: 1137, character: '후', characterName: 'hu', pronunciation: 'hu', type: 'syllable', romanization: 'hu', tags: ['Basic Syllable'] },
  { id: 1138, character: '휴', characterName: 'hyu', pronunciation: 'hyu', type: 'syllable', romanization: 'hyu', tags: ['Basic Syllable'] },
  { id: 1139, character: '흐', characterName: 'heu', pronunciation: 'heu', type: 'syllable', romanization: 'heu', tags: ['Basic Syllable'] },
  { id: 1140, character: '히', characterName: 'hi', pronunciation: 'hi', type: 'syllable', romanization: 'hi', tags: ['Basic Syllable'] }
];

// 모든 문자를 하나의 배열로 통합
export const ALL_HANGUL_CHARACTERS = [
  ...BASIC_VOWELS,
  ...COMPLEX_VOWELS,
  ...BASIC_CONSONANTS,
  ...DOUBLE_CONSONANTS,
  ...BASIC_COMBINATIONS
];

// 타입별 필터링 함수들
export const getCharactersByType = (type: KoreanCharacter['type']): KoreanCharacter[] => {
  return ALL_HANGUL_CHARACTERS.filter(char => char.type === type);
};

// 콘텐츠 ID별 문자 조회 (그룹화된 데이터 포함)
export const getCharactersByContentId = (contentId: string): KoreanCharacter[] => {
  switch (contentId) {
    case 'characters-basic-vowels-grouped':
      return BASIC_VOWELS_GROUPED;
    case 'characters-basic-consonants-grouped':
      return BASIC_CONSONANTS_GROUPED;
    case 'characters-basic-vowels':
      return BASIC_VOWELS;
    case 'characters-basic-consonants':
      return BASIC_CONSONANTS;
    case 'characters-basic-combinations':
      return BASIC_COMBINATIONS;
    case 'characters-double-consonants':
      return DOUBLE_CONSONANTS;
    default:
      return [];
  }
};

// ID로 문자 조회
export const getCharacterById = (id: number): KoreanCharacter | undefined => {
  return ALL_HANGUL_CHARACTERS.find(char => char.id === id);
};

// 문자로 조회
export const getCharacterBySymbol = (character: string): KoreanCharacter | undefined => {
  return ALL_HANGUL_CHARACTERS.find(char => char.character === character);
};

// 통계 정보
export const HANGUL_STATS = {
  totalCharacters: ALL_HANGUL_CHARACTERS.length,
  basicVowels: BASIC_VOWELS.length,
  complexVowels: COMPLEX_VOWELS.length,
  basicConsonants: BASIC_CONSONANTS.length,
  doubleConsonants: DOUBLE_CONSONANTS.length,
  basicCombinations: BASIC_COMBINATIONS.length
} as const;