'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import React from 'react';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { SimpleBreadcrumb } from '@/components/navigation/simple-breadcrumb';

// Import MDX content directly
import Chapter1Content from '@/data/markdown/iron5-chapter1-hangul-story.mdx';
import Chapter2Content from '@/data/markdown/iron5-chapter2-vowel-groups.mdx';
import Chapter3Content from '@/data/markdown/iron5-chapter3-consonant-groups.mdx';
import Chapter4Content from '@/data/markdown/iron5-chapter4-basic-combinations.mdx';

interface Chapter {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  component: React.ComponentType;
}

export default function Iron5Page() {
  const params = useParams();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';

  const [currentChapter, setCurrentChapter] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chapters: Chapter[] = [
    {
      id: 1,
      title: 'The Story of Hangul',
      description: 'Learn about King Sejong and the philosophy behind Korean writing',
      completed: false,
      component: Chapter1Content
    },
    {
      id: 2,
      title: 'Understanding Vowel Groups',
      description: 'Master the 6 fundamental vowels through scientific grouping',
      completed: false,
      component: Chapter2Content
    },
    {
      id: 3,
      title: 'Consonant Groups by Pronunciation',
      description: 'Learn consonants organized by where and how they\'re pronounced',
      completed: false,
      component: Chapter3Content
    },
    {
      id: 4,
      title: 'Combining Characters into Syllables',
      description: 'Practice combining vowels and consonants into syllable blocks',
      completed: false,
      component: Chapter4Content
    }
  ];

  const totalChapters = chapters.length;
  const currentChapterData = chapters.find(ch => ch.id === currentChapter);

  // Function to convert text to URL-friendly slug (same as MDX components)
  const slugify = (text: string): string => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  };

  const scrollToChapter = (chapterId: number) => {
    const chapterData = chapters.find(ch => ch.id === chapterId);
    if (chapterData) {
      // Try to find MDX heading first, fallback to chapter header
      const headingId = slugify(chapterData.title);
      let element = document.getElementById(headingId);
      
      // If MDX heading not found, try the chapter header
      if (!element) {
        element = document.getElementById(`chapter-${chapterId}`);
      }
      
      if (element) {
        const headerOffset = 120; // Account for sticky header + breadcrumb
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL with heading-based hash
        window.history.replaceState(null, '', `#${headingId}`);
      }
    }
  };

  const handleNext = () => {
    if (currentChapter < totalChapters) {
      const nextChapter = currentChapter + 1;
      setCurrentChapter(nextChapter);
      setTimeout(() => scrollToChapter(nextChapter), 100);
    }
  };

  const handlePrevious = () => {
    if (currentChapter > 1) {
      const prevChapter = currentChapter - 1;
      setCurrentChapter(prevChapter);
      setTimeout(() => scrollToChapter(prevChapter), 100);
    }
  };

  // Handle URL hash on page load and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #
      if (hash) {
        // Try to find the element and scroll to it with offset
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const headerOffset = 120; // Account for sticky header + breadcrumb
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 500); // Wait for content to load
      }
    };

    // Handle initial hash on page load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentChapter]);


  const CurrentChapterComponent = currentChapterData?.component;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Full width breadcrumb */}
      <SimpleBreadcrumb 
        tier="Iron 5"
        chapterNumber={currentChapter}
        chapterTitle={currentChapterData?.title || `Chapter ${currentChapter}`}
        materialTitle="Chapter Overview"
        showProgress={true}
        currentStep={currentChapter}
        totalSteps={totalChapters}
        showMobileMenu={true}
        onMobileMenuClick={() => setSidebarOpen(!sidebarOpen)}
        isMobileMenuOpen={sidebarOpen}
      />
      
      {/* Mobile accordion menu - slides down below breadcrumb */}
      {sidebarOpen && (
        <div className="lg:hidden w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg animate-in slide-in-from-top-2 duration-200 sticky top-28">
          {/* Navigation content */}
          <div className="w-full px-4 py-4 lg:max-w-6xl lg:mx-auto lg:px-4">
            <nav>
              <ul role="list" className="space-y-2">
                {chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <button
                      onClick={() => {
                        setCurrentChapter(chapter.id);
                        setSidebarOpen(false);
                        setTimeout(() => scrollToChapter(chapter.id), 100);
                      }}
                      className={`group flex w-full gap-x-3 rounded-md p-3 text-sm leading-5 font-medium text-left transition-colors duration-200 cursor-pointer ${
                        chapter.id === currentChapter
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                    >
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-medium ${
                        chapter.completed
                          ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : chapter.id === currentChapter
                            ? 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:border-blue-200 dark:group-hover:border-blue-700 group-hover:text-blue-700 dark:group-hover:text-blue-400'
                      }`}>
                        {chapter.completed ? '✓' : chapter.id}
                      </div>
                      <span className="text-left">{chapter.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Container with margins like Next.js docs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className="hidden lg:flex lg:w-80 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-black px-6 pb-4 border-r border-gray-200 dark:border-gray-800">
              <div className="flex h-16 shrink-0 items-center">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Iron 5 Chapters</h2>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {chapters.map((chapter) => (
                        <li key={chapter.id}>
                          <button
                            onClick={() => {
                              setCurrentChapter(chapter.id);
                              setTimeout(() => scrollToChapter(chapter.id), 100);
                            }}
                            className={`group flex w-full gap-x-3 rounded-md p-2 text-xs leading-5 font-medium text-left transition-all duration-200 cursor-pointer ${
                              chapter.id === currentChapter
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95'
                            }`}
                          >
                            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[0.6rem] font-medium transition-all duration-200 ${
                              chapter.completed
                                ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                : chapter.id === currentChapter
                                  ? 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:border-blue-200 dark:group-hover:border-blue-700 group-hover:text-blue-700 dark:group-hover:text-blue-400'
                            }`}>
                              {chapter.completed ? '✓' : chapter.id}
                            </div>
                            <span className="text-left">{chapter.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto bg-white dark:bg-black">
              {/* Full page content - no padding, directly attached to sidebar */}
              <div className="min-h-full">
                {/* Chapter Header */}
                <div className="px-8 py-8 border-b border-gray-200 dark:border-gray-800">
                  <h1 id={`chapter-${currentChapter}`} className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {currentChapterData?.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {currentChapterData?.description}
                  </p>
                </div>

                {/* Content Area */}
                <div className="px-8 py-8">
                  {/* Chapter Content */}
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    {CurrentChapterComponent && <CurrentChapterComponent />}
                  </div>

                  {/* Next.js Docs Style Navigation */}
                  <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                    {/* Previous Button */}
                    {currentChapter > 1 ? (
                      <button
                        onClick={handlePrevious}
                        className="group flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 max-w-sm !cursor-pointer"
                      >
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <div className="text-left">
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide mb-1">
                            Previous
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {chapters[currentChapter - 2]?.title}
                          </div>
                        </div>
                      </button>
                    ) : (
                      <div></div>
                    )}

                    {/* Next Button */}
                    {currentChapter < totalChapters ? (
                      <button
                        onClick={handleNext}
                        className="group flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 max-w-sm !cursor-pointer"
                      >
                        <div className="text-right">
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide mb-1">
                            Next
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {chapters[currentChapter]?.title}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}