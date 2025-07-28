'use client'

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { ThreadedRoadmap } from '@/components/threaded-roadmap';
import { MembershipBenefitsBanner } from '@/components/membership-benefits-banner';
import { AppInitializer } from '@/lib/app-initializer';
import { NaturalSignupManager } from '@/lib/natural-signup-manager';

type ViewState = 'loading' | 'threaded-roadmap';

export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);
  
  const [currentView, setCurrentView] = useState<ViewState>('loading');
  const [showMembershipBanner, setShowMembershipBanner] = useState(false);
  const [signupPrompt, setSignupPrompt] = useState<{type: string; message: string} | null>(null);

  // 앱 초기화
  useEffect(() => {
    const initializeApp = async () => {
      AppInitializer.initialize();
      
      // Thread 스타일 로드맵 화면으로 이동
      setCurrentView('threaded-roadmap');

      // 가입 여부에 따라 배너 표시
      if (NaturalSignupManager.isSignedUp()) {
        setShowMembershipBanner(false);
      }

      // 자연스러운 가입 제안 확인
      const prompt = NaturalSignupManager.shouldShowSignupPrompt();
      if (prompt) {
        setSignupPrompt(prompt);
      }
    };

    initializeApp();
  }, []);

  // 가입 제안 체크 (주기적)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!NaturalSignupManager.isSignedUp()) {
        const prompt = NaturalSignupManager.shouldShowSignupPrompt();
        if (prompt) {
          setSignupPrompt(prompt);
        }
      }
    }, 60000); // 1분마다 체크

    return () => clearInterval(interval);
  }, []);

  // 카테고리 선택 처리
  const handleCategorySelect = (categoryType: string, contentId?: string) => {
    NaturalSignupManager.updateProgress(1, 5); // 1레슨, 5분 추가
    
    // 실제 네비게이션 수행 - Next.js Router 방식
    let targetUrl = '';
    
    switch (categoryType) {
      case 'character':
        targetUrl = `/${validLocale}/characters`;
        break;
      case 'wordbook':
        targetUrl = `/${validLocale}/wordbooks/wordbook-absolute-beginner`;
        break;
      case 'sentence':
        targetUrl = `/${validLocale}/sentences/sentences-greetings-basic`;
        break;
      case 'grammar':
        targetUrl = `/${validLocale}/grammars/grammar-basic-particles`;
        break;
      default:
        console.warn('Unknown category type:', categoryType);
        return;
    }
    
    if (targetUrl) {
      router.push(targetUrl);
    }
  };

  // 가입 처리
  const handleSignup = () => {
    // 실제 가입 로직 구현 필요
    console.log('가입 처리');
    NaturalSignupManager.markAsSignedUp();
    setShowMembershipBanner(false);
    setSignupPrompt(null);
  };

  // 나중에 가입 처리  
  const handleLaterSignup = () => {
    setShowMembershipBanner(false);
  };

  // 가입 제안 처리
  const handlePromptSignup = () => {
    handleSignup();
  };

  const handlePromptDismiss = () => {
    setSignupPrompt(null);
  };

  const handleBackToHome = () => {
    router.push(`/${validLocale}`);
  };

  // 뷰 상태에 따른 렌더링
  const renderCurrentView = () => {
    switch (currentView) {
      case 'loading':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        );

      case 'threaded-roadmap':
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <button
                      onClick={handleBackToHome}
                      className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-2"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Home
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      🗺️ Learning Roadmap
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* 회원가입 혜택 배너 */}
              {showMembershipBanner && (
                <div className="pt-8">
                  <div className="mb-8">
                    <MembershipBenefitsBanner
                      locale={validLocale}
                      onSignup={handleSignup}
                      onLater={handleLaterSignup}
                    />
                  </div>
                </div>
              )}

              {/* 자연스러운 가입 제안 */}
              {signupPrompt && (
                <div className="mb-8 pt-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">🎉</span>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">
                          {signupPrompt.title}
                        </h4>
                        <p className="text-blue-700 dark:text-blue-300 mb-4">
                          {signupPrompt.message}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handlePromptSignup}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          >
                            {t('common.signUp')}
                          </button>
                          <button
                            onClick={handlePromptDismiss}
                            className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                          >
                            {t('common.later')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NextJS Learn 스타일 Thread 로드맵 */}
              <div className="py-8">
                <ThreadedRoadmap
                  locale={validLocale}
                  currentTier="Iron5"
                  completedTiers={[]}
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-600">{t('common.errorOccurred')}</p>
          </div>
        );
    }
  };

  return renderCurrentView();
}