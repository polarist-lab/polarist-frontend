'use client';

import { useAuth } from './auth-provider';
import AuthModal from './auth-modal';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from '@/lib/i18n';
import { Locale } from '@/lib/i18n/config';

export default function AuthStatus() {
  const { user, loading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signin');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale;
  const { t } = useTranslations(locale);

  // Debug logs
  console.log('AuthStatus: user:', user);
  console.log('AuthStatus: loading:', loading);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    );
  }

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        {/* Profile Avatar Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hover:opacity-80 cursor-pointer transition-all duration-200"
        >
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          )}
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            {/* User Info Section */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  // Navigate to profile/settings page in the future
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:opacity-80 cursor-pointer transition-all duration-200 flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t('auth.profile')}
              </button>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  // Navigate to progress page
                  window.location.href = '/progress';
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:opacity-80 cursor-pointer transition-all duration-200 flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {t('auth.learningProgress')}
              </button>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  // Navigate to settings page in the future
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:opacity-80 cursor-pointer transition-all duration-200 flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('auth.settings')}
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

            {/* Logout */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:opacity-80 cursor-pointer transition-all duration-200 flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t('auth.logout')}
            </button>
          </div>
        )}
      </div>
    );
  }

  const handleSignUp = () => {
    const locale = params?.locale || 'en';
    router.push(`/${locale}/signup`);
  };

  const handleSignIn = () => {
    const locale = params?.locale || 'en';
    router.push(`/${locale}/signin`);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    // Navigate back to home when closing modal
    const locale = params?.locale || 'en';
    router.push(`/${locale}`);
  };

  // Non-authenticated state - Show Sign up / Sign in buttons
  return (
    <>
      <div className="flex items-center gap-6">
        <button
          onClick={handleSignUp}
          className="text-sm font-medium text-primary dark:text-blue-400 hover:text-primary-dark dark:hover:text-blue-300 hover:opacity-80 cursor-pointer transition-all duration-200"
        >
          {t('common.signUp') || 'Sign up'}
        </button>
        <button
          onClick={handleSignIn}
          className="text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 hover:opacity-80 cursor-pointer transition-all duration-200"
        >
          {t('common.signIn') || 'Sign in'}
        </button>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={closeAuthModal}
      />
    </>
  );
}