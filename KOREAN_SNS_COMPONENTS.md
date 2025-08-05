# 한국어 학습 SNS 컴포넌트 명세서

## 📋 컴포넌트 아키텍처 개요

이 문서는 한국어 학습 SNS에서 사용될 React 컴포넌트들의 상세 명세를 제공합니다. 기존 커뮤니티 시스템을 확장하여 이중 언어 학습, 교정 시스템, 음성 메시지 등의 특화 기능을 구현합니다.

## 🏗️ 컴포넌트 계층 구조

```
src/components/korean-sns/
├── posts/
│   ├── BilingualPostCard.tsx
│   ├── BilingualPostEditor.tsx
│   ├── VoiceMessageCard.tsx
│   └── JournalTemplateSelector.tsx
├── corrections/
│   ├── CorrectionComment.tsx
│   ├── CorrectionEditor.tsx
│   └── CorrectionHighlight.tsx
├── mentorship/
│   ├── MentorMatchCard.tsx
│   ├── MentorshipDashboard.tsx
│   └── TopikLevelBadge.tsx
├── audio/
│   ├── VoiceRecorder.tsx
│   ├── AudioPlayer.tsx
│   └── WaveformVisualizer.tsx
├── gamification/
│   ├── RewardNotification.tsx
│   ├── StreakCounter.tsx
│   └── ProgressBar.tsx
└── layout/
    ├── KoreanSNSLayout.tsx
    ├── FeedContainer.tsx
    └── MobileFeedNav.tsx
```

## 📄 핵심 컴포넌트 명세

### 1. **BilingualPostCard**

이중 언어 포스트를 표시하는 핵심 컴포넌트입니다.

#### Props Interface
```typescript
interface BilingualPostCardProps {
  post: BilingualPost;
  currentUser?: User;
  locale: Locale;
  showCorrections?: boolean;
  showOriginalFirst?: boolean;
  onLike?: (postId: string) => Promise<void>;
  onBookmark?: (postId: string) => Promise<void>;
  onShare?: (postId: string) => Promise<void>;
  onRequestCorrection?: (postId: string) => Promise<void>;
  onComment?: (postId: string, comment: string) => Promise<void>;
  className?: string;
}

interface BilingualPost extends Post {
  originalText: string;
  originalLanguage: 'en' | 'ko';
  translatedText: string;
  translatedLanguage: 'ko' | 'en';
  translationQuality?: 'beginner' | 'intermediate' | 'advanced';
  needsCorrection: boolean;
  corrections: CorrectionComment[];
  voiceData?: VoiceComment;
  journalTemplate?: string;
}
```

#### 사용 예시
```tsx
<BilingualPostCard
  post={post}
  currentUser={user}
  locale="ko"
  showCorrections={true}
  onLike={handleLike}
  onRequestCorrection={handleRequestCorrection}
  className="mb-4"
/>
```

#### 주요 기능
- 원문과 번역문의 시각적 구분 표시
- 교정 필요 상태 표시
- 인터랙션 버튼 (좋아요, 댓글, 공유, 교정 요청)
- 음성 데이터가 있는 경우 오디오 플레이어 표시
- 반응형 레이아웃 지원

---

### 2. **BilingualPostEditor**

이중 언어 포스트 작성을 위한 에디터 컴포넌트입니다.

#### Props Interface
```typescript
interface BilingualPostEditorProps {
  initialPost?: Partial<BilingualPost>;
  locale: Locale;
  currentUser: User;
  templates?: JournalTemplate[];
  onSave: (post: CreateBilingualPostData) => Promise<void>;
  onCancel: () => void;
  onSaveDraft?: (draft: Partial<BilingualPost>) => void;
  isLoading?: boolean;
  maxLength?: {
    original: number;
    translated: number;
  };
}

interface CreateBilingualPostData {
  originalText: string;
  originalLanguage: 'en' | 'ko';
  translatedText: string;
  translatedLanguage: 'ko' | 'en';
  needsCorrection: boolean;
  category: PostCategory;
  difficulty: Difficulty;
  tags: string[];
  templateId?: string;
  voiceData?: File;
}
```

#### 사용 예시
```tsx
<BilingualPostEditor
  locale="ko"
  currentUser={user}
  templates={journalTemplates}
  onSave={handleSavePost}
  onCancel={handleCancel}
  maxLength={{ original: 500, translated: 500 }}
/>
```

#### 주요 기능
- 원문 작성 영역 (영어)
- 번역문 작성 영역 (한국어)
- 실시간 글자 수 카운터
- 일기 템플릿 선택
- 교정 요청 체크박스
- 미리보기 모드
- 임시저장 기능
- 음성 녹음 통합

---

### 3. **CorrectionComment**

교정 피드백을 표시하는 컴포넌트입니다.

