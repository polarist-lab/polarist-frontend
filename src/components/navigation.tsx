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
    <nav className="bg-[var(--color-background)]/80 dark:bg-[var(--color-background-dark)]/80 backdrop-blur-md border-b border-[var(--color-border)]/20 dark:border-[var(--color-border-dark)]/20 sticky top-0 z-50 transition-colors duration-200 supports-[backdrop-filter]:bg-[var(--color-background)]/60 supports-[backdrop-filter]:dark:bg-[var(--color-background-dark)]/60">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 h-20">
        {/* Left: Polarist Logo */}
        <div className="flex items-center">
          <Link 
            href={`/${validLocale}`}
            className="text-xl font-semibold text-[var(--color-foreground)] dark:text-[var(--color-foreground-dark)] hover:text-[var(--color-foreground-secondary)] dark:hover:text-[var(--color-foreground-secondary-dark)] transition-colors duration-200 cursor-pointer"
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
                ? 'text-[var(--color-foreground)] dark:text-[var(--color-foreground-dark)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--color-foreground)] dark:after:bg-[var(--color-foreground-dark)]' 
                : 'text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)] hover:text-[var(--color-foreground)] dark:hover:text-[var(--color-foreground-dark)]'
            }`}
          >
            {t('common.study')}
          </Link>
          
          <Link 
            href={`/${validLocale}/community`}
            className={`relative py-2 font-medium transition-all duration-200 cursor-pointer ${
              isCommunityPage 
                ? 'text-[var(--color-foreground)] dark:text-[var(--color-foreground-dark)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--color-foreground)] dark:after:bg-[var(--color-foreground-dark)]' 
                : 'text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)] hover:text-[var(--color-foreground)] dark:hover:text-[var(--color-foreground-dark)]'
            }`}
          >
            {t('common.community')}
          </Link>

          <Link 
            href={`/${validLocale}/progress`}
            className={`relative py-2 font-medium transition-all duration-200 cursor-pointer ${
              isProgressPage 
                ? 'text-[var(--color-foreground)] dark:text-[var(--color-foreground-dark)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--color-foreground)] dark:after:bg-[var(--color-foreground-dark)]' 
                : 'text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)] hover:text-[var(--color-foreground)] dark:hover:text-[var(--color-foreground-dark)]'
            }`}
          >
            {t('common.progress')}
          </Link>

          <Link 
            href={`/${validLocale}/ranking`}
            className={`relative py-2 font-medium transition-all duration-200 cursor-pointer ${
              isRankingPage 
                ? 'text-[var(--color-foreground)] dark:text-[var(--color-foreground-dark)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--color-foreground)] dark:after:bg-[var(--color-foreground-dark)]' 
                : 'text-[var(--color-foreground-secondary)] dark:text-[var(--color-foreground-secondary-dark)] hover:text-[var(--color-foreground)] dark:hover:text-[var(--color-foreground-dark)]'
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
