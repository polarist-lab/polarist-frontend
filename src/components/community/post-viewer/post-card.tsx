'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Post } from '@/lib/community/types';
import { Locale } from '@/lib/i18n/config';

interface PostCardProps {
  post: Post;
  locale: Locale;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function PostCard({
  post,
  locale,
  onLike,
  onBookmark,
  onShare
}: PostCardProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showFullContent, setShowFullContent] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      beginner: { ko: '초급', en: 'Beginner' },
      intermediate: { ko: '중급', en: 'Intermediate' },
      advanced: { ko: '고급', en: 'Advanced' }
    };
    return labels[difficulty as keyof typeof labels]?.[locale] || difficulty;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      grammar: { ko: '문법', en: 'Grammar' },
      vocabulary: { ko: '어휘', en: 'Vocabulary' },
      pronunciation: { ko: '발음', en: 'Pronunciation' },
      culture: { ko: '문화', en: 'Culture' },
      exam: { ko: '시험', en: 'Exam Prep' },
      conversation: { ko: '회화', en: 'Conversation' },
      writing: { ko: '쓰기', en: 'Writing' },
      listening: { ko: '듣기', en: 'Listening' },
      reading: { ko: '읽기', en: 'Reading' },
      general: { ko: '일반', en: 'General' }
    };
    return labels[category as keyof typeof labels]?.[locale] || category;
  };

  const nextMedia = () => {
    if (post.media && currentMediaIndex < post.media.length - 1) {
      setCurrentMediaIndex(prev => prev + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(prev => prev - 1);
    }
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    const media = post.media[currentMediaIndex];

    if (media.type === 'audio') {
      return (
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.815L4.75 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.75l3.633-2.815a1 1 0 011.617.815z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Audio Content</p>
              {media.duration && (
                <p className="text-sm text-gray-500">{Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, '0')}</p>
              )}
            </div>
          </div>
          <audio controls className="w-full" src={media.url} />
        </div>
      );
    }

    if (media.type === 'video') {
      return (
        <video
          controls
          className="w-full h-48 object-cover rounded-lg"
          src={media.url}
          poster={media.thumbnail}
        />
      );
    }

    return (
      <img
        src={media.url}
        alt={media.alt || 'Post media'}
        className="w-full h-48 object-cover rounded-lg"
      />
    );
  };

  const contentPreview = post.content.length > 200 && !showFullContent
    ? post.content.substring(0, 200) + '...'
    : post.content;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {post.authorName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{post.authorName}</p>
              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(post.difficulty)}`}>
              {getDifficultyLabel(post.difficulty)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h2>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
              >
                #{tag.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="relative">
          {renderMedia()}
          
          {post.media.length > 1 && (
            <>
              <div className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1">
                <span className="text-white text-xs">
                  {currentMediaIndex + 1}/{post.media.length}
                </span>
              </div>
              <div className="absolute inset-y-0 left-0 flex items-center">
                <button
                  onClick={prevMedia}
                  disabled={currentMediaIndex === 0}
                  className="ml-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center disabled:opacity-50"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  onClick={nextMedia}
                  disabled={currentMediaIndex === post.media.length - 1}
                  className="mr-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center disabled:opacity-50"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 text-gray-700 leading-relaxed">{children}</p>,
              h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-gray-900">{children}</h2>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-2 text-gray-700">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 text-gray-700">{children}</ol>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-2">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto my-2">
                  {children}
                </pre>
              )
            }}
          >
            {contentPreview}
          </ReactMarkdown>

          {post.content.length > 200 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
            >
              {showFullContent ? 'Show less' : 'Read more'}
            </button>
          )}

          {/* Study info */}
          <div className="mt-3 text-xs text-gray-500">
            <span>{getCategoryLabel(post.category)}</span>
            <span className="mx-2">•</span>
            <span>{post.estimatedReadTime} min read</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like */}
            <button
              onClick={() => onLike?.(post.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                post.userLiked
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill={post.userLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">{formatNumber(post.interactions.likes)}</span>
            </button>

            {/* Comments */}
            <button
              className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium">{formatNumber(post.interactions.comments)}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark */}
            <button
              onClick={() => onBookmark?.(post.id)}
              className={`p-2 rounded-full transition-colors ${
                post.isBookmarked ? 'text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4" fill={post.isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {/* Share */}
            <button
              onClick={() => onShare?.(post.id)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>{formatDate(post.updatedAt)}</span>
          <div className="flex items-center gap-2">
            <span className="uppercase">{post.language}</span>
          </div>
        </div>
      </div>
    </div>
  );
}