#### Props Interface
```typescript
interface CorrectionCommentProps {
  correction: CorrectionComment;
  locale: Locale;
  currentUser?: User;
  onMarkHelpful?: (correctionId: string) => Promise<void>;
  onReply?: (correctionId: string, reply: string) => Promise<void>;
  onReport?: (correctionId: string, reason: string) => Promise<void>;
  showMentorBadge?: boolean;
  className?: string;
}

interface CorrectionComment extends Comment {
  correctionType: 'grammar' | 'vocabulary' | 'pronunciation' | 'natural-expression';
  originalText: string;
  correctedText: string;
  explanation: string;
  severity: 'minor' | 'major' | 'critical';
  mentorTopikLevel: 1 | 2 | 3 | 4 | 5 | 6;
  helpfulCount: number;
  userMarkedHelpful?: boolean;
  corrections: TextCorrection[];
}

interface TextCorrection {
  start: number;
  end: number;
  original: string;
  corrected: string;
  type: 'grammar' | 'vocabulary' | 'spacing' | 'spelling';
}
```

#### 사용 예시
```tsx
<CorrectionComment
  correction={correction}
  locale="ko"
  currentUser={user}
  onMarkHelpful={handleMarkHelpful}
  onReply={handleReply}
  showMentorBadge={true}
/>
```

#### 주요 기능
- 취소선으로 잘못된 부분 표시
- 굵은 글씨로 올바른 표현 강조
- 교정 이유 설명 표시
- 멘토 레벨 배지 표시
- "도움됨" 투표 기능
- 답글 작성 기능

---

### 4. **VoiceMessageCard**

음성 메시지를 재생하고 관리하는 컴포넌트입니다.

#### Props Interface
```typescript
interface VoiceMessageCardProps {
  voiceData: VoiceComment;
  locale: Locale;
  showTranscription?: boolean;
  showAccuracyScore?: boolean;
  showWaveform?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onDownload?: () => void;
  className?: string;
}

interface VoiceComment {
  id: string;
  audioUrl: string;
  duration: number;
  transcription?: string;
  accuracyScore?: number;
  waveformData?: number[];
  language: 'ko' | 'en';
  isProcessing: boolean;
}
```

#### 사용 예시
```tsx
<VoiceMessageCard
  voiceData={voiceData}
  locale="ko"
  showTranscription={true}
  showAccuracyScore={true}
  showWaveform={true}
  onPlay={handlePlay}
/>
```

#### 주요 기능
- 오디오 재생/일시정지 컨트롤
- 웨이브폼 시각화
- STT 결과 표시
- 발음 정확도 점수 표시
- 재생 시간 표시
- 다운로드 기능

---

### 5. **VoiceRecorder**

음성 녹음을 위한 컴포넌트입니다.

#### Props Interface
```typescript
interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => Promise<void>;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  maxDuration?: number; // seconds
  showWaveform?: boolean;
  language?: 'ko' | 'en';
  className?: string;
}
```

#### 사용 예시
```tsx
<VoiceRecorder
  onRecordingComplete={handleRecordingComplete}
  maxDuration={60}
  showWaveform={true}
  language="ko"
/>
```

#### 주요 기능
- 마이크 권한 요청
- 실시간 음성 레벨 표시
- 녹음 시간 카운터
- 최대 녹음 시간 제한
- 재녹음 기능
- 미리듣기 기능

---

### 6. **MentorMatchCard**

멘토-멘티 매칭을 위한 컴포넌트입니다.

#### Props Interface
```typescript
interface MentorMatchCardProps {
  mentor: MentorProfile;
  currentUser: User;
  locale: Locale;
  onSendRequest?: (mentorId: string) => Promise<void>;
  onViewProfile?: (mentorId: string) => void;
  showCompatibility?: boolean;
  className?: string;
}

interface MentorProfile extends CommunityProfile {
  topikLevel: 1 | 2 | 3 | 4 | 5 | 6;
  specialties: string[];
  menteeCount: number;
  averageRating: number;
  responseTime: string;
  teachingStyle: string[];
  availableTimeSlots: TimeSlot[];
}
```

#### 사용 예시
```tsx
<MentorMatchCard
  mentor={mentor}
  currentUser={user}
  locale="ko"
  onSendRequest={handleSendRequest}
  showCompatibility={true}
/>
```

#### 주요 기능
- 멘토 프로필 정보 표시
- TOPIK 레벨 배지
- 전문 분야 태그
- 호환성 점수 표시
- 멘토링 요청 버튼
- 프로필 상세보기 링크

---

### 7. **JournalTemplateSelector**

일기 템플릿 선택을 위한 컴포넌트입니다.

#### Props Interface
```typescript
interface JournalTemplateSelectorProps {
  templates: JournalTemplate[];
  selectedTemplate?: string;
  locale: Locale;
  onSelect: (templateId: string) => void;
  onCustom?: () => void;
  className?: string;
}

interface JournalTemplate {
  id: string;
  name: string;
  description: string;
  prompts: {
    ko: string;
    en: string;
  }[];
  difficulty: Difficulty;
  category: 'daily' | 'emotions' | 'goals' | 'reflection' | 'experience';
  estimatedTime: number; // minutes
  tags: string[];
}
```

#### 사용 예시
```tsx
<JournalTemplateSelector
  templates={templates}
  selectedTemplate={selectedId}
  locale="ko"
  onSelect={handleSelectTemplate}
  onCustom={handleCustomTemplate}
/>
```

