# 한국어 학습 SNS UI/UX 디자인 가이드

## 🎨 디자인 철학

**"학습에 집중할 수 있는 직관적이고 친숙한 인터페이스"**

언어 학습은 지속적인 동기부여와 집중력이 필요합니다. 사용자가 콘텐츠 작성과 학습에 온전히 몰입할 수 있도록 친숙하면서도 깔끔한 디자인을 추구합니다.

## 🔍 참조 디자인 시스템

### Meta Threads 영감 요소
- **모바일 우선 접근**: 스마트폰에서의 사용성 최적화
- **카드 기반 레이아웃**: 각 포스트를 독립적인 카드로 구성
- **부드러운 인터랙션**: 자연스러운 애니메이션과 피드백
- **사용자 중심 네비게이션**: 직관적인 탭 구조

### Next.js Docs 영감 요소  
- **타이포그래피 중심**: 텍스트 가독성과 계층 구조 강조
- **중성적 컬러 팔레트**: 집중력을 방해하지 않는 색상
- **정보 아키텍처**: 체계적인 콘텐츠 구조화
- **검색 우선 UX**: 효율적인 정보 탐색 지원

## 🎨 색상 시스템

### 기본 컬러 팔레트 (Next.js Docs 영감)
```css
:root {
  /* Primary Colors - Korean Learning Theme */
  --korean-primary: #0066CC;        /* 차분한 파랑 - 학습 집중 */  
  --korean-primary-dark: #0052A3;   /* 다크모드용 */
  --korean-accent: #FF6B6B;         /* 교정/강조용 빨강 */
  --korean-success: #4ECDC4;        /* 성공/완료 표시 */
  
  /* Neutral Grays (Next.js Docs Style) */
  --gray-50: #FAFAFA;
  --gray-100: #F5F5F5;
  --gray-200: #E5E5E5;
  --gray-300: #D4D4D4;
  --gray-600: #525252;
  --gray-700: #404040;
  --gray-800: #262626;
  --gray-900: #171717;
  
  /* Semantic Colors */
  --correction-bg: #FEF2F2;         /* 교정 배경 */
  --correction-border: #FECACA;     /* 교정 테두리 */
  --original-text: #1F2937;        /* 원문 텍스트 */
  --translated-text: #059669;      /* 번역문 텍스트 */
  --mentor-highlight: #8B5CF6;     /* 멘토 표시 */
}
```

### 다크 모드 색상
```css
[data-theme="dark"] {
  --korean-primary: #3B82F6;
  --korean-accent: #EF4444;
  --korean-success: #10B981;
  --correction-bg: #1F1F1F;
  --correction-border: #374151;
  --original-text: #F9FAFB;
  --translated-text: #34D399;
}
```

## 📱 레이아웃 시스템

### 1. **메인 피드 레이아웃 (Meta Threads 스타일)**

```typescript
interface FeedLayoutProps {
  header: React.ReactNode;    // 상단 네비게이션
  sidebar?: React.ReactNode;  // 사이드바 (데스크톱)
  content: React.ReactNode;   // 메인 피드
  fab?: React.ReactNode;      // 플로팅 작성 버튼
}
```

#### 모바일 레이아웃
```
┌─────────────────┐
│   Header Nav    │
├─────────────────┤
│                 │
│   Feed Cards    │
│                 │
│  ┌─────────┐    │
│  │ Post 1  │    │
│  └─────────┘    │
│                 │
│  ┌─────────┐    │
│  │ Post 2  │    │
│  └─────────┘    │
│                 │
└─────────────────┘
      ┌─────┐
      │ FAB │  ← 플로팅 작성 버튼
      └─────┘
```

#### 데스크톱 레이아웃
```
┌─────┬──────────────┬─────┐
│Side │  Feed Cards  │Info │
│bar  │              │Panel│
│     │ ┌─────────┐  │     │
│🏠   │ │ Post 1  │  │📊   │
│📝   │ └─────────┘  │Stats│
│👥   │              │     │
│🏆   │ ┌─────────┐  │📈   │
│     │ │ Post 2  │  │     │
│     │ └─────────┘  │     │
└─────┴──────────────┴─────┘
```

