# 한국어 학습 SNS 커뮤니티 설계 문서

## 🌟 프로젝트 비전

**"한국어로 생각을 표현하고, 함께 성장하는 학습 커뮤니티"**

외국어 학습에서 가장 효과적인 방법 중 하나는 "자신의 생각을 외국어로 표현하는 것"입니다. 이를 루틴화하고 습관화하며, 더 숙련된 학습자들이 교정과 격려를 제공하는 문화를 만들어 학습 효과를 극대화하는 SNS 플랫폼을 구축합니다.

## 🎯 핵심 목표

### 1. 표현력 향상
- 일상적인 생각을 한국어로 표현하는 연습
- 짧은 일기/음성 메시지 형태의 콘텐츠 작성
- 점진적인 표현력 확장과 어휘력 증대

### 2. 커뮤니티 기반 학습
- TOPIK 레벨 기반 멘토-멘티 시스템
- 동료 학습자들과의 상호 격려 및 동기부여
- 실시간 교정 및 피드백 제공

### 3. 게임화된 학습 경험
- 학습 활동에 대한 리워드 시스템
- 랭킹과 배지를 통한 성취감 제공
- 연속 학습 스트릭 시스템

## 🏗️ 시스템 아키텍처

### 기술 스택
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Rust + Axum (API) / NestJS (Legacy Migration)
- **Database**: PostgreSQL + Redis (캐싱)
- **Real-time**: WebSocket (실시간 알림)
- **Media**: Audio/Video 처리를 위한 클라우드 스토리지

### 현재 기반 구조 활용
- ✅ 완성된 커뮤니티 타입 시스템 (`Post`, `Comment`, `CommunityProfile`)
- ✅ 카테고리별 포스트 분류 시스템
- ✅ 미디어 지원 (오디오, 비디오, 이미지)
- ✅ 랭킹/티어 시스템 구현
- ✅ PostEditor, PostCard 컴포넌트 기반

## 🚀 핵심 기능 명세

### 1. **이중 언어 포스트 시스템**

#### 개념
영어권 화자가 영어로 자신의 생각을 먼저 작성하고, 그 아래에 한국어 번역을 시도하는 구조

#### 구현 방식
```typescript
interface BilingualPost extends Post {
  originalText: string;      // 원문 (영어)
  translatedText: string;    // 번역문 (한국어)
  originalLanguage: 'en' | 'ko';
  targetLanguage: 'ko' | 'en';
  translationQuality?: 'beginner' | 'intermediate' | 'advanced';
  needsCorrection: boolean;
}
```

#### 사용자 플로우
1. 영어로 자신의 생각/경험 작성 (원문)
2. 한국어로 번역 시도 (학습 목표 언어)
3. 포스트 게시
4. 상급자들의 교정 피드백 수령
5. 수정된 내용으로 학습 진행

### 2. **교정 및 멘토링 시스템**

#### TOPIK 레벨 기반 멘토링
- **TOPIK 1-2급**: 기초 학습자
- **TOPIK 3-4급**: 중급 학습자  
- **TOPIK 5-6급**: 고급 학습자 (멘토 역할)

#### 교정 시스템
```typescript
interface CorrectionComment extends Comment {
  correctionType: 'grammar' | 'vocabulary' | 'pronunciation' | 'natural-expression';
  originalText: string;      // 원래 잘못된 부분
  correctedText: string;     // 교정된 부분
  explanation: string;       // 교정 이유 설명
  severity: 'minor' | 'major' | 'critical';
  mentorTopikLevel: 1 | 2 | 3 | 4 | 5 | 6;
  helpfulCount: number;      // 다른 사용자들의 도움 평가
}
```

#### 멘토링 활동 리워드
- 교정 제공: +10 포인트
- 설명 추가: +5 포인트
- 커뮤니티 평가에서 "도움됨" 받기: +3 포인트

### 3. **일기 특화 포스트**

#### 일기 템플릿 시스템
```typescript
interface JournalTemplate {
  id: string;
  name: string;
  prompts: {
    ko: string;
    en: string;
  }[];
  difficulty: Difficulty;
  category: 'daily' | 'emotions' | 'goals' | 'reflection';
}

// 예시 템플릿
const dailyJournalTemplate: JournalTemplate = {
  id: 'daily-routine',
  name: '일상 일기',
  prompts: [
    { ko: '오늘 어떤 기분이었나요?', en: 'How did you feel today?' },
    { ko: '오늘 가장 기억에 남는 일은?', en: 'What was the most memorable thing today?' },
    { ko: '내일 하고 싶은 일은?', en: 'What do you want to do tomorrow?' }
  ],
  difficulty: 'beginner',
  category: 'daily'
};
```

### 4. **음성 메시지 특화 기능**

#### 발음 연습 시스템
- 음성 녹음 및 재생
- STT(Speech-to-Text)를 통한 발음 정확도 측정  
- 네이티브 스피커 음성과 비교
- 발음 교정 피드백

#### 음성 댓글 시스템
```typescript
interface VoiceComment {
  id: string;
  audioUrl: string;
  transcription?: string;    // STT 결과
  duration: number;          // 초 단위
  waveformData?: number[];   // 시각화용 웨이브폼 데이터
}
```

