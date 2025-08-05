'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { RewardNotification as RewardNotificationType } from '@/lib/korean-sns/types';
import { TopikBadge } from '../ui/Badge';

interface RewardNotificationProps {
  reward: RewardNotificationType;
  isVisible: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
  locale?: string;
  className?: string;
}

export function RewardNotification({
  reward,
  isVisible,
  onClose,
  autoCloseDelay = 4000,
  locale = 'en',
  className
}: RewardNotificationProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 50);
      
      if (autoCloseDelay > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoCloseDelay]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300);
  };

  if (!shouldRender) return null;

  const getRewardIcon = () => {
    switch (reward.type) {
      case 'points':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            +{reward.points}
          </div>
        );
      case 'badge':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl">
            🏆
          </div>
        );
      case 'streak':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl">
            🔥
          </div>
        );
      case 'level-up':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl">
            ⬆️
          </div>
        );
      case 'achievement':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl">
            ⭐
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-2xl">
            🎉
          </div>
        );
    }
  };

  const getRewardAnimation = () => {
    switch (reward.type) {
      case 'points':
        return 'animate-bounce-in';
      case 'badge':
        return 'animate-bounce-in';
      case 'streak':
        return 'animate-pulse';
      case 'level-up':
        return 'animate-bounce-in';
      default:
        return 'animate-bounce-in';
    }
  };

  return (
    <div
      className={cn(
        'reward-notification',
        isAnimating && 'show',
        getRewardAnimation(),
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getRewardIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {reward.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {reward.description}
          </p>
          
          {/* Additional reward info */}
          <div className="flex items-center gap-2">
            {reward.points && (
              <span className="points-display">
                +{reward.points} {locale === 'ko' ? '포인트' : 'points'}
              </span>
            )}
            
            {reward.badge && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">
                <span>🏆</span>
                <span>{reward.badge.name}</span>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={locale === 'ko' ? '닫기' : 'Close'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar for auto-close */}
      {autoCloseDelay > 0 && isVisible && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress"
            style={{
              animation: `shrink ${autoCloseDelay}ms linear`,
            }}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress {
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}

// Hook for managing reward notifications
export function useRewardNotifications() {
  const [notifications, setNotifications] = useState<RewardNotificationType[]>([]);

  const showReward = (reward: Omit<RewardNotificationType, 'id' | 'isRead' | 'createdAt'>) => {
    const newReward: RewardNotificationType = {
      ...reward,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date()
    };
    
    setNotifications(prev => [...prev, newReward]);
  };

  const hideReward = (rewardId: string) => {
    setNotifications(prev => prev.filter(reward => reward.id !== rewardId));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    showReward,
    hideReward,
    clearAll
  };
}

// Reward notification container
interface RewardNotificationContainerProps {
  notifications: RewardNotificationType[];
  onClose: (rewardId: string) => void;
  locale?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function RewardNotificationContainer({
  notifications,
  onClose,
  locale = 'en',
  position = 'top-right'
}: RewardNotificationContainerProps) {
  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50'
  };

  return (
    <div className={cn(positionClasses[position], 'space-y-3')}>
      {notifications.map((reward) => (
        <RewardNotification
          key={reward.id}
          reward={reward}
          isVisible={true}
          onClose={() => onClose(reward.id)}
          locale={locale}
        />
      ))}
    </div>
  );
}