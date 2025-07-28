'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { LearningContent, RoadmapMetadata } from '@/lib/types';
import { ROADMAP_PRESETS } from '@/data/content-presets';

interface RoadmapShowcaseProps {
  locale: Locale;
  userTier?: string;
}

export function RoadmapShowcase({ locale, userTier = 'Iron5' }: RoadmapShowcaseProps) {
  const { t } = useTranslations(locale);
  const router = useRouter();
  const [selectedRoadmap, setSelectedRoadmap] = useState<LearningContent | null>(null);

  // 사용자 티어에 맞는 로드맵 필터링
  const getRecommendedRoadmap = () => {
    // Iron5 사용자를 위한 기본 로드맵
    return ROADMAP_PRESETS.find(roadmap => roadmap.id === 'roadmap-iron5-foundation') || ROADMAP_PRESETS[0];
  };

  const recommendedRoadmap = getRecommendedRoadmap();
  const otherRoadmaps = ROADMAP_PRESETS.filter(roadmap => roadmap.id !== recommendedRoadmap.id);

  const handleStartRoadmap = (roadmapId: string) => {
    // For Iron5 Foundation Path, start with the Hangul story
    if (roadmapId === 'roadmap-iron5-foundation') {
      router.push(`/${locale}/characters/hangul-story-introduction`);
    } else {
      // For other roadmaps, go to a general roadmap page (to be implemented)
      router.push(`/${locale}/roadmap/${roadmapId}`);
    }
  };

  const getStepIcon = (index: number) => {
    const icons = ['📝', '🔤', '🔀', '📚', '💬', '📖', '👨‍👩‍👧‍👦', '🗣️'];
    return icons[index] || '📖';
  };

  const getStepName = (contentId: string) => {
    const stepNames: Record<string, string> = {
      'hangul-story-introduction': 'Hangul Story',
      'characters-basic-vowels-grouped': 'Vowel Groups',
      'characters-basic-consonants-grouped': 'Consonant Groups',
      'characters-basic-vowels': 'Basic Vowels',
      'characters-basic-consonants': 'Basic Consonants', 
      'characters-basic-combinations': 'Basic Syllables',
      'wordbook-absolute-beginner': 'First Words',
      'sentences-greetings-basic': 'Greetings',
      'grammar-basic-particles': 'Basic Grammar',
      'wordbook-family-relationships': 'Family Terms',
      'sentences-daily-conversations': 'Daily Conversations'
    };
    return stepNames[contentId] || contentId;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your Learning Journey
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Follow a structured path from complete beginner to Korean proficiency. 
          Start with Hangul basics and progress through vocabulary and sentences.
        </p>
      </div>

      {/* Recommended Roadmap - Iron5 Foundation */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{recommendedRoadmap.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{recommendedRoadmap.title}</h2>
              <p className="text-gray-200">Recommended for {userTier} tier</p>
            </div>
          </div>
          
          <p className="text-gray-100 mb-8 text-lg leading-relaxed">
            {recommendedRoadmap.description}
          </p>

          {/* Learning Steps Preview */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Learning Steps ({(recommendedRoadmap.metadata as RoadmapMetadata).contentIds.length} stages)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(recommendedRoadmap.metadata as RoadmapMetadata).contentIds.slice(0, 8).map((contentId, index) => (
                <div key={contentId} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">{getStepIcon(index)}</div>
                  <div className="text-xs font-medium">{getStepName(contentId)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => handleStartRoadmap(recommendedRoadmap.id)}
              className="bg-white text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex-1 md:flex-none"
            >
              Start Learning Journey
            </button>
            <button
              onClick={() => setSelectedRoadmap(selectedRoadmap ? null : recommendedRoadmap)}
              className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Other Available Roadmaps */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Other Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherRoadmaps.map((roadmap) => (
            <div key={roadmap.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{roadmap.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{roadmap.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{roadmap.difficulty}</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {roadmap.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {Math.floor(roadmap.estimatedDuration / 60)}h {roadmap.estimatedDuration % 60}m
                </span>
                <button
                  onClick={() => handleStartRoadmap(roadmap.id)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
                >
                  Start Path
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access to Categories */}
      <div className="bg-gray-50 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Or explore by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { type: 'character', label: 'Hangul', icon: '📝', color: 'bg-red-100 text-red-700' },
            { type: 'wordbook', label: 'Vocabulary', icon: '📚', color: 'bg-blue-100 text-blue-700' },
            { type: 'sentence', label: 'Sentences', icon: '💬', color: 'bg-green-100 text-green-700' },
            { type: 'grammar', label: 'Grammar', icon: '📖', color: 'bg-purple-100 text-purple-700' }
          ].map((category) => (
            <button
              key={category.type}
              onClick={() => router.push(`/${locale}/${category.type}s`)}
              className={`${category.color} p-4 rounded-lg text-center hover:scale-105 transition-transform`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-medium text-sm">{category.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Roadmap View Modal */}
      {selectedRoadmap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedRoadmap.title}</h3>
                  <p className="text-gray-600">{selectedRoadmap.description}</p>
                </div>
                <button
                  onClick={() => setSelectedRoadmap(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {(selectedRoadmap.metadata as RoadmapMetadata).contentIds.map((contentId, index) => (
                  <div key={contentId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{getStepName(contentId)}</div>
                      <div className="text-sm text-gray-500">Step {index + 1} of {(selectedRoadmap.metadata as RoadmapMetadata).contentIds.length}</div>
                    </div>
                    <div className="text-xl">{getStepIcon(index)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => {
                    setSelectedRoadmap(null);
                    handleStartRoadmap(selectedRoadmap.id);
                  }}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Start This Roadmap
                </button>
                <button
                  onClick={() => setSelectedRoadmap(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}