### 2. **포스트 카드 디자인 (Threads 영감)**

#### 이중 언어 포스트 카드
```
┌─────────────────────────────┐
│ 👤 사용자명  • TOPIK 3급    │
│    2시간 전                  │
├─────────────────────────────┤
│ 🇺🇸 Original Text:          │
│ "I had a great day today..." │
│                             │
│ 🇰🇷 Korean Translation:     │
│ "오늘 정말 좋은 하루였어요"    │
│                             │
│ ⚠️  Need Correction         │
├─────────────────────────────┤
│ 💬 3 Comments  ❤️ 12       │
│ 🔄 Share      🔖 Save      │
└─────────────────────────────┘
```

#### 교정 댓글 카드
```
┌─────────────────────────────┐
│ 🎓 멘토 • TOPIK 6급         │
│                             │
│ ❌ "좋은 하루였어요"          │
│ ✅ "좋은 하루를 보냈어요"     │
│                             │
│ 📝 Explanation:             │
│ "과거 경험을 말할 때는       │
│  '-았/었-'을 사용해야..."    │
│                             │
│ 👍 Helpful (8)  💬 Reply    │
└─────────────────────────────┘
```

### 3. **음성 메시지 카드**

```
┌─────────────────────────────┐
│ 👤 사용자명 🎙️              │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🔊 ▶️  ∿∿∿∿∿∿∿ 0:45   │ │
│ │                       │ │
│ │ 📝 STT: "안녕하세요"    │ │
│ └─────────────────────────┘ │
│                             │
│ 🎯 발음 정확도: 85%         │
│ 💬 Voice Comments (3)       │
└─────────────────────────────┘
```

## 🧩 컴포넌트 디자인 명세

### 1. **BilingualPostCard**

#### 구조
```typescript
interface BilingualPostCardProps {
  post: BilingualPost;
  showCorrections?: boolean;
  onCorrect?: (postId: string) => void;
  onLike?: (postId: string) => void;
  onShare?: (postId: string) => void;
}
```

#### 스타일링
```scss
.bilingual-post-card {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700;
  @apply p-4 mb-4 transition-all duration-200 hover:shadow-md;
  
  .post-header {
    @apply flex items-center justify-between mb-3;
    
    .user-info {
      @apply flex items-center space-x-3;
      
      .avatar {
        @apply w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600;
      }
      
      .user-details {
        .username {
          @apply font-semibold text-gray-900 dark:text-gray-100;
        }
        .topik-level {
          @apply text-sm text-blue-600 dark:text-blue-400 font-medium;
        }
      }
    }
  }
  
  .content-section {
    @apply space-y-4;
    
    .original-text {
      @apply p-3 bg-gray-50 dark:bg-gray-700 rounded-lg;
      @apply border-l-4 border-gray-300 dark:border-gray-500;
      
      .language-flag {
        @apply text-sm font-medium text-gray-600 dark:text-gray-400 mb-2;
      }
      
      .text-content {
        @apply text-gray-800 dark:text-gray-200 leading-relaxed;
      }
    }
    
    .translated-text {
      @apply p-3 bg-green-50 dark:bg-green-900/20 rounded-lg;
      @apply border-l-4 border-green-400;
      
      .korean-text {
        @apply text-gray-800 dark:text-gray-200 leading-relaxed;
        font-family: 'Noto Sans KR', sans-serif;
      }
    }
  }
  
  .correction-needed {
    @apply flex items-center space-x-2 mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg;
    
    .icon {
      @apply text-orange-500;
    }
    
    .text {
      @apply text-sm text-orange-700 dark:text-orange-300;
    }
  }
  
  .action-bar {
    @apply flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700;
    
    .stats {
      @apply flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400;
    }
    
    .actions {
      @apply flex items-center space-x-3;
      
      .action-button {
        @apply p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
        @apply text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400;
      }
    }
  }
}
```

### 2. **CorrectionComment**

