'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';

interface HangulStoryProps {
  locale: Locale;
  onComplete?: () => void;
}

interface StorySection {
  id: string;
  title: string;
  content: string;
  visual: string;
  interactive?: React.ReactNode;
}

export function HangulStory({ locale, onComplete }: HangulStoryProps) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const storySections: StorySection[] = [
    {
      id: 'introduction',
      title: 'The Birth of Hangul',
      content: `In 1443, King Sejong the Great of Korea created Hangul (한글), originally called Hunminjeongeum (훈민정음), meaning "proper sounds for instructing the people." 

Before Hangul, Koreans used Chinese characters, which were difficult for common people to learn. King Sejong wanted to create a writing system that everyone could easily master.`,
      visual: '👑'
    },
    {
      id: 'philosophy',
      title: 'The Philosophy: Heaven, Earth, Human',
      content: `Hangul is based on the ancient Korean philosophy of Cheonjiin (천지인) - Heaven, Earth, and Human. This philosophy is deeply embedded in the shape and structure of Korean vowels.

• Heaven (천/天) = ㅣ (vertical line)
• Earth (지/地) = ㅡ (horizontal line)  
• Human (인/人) = ㆍ (dot, connecting heaven and earth)`,
      visual: '☰',
      interactive: <CheonjinDiagram />
    },
    {
      id: 'vowel-creation',
      title: 'How Vowels Were Born',
      content: `All Korean vowels are created by combining these three basic elements:

• ㅏ = ㅣ + ㆍ (Heaven + Human, bright sound)
• ㅓ = ㆍ + ㅣ (Human + Heaven, dark sound)
• ㅗ = ㅡ + ㆍ (Earth + Human, bright sound)
• ㅜ = ㆍ + ㅡ (Human + Earth, dark sound)
• ㅡ = Earth (neutral sound)
• ㅣ = Heaven (neutral sound)`,
      visual: '🔤',
      interactive: <VowelFormation />
    },
    {
      id: 'scientific-design',
      title: 'Scientific Design of Consonants',
      content: `Korean consonants are designed to mimic the shape of your mouth and tongue when making each sound:

• ㄱ represents the tongue touching the soft palate
• ㄴ shows the tongue touching the upper teeth
• ㅁ depicts closed lips
• ㅅ represents teeth shape

This makes Hangul one of the most logical writing systems in the world!`,
      visual: '🔬',
      interactive: <ConsonantShapes />
    },
    {
      id: 'modern-legacy',
      title: 'Hangul Today',
      content: `Today, Hangul is celebrated as one of the most scientific and efficient writing systems ever created. UNESCO proclaimed October 9th as "World Hangul Day" to honor this remarkable achievement.

You're about to embark on learning this beautiful and logical system. King Sejong would be proud!`,
      visual: '🌍'
    }
  ];

  const currentStory = storySections[currentSection];

  const handleNext = () => {
    if (currentSection < storySections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setIsCompleted(true);
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSkip = () => {
    setIsCompleted(true);
    onComplete?.();
  };

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to the World of Hangul!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Now you understand the beautiful philosophy behind Korean writing. 
            Let's start learning the actual characters!
          </p>
          <button
            onClick={() => router.push(`/${locale}/characters/characters-basic-vowels-grouped`)}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-8 py-4 rounded-lg font-medium hover:from-gray-700 hover:to-gray-900 transition-all transform hover:scale-105"
          >
            Begin Learning Vowels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Story Progress
          </span>
          <span className="text-sm text-gray-500">
            {currentSection + 1} of {storySections.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-gray-600 to-gray-800 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentSection + 1) / storySections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Story Content */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{currentStory.visual}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentStory.title}
          </h1>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
          {currentStory.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Interactive Element */}
        {currentStory.interactive && (
          <div className="mb-8 bg-gray-50 rounded-xl p-6">
            {currentStory.interactive}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentSection === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentSection === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm"
          >
            Skip Story
          </button>

          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-700 hover:to-gray-900 transition-all"
          >
            {currentSection === storySections.length - 1 ? 'Start Learning' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Interactive Components
function CheonjinDiagram() {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-6">Cheonjiin Philosophy Visualization</h3>
      <div className="flex justify-center items-center space-x-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl font-bold text-blue-600">ㅣ</span>
          </div>
          <p className="text-sm font-medium">Heaven (천)</p>
          <p className="text-xs text-gray-500">Vertical</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl font-bold text-yellow-600">ㆍ</span>
          </div>
          <p className="text-sm font-medium">Human (인)</p>
          <p className="text-xs text-gray-500">Dot</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl font-bold text-green-600">ㅡ</span>
          </div>
          <p className="text-sm font-medium">Earth (지)</p>
          <p className="text-xs text-gray-500">Horizontal</p>
        </div>
      </div>
    </div>
  );
}

function VowelFormation() {
  const formations = [
    { vowel: 'ㅏ', formula: 'ㅣ + ㆍ', type: 'Bright', color: 'text-red-500' },
    { vowel: 'ㅓ', formula: 'ㆍ + ㅣ', type: 'Dark', color: 'text-blue-500' },
    { vowel: 'ㅗ', formula: 'ㅡ + ㆍ', type: 'Bright', color: 'text-red-500' },
    { vowel: 'ㅜ', formula: 'ㆍ + ㅡ', type: 'Dark', color: 'text-blue-500' }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 text-center">How Vowels Are Formed</h3>
      <div className="grid grid-cols-2 gap-4">
        {formations.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${item.color}`}>
                {item.vowel}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {item.formula}
              </div>
              <div className={`text-xs font-medium ${item.color}`}>
                {item.type} Sound
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsonantShapes() {
  const consonants = [
    { char: 'ㄱ', shape: 'Tongue touching soft palate', organ: '🗣️' },
    { char: 'ㄴ', shape: 'Tongue touching upper teeth', organ: '👅' },
    { char: 'ㅁ', shape: 'Closed lips', organ: '👄' },
    { char: 'ㅅ', shape: 'Teeth shape', organ: '🦷' }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 text-center">Scientific Consonant Design</h3>
      <div className="grid grid-cols-2 gap-4">
        {consonants.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 text-center">
            <div className="text-2xl mb-2">{item.organ}</div>
            <div className="text-3xl font-bold text-gray-700 mb-2">
              {item.char}
            </div>
            <div className="text-xs text-gray-600">
              {item.shape}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}