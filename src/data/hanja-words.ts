import { HanjaInfo } from '@/lib/types';

// 주요 한자어 단어들의 한자 정보 데이터베이스
export const HANJA_DATABASE: Record<string, HanjaInfo> = {
  // 기본/일상 단어들
  '학교': {
    traditional: '學校',
    simplified: '学校',
    meaning: '학습할 학 + 학교 교',
    etymology: 'place of learning'
  },
  '병원': {
    traditional: '病院',
    simplified: '病院',
    meaning: '병들 병 + 뜰 원',
    etymology: 'place for treating illness'
  },
  '회사': {
    traditional: '會社',
    simplified: '会社',
    meaning: '모일 회 + 모일 사',
    etymology: 'gathering/organization'
  },
  '시간': {
    traditional: '時間',
    simplified: '时间',
    meaning: '때 시 + 사이 간',
    etymology: 'time period'
  },
  '사람': {
    traditional: '人',
    simplified: '人',
    meaning: '사람 인',
    etymology: 'human being'
  },
  '친구': {
    traditional: '親舊',
    simplified: '亲旧',
    meaning: '친할 친 + 옛 구',
    etymology: 'close old relationship'
  },
  '가족': {
    traditional: '家族',
    simplified: '家族',
    meaning: '집 가 + 겨레 족',
    etymology: 'family group'
  },
  '선생': {
    traditional: '先生',
    simplified: '先生',
    meaning: '먼저 선 + 날 생',
    etymology: 'one who was born before'
  },

  // 음식 관련
  '음식': {
    traditional: '飮食',
    simplified: '饮食',
    meaning: '마실 음 + 먹을 식',
    etymology: 'drink and food'
  },
  '식당': {
    traditional: '食堂',
    simplified: '食堂',
    meaning: '먹을 식 + 집 당',
    etymology: 'eating hall'
  },
  '차': {
    traditional: '茶',
    simplified: '茶',
    meaning: '차 차',
    etymology: 'tea plant'
  },
  '커피': {
    traditional: '咖啡',
    simplified: '咖啡',
    meaning: '커피 음성',
    etymology: 'coffee (sound translation)'
  },
  '물': {
    traditional: '水',
    simplified: '水',
    meaning: '물 수',
    etymology: 'water'
  },

  // 가족 관계
  '아버지': {
    traditional: '父親',
    simplified: '父亲',
    meaning: '아비 부 + 친할 친',
    etymology: 'father parent'
  },
  '어머니': {
    traditional: '母親',
    simplified: '母亲',
    meaning: '어미 모 + 친할 친',
    etymology: 'mother parent'
  },
  '형제': {
    traditional: '兄弟',
    simplified: '兄弟',
    meaning: '형 형 + 아우 제',
    etymology: 'older and younger brothers'
  },
  '자매': {
    traditional: '姉妹',
    simplified: '姐妹',
    meaning: '누이 자 + 누이동생 매',
    etymology: 'older and younger sisters'
  },

  // 교통/여행
  '자동차': {
    traditional: '自動車',
    simplified: '自动车',
    meaning: '스스로 자 + 움직일 동 + 수레 차',
    etymology: 'self-moving vehicle'
  },
  '지하철': {
    traditional: '地下鐵',
    simplified: '地下铁',
    meaning: '땅 지 + 아래 하 + 쇠 철',
    etymology: 'underground railway'
  },
  '비행기': {
    traditional: '飛行機',
    simplified: '飞行机',
    meaning: '날 비 + 다닐 행 + 기계 기',
    etymology: 'flying machine'
  },
  '기차': {
    traditional: '汽車',
    simplified: '汽车',
    meaning: '김 기 + 수레 차',
    etymology: 'steam vehicle'
  },

  // 감정/상태
  '기분': {
    traditional: '氣分',
    simplified: '气分',
    meaning: '기운 기 + 나눌 분',
    etymology: 'state of spirit'
  },
  '행복': {
    traditional: '幸福',
    simplified: '幸福',
    meaning: '다행 행 + 복 복',
    etymology: 'good fortune and blessing'
  },
  '사랑': {
    traditional: '愛',
    simplified: '爱',
    meaning: '사랑 애',
    etymology: 'love, affection'
  },

  // 시간 관련
  '오늘': {
    traditional: '今日',
    simplified: '今日',
    meaning: '이제 금 + 날 일',
    etymology: 'present day'
  },
  '어제': {
    traditional: '昨日',
    simplified: '昨日',
    meaning: '어제 작 + 날 일',
    etymology: 'previous day'
  },
  '내일': {
    traditional: '來日',
    simplified: '来日',
    meaning: '올 래 + 날 일',
    etymology: 'coming day'
  },
  '주말': {
    traditional: '週末',
    simplified: '周末',
    meaning: '주 주 + 끝 말',
    etymology: 'end of week'
  },

  // 장소
  '도서관': {
    traditional: '圖書館',
    simplified: '图书馆',
    meaning: '그림 도 + 글 서 + 집 관',
    etymology: 'place for books and documents'
  },
  '공원': {
    traditional: '公園',
    simplified: '公园',
    meaning: '공공 공 + 동산 원',
    etymology: 'public garden'
  },
  '시장': {
    traditional: '市場',
    simplified: '市场',
    meaning: '저잣거리 시 + 마당 장',
    etymology: 'marketplace'
  },
  '은행': {
    traditional: '銀行',
    simplified: '银行',
    meaning: '은 은 + 다닐 행',
    etymology: 'silver trading place'
  },

  // 날씨
  '날씨': {
    traditional: '天氣',
    simplified: '天气',
    meaning: '하늘 천 + 기운 기',
    etymology: 'heavenly energy'
  },
  '비': {
    traditional: '雨',
    simplified: '雨',
    meaning: '비 우',
    etymology: 'rain'
  },
  '눈': {
    traditional: '雪',
    simplified: '雪',
    meaning: '눈 설',
    etymology: 'snow'
  },
  '바람': {
    traditional: '風',
    simplified: '风',
    meaning: '바람 풍',
    etymology: 'wind'
  },

  // 색깔
  '색깔': {
    traditional: '色',
    simplified: '色',
    meaning: '빛깔 색',
    etymology: 'color, hue'
  },
  '빨간색': {
    traditional: '紅色',
    simplified: '红色',
    meaning: '붉을 홍 + 빛깔 색',
    etymology: 'red color'
  },
  '파란색': {
    traditional: '靑色',
    simplified: '青色',
    meaning: '푸를 청 + 빛깔 색',
    etymology: 'blue/green color'
  },

  // 직업
  '의사': {
    traditional: '醫師',
    simplified: '医师',
    meaning: '의원 의 + 스승 사',
    etymology: 'medical teacher'
  },
  '간호사': {
    traditional: '看護師',
    simplified: '看护师',
    meaning: '볼 간 + 도울 호 + 스승 사',
    etymology: 'one who watches and protects'
  },
  '교사': {
    traditional: '敎師',
    simplified: '教师',
    meaning: '칠 교 + 스승 사',
    etymology: 'teaching master'
  },

  // 기술/현대
  '컴퓨터': {
    traditional: '電腦',
    simplified: '电脑',
    meaning: '번개 전 + 골 뇌',
    etymology: 'electronic brain'
  },
  '인터넷': {
    traditional: '因特網',
    simplified: '因特网',
    meaning: '인터넷 음성',
    etymology: 'internet (sound translation)'
  },
  '휴대폰': {
    traditional: '携帶電話',
    simplified: '携带电话',
    meaning: '끼고 갈 휴대 + 번개 전 + 말할 화',
    etymology: 'portable electronic communication'
  },

  // 스포츠/활동
  '운동': {
    traditional: '運動',
    simplified: '运动',
    meaning: '옮길 운 + 움직일 동',
    etymology: 'moving and exercising'
  },
  '축구': {
    traditional: '蹴球',
    simplified: '蹴球',
    meaning: '찰 축 + 공 구',
    etymology: 'kicking ball'
  },
  '야구': {
    traditional: '野球',
    simplified: '野球',
    meaning: '들 야 + 공 구',
    etymology: 'field ball'
  }
};

