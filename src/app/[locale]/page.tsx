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
      title: t('home.learningRoadmap'),
      description: t('home.learningRoadmapDesc'),
      icon: '🗺️',
      href: `/${validLocale}/roadmap`
    },
    {
      id: 'words',
      title: t('home.vocabulary'),
      description: t('home.vocabularyDesc'),
      icon: '📖',
      href: `/${validLocale}/study/vocabulary`
    },
    {
      id: 'sentences',
      title: t('home.sentences'),
      description: t('home.sentencesDesc'),
      icon: '💬',
      href: `/${validLocale}/study/sentences`
    },
    {
      id: 'grammar',
      title: t('home.grammar'),
      description: t('home.grammarDesc'),
      icon: '📝',
      href: `/${validLocale}/study/grammar`,
      comingSoon: true
    },
    {
      id: 'iron5',
      title: t('home.iron5Challenge'),
      description: t('home.iron5ChallengeDesc'),
      icon: '⚡',
      href: `/${validLocale}/iron5`
    },
    {
      id: 'community',
      title: t('home.community'),
      description: t('home.communityDesc'),
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
    <div className="min-h-screen bg-[var(--color-background-secondary)] dark:bg-[var(--color-background-secondary-dark)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[var(--color-background)] dark:bg-[var(--color-background-dark)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-background-secondary)] to-[var(--color-background-tertiary)] dark:from-[var(--color-background-dark)] dark:to-[var(--color-background-secondary-dark)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-foreground)] dark:text-[var(--color-foreground-dark)] mb-6">
              {t('home.heroTitle')}
              <span className="block text-[var(--color-link)] dark:text-[var(--color-link-dark)]">{t('home.heroSubtitle')}</span>
            </h1>
            <p className="text-xl text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)] max-w-3xl mx-auto mb-8">
              {t('home.heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push(`/${validLocale}/roadmap`)}
                className="inline-flex items-center px-8 py-3 rounded-lg text-white bg-[var(--color-link)] hover:bg-[var(--color-primary-dark)] font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">🚀</span>
                {t('home.startLearning')}
              </button>
              <button
                onClick={() => router.push(`/${validLocale}/community`)}
                className="inline-flex items-center px-8 py-3 rounded-lg text-[var(--color-link)] dark:text-[var(--color-link-dark)] bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] hover:bg-[var(--color-card-hover)] dark:hover:bg-[var(--color-card-hover-dark)] font-semibold transition-colors"
              >
                <span className="mr-2">👥</span>
                {t('home.joinCommunity')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] dark:text-[var(--color-foreground-dark)] mb-4">
            {t('home.chooseYourPath')}
          </h2>
          <p className="text-lg text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)] max-w-2xl mx-auto">
            {t('home.pathDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studyCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`
                group relative rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] p-6 transition-all duration-200
                ${category.comingSoon 
                  ? 'cursor-not-allowed opacity-60' 
                  : 'cursor-pointer hover:border-[var(--color-border)] dark:hover:border-[var(--color-border-dark)] hover:shadow-md hover:bg-[var(--color-card-hover)] dark:hover:bg-[var(--color-card-hover-dark)]'
                }
              `}
            >
              {/* Coming Soon Badge */}
              {category.comingSoon && (
                <div className="absolute top-3 right-3 bg-[var(--color-background-secondary)] dark:bg-[var(--color-background-secondary-dark)] text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)] text-xs font-medium px-2 py-1 rounded">
                  {t('home.comingSoon')}
                </div>
              )}

              {/* Icon and Title */}
              <div className="flex items-start gap-4 mb-3">
                <div className="text-2xl">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--color-foreground)] dark:text-[var(--color-foreground-dark)] mb-1">
                    {category.title}
                  </h3>
                </div>
                {!category.comingSoon && (
                  <svg 
                    className="w-5 h-5 text-[var(--color-foreground-muted)] dark:text-[var(--color-foreground-muted-dark)] transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)] leading-relaxed">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-[var(--color-foreground)] dark:text-[var(--color-foreground-dark)] mb-4">
              {t('home.joinThousands')}
            </h3>
            <p className="text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)]">
              {t('home.communityGrowing')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-link)] dark:text-[var(--color-link-dark)] mb-2">10K+</div>
              <div className="text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)]">{t('home.activeLearners')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50K+</div>
              <div className="text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)]">{t('home.wordsLearned')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">200+</div>
              <div className="text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)]">{t('home.lessonsAvailable')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">98%</div>
              <div className="text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)]">{t('home.successRate')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}