#### 구조
```typescript
interface CorrectionCommentProps {
  correction: CorrectionComment;
  onMarkHelpful?: (correctionId: string) => void;
  onReply?: (correctionId: string) => void;
}
```

#### 스타일링
```scss
.correction-comment {
  @apply bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-3;
  
  .mentor-header {
    @apply flex items-center space-x-3 mb-3;
    
    .mentor-badge {
      @apply bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200;
      @apply px-2 py-1 rounded-full text-xs font-medium;
    }
  }
  
  .correction-content {
    @apply space-y-3;
    
    .text-correction {
      @apply flex flex-col space-y-2;
      
      .incorrect-text {
        @apply line-through text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded;
      }
      
      .correct-text {
        @apply text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded font-medium;
      }
    }
    
    .explanation {
      @apply text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg;
      @apply border-l-4 border-blue-400;
    }
  }
  
  .correction-actions {
    @apply flex items-center justify-between mt-3 pt-3 border-t border-red-200 dark:border-red-800;
    
    .helpful-button {
      @apply flex items-center space-x-2 px-3 py-1 rounded-full;
      @apply bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300;
      @apply hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors;
    }
  }
}
```

### 3. **VoiceMessageCard**

#### 구조
```typescript
interface VoiceMessageCardProps {
  voiceData: VoiceComment;
  showTranscription?: boolean;
  showAccuracyScore?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}
```

#### 스타일링
```scss
.voice-message-card {
  @apply bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20;
  @apply border border-blue-200 dark:border-blue-800 rounded-xl p-4;
  
  .voice-player {
    @apply flex items-center space-x-4 mb-3;
    
    .play-button {
      @apply w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center;
      @apply text-white shadow-lg transition-all duration-200 hover:scale-105;
    }
    
    .waveform {
      @apply flex-1 h-8 flex items-end space-x-1;
      
      .wave-bar {
        @apply bg-blue-400 dark:bg-blue-500 rounded-full transition-all duration-200;
        &.active {
          @apply bg-blue-600 dark:bg-blue-300;
        }
      }
    }
    
    .duration {
      @apply text-sm text-gray-600 dark:text-gray-400 font-mono;
    }
  }
  
  .transcription {
    @apply bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700;
    
    .stt-text {
      @apply text-gray-800 dark:text-gray-200;
      font-family: 'Noto Sans KR', sans-serif;
    }
  }
  
  .accuracy-score {
    @apply flex items-center justify-between mt-3 p-2 bg-green-100 dark:bg-green-900/20 rounded-lg;
    
    .score-text {
      @apply text-green-700 dark:text-green-300 font-medium;
    }
    
    .score-bar {
      @apply flex-1 ml-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden;
      
      .score-fill {
        @apply h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500;
      }
    }
  }
}
```

## 📐 타이포그래피 시스템

### 폰트 패밀리
```css
/* 한국어 텍스트 */
.korean-text {
  font-family: 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif;
}

/* 영어 텍스트 */
.english-text {
  font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
}

/* 코드/monospace */
.mono-text {
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
}
```

### 텍스트 스케일 (Next.js Docs 스타일)
```scss
.text-scale {
  --text-xs: 0.75rem;    /* 12px - 메타데이터 */
  --text-sm: 0.875rem;   /* 14px - 라벨, 캡션 */
  --text-base: 1rem;     /* 16px - 본문 */
  --text-lg: 1.125rem;   /* 18px - 부제목 */
  --text-xl: 1.25rem;    /* 20px - 제목 */
  --text-2xl: 1.5rem;    /* 24px - 큰 제목 */
  --text-3xl: 1.875rem;  /* 30px - 페이지 제목 */
}

/* 한국어 텍스트 행간 조정 */
.korean-content {
  line-height: 1.7;      /* 한국어는 더 넓은 행간 */
}

/* 영어 텍스트 행간 */
.english-content {
  line-height: 1.6;
}
```

## 🎯 인터랙션 디자인

