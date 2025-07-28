'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LearningRoadmap, LearningContent, RoadmapMetadata } from '@/lib/types';
import { LearningTracker } from '@/lib/learning-tracker';
import { ContentManager } from '@/lib/content-manager';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';

interface RoadmapViewerProps {
  roadmap: LearningRoadmap;
  locale: Locale;
  className?: string;
}

interface RoadmapStepProps {
  content: LearningContent;
  index: number;
  isCompleted: boolean;
  isAvailable: boolean;
  isCurrent: boolean;
  onStart: (contentId: string) => void;
  locale: Locale;
}

function RoadmapStep({ 
  content, 
  index, 
  isCompleted, 
  isAvailable, 
  isCurrent, 
  onStart,
  locale 
}: RoadmapStepProps) {
  const { t } = useTranslations(locale);
  const progress = LearningTracker.getContentProgressById(content.id);

  const getStepIcon = () => {
    if (isCompleted) return '✅';
    if (isCurrent) return '🎯';
    if (isAvailable) return content.icon || '📚';
    return '🔒';
  };

  const getStepStatus = () => {
    if (isCompleted) return t('content.completed');
    if (isCurrent) return t('roadmaps.currentStep');
    if (isAvailable) return t('content.notStarted');
    return 'Locked';
  };

  const getContentTypeIcon = () => {
    switch (content.type) {
      case 'wordbook': return '📖';
      case 'sentence': return '💬';
      case 'roadmap': return '🗺️';
      default: return '📚';
    }
  };

  return (
    <div className={`roadmap-step ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${!isAvailable ? 'locked' : ''}`}>
      <div className="flex items-start gap-4 p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg">
        {/* Steps Number & Icon */}
        <div className="flex flex-col items-center min-w-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 transition-all ${
            isCompleted 
              ? 'bg-green-500 border-green-500 text-white' 
              : isCurrent 
                ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                : isAvailable
                  ? 'bg-white border-gray-300 text-gray-600 hover:border-blue-400'
                  : 'bg-gray-100 border-gray-200 text-gray-400'
          }`}>
            {isCompleted ? '✓' : index + 1}
          </div>
          <div className="text-xs mt-2 text-center font-medium text-gray-500">
            {getStepStatus()}
          </div>
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getContentTypeIcon()}</span>
            <h3 className={`font-semibold ${
              isAvailable ? 'text-gray-800' : 'text-gray-500'
            }`}>
              {content.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              content.difficulty === 'absolute-beginner' ? 'bg-green-100 text-green-700' :
              content.difficulty === 'beginner' ? 'bg-blue-100 text-blue-700' :
              content.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
              content.difficulty === 'advanced' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
            }`}>
              {content.difficulty}
            </span>
          </div>
          
          <p className={`text-sm mb-3 ${
            isAvailable ? 'text-gray-600' : 'text-gray-500'
          }`}>
            {content.description}
          </p>

          {/* Progress Bar */}
          {progress && progress.completionPercentage > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress.completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress.completionPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>⏱️ {content.estimatedDuration} min</span>
            {content.categories && content.categories.length > 0 && (
              <span>🏷️ {content.categories.slice(0, 2).join(', ')}</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => isAvailable && onStart(content.id)}
            disabled={!isAvailable}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isCompleted
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : isCurrent
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : isAvailable
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isCompleted ? '✓ Review' : isCurrent ? '▶ Continue' : isAvailable ? 'Start' : 'Locked'}
          </button>
          
          {progress && !isCompleted && (
            <div className="text-xs text-gray-500">
              {progress.itemsCompleted}/{progress.totalItems}
            </div>
          )}
        </div>
      </div>

      {/* Connection Line */}
      {index < 10 && ( // Assuming max 10 steps
        <div className="flex justify-center py-2">
          <div className={`w-0.5 h-6 ${
            isCompleted ? 'bg-green-300' : 'bg-gray-300'
          }`} />
        </div>
      )}

      <style jsx>{`
        .roadmap-step.current {
          transform: scale(1.02);
        }
        
        .roadmap-step.completed {
          opacity: 0.9;
        }
        
        .roadmap-step.locked {
          opacity: 0.6;
        }
        
        .roadmap-step:hover:not(.locked) {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export function RoadmapViewer({ roadmap, locale, className = '' }: RoadmapViewerProps) {
  const { t } = useTranslations(locale);
  const router = useRouter();
  const [roadmapContents, setRoadmapContents] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(true);

  const metadata = roadmap.metadata as RoadmapMetadata;

  useEffect(() => {
    // Load all contents for the roadmap
    const loadContents = async () => {
      setLoading(true);
      const contents: LearningContent[] = [];
      
      for (const contentId of metadata.contentIds) {
        const content = ContentManager.getContentById(contentId);
        if (content) {
          contents.push(content);
        }
      }
      
      setRoadmapContents(contents);
      setLoading(false);
    };

    loadContents();
  }, [metadata.contentIds]);

  const handleStartContent = (contentId: string) => {
    const content = ContentManager.getContentById(contentId);
    if (!content) return;

    // Record roadmap step start
    LearningTracker.recordStudyAction({
      contentId: roadmap.id,
      contentType: 'roadmap',
      itemId: metadata.contentIds.indexOf(contentId),
      action: 'view',
      timestamp: new Date(),
      mode: 'roadmap-step'
    });

    // Navigate to appropriate study page
    switch (content.type) {
      case 'wordbook':
        router.push(`/${locale}/study?wordbook=${contentId.replace('wordbook-', '')}`);
        break;
      case 'sentence':
        router.push(`/${locale}/sentences/${contentId}`);
        break;
      case 'roadmap':
        router.push(`/${locale}/roadmap/${contentId}`);
        break;
    }
  };

  // Calculate progress and current step
  const completedContents = roadmapContents.filter(content => 
    LearningTracker.isContentCompleted(content.id)
  );
  const overallProgress = roadmapContents.length > 0 
    ? Math.round((completedContents.length / roadmapContents.length) * 100)
    : 0;

  // Find current step (first non-completed content)
  const currentStepIndex = roadmapContents.findIndex(content => 
    !LearningTracker.isContentCompleted(content.id)
  );

  // Check if prerequisites are met for each step
  const isStepAvailable = (index: number): boolean => {
    // First step is always available
    if (index === 0) return true;
    
    // Check if all previous steps are completed
    for (let i = 0; i < index; i++) {
      if (!LearningTracker.isContentCompleted(roadmapContents[i].id)) {
        return false;
      }
    }
    return true;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`roadmap-viewer ${className}`}>
      {/* Roadmap Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{roadmap.icon || '🗺️'}</span>
              <div>
                <h1 className="text-3xl font-bold">{roadmap.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-blue-100">
                  <span className="text-sm">⏱️ {metadata.totalDuration} minutes</span>
                  <span className="text-sm">📚 {roadmapContents.length} steps</span>
                  <span className="text-sm">🎯 {roadmap.difficulty}</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-blue-100 leading-relaxed">
              {roadmap.description}
            </p>
          </div>

          {/* Overall Progress Circle */}
          <div className="flex flex-col items-center ml-8">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${overallProgress * 0.628} 62.8`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{overallProgress}%</span>
              </div>
            </div>
            <div className="text-sm text-blue-100 mt-2 text-center">
              {completedContents.length}/{roadmapContents.length} {t('roadmaps.completedSteps')}
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Steps */}
      <div className="space-y-0">
        {roadmapContents.map((content, index) => (
          <RoadmapStep
            key={content.id}
            content={content}
            index={index}
            isCompleted={LearningTracker.isContentCompleted(content.id)}
            isAvailable={isStepAvailable(index)}
            isCurrent={currentStepIndex === index}
            onStart={handleStartContent}
            locale={locale}
          />
        ))}
      </div>

      {/* Completion Message */}
      {overallProgress === 100 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center mt-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Congratulations!
          </h2>
          <p className="text-green-700 mb-4">
            You've completed the "{roadmap.title}" roadmap! You're well on your way to mastering Korean.
          </p>
          <button
            onClick={() => router.push(`/${locale}`)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            🏠 Back to Home
          </button>
        </div>
      )}

      {/* Next Steps Recommendation */}
      {overallProgress > 0 && overallProgress < 100 && currentStepIndex >= 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8">
          <h3 className="font-semibold text-blue-800 mb-2">
            🎯 {t('roadmaps.nextStep')}
          </h3>
          <p className="text-blue-700 mb-4">
            Continue with "{roadmapContents[currentStepIndex]?.title}" to keep progressing on your Korean learning journey.
          </p>
          <button
            onClick={() => handleStartContent(roadmapContents[currentStepIndex]?.id)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            ▶ Continue Learning
          </button>
        </div>
      )}
    </div>
  );
}