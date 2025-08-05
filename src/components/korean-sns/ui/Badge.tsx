'use client';

import { forwardRef } from 'react';
import { cn, getTopikLevelColor } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'topik';
  size?: 'sm' | 'md' | 'lg';
  topikLevel?: number;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', topikLevel, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center font-medium rounded-full";
    
    const variants = {
      default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      secondary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      topik: topikLevel ? getTopikLevelColor(topikLevel) : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-xs",
      lg: "px-3 py-1.5 text-sm"
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

interface TopikBadgeProps extends Omit<BadgeProps, 'variant' | 'topikLevel'> {
  level: number;
  showLabel?: boolean;
}

const TopikBadge = forwardRef<HTMLSpanElement, TopikBadgeProps>(
  ({ level, showLabel = true, className, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant="topik"
        topikLevel={level}
        className={cn("topik-badge", className)}
        {...props}
      >
        {showLabel ? `TOPIK ${level}급` : level}
      </Badge>
    );
  }
);

TopikBadge.displayName = 'TopikBadge';

export { Badge, TopikBadge, type BadgeProps, type TopikBadgeProps };