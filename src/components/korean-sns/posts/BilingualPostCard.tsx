'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { TopikBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn, formatNumber, formatRelativeTime } from '@/lib/utils';
import { BilingualPost, KoreanLearnerProfile } from '@/lib/korean-sns/types';

interface BilingualPostCardProps {
  post: BilingualPost;
  currentUser?: KoreanLearnerProfile;
  locale?: string;
  showActions?: boolean;
  showCorrections?: boolean;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onCorrect?: (postId: string) => void;
  onComment?: (postId: string) => void;
  className?: string;
}

export function BilingualPostCard({
  post,
  currentUser,
  locale = 'en',
  showActions = true,
  showCorrections = true,
  onLike,
  onBookmark,
  onShare,
  onCorrect,
  onComment,
  className
}: BilingualPostCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);

  const handleLike = () => {
    onLike?.(post.id);
  };

  const handleBookmark = () => {
    onBookmark?.(post.id);
  };

  const handleShare = () => {
    onShare?.(post.id);
  };

  const handleCorrect = () => {
    onCorrect?.(post.id);
  };

  const handleComment = () => {
    onComment?.(post.id);
  };

  const isLongContent = post.originalText.length > 200 || post.translatedText.length > 200;
  const shouldTruncate = isLongContent && !showFullContent;

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Card className={cn("korean-post-card", className)} hover>
      {/* Header with user info */}
      <CardHeader>
        <div className="user-info">
          <Avatar
            src={post.author.avatar}
            alt={post.author.displayName}
            fallback={post.author.displayName}
            size="md"
          />
          <div className="user-details">
            <div className="username">{post.author.displayName}</div>
            <div className="flex items-center gap-2 mt-1">
              <TopikBadge level={post.author.topikLevel} size="sm" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatRelativeTime(post.createdAt, locale)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Category and difficulty */}
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
            {post.category}
          </span>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full",
            post.difficulty === 'beginner' && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
            post.difficulty === 'intermediate' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
            post.difficulty === 'advanced' && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          )}>
            {post.difficulty}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {/* Original Text Section */}
        <div className="original-text-section">
          <div className="language-flag english">
            {locale === 'ko' ? '원문 (영어)' : 'Original (English)'}
          </div>
          <div className="english-text text-gray-800 dark:text-gray-200">
            {shouldTruncate ? truncateText(post.originalText) : post.originalText}
          </div>
        </div>

        {/* Korean Translation Section */}
        <div className="translated-text-section">
          <div className="language-flag korean">
            {locale === 'ko' ? '한국어 번역' : 'Korean Translation'}
          </div>
          <div className="korean-sns-text text-gray-800 dark:text-gray-200">
            {shouldTruncate ? truncateText(post.translatedText) : post.translatedText}
          </div>
        </div>

        {/* Show more/less button */}
        {isLongContent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullContent(!showFullContent)}
            className="mt-2 text-korean-primary hover:text-korean-primary-hover"
          >
            {showFullContent 
              ? (locale === 'ko' ? '접기' : 'Show less')
              : (locale === 'ko' ? '더 보기' : 'Show more')
            }
          </Button>
        )}

        {/* Voice Message (if exists) */}
        {post.voiceData && (
          <div className="voice-message-card mt-4">
            <div className="voice-player">
              <button className="play-button">
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
              <div className="waveform-container">
                {/* Simple waveform visualization */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "wave-bar w-1",
                      Math.random() > 0.5 ? "h-6" : "h-3"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 mono-text">
                {Math.floor(post.voiceData.duration / 60)}:{(post.voiceData.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
            
            {post.voiceData.transcription && (
              <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded border text-sm text-gray-700 dark:text-gray-300">
                <span className="text-xs text-gray-500 dark:text-gray-400">STT: </span>
                {post.voiceData.transcription}
              </div>
            )}
          </div>
        )}

        {/* Needs Correction Notice */}
        {post.needsCorrection && (
          <div className="flex items-center gap-2 mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">
              {locale === 'ko' ? '교정이 필요합니다' : 'Needs Correction'}
            </span>
          </div>
        )}

        {/* Corrections Preview */}
        {showCorrections && post.corrections.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {locale === 'ko' ? `교정 ${post.corrections.length}개` : `${post.corrections.length} Corrections`}
            </div>
            <div className="space-y-2">
              {post.corrections.slice(0, 2).map((correction, index) => (
                <div key={correction.id} className="correction-comment">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar
                      src={correction.author.avatar}
                      alt={correction.author.displayName}
                      fallback={correction.author.displayName}
                      size="sm"
                    />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {correction.author.displayName}
                    </span>
                    <span className="mentor-badge">
                      {locale === 'ko' ? '멘토' : 'Mentor'}
                    </span>
                  </div>
                  
                  {correction.corrections.length > 0 && (
                    <div className="mb-2">
                      {correction.corrections.slice(0, 1).map((textCorrection, idx) => (
                        <div key={idx} className="flex flex-wrap items-center gap-2">
                          <span className="correction-incorrect">
                            {textCorrection.originalText}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="correction-correct">
                            {textCorrection.correctedText}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {post.corrections.length > 2 && (
                <Button variant="ghost" size="sm" className="text-korean-primary">
                  {locale === 'ko' 
                    ? `${post.corrections.length - 2}개 교정 더 보기` 
                    : `View ${post.corrections.length - 2} more corrections`
                  }
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Action buttons */}
      {showActions && (
        <CardFooter>
          <div className="action-stats">
            <span>{formatNumber(post.likes)} {locale === 'ko' ? '좋아요' : 'likes'}</span>
            <span>{formatNumber(post.comments)} {locale === 'ko' ? '댓글' : 'comments'}</span>
            <span>{formatNumber(post.views)} {locale === 'ko' ? '조회' : 'views'}</span>
          </div>
          
          <div className="action-buttons">
            <button
              onClick={handleLike}
              className={cn(
                "action-button",
                post.isLikedByUser && "liked"
              )}
              aria-label={locale === 'ko' ? '좋아요' : 'Like'}
            >
              <svg className="w-5 h-5" fill={post.isLikedByUser ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button
              onClick={handleComment}
              className="action-button"
              aria-label={locale === 'ko' ? '댓글' : 'Comment'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            
            {currentUser?.topikLevel && currentUser.topikLevel > post.author.topikLevel && (
              <button
                onClick={handleCorrect}
                className="action-button text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                aria-label={locale === 'ko' ? '교정하기' : 'Correct'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            
            <button
              onClick={handleShare}
              className="action-button"
              aria-label={locale === 'ko' ? '공유' : 'Share'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            
            <button
              onClick={handleBookmark}
              className={cn(
                "action-button",
                post.isBookmarkedByUser && "bookmarked"
              )}
              aria-label={locale === 'ko' ? '북마크' : 'Bookmark'}
            >
              <svg className="w-5 h-5" fill={post.isBookmarkedByUser ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}