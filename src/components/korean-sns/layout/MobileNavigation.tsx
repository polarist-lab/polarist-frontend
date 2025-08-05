'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { KoreanLearnerProfile } from '@/lib/korean-sns/types';

interface MobileNavigationProps {
  locale?: string;
  currentUser?: KoreanLearnerProfile;
}

export function MobileNavigation({ locale = 'en', currentUser }: MobileNavigationProps) {
  const pathname = usePathname();

  const navItems = [
    {
      id: 'feed',
      href: '/korean-sns',
      label: locale === 'ko' ? '피드' : 'Feed',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
        </svg>
      )
    },
    {
      id: 'mentors',
      href: '/korean-sns/mentors',
      label: locale === 'ko' ? '멘토' : 'Mentors',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      id: 'create',
      href: '/korean-sns/create',
      label: locale === 'ko' ? '작성' : 'Create',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      isCreate: true
    },
    {
      id: 'bookmarks',
      href: '/korean-sns/bookmarks',
      label: locale === 'ko' ? '북마크' : 'Bookmarks',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )
    },
    {
      id: 'profile',
      href: '/korean-sns/profile',
      label: locale === 'ko' ? '프로필' : 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  const isActive = (href: string) => {
    if (href === '/korean-sns') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="mobile-nav lg:hidden">
      {navItems.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className={cn(
            "mobile-nav-item",
            isActive(item.href) && "active",
            item.isCreate && "relative"
          )}
        >
          {item.isCreate ? (
            <div className="w-12 h-12 bg-korean-primary text-white rounded-full flex items-center justify-center shadow-lg">
              {item.icon}
            </div>
          ) : (
            <>
              <div className="w-6 h-6 mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </>
          )}
        </a>
      ))}
    </nav>
  );
}