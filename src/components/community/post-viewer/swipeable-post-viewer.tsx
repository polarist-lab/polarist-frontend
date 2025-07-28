'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Post } from '@/lib/community/types';
import { Locale } from '@/lib/i18n/config';
import { PostCard } from './post-card';
import { CategoryFilter } from './category-filter';

interface SwipeablePostViewerProps {
  posts: Post[];
  locale: Locale;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  onPostLike?: (postId: string) => void;
  onPostBookmark?: (postId: string) => void;
  onPostShare?: (postId: string) => void;
}

export function SwipeablePostViewer({
  posts,
  locale,
  selectedCategory = 'all',
  onCategoryChange,
  onPostLike,
  onPostBookmark,
  onPostShare
}: SwipeablePostViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset to first post when posts change
  useEffect(() => {
    setCurrentIndex(0);
  }, [posts]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    if (translateX > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (translateX < -threshold && currentIndex < posts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
    
    setTranslateX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  }, [isDragging, startX]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    if (translateX > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (translateX < -threshold && currentIndex < posts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
    
    setTranslateX(0);
  }, [isDragging, translateX, currentIndex, posts.length]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (e.key === 'ArrowRight' && currentIndex < posts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, posts.length]);

  const goToNext = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToPost = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle post interactions
  const handleLike = (postId: string) => {
    onPostLike?.(postId);
  };

  const handleBookmark = (postId: string) => {
    onPostBookmark?.(postId);
  };

  const handleShare = (postId: string) => {
    onPostShare?.(postId);
  };

  if (!posts.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-50">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No posts yet
          </h2>
          <p className="text-gray-600">
            Be the first to share something with the community!
          </p>
        </div>
      </div>
    );
  }

  const currentPost = posts[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          locale={locale}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Post Container */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div 
            className="h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${translateX}px)`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            <PostCard
              key={currentPost.id}
              post={currentPost}
              locale={locale}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onShare={handleShare}
            />
          </div>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {currentIndex < posts.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {currentIndex + 1} of {posts.length}
            </span>
            <div className="flex items-center gap-2">
              {/* Keyboard hint */}
              <span className="text-xs text-gray-400 hidden sm:block">
                ← → to navigate
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / posts.length) * 100}%` }}
            />
          </div>
          
          {/* Dot Indicators */}
          <div className="flex justify-center mt-3 gap-1">
            {posts.slice(Math.max(0, currentIndex - 2), Math.min(posts.length, currentIndex + 3)).map((_, idx) => {
              const actualIndex = Math.max(0, currentIndex - 2) + idx;
              return (
                <button
                  key={actualIndex}
                  onClick={() => goToPost(actualIndex)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    actualIndex === currentIndex 
                      ? 'bg-blue-500 w-4' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}