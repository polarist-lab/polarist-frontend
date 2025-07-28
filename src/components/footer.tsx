'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { ThemeToggle } from './theme/theme-toggle';

export function Footer() {
  const params = useParams();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: Brand and Links */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Link 
              href={`/${validLocale}`}
              className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200"
            >
              Polarist
            </Link>
            
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <Link 
                href={`/${validLocale}/about`}
                className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                {t('footer.about') || 'About'}
              </Link>
              <Link 
                href={`/${validLocale}/privacy`}
                className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                {t('footer.privacy') || 'Privacy'}
              </Link>
              <Link 
                href={`/${validLocale}/terms`}
                className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                {t('footer.terms') || 'Terms'}
              </Link>
              <Link 
                href={`/${validLocale}/contact`}
                className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                {t('footer.contact') || 'Contact'}
              </Link>
            </div>
          </div>

          {/* Right: Theme Toggle and Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ThemeToggle />
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Polarist. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}