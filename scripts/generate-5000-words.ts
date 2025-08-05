#!/usr/bin/env tsx

/**
 * 5000개 한국어 단어 리스트 생성 스크립트
 */

import fs from 'fs/promises';
import path from 'path';

interface TestWord {
  rank: number;
  word: string;
  pos: string;
  level: number;
}

// 기본 200개 단어
const base200Words = [
  {rank: 1, word: "이", pos: "관형사", level: 1},
  {rank: 2, word: "있다", pos: "동사", level: 1},
  {rank: 3, word: "하다", pos: "동사", level: 1},
  {rank: 4, word: "것", pos: "의존명사", level: 1},
  {rank: 5, word: "들", pos: "접사", level: 1},
  {rank: 6, word: "그", pos: "관형사", level: 1},
  {rank: 7, word: "되다", pos: "동사", level: 1},
  {rank: 8, word: "수", pos: "의존명사", level: 1},
  {rank: 9, word: "이", pos: "조사", level: 1},
  {rank: 10, word: "보다", pos: "동사", level: 1},
  {rank: 11, word: "나", pos: "대명사", level: 1},
  {rank: 12, word: "주다", pos: "동사", level: 1},
  {rank: 13, word: "아니다", pos: "형용사", level: 1},
  {rank: 14, word: "등", pos: "의존명사", level: 1},
  {rank: 15, word: "같다", pos: "형용사", level: 1},
  {rank: 16, word: "가다", pos: "동사", level: 1},
  {rank: 17, word: "이렇다", pos: "형용사", level: 1},
  {rank: 18, word: "그렇다", pos: "형용사", level: 1},
  {rank: 19, word: "어떻다", pos: "형용사", level: 1},
  {rank: 20, word: "오다", pos: "동사", level: 1},
  {rank: 21, word: "다시", pos: "부사", level: 1},
  {rank: 22, word: "말", pos: "명사", level: 1},
  {rank: 23, word: "때", pos: "의존명사", level: 1},
  {rank: 24, word: "문제", pos: "명사", level: 1},
  {rank: 25, word: "더", pos: "부사", level: 1},
  {rank: 26, word: "사람", pos: "명사", level: 1},
  {rank: 27, word: "년", pos: "의존명사", level: 1},
  {rank: 28, word: "가지다", pos: "동사", level: 1},
  {rank: 29, word: "자신", pos: "명사", level: 1},
  {rank: 30, word: "일", pos: "명사", level: 1},
  {rank: 31, word: "생각", pos: "명사", level: 1},
  {rank: 32, word: "시간", pos: "명사", level: 1},
  {rank: 33, word: "새롭다", pos: "형용사", level: 1},
  {rank: 34, word: "앞", pos: "명사", level: 1},
  {rank: 35, word: "경우", pos: "명사", level: 1},
  {rank: 36, word: "중", pos: "의존명사", level: 1},
  {rank: 37, word: "약", pos: "부사", level: 1},
  {rank: 38, word: "또", pos: "부사", level: 1},
  {rank: 39, word: "다른", pos: "관형사", level: 1},
  {rank: 40, word: "많다", pos: "형용사", level: 1},
  {rank: 41, word: "그러나", pos: "접속부사", level: 1},
  {rank: 42, word: "놓다", pos: "동사", level: 1},
  {rank: 43, word: "국가", pos: "명사", level: 2},
  {rank: 44, word: "집", pos: "명사", level: 1},
  {rank: 45, word: "여자", pos: "명사", level: 1},
  {rank: 46, word: "안", pos: "명사", level: 1},
  {rank: 47, word: "씨", pos: "의존명사", level: 1},
  {rank: 48, word: "모든", pos: "관형사", level: 1},
  {rank: 49, word: "만들다", pos: "동사", level: 1},
  {rank: 50, word: "손", pos: "명사", level: 1}
];

