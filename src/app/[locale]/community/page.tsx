'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { SwipeablePostViewer } from '@/components/community/post-viewer/swipeable-post-viewer';
import { CommunityDataManager } from '@/lib/community/data-manager';
import { Post, PostCategory } from '@/lib/community/types';

export default function CommunityPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';

  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load posts on mount and category change
  useEffect(() => {
    const loadPosts = () => {
      setIsLoading(true);
      const allPosts = CommunityDataManager.getPostsByCategory(selectedCategory);
      setPosts(allPosts);
      setIsLoading(false);
    };

    loadPosts();
  }, [selectedCategory]);

  const handlePostLike = (postId: string) => {
    const newLikeStatus = CommunityDataManager.toggleLike(postId);
    // Update local state
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              userLiked: newLikeStatus,
              interactions: {
                ...post.interactions,
                likes: post.interactions.likes + (newLikeStatus ? 1 : -1)
              }
            }
          : post
      )
    );
  };

  const handlePostBookmark = (postId: string) => {
    const newBookmarkStatus = CommunityDataManager.toggleBookmark(postId);
    // Update local state
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isBookmarked: newBookmarkStatus,
              interactions: {
                ...post.interactions,
                bookmarks: post.interactions.bookmarks + (newBookmarkStatus ? 1 : -1)
              }
            }
          : post
      )
    );
  };

  const handlePostShare = (postId: string) => {
    if (navigator.share) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: `${window.location.origin}/${validLocale}/community/post/${postId}`
        });
      }
    } else {
      // Fallback: copy to clipboard
      const url = `${window.location.origin}/${validLocale}/community/post/${postId}`;
      navigator.clipboard.writeText(url);
      // You could show a toast notification here
    }
  };

  const handleCategoryChange = (category: PostCategory | 'all') => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/${validLocale}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
            </div>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Korean Learning Community</h1>
              <p className="text-sm text-gray-500">{posts.length} posts</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/${validLocale}/community/create`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">New Post</span>
              </button>
              
              <button
                onClick={() => router.push(`/${validLocale}/community/search`)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post Viewer */}
      <SwipeablePostViewer
        posts={posts}
        locale={validLocale}
        onPostLike={handlePostLike}
        onPostBookmark={handlePostBookmark}
        onPostShare={handlePostShare}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        hasMore={false} // TODO: Implement pagination
        isLoading={false}
      />
    </div>
  );
}