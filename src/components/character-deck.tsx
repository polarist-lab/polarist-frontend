'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { KoreanCharacter, LearningContent, CharacterMetadata } from '@/lib/types';
import { CharacterCard } from './character-card';
import { GroupedCharacterDeck } from './grouped-character-deck';
import { getCharactersByType, getCharactersByContentId } from '@/lib/hangul-characters';
import { LearningTracker } from '@/lib/learning-tracker';
import { useTranslations } from '@/lib/i18n';
import { Locale } from '@/lib/i18n/config';

interface CharacterDeckProps {
  content: LearningContent;
  locale: Locale;
}

export function CharacterDeck({ content, locale }: CharacterDeckProps) {
  const { t } = useTranslations(locale);
  const [characters, setCharacters] = useState<KoreanCharacter[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [isGroupedContent, setIsGroupedContent] = useState(false);

  // 콘텐츠에서 문자 데이터 로드 (그룹화된 데이터 우선)
  useEffect(() => {
    let loadedCharacters: KoreanCharacter[] = [];
    let isGrouped = false;
    
    // 1. 먼저 콘텐츠 ID로 특정 그룹 데이터 조회 시도
    loadedCharacters = getCharactersByContentId(content.id);
    if (loadedCharacters.length > 0 && content.id.includes('-grouped')) {
      isGrouped = true;
    }
    
    // 2. 그룹 데이터가 없으면 메타데이터의 타입으로 조회
    if (loadedCharacters.length === 0) {
      const metadata = content.metadata as CharacterMetadata;
      if (metadata?.characterType) {
        loadedCharacters = getCharactersByType(metadata.characterType);
      }
    }
    
    setCharacters(loadedCharacters);
    setIsGroupedContent(isGrouped);
    
    // 콘텐츠 시작 기록
    if (loadedCharacters.length > 0) {
      LearningTracker.startContent(
        content.id,
        'character',
        loadedCharacters.length
      );
    }
  }, [content]);

  const currentCharacter = characters[currentIndex];

  const handleToggleInfo = useCallback(() => {
    setShowFullInfo(!showFullInfo);
  }, [showFullInfo]);

  const handleNext = useCallback(() => {
    if (currentIndex < characters.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFullInfo(false);
      
      // 진도 기록
      LearningTracker.completeContentItem(content.id);
    }
  }, [currentIndex, characters.length, content.id]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowFullInfo(false);
    }
  }, [currentIndex]);


  const progressPercentage = characters.length > 0 
    ? Math.round(((currentIndex + 1) / characters.length) * 100) 
    : 0;

  if (!currentCharacter || characters.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Characters...
          </h2>
          <p className="text-gray-600">
            Preparing your Korean character learning session.
          </p>
        </div>
      </div>
    );
  }

  // Use grouped deck for grouped content, regular deck for others
  if (isGroupedContent) {
    return (
      <GroupedCharacterDeck
        characters={characters}
        title={content.title}
        description={content.description || ''}
        locale={locale}
        onComplete={() => {
          LearningTracker.completeContent(content.id);
          window.history.length > 1 ? window.history.back() : window.location.href = `/${locale}/characters`;
        }}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          {content.icon && <span className="text-2xl">{content.icon}</span>}
          <h1 className="text-2xl font-bold text-gray-800">{content.title}</h1>
        </div>
        {content.description && <p className="text-gray-600">{content.description}</p>}
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gray-900 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600">
          Character <span className="font-semibold">{currentIndex + 1}</span> of{' '}
          <span className="font-semibold">{characters.length}</span> ({progressPercentage}%)
        </div>
      </div>


      {/* Character Card */}
      <CharacterCard
        character={currentCharacter}
        showFullInfo={showFullInfo}
        onToggle={handleToggleInfo}
        onNext={currentIndex < characters.length - 1 ? handleNext : undefined}
        onPrevious={currentIndex > 0 ? handlePrevious : undefined}
        showNavigation={true}
        locale={locale}
      />

      {/* Completion Message */}
      {currentIndex === characters.length - 1 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-green-600 text-lg font-medium mb-2">
            🎉 Character Set Complete!
          </div>
          <p className="text-green-700 text-sm mb-4">
            Great job! You've completed this character set. Ready to explore more character types?
          </p>
          <button
            onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = `/${locale}/characters`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            ← Back to Character Overview
          </button>
        </div>
      )}
    </div>
  );
}