### 1. **마이크로 애니메이션**
```scss
/* 좋아요 버튼 애니메이션 */
.like-button {
  @apply transition-all duration-200;
  
  &:hover {
    @apply scale-110;
  }
  
  &.liked {
    @apply text-red-500;
    animation: heartbeat 0.6s ease-in-out;
  }
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* 교정 하이라이트 애니메이션 */
.correction-highlight {
  animation: highlightFade 2s ease-in-out;
}

@keyframes highlightFade {
  0% { background-color: rgba(239, 68, 68, 0.3); }
  100% { background-color: transparent; }
}
```

### 2. **로딩 상태**
```scss
.loading-skeleton {
  @apply bg-gray-200 dark:bg-gray-700 rounded animate-pulse;
  
  .post-skeleton {
    @apply space-y-3;
    
    .header-skeleton {
      @apply h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4;
    }
    
    .content-skeleton {
      @apply space-y-2;
      .line { @apply h-3 bg-gray-300 dark:bg-gray-600 rounded; }
      .line-short { @apply w-3/4; }
      .line-medium { @apply w-5/6; }
    }
  }
}
```

### 3. **모바일 제스처**
```typescript
// 스와이프 제스처 (React)
const SwipeablePostCard = ({ post, onSwipeLeft, onSwipeRight }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipeLeft(post.id),  // 다음 포스트
    onSwipedRight: () => onSwipeRight(post.id), // 좋아요
    trackMouse: true
  });
  
  return <div {...handlers} className="swipeable-post">...</div>;
};
```

## 📱 반응형 디자인

### 브레이크포인트
```scss
$breakpoints: (
  sm: 640px,   // 모바일
  md: 768px,   // 태블릿
  lg: 1024px,  // 데스크톱
  xl: 1280px   // 큰 데스크톱
);
```

### 반응형 레이아웃
```scss
.korean-sns-layout {
  @apply container mx-auto px-4;
  
  /* 모바일: 단일 컬럼 */
  @apply grid grid-cols-1 gap-4;
  
  /* 태블릿: 메인 + 사이드바 */
  @screen md {
    @apply grid-cols-3;
    
    .main-content { @apply col-span-2; }
    .sidebar { @apply col-span-1; }
  }
  
  /* 데스크톱: 3컬럼 레이아웃 */
  @screen lg {
    @apply grid-cols-4;
    
    .left-sidebar { @apply col-span-1; }
    .main-content { @apply col-span-2; }
    .right-sidebar { @apply col-span-1; }
  }
}
```

## ♿ 접근성 고려사항

### 1. **스크린 리더 지원**
```tsx
// 의미있는 ARIA 라벨
<button 
  aria-label="이 포스트에 좋아요 표시" 
  aria-pressed={isLiked}
  onClick={handleLike}
>
  <HeartIcon className={isLiked ? 'text-red-500' : 'text-gray-400'} />
  <span className="sr-only">좋아요 {likeCount}개</span>
</button>

// 교정 내용의 의미 전달
<div role="alert" aria-live="polite">
  <span className="sr-only">교정 제안:</span>
  <del aria-label="잘못된 표현">좋은 하루였어요</del>
  <ins aria-label="올바른 표현">좋은 하루를 보냈어요</ins>
</div>
```

### 2. **키보드 네비게이션**
```scss
.keyboard-navigation {
  /* 포커스 스타일 */
  .focus-visible\:ring-2 {
    @apply ring-blue-500 ring-offset-2;
  }
  
  /* 스킵 링크 */
  .skip-link {
    @apply absolute -top-40 left-6 bg-blue-600 text-white px-4 py-2 rounded;
    @apply focus:top-6 transition-all duration-200;
  }
}
```

### 3. **색상 대비**
모든 텍스트와 배경색의 대비비는 WCAG 2.1 AA 기준 (4.5:1) 이상을 준수합니다.

---

**이 UI/UX 디자인 가이드는 Meta Threads의 친숙한 소셜 경험과 Next.js Docs의 깔끔한 학습 환경을 결합하여, 한국어 학습자들이 편안하고 효과적으로 학습할 수 있는 인터페이스를 제공합니다.**