#### 주요 기능
- 템플릿 카드 그리드 레이아웃
- 카테고리별 필터링
- 난이도별 색상 구분
- 미리보기 모달
- 커스텀 템플릿 옵션

---

### 8. **TopikLevelBadge**

TOPIK 레벨을 표시하는 배지 컴포넌트입니다.

#### Props Interface
```typescript
interface TopikLevelBadgeProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'subtle';
  showLabel?: boolean;
  className?: string;
}
```

#### 사용 예시
```tsx
<TopikLevelBadge
  level={5}
  size="md"
  variant="default"
  showLabel={true}
/>
```

#### 주요 기능
- 레벨별 색상 구분
- 다양한 크기 옵션
- 여러 스타일 변형
- 접근성 레이블 지원

---

### 9. **RewardNotification**

리워드 획득 알림을 표시하는 컴포넌트입니다.

#### Props Interface
```typescript
interface RewardNotificationProps {
  reward: RewardData;
  isVisible: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
  className?: string;
}

interface RewardData {
  type: 'points' | 'badge' | 'streak' | 'level-up';
  title: string;
  description: string;
  points?: number;
  badge?: BadgeData;
  animation: 'bounce' | 'slide' | 'fade' | 'confetti';
}
```

#### 사용 예시
```tsx
<RewardNotification
  reward={rewardData}
  isVisible={showReward}
  onClose={handleCloseReward}
  autoCloseDelay={3000}
/>
```

#### 주요 기능
- 애니메이션 효과
- 자동 닫기 기능
- 다양한 리워드 타입 지원
- 접근성 고려

---

### 10. **KoreanSNSLayout**

전체 레이아웃을 관리하는 컨테이너 컴포넌트입니다.

#### Props Interface
```typescript
interface KoreanSNSLayoutProps {
  children: React.ReactNode;
  currentUser?: User;
  locale: Locale;
  sidebar?: React.ReactNode;
  rightPanel?: React.ReactNode;
  showFAB?: boolean;
  onCreatePost?: () => void;
  className?: string;
}
```

#### 사용 예시
```tsx
<KoreanSNSLayout
  currentUser={user}
  locale="ko"
  sidebar={<SideNavigation />}
  rightPanel={<TrendingTopics />}
  showFAB={true}
  onCreatePost={handleCreatePost}
>
  <FeedContainer posts={posts} />
</KoreanSNSLayout>
```

#### 주요 기능
- 반응형 그리드 레이아웃
- 사이드바 및 우측 패널 지원
- 플로팅 액션 버튼
- 모바일 네비게이션
- 스크롤 최적화

## 🔧 Utility Hooks

### 1. **useVoiceRecorder**
```typescript
const useVoiceRecorder = (options?: {
  maxDuration?: number;
  onRecordingComplete?: (blob: Blob) => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const startRecording = () => { /* ... */ };
  const stopRecording = () => { /* ... */ };
  const resetRecording = () => { /* ... */ };
  
  return {
    isRecording,
    duration,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording
  };
};
```

### 2. **useBilingualPost**
```typescript
const useBilingualPost = (postId: string) => {
  const [post, setPost] = useState<BilingualPost | null>(null);
  const [corrections, setCorrections] = useState<CorrectionComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const addCorrection = (correction: CreateCorrectionData) => { /* ... */ };
  const markHelpful = (correctionId: string) => { /* ... */ };
  const requestCorrection = () => { /* ... */ };
  
  return {
    post,
    corrections,
    isLoading,
    addCorrection,
    markHelpful,
    requestCorrection
  };
};
```

### 3. **useKoreanSNSAuth**
```typescript
const useKoreanSNSAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const updateTopikLevel = (level: number) => { /* ... */ };
  const updateLearningPreferences = (preferences: LearningPreferences) => { /* ... */ };
  
  return {
    user,
    isLoading,
    updateTopikLevel,
    updateLearningPreferences
  };
};
```

## 📋 개발 체크리스트

### 컴포넌트 개발 순서
1. ✅ **기본 타입 정의** - TypeScript 인터페이스
2. ⏳ **핵심 컴포넌트** - BilingualPostCard, CorrectionComment
3. ⏳ **에디터 컴포넌트** - BilingualPostEditor, VoiceRecorder
4. ⏳ **멘토링 시스템** - MentorMatchCard, TopikLevelBadge
5. ⏳ **게임화 요소** - RewardNotification, StreakCounter
6. ⏳ **레이아웃 시스템** - KoreanSNSLayout, FeedContainer
7. ⏳ **최적화 및 테스트** - 성능 최적화, 단위 테스트

### 품질 보증
- [ ] TypeScript 타입 안전성 100%
- [ ] 접근성 표준 준수 (WCAG 2.1 AA)
- [ ] 모바일 반응형 지원
- [ ] 다크모드 지원
- [ ] 국제화(i18n) 지원
- [ ] 단위 테스트 커버리지 80% 이상

---

**이 컴포넌트 명세서는 한국어 학습 SNS의 모든 UI 요소에 대한 상세한 구현 가이드를 제공하며, 개발팀이 일관성 있고 재사용 가능한 컴포넌트를 만들 수 있도록 지원합니다.**