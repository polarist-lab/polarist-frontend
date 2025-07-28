'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';
import { RoadmapViewer } from '@/components/roadmap-viewer';
import { ContentManager } from '@/lib/content-manager';
import { LearningContent, LearningRoadmap, RoadmapMetadata } from '@/lib/types';
import { LearningTracker } from '@/lib/learning-tracker';

export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const roadmapId = params?.id as string;
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  const { t } = useTranslations(validLocale);

  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoadmapContent = async () => {
      setLoading(true);
      setError(null);

      try {
        // 로드맵 콘텐츠 로드
        const contentData = ContentManager.getContentById(roadmapId);
        
        if (!contentData) {
          setError('Roadmap not found');
          return;
        }

        if (contentData.type !== 'roadmap') {
          setError('Invalid content type');
          return;
        }

        // 로드맵의 모든 콘텐츠 로드
        const metadata = contentData.metadata as RoadmapMetadata;
        const roadmapContents: LearningContent[] = [];
        
        for (const contentId of metadata.contentIds) {
          const content = ContentManager.getContentById(contentId);
          if (content) {
            roadmapContents.push(content);
          }
        }

        const roadmapData: LearningRoadmap = {
          ...contentData,
          type: 'roadmap',
          contents: roadmapContents,
          metadata
        };

        setRoadmap(roadmapData);

        // 로드맵 시작 기록
        LearningTracker.startContent(
          roadmapId, 
          'roadmap', 
          metadata.contentIds.length
        );

      } catch (err) {
        console.error('Failed to load roadmap content:', err);
        setError('Failed to load roadmap');
      } finally {
        setLoading(false);
      }
    };

    if (roadmapId) {
      loadRoadmapContent();
    }
  }, [roadmapId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4 opacity-50">🗺️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Roadmap Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push(`/${validLocale}`)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push(`/${validLocale}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Content
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <RoadmapViewer 
          roadmap={roadmap} 
          locale={validLocale}
        />
      </div>
    </div>
  );
}