'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { PostEditor } from '@/components/community/post-editor/post-editor';
import { CommunityDataManager } from '@/lib/community/data-manager';
import { Post } from '@/lib/community/types';

export default function CreatePostPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (postData: Omit<Post, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);

    try {
      // Create new post
      const newPost: Post = {
        ...postData,
        id: `post_${Date.now()}`,
        authorId: 'current_user', // TODO: Get from auth
        authorName: 'Anonymous User', // TODO: Get from user profile
        authorAvatar: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to data manager
      CommunityDataManager.addPost(newPost);

      // Redirect to community page
      router.push(`/${validLocale}/community`);
    } catch (error) {
      console.error('Failed to create post:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${validLocale}/community`);
  };

  return (
    <PostEditor
      locale={validLocale}
      onSave={handleSave}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}