'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { SentenceDeck } from '@/components/sentence-deck';
import { ContentManager } from '@/lib/content-manager';
import { getSentencesByPresetId } from '@/data/sentence-presets';
import { LearningContent, SentenceMetadata, KoreanSentence } from '@/lib/types';
import { LearningTracker } from '@/lib/learning-tracker';

export default function SentencesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const sentenceId = params?.id as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  const [content, setContent] = useState<LearningContent | null>(null);
  const [sentences, setSentences] = useState<KoreanSentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSentenceContent = async () => {
      setLoading(true);
      setError(null);

      try {
        // 콘텐츠 정보 로드
        const contentData = ContentManager.getContentById(sentenceId);
        
        if (!contentData) {
          setError('Sentence collection not found');
          return;
        }

        if (contentData.type !== 'sentence') {
          setError('Invalid content type');
          return;
        }

        setContent(contentData);

        // 문장 데이터 로드
        const sentenceData = getSentencesByPresetId(sentenceId);
        
        if (sentenceData.length === 0) {
          setError('No sentences found for this collection');
          return;
        }

        setSentences(sentenceData);

        // 콘텐츠 시작 기록
        const metadata = contentData.metadata as SentenceMetadata;
        LearningTracker.startContent(
          sentenceId, 
          'sentence', 
          metadata.sentenceCount || sentenceData.length
        );

      } catch (err) {
        console.error('Failed to load sentence content:', err);
        setError('Failed to load sentences');
      } finally {
        setLoading(false);
      }
    };

    if (sentenceId) {
      loadSentenceContent();
    }
  }, [sentenceId]);

  const handleProgress = (current: number, total: number) => {
    // 진도율 업데이트 로직은 SentenceDeck에서 처리됨
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sentences...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4 opacity-50">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push(`/${validLocale}`)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => router.push(`/${validLocale}`)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-3xl">{content.icon || '💬'}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{content.title}</h1>
                  <p className="text-gray-600 text-sm">{content.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  📚 {sentences.length} sentences
                </span>
                <span className="flex items-center gap-1">
                  ⏱️ {content.estimatedDuration} min
                </span>
                <span className={`px-2 py-1 rounded-full text-xs border ${
                  content.difficulty === 'absolute-beginner' ? 'bg-green-100 text-green-700 border-green-200' :
                  content.difficulty === 'beginner' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                  content.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                  content.difficulty === 'advanced' ? 'bg-red-100 text-red-700 border-red-200' :
                  'bg-purple-100 text-purple-700 border-purple-200'
                }`}>
                  {content.difficulty}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {content.authorType === 'official' ? '🏢 Official' : 
                 content.authorType === 'community' ? '👥 Community' : '👤 User'}
              </div>
              {content.categories && content.categories.length > 0 && (
                <div className="text-xs text-gray-400 mt-1">
                  🏷️ {content.categories.slice(0, 2).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SentenceDeck
          sentences={sentences}
          onProgress={handleProgress}
          locale={validLocale}
          contentId={sentenceId}
        />
      </div>

      {/* Grammar Focus Info */}
      {content.metadata && (content.metadata as SentenceMetadata).grammarFocus && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              🎯 Grammar Focus in this Collection
            </h3>
            <div className="flex flex-wrap gap-2">
              {(content.metadata as SentenceMetadata).grammarFocus.map((grammar, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800"
                >
                  {grammar.replace('-', ' ')}
                </span>
              ))}
            </div>
            <p className="text-green-700 text-sm mt-3">
              Pay attention to these grammar patterns as you practice the sentences.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}