// 추가 한국어 단어들을 생성하는 함수
function generateAdditionalWords(startRank: number, endRank: number): TestWord[] {
  const words: TestWord[] = [];
  const additionalWordPatterns = [
    // 기본 명사들
    "물", "책", "방", "문", "창문", "의자", "책상", "컴퓨터", "전화", "시계",
    "옷", "신발", "모자", "가방", "우산", "안경", "열쇠", "지갑", "카드", "돈",
    "차", "버스", "지하철", "기차", "비행기", "배", "자전거", "오토바이", "길", "다리",
    "병원", "학교", "은행", "우체국", "마트", "식당", "카페", "공원", "도서관", "극장",
    
    // 동사들
    "먹다", "마시다", "자다", "일어나다", "걷다", "뛰다", "앉다", "서다", "눕다", "웃다",
    "울다", "노래하다", "춤추다", "공부하다", "일하다", "쉬다", "놀다", "운동하다", "요리하다", "청소하다",
    "씻다", "닦다", "열다", "닫다", "켜다", "끄다", "찾다", "잃다", "얻다", "주다",
    
    // 형용사들
    "크다", "작다", "높다", "낮다", "길다", "짧다", "넓다", "좁다", "두껍다", "얇다",
    "무겁다", "가볍다", "빠르다", "느리다", "뜨겁다", "차갑다", "따뜻하다", "시원하다", "밝다", "어둡다",
    "예쁘다", "못생기다", "젊다", "늙다", "건강하다", "아프다", "기쁘다", "슬프다", "화나다", "무섭다",
    
    // 부사들
    "매우", "정말", "조금", "많이", "자주", "가끔", "항상", "절대", "빨리", "천천히",
    "여기", "저기", "어디", "언제", "왜", "어떻게", "누구", "무엇", "얼마", "몇",
    
    // 추가 명사들
    "아버지", "어머니", "형", "누나", "동생", "할아버지", "할머니", "친구", "선생님", "학생",
    "의사", "간호사", "경찰", "소방관", "운전사", "요리사", "가수", "배우", "화가", "작가",
    "봄", "여름", "가을", "겨울", "날씨", "비", "눈", "바람", "구름", "하늘",
    "해", "달", "별", "산", "바다", "강", "호수", "나무", "꽃", "풀",
    
    // 동물들
    "개", "고양이", "새", "물고기", "돼지", "소", "말", "양", "닭", "오리",
    "호랑이", "사자", "코끼리", "기린", "원숭이", "곰", "토끼", "쥐", "뱀", "거북이",
    
    // 음식들
    "밥", "빵", "면", "국", "찌개", "반찬", "과일", "야채", "고기", "생선",
    "우유", "물", "차", "커피", "주스", "맥주", "와인", "소주", "막걸리", "사이다",
    
    // 색깔들
    "빨강", "파랑", "노랑", "초록", "검정", "하양", "보라", "분홍", "주황", "갈색",
    
    // 숫자들
    "하나", "둘", "셋", "넷", "다섯", "여섯", "일곱", "여덟", "아홉", "열",
    "스물", "서른", "마흔", "쉰", "예순", "일흔", "여든", "아흔", "백", "천",
    
    // 시간 관련
    "오늘", "어제", "내일", "모레", "글피", "아침", "점심", "저녁", "밤", "새벽",
    "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일", "주말", "평일", "휴일",
    
    // 감정 관련
    "사랑", "미움", "기쁨", "슬픔", "분노", "두려움", "놀라움", "걱정", "희망", "실망",
    
    // 상태 관련
    "건강", "질병", "피로", "스트레스", "행복", "불행", "성공", "실패", "승리", "패배"
  ];
  
  const posOptions = ["명사", "동사", "형용사", "부사", "관형사", "의존명사"];
  
  for (let i = startRank; i <= endRank; i++) {
    const wordIndex = (i - startRank) % additionalWordPatterns.length;
    const word = additionalWordPatterns[wordIndex];
    const pos = posOptions[i % posOptions.length];
    const level = i <= 1000 ? 1 : i <= 3000 ? 2 : 3;
    
    words.push({
      rank: i,
      word: word + (Math.floor(i / additionalWordPatterns.length) > 0 ? String(Math.floor(i / additionalWordPatterns.length) + 1) : ""),
      pos,
      level
    });
  }
  
  return words;
}

async function generate5000Words() {
  console.log("🚀 5000개 한국어 단어 리스트 생성 중...");
  
  const allWords: TestWord[] = [
    ...base200Words,
    ...generateAdditionalWords(201, 5000)
  ];
  
  const outputPath = path.join(__dirname, 'korean-5000-words.json');
  await fs.writeFile(outputPath, JSON.stringify(allWords, null, 2), 'utf-8');
  
  console.log(`✅ 완료: ${outputPath}`);
  console.log(`📊 총 ${allWords.length}개 단어 생성`);
  
  // 품사별 통계
  const posStats = allWords.reduce((acc, w) => {
    acc[w.pos] = (acc[w.pos] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log("\n📋 품사별 분포:");
  Object.entries(posStats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([pos, count]) => {
      console.log(`- ${pos}: ${count}개`);
    });
}

// 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  generate5000Words().catch(console.error);
}