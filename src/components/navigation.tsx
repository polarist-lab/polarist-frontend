'use client'

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from '@/lib/i18n';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import AuthStatus from '@/components/auth/auth-status';
import { TierDisplay } from '@/components/tier-display';

export function Navigation() {
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  // Determine current page based on pathname
  const isStudyPage = pathname === `/${validLocale}` || pathname.includes('/study');
  const isCommunityPage = pathname.includes('/community');
  const isProgressPage = pathname === `/${validLocale}/progress`;
  const isRankingPage = pathname.includes('/ranking');

  return (
    <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20 sticky top-0 z-50 transition-colors duration-200 supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-black/60">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 h-20">
        {/* Left: Polarist Logo */}
        <div className="flex items-center">
          <Link 
            href={`/${validLocale}`}
            className="text-xl font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer"
          >
            Polarist
          </Link>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="flex space-x-8">
          <Link 
            href={`/${validLocale}`}
            className={`relative py-2 font-medium transition-all duration-200 cursor-pointer ${
              isStudyPage 
                ? 'text-gray-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900 dark:after:bg-white' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('common.study')}
          </Link>
          
          <Link 
            href={`/${validLocale}/community`}
            className={`relative py-2 font-medium transition-all duration-200 cursor-pointer ${
              isCommunityPage 
                ? 'text-gray-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900 dark:after:bg-white' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('common.community')}
          </Link>

          <Link 
            href={`/${validLocale}/progress`}
            className={`relative py-2 font-medium transition-all duration-200 cursor-pointer ${
              isProgressPage 
                ? 'text-gray-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900 dark:after:bg-white' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('common.progress')}
          </Link>

          <Link 
            href={`/${validLocale}/ranking`}
            className={`relative py-2 font-medium transition-all duration-200 cursor-pointer ${
              isRankingPage 
                ? 'text-gray-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900 dark:after:bg-white' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('common.ranking')}
          </Link>
        </div>

        {/* Right: Auth Status */}
        <div className="flex items-center gap-4 h-full">
          <AuthStatus />
        </div>
      </div>
    </nav>
  );
}
