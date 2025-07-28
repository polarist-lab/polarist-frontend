'use client'

import { useParams, useRouter } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';

interface StudyCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  comingSoon?: boolean;
}

export default function HomePage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  const studyCategories: StudyCategory[] = [
    {
      id: 'roadmap',
      title: 'Learning Roadmap',
      description: 'Structured learning path with Iron 5 system and progressive lessons',
      icon: '🗺️',
      href: `/${validLocale}/roadmap`
    },
    {
      id: 'words',
      title: 'Vocabulary',
      description: 'Master Korean words with interactive flashcards and spaced repetition',
      icon: '📖',
      href: `/${validLocale}/study/words`
    },
    {
      id: 'sentences',
      title: 'Sentences',
      description: 'Practice with real Korean sentences and natural conversation patterns',
      icon: '💬',
      href: `/${validLocale}/study/sentences`,
      comingSoon: true
    },
    {
      id: 'grammar',
      title: 'Grammar',
      description: 'Understand Korean grammar patterns and sentence structures',
      icon: '📝',
      href: `/${validLocale}/study/grammar`,
      comingSoon: true
    },
    {
      id: 'iron5',
      title: 'Iron 5 Challenge',
      description: 'Complete the foundational Korean learning system',
      icon: '⚡',
      href: `/${validLocale}/iron5`
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Connect with other learners and share your progress',
      icon: '👥',
      href: `/${validLocale}/community`
    }
  ];

  const handleCategoryClick = (category: StudyCategory) => {
    if (category.comingSoon) {
      return; // Do nothing for coming soon categories
    }
    router.push(category.href);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Learn Korean
              <span className="block text-blue-600 dark:text-blue-400">Your Way</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Master Korean through structured learning paths, interactive practice, and a supportive community. 
              Start your journey from complete beginner to confident speaker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push(`/${validLocale}/roadmap`)}
                className="inline-flex items-center px-8 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">🚀</span>
                Start Learning
              </button>
              <button
                onClick={() => router.push(`/${validLocale}/community`)}
                className="inline-flex items-center px-8 py-3 rounded-lg text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 font-semibold transition-colors"
              >
                <span className="mr-2">👥</span>
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Each category is designed to help you master different aspects of Korean. 
            Pick what interests you most or follow our structured roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studyCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`
                group relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition-all duration-200
                ${category.comingSoon 
                  ? 'cursor-not-allowed opacity-60' 
                  : 'cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                }
              `}
            >
              {/* Coming Soon Badge */}
              {category.comingSoon && (
                <div className="absolute top-3 right-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-1 rounded">
                  Coming Soon
                </div>
              )}

              {/* Icon and Title */}
              <div className="flex items-start gap-4 mb-3">
                <div className="text-2xl">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {category.title}
                  </h3>
                </div>
                {!category.comingSoon && (
                  <svg 
                    className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Join Thousands of Korean Learners
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our community is growing every day with learners from around the world
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-400">Words Learned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">200+</div>
              <div className="text-gray-600 dark:text-gray-400">Lessons Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}