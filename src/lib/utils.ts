// Simple className utility without external dependencies
export function cn(...inputs: Array<string | undefined | null | false>): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatRelativeTime(date: Date, locale: string = 'en'): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return locale === 'ko' ? '방금 전' : 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return locale === 'ko' ? `${diffInMinutes}분 전` : `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return locale === 'ko' ? `${diffInHours}시간 전` : `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return locale === 'ko' ? `${diffInDays}일 전` : `${diffInDays}d ago`;
  }
  
  // For older dates, show the actual date
  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: diffInDays > 365 ? 'numeric' : undefined
  }).format(date);
}

export function getTopikLevelColor(level: number): string {
  const colors = {
    1: 'topik-1',
    2: 'topik-2', 
    3: 'topik-3',
    4: 'topik-4',
    5: 'topik-5',
    6: 'topik-6'
  };
  return colors[level as keyof typeof colors] || 'topik-1';
}

export function getTopikLevelName(level: number, locale: string = 'en'): string {
  const names = {
    1: { ko: 'TOPIK 1급', en: 'TOPIK Level 1' },
    2: { ko: 'TOPIK 2급', en: 'TOPIK Level 2' },
    3: { ko: 'TOPIK 3급', en: 'TOPIK Level 3' },
    4: { ko: 'TOPIK 4급', en: 'TOPIK Level 4' },
    5: { ko: 'TOPIK 5급', en: 'TOPIK Level 5' },
    6: { ko: 'TOPIK 6급', en: 'TOPIK Level 6' }
  };
  
  return names[level as keyof typeof names]?.[locale as 'ko' | 'en'] || 'TOPIK Level 1';
}

export function getCorrectionTypeLabel(type: string, locale: string = 'en'): string {
  const labels = {
    grammar: { ko: '문법', en: 'Grammar' },
    vocabulary: { ko: '어휘', en: 'Vocabulary' },
    pronunciation: { ko: '발음', en: 'Pronunciation' },
    'natural-expression': { ko: '자연스러운 표현', en: 'Natural Expression' },
    spacing: { ko: '띄어쓰기', en: 'Spacing' }
  };
  
  return labels[type as keyof typeof labels]?.[locale as 'ko' | 'en'] || type;
}