'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { KoreanLearnerProfile } from '@/lib/korean-sns/types';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { TopikBadge } from '../ui/Badge';
import { MobileNavigation } from './MobileNavigation';

interface KoreanSNSLayoutProps {
  children: React.ReactNode;
  currentUser?: KoreanLearnerProfile;
  locale?: string;
  showSidebar?: boolean;
  showRightPanel?: boolean;
  showFAB?: boolean;
  onCreatePost?: () => void;
  className?: string;
}

export function KoreanSNSLayout({
  children,
  currentUser,
  locale = 'en',
  showSidebar = true,
  showRightPanel = true,
  showFAB = true,
  onCreatePost,
  className
}: KoreanSNSLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-950", className)}>
      {/* Desktop Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              한국어 SNS
            </h1>
          </div>
          
          {currentUser && (
            <div className="flex items-center gap-2">
              <Avatar
                src={currentUser.avatar}
                alt={currentUser.displayName}
                fallback={currentUser.displayName}
                size="sm"
              />
            </div>
          )}
        </div>
      </header>

      <div className="korean-sns-grid">
        {/* Left Sidebar */}
        {showSidebar && (
          <aside className={cn(
            "left-sidebar fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "lg:block"
          )}>
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  한국어 SNS
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Profile Section */}
              {currentUser && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar
                      src={currentUser.avatar}
                      alt={currentUser.displayName}
                      fallback={currentUser.displayName}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {currentUser.displayName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <TopikBadge level={currentUser.topikLevel} size="sm" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span className="streak-counter">
                      🔥 {currentUser.studyStreak} {locale === 'ko' ? '일 연속' : 'day streak'}
                    </span>
                    <span className="points-display">
                      {currentUser.totalPoints} {locale === 'ko' ? '포인트' : 'pts'}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Menu */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/korean-sns"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                      </svg>
                      {locale === 'ko' ? '피드' : 'Feed'}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/korean-sns/my-posts"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {locale === 'ko' ? '내 글' : 'My Posts'}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/korean-sns/bookmarks"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      {locale === 'ko' ? '북마크' : 'Bookmarks'}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/korean-sns/mentors"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      {locale === 'ko' ? '멘토' : 'Mentors'}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/korean-sns/leaderboard"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      {locale === 'ko' ? '리더보드' : 'Leaderboard'}
                    </a>
                  </li>
                </ul>

                {/* Create Post Button */}
                <div className="mt-6">
                  <Button
                    onClick={onCreatePost}
                    className="w-full"
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }
                  >
                    {locale === 'ko' ? '글 쓰기' : 'Create Post'}
                  </Button>
                </div>
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="main-feed">
          <div className="korean-sns-container py-6">
            {children}
          </div>
        </main>

        {/* Right Panel */}
        {showRightPanel && (
          <aside className="right-sidebar hidden lg:block">
            <div className="sticky top-6 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {locale === 'ko' ? '오늘의 통계' : "Today's Stats"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {locale === 'ko' ? '새 포스트' : 'New Posts'}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      24
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {locale === 'ko' ? '교정 완료' : 'Corrections'}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      15
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {locale === 'ko' ? '활성 멘토' : 'Active Mentors'}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      8
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {locale === 'ko' ? '이주의 기여자' : 'Top Contributors'}
                </h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((rank) => (
                    <div key={rank} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {rank}
                      </div>
                      <Avatar size="sm" fallback={`U${rank}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          User {rank}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.floor(Math.random() * 100) + 50} {locale === 'ko' ? '교정' : 'corrections'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Tips */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {locale === 'ko' ? '학습 팁' : 'Learning Tips'}
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {locale === 'ko' 
                        ? '매일 짧은 일기를 써보세요!' 
                        : 'Write a short daily journal!'
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {locale === 'ko' 
                        ? '다른 사람의 교정을 주의깊게 읽어보세요.' 
                        : 'Carefully read others\' corrections.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation locale={locale} currentUser={currentUser} />

      {/* Floating Action Button */}
      {showFAB && (
        <button
          onClick={onCreatePost}
          className="fixed bottom-20 right-6 lg:bottom-6 w-14 h-14 bg-korean-primary hover:bg-korean-primary-hover text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center z-30"
          aria-label={locale === 'ko' ? '글 쓰기' : 'Create Post'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}