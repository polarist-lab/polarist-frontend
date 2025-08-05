'use client';

interface SimpleBreadcrumbProps {
  tier: string;
  chapterNumber: number;
  chapterTitle: string;
  materialTitle: string;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  showMobileMenu?: boolean;
  onMobileMenuClick?: () => void;
  isMobileMenuOpen?: boolean;
}

export function SimpleBreadcrumb({ 
  tier, 
  chapterNumber, 
  chapterTitle, 
  materialTitle,
  showProgress = false,
  currentStep = 1,
  totalSteps = 1,
  showMobileMenu = false,
  onMobileMenuClick,
  isMobileMenuOpen = false
}: SimpleBreadcrumbProps) {
  return (
    <div className="sticky top-16 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm w-full">
      <div className="w-full px-0 py-3 lg:max-w-6xl lg:mx-auto lg:px-4">
        {/* Mobile full-width navigation */}
        <div className="lg:hidden w-full">
          <nav className="flex items-center space-x-3 text-xs px-4">
            {/* Mobile menu button */}
            {showMobileMenu && (
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 -m-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200 active:scale-95 cursor-pointer"
                onClick={onMobileMenuClick}
              >
                <span className="sr-only">Toggle menu</span>
                <svg className="w-5 h-5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  )}
                </svg>
              </button>
            )}
            
            <div className="flex items-center space-x-1 flex-1">
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200 !cursor-pointer font-normal">
                {tier}
              </button>
              
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200 !cursor-pointer font-normal">
                Chapter {chapterNumber}: {chapterTitle}
              </button>
              
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              
              <span className="text-gray-900 font-medium text-xs">
                {materialTitle}
              </span>
            </div>
          </nav>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:block">
          <nav className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200 !cursor-pointer font-normal">
                {tier}
              </button>
              
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200 !cursor-pointer font-normal">
                Chapter {chapterNumber}: {chapterTitle}
              </button>
              
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              
              <span className="text-gray-900 font-medium text-xs">
                {materialTitle}
              </span>
            </div>
          </nav>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="bg-white border-t border-gray-100">
          <div className="w-full px-0 lg:max-w-6xl lg:mx-auto lg:px-4">
            <div className="w-full bg-gray-200 h-0.5">
              <div 
                className="bg-blue-600 h-0.5 transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}