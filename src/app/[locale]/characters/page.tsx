'use client';

import { useParams, useRouter } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { CharacterOverview } from '@/components/character-overview';

export default function CharactersIndexPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  const handleLessonSelect = (lessonId: string) => {
    router.push(`/${validLocale}/characters/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push(`/${validLocale}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>

      {/* Content */}
      <CharacterOverview 
        locale={validLocale}
        onLessonSelect={handleLessonSelect}
      />
    </div>
  );
}