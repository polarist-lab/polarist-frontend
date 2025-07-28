'use client';

import dynamic from 'next/dynamic';

// Dynamic import with no SSR to avoid hydration issues
const WordsPageClient = dynamic(() => import('@/components/study/words-page-client'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
          <div className="space-y-6">
            <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
            </div>
            <div className="flex justify-between pt-4">
              <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});

export default function WordsPage() {
  return <WordsPageClient />;
}