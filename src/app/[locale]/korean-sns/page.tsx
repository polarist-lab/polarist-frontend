'use client';

import { useState } from 'react';
import { KoreanSNSLayout } from '@/components/korean-sns/layout/KoreanSNSLayout';
import { FeedContainer } from '@/components/korean-sns/layout/FeedContainer';
import { BilingualPost } from '@/lib/korean-sns/types';
import { mockMentor, mockPosts } from '@/lib/korean-sns/mock-data';

export default function KoreanSNSPage() {
  const [posts, setPosts] = useState<BilingualPost[]>(mockPosts);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.isLikedByUser ? post.likes - 1 : post.likes + 1,
              isLikedByUser: !post.isLikedByUser 
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              bookmarks: post.isBookmarkedByUser ? post.bookmarks - 1 : post.bookmarks + 1,
              isBookmarkedByUser: !post.isBookmarkedByUser 
            }
          : post
      )
    );
  };

  const handleShare = (postId: string) => {
    // In a real app, this would open a share dialog or copy link
    navigator.clipboard?.writeText(`${window.location.origin}/korean-sns/post/${postId}`);
    console.log('Shared post:', postId);
  };

  const handleCorrect = (postId: string) => {
    console.log('Opening correction editor for post:', postId);
    // Navigate to correction editor
  };

  const handleComment = (postId: string) => {
    console.log('Opening comment editor for post:', postId);
    // Navigate to post detail with comment focus
  };

  const handleCreatePost = () => {
    console.log('Opening post creation modal/page');
    // Navigate to post creation page
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading more posts
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would fetch more posts from API
    }, 1500);
  };

  return (
    <KoreanSNSLayout
      currentUser={mockMentor}
      locale="en"
      onCreatePost={handleCreatePost}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Korean Learning Community
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your Korean learning journey and get help from fellow learners
        </p>
      </div>

      <FeedContainer
        posts={posts}
        currentUser={mockMentor}
        locale="en"
        isLoading={isLoading}
        hasMore={true}
        onLoadMore={handleLoadMore}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onShare={handleShare}
        onCorrect={handleCorrect}
        onComment={handleComment}
      />
    </KoreanSNSLayout>
  );
}