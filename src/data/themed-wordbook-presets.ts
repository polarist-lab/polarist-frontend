import { Difficulty, Category } from '@/lib/types';

// 테마 기반 단어장 프리셋 인터페이스
export interface ThemedWordbookPreset {
  id: string;
  titleKey: string; // 번역 키
  descriptionKey: string; // 번역 키
  icon: string;
  color: string;
  category: Category;
  totalWords: number;
  difficultyBreakdown: {
    'absolute-beginner': number;
    'beginner': number;
    'intermediate': number;
    'advanced': number;
  };
  minFrequency: number;
  featured?: boolean;
}

export const THEMED_WORDBOOK_PRESETS: ThemedWordbookPreset[] = [
  // 🍎 과일
  {
    id: 'fruits',
    titleKey: 'wordbooks.fruits',
    descriptionKey: 'wordbooks.fruitsDesc',
    icon: '🍎',
    color: 'bg-gradient-to-br from-red-400 to-pink-600',
    category: 'food',
    totalWords: 32,
    difficultyBreakdown: {
      'absolute-beginner': 8,  // 사과, 바나나, 오렌지, 포도
      'beginner': 12,          // 딸기, 복숭아, 배, 수박
      'intermediate': 8,       // 망고, 키위, 파인애플, 체리
      'advanced': 4           // 용과, 무화과, 석류, 두리안
    },
    minFrequency: 30,
    featured: true
  },

  // 🐕 동물
  {
    id: 'animals',
    titleKey: 'wordbooks.animals',
    descriptionKey: 'wordbooks.animalsDesc',
    icon: '🐕',
    color: 'bg-gradient-to-br from-yellow-400 to-orange-600',
    category: 'animals',
    totalWords: 40,
    difficultyBreakdown: {
      'absolute-beginner': 10, // 개, 고양이, 새, 물고기
      'beginner': 15,         // 소, 돼지, 닭, 말, 양
      'intermediate': 10,     // 사자, 호랑이, 코끼리, 원숭이
      'advanced': 5          // 기린, 하마, 캥거루, 펭귄
    },
    minFrequency: 25
  },

  // 🌈 색깔
  {
    id: 'colors',
    titleKey: 'wordbooks.colors',
    descriptionKey: 'wordbooks.colorsDesc',
    icon: '🌈',
    color: 'bg-gradient-to-br from-purple-400 to-blue-600',
    category: 'colors',
    totalWords: 20,
    difficultyBreakdown: {
      'absolute-beginner': 8,  // 빨간색, 파란색, 노란색, 초록색
      'beginner': 6,          // 검은색, 흰색, 분홍색, 주황색
      'intermediate': 4,      // 보라색, 회색, 갈색, 금색
      'advanced': 2          // 청록색, 자주색
    },
    minFrequency: 40
  },

  // 👨‍👩‍👧‍👦 가족
  {
    id: 'family',
    titleKey: 'wordbooks.family',
    descriptionKey: 'wordbooks.familyDesc',
    icon: '👨‍👩‍👧‍👦',
    color: 'bg-gradient-to-br from-pink-400 to-red-600',
    category: 'family',
    totalWords: 25,
    difficultyBreakdown: {
      'absolute-beginner': 10, // 엄마, 아빠, 언니, 오빠, 동생
      'beginner': 8,          // 할머니, 할아버지, 이모, 삼촌
      'intermediate': 5,      // 며느리, 사위, 시어머니, 장인
      'advanced': 2          // 종손, 외증조부
    },
    minFrequency: 50
  },

  // 🍜 음식
  {
    id: 'food-dishes',
    titleKey: 'wordbooks.foodDishes',
    descriptionKey: 'wordbooks.foodDishesDesc',
    icon: '🍜',
    color: 'bg-gradient-to-br from-orange-400 to-red-600',
    category: 'food',
    totalWords: 45,
    difficultyBreakdown: {
      'absolute-beginner': 12, // 밥, 김치, 라면, 물
      'beginner': 18,         // 불고기, 비빔밥, 냉면, 떡볶이
      'intermediate': 12,     // 갈비찜, 삼계탕, 해물파전, 순두부찌개
      'advanced': 3          // 구절판, 신선로, 한정식
    },
    minFrequency: 35
  },

  // 🚗 교통수단
  {
    id: 'transportation',
    titleKey: 'wordbooks.transportation',
    descriptionKey: 'wordbooks.transportationDesc',
    icon: '🚗',
    color: 'bg-gradient-to-br from-blue-400 to-cyan-600',
    category: 'transportation',
    totalWords: 30,
    difficultyBreakdown: {
      'absolute-beginner': 8,  // 자동차, 버스, 지하철, 기차
      'beginner': 12,         // 택시, 비행기, 자전거, 오토바이
      'intermediate': 7,      // 헬리콥터, 트럭, 배, 요트
      'advanced': 3          // 크루즈, 잠수함, 우주선
    },
    minFrequency: 30
  },

  // 🏠 집과 가구
  {
    id: 'home-furniture',
    titleKey: 'wordbooks.homeFurniture',
    descriptionKey: 'wordbooks.homeFurnitureDesc',
    icon: '🏠',
    color: 'bg-gradient-to-br from-green-400 to-blue-600',
    category: 'house',
    totalWords: 35,
    difficultyBreakdown: {
      'absolute-beginner': 10, // 집, 방, 침대, 의자
      'beginner': 15,         // 소파, 책상, 냉장고, 텔레비전
      'intermediate': 8,      // 서랍장, 옷장, 식탁, 거울
      'advanced': 2          // 안티크가구, 빌트인가구
    },
    minFrequency: 25
  },

  // 👔 옷
  {
    id: 'clothing',
    titleKey: 'wordbooks.clothing',
    descriptionKey: 'wordbooks.clothingDesc',
    icon: '👔',
    color: 'bg-gradient-to-br from-indigo-400 to-purple-600',
    category: 'clothing',
    totalWords: 40,
    difficultyBreakdown: {
      'absolute-beginner': 12, // 옷, 바지, 치마, 신발
      'beginner': 16,         // 셔츠, 재킷, 모자, 양말
      'intermediate': 10,     // 코트, 드레스, 정장, 운동화
      'advanced': 2          // 턱시도, 한복
    },
    minFrequency: 20
  },

  // 💼 직업
  {
    id: 'jobs',
    titleKey: 'wordbooks.jobs',
    descriptionKey: 'wordbooks.jobsDesc',
    icon: '💼',
    color: 'bg-gradient-to-br from-gray-500 to-blue-600',
    category: 'work',
    totalWords: 35,
    difficultyBreakdown: {
      'absolute-beginner': 8,  // 선생님, 의사, 학생, 가수
      'beginner': 15,         // 간호사, 요리사, 경찰, 소방관
      'intermediate': 10,     // 변호사, 건축가, 프로그래머, 디자이너
      'advanced': 2          // 외교관, 천체물리학자
    },
    minFrequency: 25
  },

  // 🏥 건강과 몸
  {
    id: 'health-body',
    titleKey: 'wordbooks.healthBody',
    descriptionKey: 'wordbooks.healthBodyDesc',
    icon: '🏥',
    color: 'bg-gradient-to-br from-red-400 to-pink-600',
    category: 'health',
    totalWords: 30,
    difficultyBreakdown: {
      'absolute-beginner': 8,  // 머리, 눈, 코, 입
      'beginner': 12,         // 손, 발, 다리, 팔, 배
      'intermediate': 8,      // 심장, 폐, 간, 위
      'advanced': 2          // 췌장, 갑상선
    },
    minFrequency: 35
  }
];

