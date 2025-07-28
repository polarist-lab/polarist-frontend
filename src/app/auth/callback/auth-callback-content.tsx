'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { useTranslations } from '@/lib/i18n';
import { Locale } from '@/lib/i18n/config';
import { usersAPI } from '@/lib/api';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetchUser } = useAuth();
  const { t } = useTranslations('en' as Locale); // Default to English for callback page since we don't have locale in URL
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuth = async () => {
      const token = searchParams.get('token');
      const state = searchParams.get('state');
      
      if (!token) {
        setError('Authentication token is missing');
        setTimeout(() => router.push('/'), 2000);
        return;
      }

      try {
        // Parse state parameter to determine signup vs signin
        let authMode = 'signin'; // default
        if (state) {
          try {
            const decodedState = decodeURIComponent(state);
            const modeMatch = decodedState.match(/mode=(\w+)/);
            if (modeMatch) {
              authMode = modeMatch[1];
            }
          } catch (e) {
            console.log('Could not parse state parameter:', state);
          }
        }

        // Show different messages based on auth mode
        const processingMessage = authMode === 'signup' ? t('auth.signupProcessing') : t('auth.signinProcessing');
        setStatus(processingMessage);
        
        // Store token
        localStorage.setItem('auth_token', token);
        
        // Add a small delay to show the loading message
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const completeMessage = authMode === 'signup' ? t('auth.signupComplete') : t('auth.signinComplete');
        setStatus(completeMessage);
        
        // Refetch user in provider (this will call usersAPI.getMe internally)
        await refetchUser();
        
        // Navigate after a brief success message
        setTimeout(() => {
          router.push('/');
        }, 500);
        
      } catch (error) {
        console.error('Auth callback error:', error);
        setError(t('auth.authError'));
        localStorage.removeItem('auth_token');
        setTimeout(() => router.push('/'), 3000);
      }
    };

    processAuth();
  }, [searchParams, refetchUser, router, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-sm">
        {!error && (
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
        )}
        {error && (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-red-500 text-sm">✗</span>
          </div>
        )}
        <p className="text-gray-500 text-sm">
          {error || status}
        </p>
      </div>
    </div>
  );
}