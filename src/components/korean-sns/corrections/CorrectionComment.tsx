'use client';

import { useState } from 'react';
import { CorrectionComment as CorrectionCommentType, KoreanLearnerProfile } from '@/lib/korean-sns/types';
import { Avatar } from '../ui/Avatar';
import { TopikBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn, formatRelativeTime, getCorrectionTypeLabel } from '@/lib/utils';

interface CorrectionCommentProps {
  correction: CorrectionCommentType;
  currentUser?: KoreanLearnerProfile;
  locale?: string;
  showActions?: boolean;
  onMarkHelpful?: (correctionId: string) => void;
  onReply?: (correctionId: string, content: string) => void;
  onReport?: (correctionId: string, reason: string) => void;
  className?: string;
}

export function CorrectionComment({
  correction,
  currentUser,
  locale = 'en',
  showActions = true,
  onMarkHelpful,
  onReply,
  onReport,
  className
}: CorrectionCommentProps) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showAllCorrections, setShowAllCorrections] = useState(false);

  const handleMarkHelpful = () => {
    onMarkHelpful?.(correction.id);
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !onReply) return;
    
    setIsSubmittingReply(true);
    try {
      await onReply(correction.id, replyContent.trim());
      setReplyContent('');
      setShowReplyBox(false);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleReport = (reason: string) => {
    onReport?.(correction.id, reason);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'text-yellow-600 dark:text-yellow-400';
      case 'major': return 'text-orange-600 dark:text-orange-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSeverityLabel = (severity: string) => {
    const labels = {
      minor: { ko: '경미', en: 'Minor' },
      major: { ko: '중요', en: 'Major' },
      critical: { ko: '심각', en: 'Critical' }
    };
    return labels[severity as keyof typeof labels]?.[locale as 'ko' | 'en'] || severity;
  };

  return (
    <div className={cn("correction-comment", className)}>
      {/* Correction Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={correction.author.avatar}
            alt={correction.author.displayName}
            fallback={correction.author.displayName}
            size="sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {correction.author.displayName}
              </span>
              <span className="mentor-badge">
                {locale === 'ko' ? '멘토' : 'Mentor'}
              </span>
              <TopikBadge level={correction.author.topikLevel} size="sm" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeTime(correction.createdAt, locale)}
              </span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                {getCorrectionTypeLabel(correction.correctionType, locale)}
              </span>
              <span className={cn("text-xs font-medium", getSeverityColor(correction.severity))}>
                {getSeverityLabel(correction.severity)}
              </span>
            </div>
          </div>
        </div>

        {/* More Options */}
        {showActions && (
          <div className="relative">
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Corrections */}
      {correction.corrections.length > 0 && (
        <div className="mb-4">
          <div className="space-y-2">
            {correction.corrections
              .slice(0, showAllCorrections ? undefined : 3)
              .map((textCorrection, index) => (
              <div key={textCorrection.id} className="correction-highlight">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="correction-incorrect">
                    {textCorrection.originalText}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="correction-correct">
                    {textCorrection.correctedText}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                    {getCorrectionTypeLabel(textCorrection.type, locale)}
                  </span>
                </div>
                {textCorrection.explanation && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-2">
                    💡 {textCorrection.explanation}
                  </div>
                )}
              </div>
            ))}
            
            {correction.corrections.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllCorrections(!showAllCorrections)}
                className="text-korean-primary"
              >
                {showAllCorrections 
                  ? (locale === 'ko' ? '접기' : 'Show less')
                  : (locale === 'ko' 
                      ? `${correction.corrections.length - 3}개 더 보기` 
                      : `Show ${correction.corrections.length - 3} more`
                    )
                }
              </Button>
            )}
          </div>
        </div>
      )}

      {/* General Feedback */}
      {correction.generalFeedback && (
        <div className="correction-explanation mb-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {correction.generalFeedback}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={handleMarkHelpful}
              className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors",
                correction.isMarkedHelpfulByUser
                  ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>
                {locale === 'ko' ? '도움됨' : 'Helpful'} ({correction.helpfulCount})
              </span>
            </button>

            <button
              onClick={() => setShowReplyBox(!showReplyBox)}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{locale === 'ko' ? '답글' : 'Reply'}</span>
            </button>
          </div>

          <button
            onClick={() => handleReport('inappropriate')}
            className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400"
          >
            {locale === 'ko' ? '신고' : 'Report'}
          </button>
        </div>
      )}

      {/* Reply Box */}
      {showReplyBox && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={locale === 'ko' ? '정중하게 답글을 작성해주세요...' : 'Write a respectful reply...'}
            className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-korean-primary focus:border-transparent resize-none"
            rows={3}
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowReplyBox(false);
                setReplyContent('');
              }}
            >
              {locale === 'ko' ? '취소' : 'Cancel'}
            </Button>
            <Button
              size="sm"
              onClick={handleReply}
              disabled={!replyContent.trim() || isSubmittingReply}
              isLoading={isSubmittingReply}
            >
              {locale === 'ko' ? '답글 작성' : 'Reply'}
            </Button>
          </div>
        </div>
      )}

      {/* Replies */}
      {correction.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {correction.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
              <Avatar
                src={reply.author.avatar}
                alt={reply.author.displayName}
                fallback={reply.author.displayName}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {reply.author.displayName}
                  </span>
                  <TopikBadge level={reply.author.topikLevel} size="sm" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(reply.createdAt, locale)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {reply.content}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    👍 {reply.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}