// 카테고리별로 그룹화
export const THEMED_WORDBOOK_CATEGORIES = [
  {
    id: 'daily-life',
    titleKey: 'categories.dailyLife',
    presets: THEMED_WORDBOOK_PRESETS.filter(preset => 
      ['food', 'family', 'house', 'clothing'].includes(preset.category)
    )
  },
  {
    id: 'nature-animals',
    titleKey: 'categories.natureAnimals', 
    presets: THEMED_WORDBOOK_PRESETS.filter(preset =>
      ['animals', 'colors'].includes(preset.category)
    )
  },
  {
    id: 'society-work',
    titleKey: 'categories.societyWork',
    presets: THEMED_WORDBOOK_PRESETS.filter(preset =>
      ['work', 'transportation', 'health'].includes(preset.category)
    )
  }
];

// 난이도별 통계 계산
export const getDifficultyStats = (preset: ThemedWordbookPreset) => {
  const stats = [];
  Object.entries(preset.difficultyBreakdown).forEach(([difficulty, count]) => {
    if (count > 0) {
      stats.push({
        difficulty: difficulty as Difficulty,
        count,
        percentage: Math.round((count / preset.totalWords) * 100)
      });
    }
  });
  return stats;
};

// 추천 학습 경로 생성
export const getRecommendedPath = (preset: ThemedWordbookPreset, userLevel: Difficulty) => {
  const paths = {
    'absolute-beginner': ['absolute-beginner'],
    'beginner': ['absolute-beginner', 'beginner'],
    'intermediate': ['absolute-beginner', 'beginner', 'intermediate'],
    'advanced': ['absolute-beginner', 'beginner', 'intermediate', 'advanced']
  };
  
  return paths[userLevel] || ['absolute-beginner'];
};