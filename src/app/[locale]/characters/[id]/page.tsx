'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { CharacterDeck } from '@/components/character-deck';
import { HangulStory } from '@/components/hangul-story';
import { ALL_CONTENT_PRESETS } from '@/data/content-presets';
import { LearningContent } from '@/lib/types';
import { LearningTracker } from '@/lib/learning-tracker';

export default function CharacterLearningPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const characterId = params?.id as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  const [content, setContent] = useState<LearningContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !characterId) return;
    
    const loadCharacterContent = () => {
      setLoading(true);
      setError(null);

      try {
        // 프리셋에서 직접 찾기 (클라이언트 사이드 전용)
        const contentData = ALL_CONTENT_PRESETS.find(c => c.id === characterId);
        
        if (!contentData) {
          setError('Character learning content not found');
          return;
        }

        if (contentData.type !== 'character') {
          setError('Invalid content type - expected character learning');
          return;
        }

        setContent(contentData);

      } catch (err) {
        console.error('Failed to load character content:', err);
        setError('Failed to load character learning content');
      } finally {
        setLoading(false);
      }
    };

    loadCharacterContent();
  }, [characterId, mounted]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading character learning...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4 opacity-50">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Character Learning Not Found
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
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/${validLocale}/characters`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Character Overview
            </button>
            <button
              onClick={() => router.push(`/${validLocale}`)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {content.id === 'hangul-story-introduction' ? (
          <HangulStory 
            locale={validLocale}
            onComplete={() => {
              // Mark content as complete and navigate to next step
              LearningTracker.completeContent(content.id);
              router.push(`/${validLocale}/characters/characters-basic-vowels-grouped`);
            }}
          />
        ) : (
          <CharacterDeck 
            content={content} 
            locale={validLocale}
          />
        )}
      </div>
    </div>
  );
}