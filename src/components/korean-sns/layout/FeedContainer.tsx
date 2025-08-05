'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { BilingualPost, KoreanLearnerProfile, PostFilter } from '@/lib/korean-sns/types';
import { BilingualPostCard } from '../posts/BilingualPostCard';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

interface FeedContainerProps {
  posts?: BilingualPost[];
  currentUser?: KoreanLearnerProfile;
  locale?: string;
  filter?: PostFilter;
  showLoadMore?: boolean;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onCorrect?: (postId: string) => void;
  onComment?: (postId: string) => void;
  className?: string;
}

export function FeedContainer({
  posts = [],
  currentUser,
  locale = 'en',
  filter,
  showLoadMore = true,
  isLoading = false,
  hasMore = true,
  onLoadMore,
  onLike,
  onBookmark,
  onShare,
  onCorrect,
  onComment,
  className
}: FeedContainerProps) {
  const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll implementation
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading && onLoadMore && isInfiniteScrollEnabled) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore, isInfiniteScrollEnabled]);

  useEffect(() => {
    if (!showLoadMore || !isInfiniteScrollEnabled) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '100px'
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, showLoadMore, isInfiniteScrollEnabled]);

  // Memoized filtered posts to avoid re-filtering on every render
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (!filter) return true;
      
      if (filter.category && post.category !== filter.category) return false;
      if (filter.difficulty && post.difficulty !== filter.difficulty) return false;
      if (filter.language && post.originalLanguage !== filter.language) return false;
      if (filter.needsCorrection !== undefined && post.needsCorrection !== filter.needsCorrection) return false;
      
      if (filter.authorTopikLevel && filter.authorTopikLevel.length > 0) {
        if (!filter.authorTopikLevel.includes(post.author.topikLevel)) return false;
      }
      
      if (filter.tags && filter.tags.length > 0) {
        const hasMatchingTag = filter.tags.some(tag => 
          post.tags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }
      
      return true;
    });
  }, [posts, filter]);

  // Memoized sorted posts to avoid re-sorting on every render
  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      switch (filter?.sortBy) {
        case 'popular':
          return (b.likes + b.comments) - (a.likes + a.comments);
        case 'needs-help':
          return Number(b.needsCorrection) - Number(a.needsCorrection);
        case 'trending':
          // Simple trending algorithm based on recent activity
          const aScore = a.likes + a.comments + (Date.now() - a.createdAt.getTime()) / (1000 * 60 * 60);
          const bScore = b.likes + b.comments + (Date.now() - b.createdAt.getTime()) / (1000 * 60 * 60);
          return bScore - aScore;
        case 'recent':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  }, [filteredPosts, filter?.sortBy]);

  if (isLoading && posts.length === 0) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Loading skeletons */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="korean-post-card animate-pulse">
            <div className="post-header">
              <div className="user-info">
                <div className="skeleton-avatar" />
                <div className="user-details">
                  <div className="skeleton-text short mb-2" />
                  <div className="skeleton-text short" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="skeleton-text" />
              <div className="skeleton-text medium" />
              <div className="skeleton-text short" />
            </div>
            
            <div className="post-actions mt-4">
              <div className="flex space-x-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sortedPosts.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {locale === 'ko' ? '포스트가 없습니다' : 'No posts found'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {locale === 'ko' 
            ? '첫 번째 한국어 포스트를 작성해보세요!' 
            : 'Be the first to share your Korean learning journey!'
          }
        </p>
        <Button
          onClick={() => window.location.href = '/korean-sns/create'}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          {locale === 'ko' ? '포스트 작성하기' : 'Create Post'}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filter Summary */}
      {filter && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {locale === 'ko' ? '필터:' : 'Filters:'}
          </span>
          {filter.category && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
              {filter.category}
            </span>
          )}
          {filter.difficulty && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
              {filter.difficulty}
            </span>
          )}
          {filter.needsCorrection && (
            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs">
              {locale === 'ko' ? '교정 필요' : 'Needs Correction'}
            </span>
          )}
        </div>
      )}

      {/* Posts */}
      {sortedPosts.map((post, index) => (
        <BilingualPostCard
          key={`${post.id}-${index}`}
          post={post}
          currentUser={currentUser}
          locale={locale}
          onLike={onLike}
          onBookmark={onBookmark}
          onShare={onShare}
          onCorrect={onCorrect}
          onComment={onComment}
        />
      ))}

      {/* Load More */}
      {showLoadMore && hasMore && (
        <div ref={loadMoreRef} className="flex flex-col items-center py-8">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm">
                {locale === 'ko' ? '로딩 중...' : 'Loading...'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={onLoadMore}
                disabled={isLoading}
                variant="outline"
              >
                {locale === 'ko' ? '더 보기' : 'Load More'}
              </Button>
              
              <button
                onClick={() => setIsInfiniteScrollEnabled(!isInfiniteScrollEnabled)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {isInfiniteScrollEnabled 
                  ? (locale === 'ko' ? '무한 스크롤 끄기' : 'Disable auto-load')
                  : (locale === 'ko' ? '무한 스크롤 켜기' : 'Enable auto-load')
                }
              </button>
            </div>
          )}
        </div>
      )}

      {/* End of feed message */}
      {!hasMore && sortedPosts.length > 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {locale === 'ko' 
              ? '모든 포스트를 확인했습니다!' 
              : "You've seen all the posts!"
            }
          </p>
        </div>
      )}
    </div>
  );
}