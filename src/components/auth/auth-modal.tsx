'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from '@/lib/i18n';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import AuthProviderCard from './auth-provider-card';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'signup' | 'signin';
  onClose: () => void;
}

export default function AuthModal({ isOpen, mode, onClose }: AuthModalProps) {
  const params = useParams();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogleAuth = () => {
    // Updated URLs for signin/signup endpoints
    const endpoint = mode === 'signup' ? '/auth/google/signup' : '/auth/google/signin';
    window.location.href = `http://localhost:4000${endpoint}`;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const subtitle = mode === 'signup' 
    ? t('auth.signupSubtitle')
    : t('auth.signinSubtitle');

  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('auth.welcome')}
            </h2>
            <p className="text-gray-600 text-sm">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Auth Providers */}
        <div className="px-8 py-6 space-y-4">
          <AuthProviderCard
            provider="google"
            enabled={true}
            onClick={handleGoogleAuth}
          />
          
          <AuthProviderCard
            provider="apple"
            enabled={false}
            comingSoon={true}
          />
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-medium hover:opacity-80 cursor-pointer transition-all duration-200"
          >
            {t('auth.cancel')}
          </button>
        </div>

        {/* Close button (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center hover:opacity-80 cursor-pointer transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}