// 한자어 여부 확인
export function isHanjaWord(korean: string): boolean {
  return korean in HANJA_DATABASE;
}

// 한자 정보 조회
export function getHanjaInfo(korean: string): HanjaInfo | undefined {
  return HANJA_DATABASE[korean];
}

// 모든 한자어 목록 조회
export function getAllHanjaWords(): string[] {
  return Object.keys(HANJA_DATABASE);
}

// 한자 스크립트별 표시
export function getHanjaDisplay(korean: string, script: 'traditional' | 'simplified' | 'both'): string {
  const info = getHanjaInfo(korean);
  if (!info) return '';

  switch (script) {
    case 'traditional':
      return info.traditional;
    case 'simplified':
      return info.simplified;
    case 'both':
      return info.traditional === info.simplified 
        ? info.traditional 
        : `${info.traditional} / ${info.simplified}`;
    default:
      return info.traditional;
  }
}

// 통계 정보
export const HANJA_STATS = {
  totalWords: Object.keys(HANJA_DATABASE).length,
  categories: {
    basic: ['학교', '병원', '회사', '시간', '사람', '친구', '가족', '선생'].length,
    food: ['음식', '식당', '차', '커피', '물'].length,
    family: ['아버지', '어머니', '형제', '자매'].length,
    transport: ['자동차', '지하철', '비행기', '기차'].length,
    emotions: ['기분', '행복', '사랑'].length,
    time: ['오늘', '어제', '내일', '주말'].length,
    places: ['도서관', '공원', '시장', '은행'].length,
    weather: ['날씨', '비', '눈', '바람'].length,
    colors: ['색깔', '빨간색', '파란색'].length,
    jobs: ['의사', '간호사', '교사'].length,
    technology: ['컴퓨터', '인터넷', '휴대폰'].length,
    sports: ['운동', '축구', '야구'].length
  }
} as const;