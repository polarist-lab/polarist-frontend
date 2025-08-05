'use client';

import { useState, useRef, useCallback } from 'react';
import { BilingualPost, KoreanLearnerProfile, PostCategory, Difficulty, Language, VoiceData } from '@/lib/korean-sns/types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { TopikBadge } from '../ui/Badge';
import { cn } from '@/lib/utils';

interface BilingualPostEditorProps {
  currentUser: KoreanLearnerProfile;
  locale?: string;
  editingPost?: BilingualPost;
  onSubmit?: (postData: Omit<BilingualPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  onSaveDraft?: (postData: Partial<BilingualPost>) => void;
  className?: string;
}

interface VoiceRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob?: Blob;
  audioUrl?: string;
}

export function BilingualPostEditor({
  currentUser,
  locale = 'en',
  editingPost,
  onSubmit,
  onCancel,
  onSaveDraft,
  className
}: BilingualPostEditorProps) {
  // Form state
  const [originalText, setOriginalText] = useState(editingPost?.originalText || '');
  const [translatedText, setTranslatedText] = useState(editingPost?.translatedText || '');
  const [category, setCategory] = useState<PostCategory>(editingPost?.category || 'daily-life');
  const [difficulty, setDifficulty] = useState<Difficulty>(editingPost?.difficulty || 'beginner');
  const [tags, setTags] = useState<string[]>(editingPost?.tags || []);
  const [needsCorrection, setNeedsCorrection] = useState(editingPost?.needsCorrection ?? true);
  const [currentTag, setCurrentTag] = useState('');
  
  // Voice recording state
  const [voiceRecording, setVoiceRecording] = useState<VoiceRecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState<'original' | 'translation'>('original');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Categories and difficulties
  const categories: { value: PostCategory; label: { ko: string; en: string } }[] = [
    { value: 'daily-life', label: { ko: '일상생활', en: 'Daily Life' } },
    { value: 'grammar', label: { ko: '문법', en: 'Grammar' } },
    { value: 'vocabulary', label: { ko: '어휘', en: 'Vocabulary' } },
    { value: 'culture', label: { ko: '문화', en: 'Culture' } },
    { value: 'pronunciation', label: { ko: '발음', en: 'Pronunciation' } },
    { value: 'business', label: { ko: '비즈니스', en: 'Business' } },
    { value: 'travel', label: { ko: '여행', en: 'Travel' } },
    { value: 'food', label: { ko: '음식', en: 'Food' } },
    { value: 'entertainment', label: { ko: '엔터테인먼트', en: 'Entertainment' } },
    { value: 'study-tips', label: { ko: '학습 팁', en: 'Study Tips' } },
    { value: 'other', label: { ko: '기타', en: 'Other' } }
  ];

  const difficulties: { value: Difficulty; label: { ko: string; en: string }; color: string }[] = [
    { value: 'beginner', label: { ko: '초급', en: 'Beginner' }, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { value: 'intermediate', label: { ko: '중급', en: 'Intermediate' }, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { value: 'advanced', label: { ko: '고급', en: 'Advanced' }, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
  ];

  // Voice recording functions
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setVoiceRecording(prev => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false
        }));
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setVoiceRecording(prev => ({ ...prev, isRecording: true, duration: 0 }));
      
      // Start timer
      timerRef.current = setInterval(() => {
        setVoiceRecording(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert(locale === 'ko' 
        ? '마이크 접근 권한이 필요합니다.' 
        : 'Microphone access is required for voice recording.'
      );
    }
  }, [locale]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const clearRecording = useCallback(() => {
    if (voiceRecording.audioUrl) {
      URL.revokeObjectURL(voiceRecording.audioUrl);
    }
    setVoiceRecording({
      isRecording: false,
      isPaused: false,
      duration: 0
    });
  }, [voiceRecording.audioUrl]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!originalText.trim()) {
      newErrors.originalText = locale === 'ko' 
        ? '원문을 입력해주세요.' 
        : 'Please enter your original text.';
    } else if (originalText.length < 10) {
      newErrors.originalText = locale === 'ko'
        ? '원문은 최소 10자 이상이어야 합니다.'
        : 'Original text must be at least 10 characters long.';
    }

    if (!translatedText.trim()) {
      newErrors.translatedText = locale === 'ko'
        ? '번역문을 입력해주세요.'
        : 'Please enter your Korean translation.';
    } else if (translatedText.length < 5) {
      newErrors.translatedText = locale === 'ko'
        ? '번역문은 최소 5자 이상이어야 합니다.'
        : 'Translation must be at least 5 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Tag management
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const voiceData: VoiceData | undefined = voiceRecording.audioBlob ? {
        id: Date.now().toString(),
        audioUrl: voiceRecording.audioUrl || '',
        duration: voiceRecording.duration,
        transcription: translatedText, // Use translation as transcription for now
        accuracyScore: 0, // Will be calculated by backend
        waveformData: [],
        language: 'ko',
        isProcessing: false,
        uploadedAt: new Date()
      } : undefined;

      const postData: Omit<BilingualPost, 'id' | 'createdAt' | 'updatedAt'> = {
        authorId: currentUser.id,
        author: currentUser,
        originalText: originalText.trim(),
        originalLanguage: 'en',
        translatedText: translatedText.trim(),
        translatedLanguage: 'ko',
        category,
        difficulty,
        tags,
        needsCorrection,
        likes: 0,
        comments: 0,
        shares: 0,
        bookmarks: 0,
        views: 0,
        isLikedByUser: false,
        isBookmarkedByUser: false,
        corrections: [],
        publishedAt: new Date(),
        isPublished: true,
        voiceData
      };

      onSubmit?.(postData);
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    const draftData: Partial<BilingualPost> = {
      originalText: originalText.trim(),
      translatedText: translatedText.trim(),
      category,
      difficulty,
      tags,
      needsCorrection,
      isPublished: false
    };
    onSaveDraft?.(draftData);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("bilingual-post-editor", className)}>
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={currentUser.avatar}
              alt={currentUser.displayName}
              fallback={currentUser.displayName}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {currentUser.displayName}
                </span>
                <TopikBadge level={currentUser.topikLevel} size="sm" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {locale === 'ko' ? '새 포스트 작성' : 'Creating new post'}
              </p>
            </div>
          </div>
          
          {!showPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
            >
              {locale === 'ko' ? '미리보기' : 'Preview'}
            </Button>
          )}
        </div>

        {showPreview ? (
          /* Preview Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {locale === 'ko' ? '포스트 미리보기' : 'Post Preview'}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                {locale === 'ko' ? '편집 계속' : 'Continue Editing'}
              </Button>
            </div>
            
            <div className="korean-post-card">
              <div className="original-text-section">
                <div className="original-text-label">
                  {locale === 'ko' ? '원문 (영어)' : 'Original (English)'}
                </div>
                <p className="original-text">
                  {originalText || (locale === 'ko' ? '원문을 입력해주세요...' : 'Enter your original text...')}
                </p>
              </div>
              
              <div className="translation-text-section">
                <div className="translation-text-label">
                  {locale === 'ko' ? '번역 (한국어)' : 'Translation (Korean)'}
                </div>
                <p className="translation-text">
                  {translatedText || (locale === 'ko' ? '번역문을 입력해주세요...' : 'Enter your Korean translation...')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Editor Mode */
          <>
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('original')}
                className={cn(
                  "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors",
                  activeTab === 'original'
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                {locale === 'ko' ? '1. 원문 (영어)' : '1. Original (English)'}
              </button>
              <button
                onClick={() => setActiveTab('translation')}
                className={cn(
                  "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors",
                  activeTab === 'translation'
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                {locale === 'ko' ? '2. 번역 (한국어)' : '2. Translation (Korean)'}
              </button>
            </div>

            {/* Content Tabs */}
            {activeTab === 'original' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {locale === 'ko' 
                      ? '영어로 자신의 생각을 자유롭게 표현해보세요' 
                      : 'Express your thoughts freely in English'
                    }
                  </label>
                  <textarea
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    placeholder={locale === 'ko'
                      ? "예: I had a wonderful day today! I went to a Korean cafe with my friends..."
                      : "e.g., I had a wonderful day today! I went to a Korean cafe with my friends..."
                    }
                    className={cn(
                      "w-full p-4 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-korean-primary focus:border-transparent resize-none",
                      errors.originalText ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    )}
                    rows={6}
                  />
                  {errors.originalText && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.originalText}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {originalText.length} {locale === 'ko' ? '자' : 'characters'}
                  </div>
                  <Button
                    onClick={() => setActiveTab('translation')}
                    disabled={!originalText.trim()}
                  >
                    {locale === 'ko' ? '다음: 한국어 번역' : 'Next: Korean Translation'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {locale === 'ko'
                      ? '위의 영어 문장을 한국어로 번역해보세요'
                      : 'Translate the above English text into Korean'
                    }
                  </label>
                  <textarea
                    value={translatedText}
                    onChange={(e) => setTranslatedText(e.target.value)}
                    placeholder={locale === 'ko'
                      ? "예: 오늘 정말 좋은 하루였어요! 친구들과 한국 카페에 가서..."
                      : "e.g., 오늘 정말 좋은 하루였어요! 친구들과 한국 카페에 가서..."
                    }
                    className={cn(
                      "w-full p-4 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-korean-primary focus:border-transparent resize-none",
                      errors.translatedText ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    )}
                    rows={6}
                  />
                  {errors.translatedText && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.translatedText}
                    </p>
                  )}
                </div>

                {/* Voice Recording */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {locale === 'ko' ? '발음 연습 (선택사항)' : 'Pronunciation Practice (Optional)'}
                    </label>
                    {voiceRecording.duration > 0 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDuration(voiceRecording.duration)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {!voiceRecording.isRecording && !voiceRecording.audioUrl ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startRecording}
                        leftIcon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m0 0V5a2 2 0 012-2h10a2 2 0 012 2v6a7 7 0 01-7 7z" />
                          </svg>
                        }
                      >
                        {locale === 'ko' ? '녹음 시작' : 'Start Recording'}
                      </Button>
                    ) : voiceRecording.isRecording ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={stopRecording}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        leftIcon={
                          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                        }
                      >
                        {locale === 'ko' ? '녹음 중지' : 'Stop Recording'}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <audio
                          src={voiceRecording.audioUrl}
                          controls
                          className="h-8"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearRecording}
                          className="text-red-600 hover:text-red-700"
                        >
                          {locale === 'ko' ? '삭제' : 'Delete'}
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {locale === 'ko'
                      ? '한국어 번역문을 소리내어 읽어보세요. 다른 학습자들이 발음을 도와줄 수 있습니다.'
                      : 'Read your Korean translation aloud. Other learners can help with pronunciation.'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Post Settings */}
            <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              {/* Category and Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {locale === 'ko' ? '카테고리' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PostCategory)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-korean-primary focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label[locale as 'ko' | 'en']}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {locale === 'ko' ? '난이도' : 'Difficulty Level'}
                  </label>
                  <div className="flex gap-2">
                    {difficulties.map((diff) => (
                      <button
                        key={diff.value}
                        onClick={() => setDifficulty(diff.value)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          difficulty === diff.value
                            ? diff.color
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                      >
                        {diff.label[locale as 'ko' | 'en']}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {locale === 'ko' ? '태그 (최대 5개)' : 'Tags (up to 5)'}
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-korean-primary/10 text-korean-primary rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-korean-primary hover:text-korean-primary/70"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                {tags.length < 5 && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder={locale === 'ko' ? '태그 입력...' : 'Enter tag...'}
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-korean-primary focus:border-transparent"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addTag}
                      disabled={!currentTag.trim() || tags.includes(currentTag.trim())}
                    >
                      {locale === 'ko' ? '추가' : 'Add'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Request Correction */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="needsCorrection"
                  checked={needsCorrection}
                  onChange={(e) => setNeedsCorrection(e.target.checked)}
                  className="w-4 h-4 text-korean-primary focus:ring-korean-primary border-gray-300 rounded"
                />
                <label htmlFor="needsCorrection" className="text-sm text-gray-700 dark:text-gray-300">
                  {locale === 'ko'
                    ? '멘토들에게 교정을 요청합니다 (추천)'
                    : 'Request corrections from mentors (recommended)'
                  }
                </label>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              {locale === 'ko' ? '임시저장' : 'Save Draft'}
            </Button>
            {onCancel && (
              <Button
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {locale === 'ko' ? '취소' : 'Cancel'}
              </Button>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !originalText.trim() || !translatedText.trim()}
            isLoading={isSubmitting}
          >
            {isSubmitting
              ? (locale === 'ko' ? '게시 중...' : 'Publishing...')
              : (locale === 'ko' ? '게시하기' : 'Publish Post')
            }
          </Button>
        </div>
      </Card>
    </div>
  );
}