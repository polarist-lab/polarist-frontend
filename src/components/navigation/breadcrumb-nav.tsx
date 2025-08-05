'use client';

import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';
import { LearningContext } from '@/lib/content-types';

interface BreadcrumbNavProps {
  locale: Locale;
  context: LearningContext;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export function BreadcrumbNav({ 
  locale, 
  context, 
  showProgress = false,
  currentStep = 1,
  totalSteps = 1
}: BreadcrumbNavProps) {
  const router = useRouter();

  const getTierColor = (tierName: string) => {
    const tierLower = tierName.toLowerCase();
    if (tierLower.includes('iron')) return 'text-gray-700';
    if (tierLower.includes('silver')) return 'text-slate-700';
    if (tierLower.includes('gold')) return 'text-yellow-700';
    if (tierLower.includes('platinum')) return 'text-purple-700';
    if (tierLower.includes('diamond')) return 'text-cyan-700';
    return 'text-gray-700';
  };

  const handleBackToRoadmap = () => {
    router.push(`/${locale}`);
  };

  const handleBackToChapter = () => {
    router.push(`/${locale}/${context.roadmapTier}`);
  };

  return (
    <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 w-full">
      <div className="w-full px-0 py-4 lg:max-w-6xl lg:mx-auto lg:px-4">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-4 px-4 lg:px-0">
          <button
            onClick={handleBackToRoadmap}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Roadmap
          </button>
          
          {showProgress && (
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
          )}
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm px-4 lg:px-0">
          <button
            onClick={handleBackToRoadmap}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            Roadmap
          </button>
          
          <svg className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          
          <button
            onClick={handleBackToChapter}
            className={`hover:opacity-80 transition-colors font-medium cursor-pointer ${getTierColor(context.breadcrumb.roadmapTitle)}`}
          >
            {context.breadcrumb.roadmapTitle}
          </button>
          
          <svg className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          
          <span className="text-gray-600 font-medium">
            Chapter {context.chapterNumber}: {context.breadcrumb.chapterTitle}
          </span>
          
          <svg className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          
          <span className="text-gray-900 font-semibold">
            {context.breadcrumb.materialTitle}
          </span>
        </nav>

      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="bg-white border-t border-gray-100">
          <div className="w-full px-0 lg:max-w-6xl lg:mx-auto lg:px-4">
            <div className="w-full bg-gray-200 h-1">
              <div 
                className="bg-blue-500 h-1 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}