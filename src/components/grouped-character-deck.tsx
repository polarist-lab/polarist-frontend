'use client'

import React, { useState, useEffect } from 'react';
import { KoreanCharacter } from '@/lib/types';
import { CharacterCard } from './character-card';
import { Locale } from '@/lib/i18n/config';

interface GroupedCharacterDeckProps {
  characters: KoreanCharacter[];
  title: string;
  description: string;
  locale: Locale;
  onComplete?: () => void;
}

interface CharacterGroup {
  name: string;
  description: string;
  characters: KoreanCharacter[];
  color: string;
}

export function GroupedCharacterDeck({ 
  characters, 
  title, 
  description, 
  locale, 
  onComplete 
}: GroupedCharacterDeckProps) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showFullInfo, setShowFullInfo] = useState(false);

  // Group characters by their tags
  const groups: CharacterGroup[] = React.useMemo(() => {
    const groupMap = new Map<string, CharacterGroup>();
    
    characters.forEach(char => {
      const mainTag = char.tags?.[0] || 'Other';
      
      if (!groupMap.has(mainTag)) {
        let groupInfo = getGroupInfo(mainTag);
        groupMap.set(mainTag, {
          name: groupInfo.name,
          description: groupInfo.description,
          characters: [],
          color: groupInfo.color
        });
      }
      
      groupMap.get(mainTag)!.characters.push(char);
    });
    
    return Array.from(groupMap.values());
  }, [characters]);

  const currentGroup = groups[currentGroupIndex];
  const currentCharacter = currentGroup?.characters[currentCharIndex];
  const totalProgress = groups.reduce((acc, group, index) => {
    if (index < currentGroupIndex) return acc + group.characters.length;
    if (index === currentGroupIndex) return acc + currentCharIndex + 1;
    return acc;
  }, 0);
  const totalCharacters = characters.length;

  const handleNext = () => {
    if (currentCharIndex < currentGroup.characters.length - 1) {
      setCurrentCharIndex(currentCharIndex + 1);
    } else if (currentGroupIndex < groups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      setCurrentCharIndex(0);
    } else {
      onComplete?.();
    }
    setShowFullInfo(false);
  };

  const handlePrevious = () => {
    if (currentCharIndex > 0) {
      setCurrentCharIndex(currentCharIndex - 1);
    } else if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
      setCurrentCharIndex(groups[currentGroupIndex - 1].characters.length - 1);
    }
    setShowFullInfo(false);
  };

  if (!currentGroup || !currentCharacter) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading grouped characters...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-600 text-lg">{description}</p>
        
        {/* Overall Progress */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-gray-600 to-gray-800 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(totalProgress / totalCharacters) * 100}%` }}
          />
        </div>
        <div className="text-sm text-gray-600">
          Character <span className="font-semibold">{totalProgress}</span> of{' '}
          <span className="font-semibold">{totalCharacters}</span>
        </div>
      </div>

      {/* Current Group Info */}
      <div className={`${currentGroup.color} rounded-xl p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{currentGroup.name}</h2>
            <p className="opacity-90">{currentGroup.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-75">Group Progress</div>
            <div className="text-lg font-semibold">
              {currentCharIndex + 1} / {currentGroup.characters.length}
            </div>
          </div>
        </div>
        
        {/* Group Progress Bar */}
        <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCharIndex + 1) / currentGroup.characters.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Character Card */}
      <CharacterCard
        character={currentCharacter}
        showFullInfo={showFullInfo}
        onToggle={() => setShowFullInfo(!showFullInfo)}
        onNext={totalProgress < totalCharacters ? handleNext : undefined}
        onPrevious={totalProgress > 1 ? handlePrevious : undefined}
        showNavigation={true}
        locale={locale}
      />

      {/* Group Navigation */}
      <div className="flex justify-center space-x-2">
        {groups.map((group, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentGroupIndex(index);
              setCurrentCharIndex(0);
              setShowFullInfo(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              index === currentGroupIndex 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {group.name}
          </button>
        ))}
      </div>

      {/* Completion Message */}
      {totalProgress === totalCharacters && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-xl font-bold mb-2">
            🎉 Congratulations!
          </div>
          <p className="text-green-700 mb-4">
            You've mastered all character groups! Understanding the scientific grouping helps you remember the patterns.
          </p>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Continue Learning Journey
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function to get group styling and info
function getGroupInfo(tag: string): { name: string; description: string; color: string } {
  switch (tag) {
    case 'Basic Axis':
      return {
        name: 'Basic Axes (기본축)',
        description: 'Heaven (ㅣ) and Earth (ㅡ) - the fundamental building blocks',
        color: 'bg-gradient-to-r from-blue-500 to-indigo-600'
      };
    case 'Bright Sound':
      return {
        name: 'Bright Sounds (양성모음)',
        description: 'Yang vowels with bright, open sounds',
        color: 'bg-gradient-to-r from-orange-500 to-red-500'
      };
    case 'Dark Sound':
      return {
        name: 'Dark Sounds (음성모음)',
        description: 'Yin vowels with darker, closed sounds',
        color: 'bg-gradient-to-r from-purple-500 to-blue-600'
      };
    case 'Throat':
      return {
        name: 'Throat Sounds (목구멍 소리)',
        description: 'Consonants made with the back of the tongue and throat',
        color: 'bg-gradient-to-r from-green-500 to-teal-600'
      };
    case 'Tongue-tip':
      return {
        name: 'Tongue-tip Sounds (혀끝 소리)',
        description: 'Consonants made with the tip of the tongue',
        color: 'bg-gradient-to-r from-cyan-500 to-blue-500'
      };
    case 'Lip':
      return {
        name: 'Lip Sounds (입술 소리)',
        description: 'Consonants made with the lips',
        color: 'bg-gradient-to-r from-pink-500 to-purple-500'
      };
    case 'Teeth':
      return {
        name: 'Teeth Sounds (치아 소리)',
        description: 'Consonants made with the teeth and tongue',
        color: 'bg-gradient-to-r from-gray-500 to-slate-600'
      };
    default:
      return {
        name: tag,
        description: 'Character group',
        color: 'bg-gradient-to-r from-gray-400 to-gray-600'
      };
  }
}