### 5. **리워드 및 랭킹 시스템**

#### 포인트 시스템
```typescript
interface PointAction {
  action: string;
  points: number;
  description: string;
}

const POINT_ACTIONS: PointAction[] = [
  { action: 'daily_post', points: 5, description: '일일 포스트 작성' },
  { action: 'correction_provided', points: 10, description: '교정 피드백 제공' },
  { action: 'helpful_correction', points: 3, description: '도움되는 교정으로 평가받음' },
  { action: 'audio_post', points: 8, description: '음성 포스트 작성' },
  { action: 'streak_7days', points: 50, description: '7일 연속 학습' },
  { action: 'streak_30days', points: 200, description: '30일 연속 학습' }
];
```

#### 배지 시스템
- **학습자 배지**: "첫 포스트", "7일 스트릭", "한 달 완주"
- **멘토 배지**: "도움왕", "교정 마스터", "격려왕"
- **커뮤니티 배지**: "인기 작성자", "베스트 댓글러", "활발한 참여자"

## 👥 사용자 플로우

### 📝 **일반 학습자 플로우**
```
1. 회원가입 → TOPIK 레벨 설정
2. 오늘의 일기 주제 선택
3. 영어로 생각 정리 (원문 작성)
4. 한국어로 번역 시도
5. 포스트 게시
6. 상급자의 교정 피드백 대기
7. 교정 내용 학습 및 적용
8. 포인트 획득 및 레벨업
```

### 🎓 **멘토(상급자) 플로우**
```
1. 자신보다 낮은 레벨 포스트 탐색
2. 문법/어휘/표현 오류 식별
3. 친절한 교정 피드백 작성
4. 설명과 대안 제시
5. 격려 메시지 추가
6. 멘토링 포인트 획득
7. 멘토 랭킹 상승
```

## 🎨 사용자 인터페이스 설계 방향

### Meta Threads 영감 요소
- **카드 기반 레이아웃**: 각 포스트를 둥근 모서리의 카드로 표시
- **부드러운 인터랙션**: 좋아요, 댓글, 공유 버튼의 애니메이션
- **모바일 우선**: 스와이프 제스처와 터치 친화적 UI

### Next.js Docs 영감 요소  
- **깔끔한 타이포그래피**: 한국어와 영어 텍스트의 가독성 최적화
- **계층적 정보 구조**: 원문-번역-교정의 명확한 구분
- **중성적 컬러**: 학습에 집중할 수 있는 차분한 색상

## 📊 데이터 모델 확장

### 기존 타입 확장
```typescript
// 기존 Post 타입 확장
interface KoreanLearningPost extends Post {
  postType: 'bilingual' | 'journal' | 'voice' | 'correction-request';
  originalText?: string;
  translatedText?: string;
  voiceData?: VoiceComment;
  corrections: CorrectionComment[];
  needsHelp: boolean;
  helpfulnessScore: number;
}

// 사용자 프로필 확장
interface KoreanLearnerProfile extends CommunityProfile {
  topikLevel: 1 | 2 | 3 | 4 | 5 | 6;
  nativeLanguage: string;
  learningGoals: string[];
  mentorshipPreference: 'receive' | 'provide' | 'both';
  studyStreak: number;
  totalCorrectionsGiven: number;
  totalCorrectionsReceived: number;
}
```

## 🔧 기술적 구현 고려사항

### 1. **실시간 알림 시스템**
- 새로운 교정 피드백 알림
- 멘토-멘티 매칭 알림
- 스트릭 달성 축하 알림

### 2. **검색 및 매칭 알고리즘**
- TOPIK 레벨 기반 멘토 추천
- 관심사 기반 포스트 추천
- 비슷한 실력 학습자 그룹핑

### 3. **콘텐츠 모더레이션**
- 부적절한 교정 피드백 신고 시스템
- 건설적인 피드백 문화 조성
- 스팸 및 악성 댓글 필터링

### 4. **데이터 분석 및 인사이트**
- 개인별 학습 진도 추적
- 취약한 문법/어휘 영역 분석
- 커뮤니티 활동 통계

## 🎯 성공 지표

### 학습 효과 측정
- **포스트 품질 향상**: 교정 받은 횟수 대비 오류 감소율
- **어휘력 확장**: 새로운 단어 사용 빈도 증가
- **표현력 향상**: 문장 복잡도 및 자연스러움 개선

### 커뮤니티 활성도
- **일일 활성 사용자** (DAU)
- **포스트 작성 빈도**
- **교정 피드백 제공/수령 비율**
- **사용자 간 상호작용 수준**

### 지속성 지표
- **사용자 리텐션율** (1개월, 3개월, 6개월)
- **학습 스트릭 달성률**
- **멘토링 활동 지속률**

---

**이 설계 문서는 한국어 학습자들이 실질적인 표현력 향상을 경험할 수 있는 SNS 커뮤니티 구축을 위한 청사진입니다. 기존의 견고한 기술적 기반 위에 사용자 중심의 학습 경험을 더해 효과적인 언어 학습 플랫폼을 만들어나갈 것입니다.**