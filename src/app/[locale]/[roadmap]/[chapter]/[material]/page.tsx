'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Locale, isValidLocale } from '@/lib/i18n/config';
import { LearningMaterial, LearningContext, DocumentMaterial } from '@/lib/content-types';
import { DocumentRenderer } from '@/components/learning-materials/document-renderer';
import { CharacterDeck } from '@/components/character-deck';
import { HangulStory } from '@/components/hangul-story';
import { BreadcrumbNav } from '@/components/navigation/breadcrumb-nav';
import { ALL_CONTENT_PRESETS } from '@/data/content-presets';
import { getMarkdownContent } from '@/lib/markdown-loader';

export default function LearningMaterialPage() {
  const params = useParams();
  const router = useRouter();
  
  const locale = params?.locale as string;
  const roadmap = params?.roadmap as string;
  const chapter = params?.chapter as string;
  const material = params?.material as string;
  
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en';
  
  const [learningMaterial, setLearningMaterial] = useState<LearningMaterial | null>(null);
  const [context, setContext] = useState<LearningContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMaterial = async () => {
      setLoading(true);
      setError(null);

      try {
        // Handle document materials first (markdown content)
        const markdownMaterials = [
          'hangul-history-introduction',
          'vowel-groups-introduction', 
          'consonant-groups-introduction',
          'basic-combinations-introduction'
        ];
        
        if (markdownMaterials.includes(material)) {
          const markdownData = getMarkdownContent(material);
          
          if (markdownData) {
            const learningContext: LearningContext = {
              roadmapTier: roadmap,
              chapterNumber: parseInt(chapter),
              materialId: material,
              materialType: 'document',
              breadcrumb: {
                roadmapTitle: getRoadmapTitle(roadmap),
                chapterTitle: getChapterTitle(roadmap, parseInt(chapter)),
                materialTitle: markdownData.title
              },
              ...getNavigationData(roadmap, parseInt(chapter), material, validLocale)
            };

            setLearningMaterial(markdownData);
            setContext(learningContext);
            return;
          }
        }

        // Handle character materials that already exist
        if (material === 'hangul-story-introduction' || 
            material === 'characters-basic-vowels-grouped' ||
            material === 'characters-basic-consonants-grouped' ||
            material === 'characters-basic-combinations') {
          
          // Find the content in existing presets
          const contentData = ALL_CONTENT_PRESETS.find(c => c.id === material);
          
          if (!contentData) {
            setError('Learning material not found');
            return;
          }

          // Convert to our new format
          const materialData: LearningMaterial = {
            id: contentData.id,
            type: 'character',
            title: contentData.title,
            description: contentData.description || '',
            content: contentData.metadata,
            estimatedTime: contentData.estimatedDuration,
            difficulty: contentData.difficulty as 'beginner' | 'intermediate' | 'advanced',
            tags: [contentData.category],
            roadmapTier: roadmap,
            chapterNumber: parseInt(chapter)
          };

          // Create context
          const learningContext: LearningContext = {
            roadmapTier: roadmap,
            chapterNumber: parseInt(chapter),
            materialId: material,
            materialType: 'character',
            breadcrumb: {
              roadmapTitle: getRoadmapTitle(roadmap),
              chapterTitle: getChapterTitle(roadmap, parseInt(chapter)),
              materialTitle: contentData.title
            },
            ...getNavigationData(roadmap, parseInt(chapter), material, validLocale)
          };

          setLearningMaterial(materialData);
          setContext(learningContext);
        } else {
          // Handle new material types (words, sentences, practice, test)
          setError('Material type not yet implemented');
        }

      } catch (err) {
        console.error('Failed to load learning material:', err);
        setError('Failed to load learning material');
      } finally {
        setLoading(false);
      }
    };

    if (roadmap && chapter && material) {
      loadMaterial();
    }
  }, [roadmap, chapter, material]);

  // Helper functions
  const getRoadmapTitle = (roadmapId: string) => {
    const tierMap: Record<string, string> = {
      'iron5': 'Iron 5',
      'iron4': 'Iron 4',
      'iron3': 'Iron 3',
      'iron2': 'Iron 2',
      'iron1': 'Iron 1',
      'silver5': 'Silver 5',
      'silver4': 'Silver 4',
      'silver3': 'Silver 3',
      'silver2': 'Silver 2',
      'silver1': 'Silver 1',
      // Add more as needed
    };
    return tierMap[roadmapId] || roadmapId;
  };

  const getChapterTitle = (roadmapId: string, chapterNum: number) => {
    if (roadmapId === 'iron5') {
      const chapters = [
        'The Story of Hangul',
        'Understanding Vowel Groups',
        'Consonant Groups by Pronunciation',
        'Combining Characters into Syllables'
      ];
      return chapters[chapterNum - 1] || `Chapter ${chapterNum}`;
    }
    return `Chapter ${chapterNum}`;
  };

  // Navigation data for Iron5 roadmap
  const getNavigationData = (roadmapId: string, chapterNum: number, currentMaterial: string, locale: Locale) => {
    if (roadmapId !== 'iron5') return {};

    // Define the sequence of materials across all chapters
    const iron5Sequence = [
      // Chapter 1
      { id: 'hangul-history-introduction', title: 'History of Hangul', chapter: 1 },
      { id: 'hangul-story-introduction', title: 'Hangul Story', chapter: 1 },
      
      // Chapter 2  
      { id: 'vowel-groups-introduction', title: 'Vowel Groups', chapter: 2 },
      { id: 'characters-basic-vowels-grouped', title: 'Basic Vowels Practice', chapter: 2 },
      
      // Chapter 3
      { id: 'consonant-groups-introduction', title: 'Consonant Groups', chapter: 3 },
      { id: 'characters-basic-consonants-grouped', title: 'Basic Consonants Practice', chapter: 3 },
      
      // Chapter 4
      { id: 'basic-combinations-introduction', title: 'Basic Combinations', chapter: 4 },
      { id: 'characters-basic-combinations', title: 'Combinations Practice', chapter: 4 }
    ];

    const currentIndex = iron5Sequence.findIndex(item => item.id === currentMaterial);
    if (currentIndex === -1) return {};

    const previousMaterial = currentIndex > 0 ? iron5Sequence[currentIndex - 1] : null;
    const nextMaterial = currentIndex < iron5Sequence.length - 1 ? iron5Sequence[currentIndex + 1] : null;

    return {
      previousMaterial: previousMaterial ? {
        id: previousMaterial.id,
        title: previousMaterial.title,
        href: `/${locale}/${roadmapId}/${previousMaterial.chapter}/${previousMaterial.id}`
      } : undefined,
      nextMaterial: nextMaterial ? {
        id: nextMaterial.id,
        title: nextMaterial.title,
        href: `/${locale}/${roadmapId}/${nextMaterial.chapter}/${nextMaterial.id}`
      } : undefined
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading learning material...</p>
        </div>
      </div>
    );
  }

  if (error || !learningMaterial || !context) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4 opacity-50">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Learning Material Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push(`/${validLocale}`)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            🏠 Back to Roadmap
          </button>
        </div>
      </div>
    );
  }

  // Render based on material type
  const renderMaterial = () => {
    switch (learningMaterial.type) {
      case 'document':
        return (
          <div className="min-h-screen bg-white">
            <BreadcrumbNav context={context} locale={validLocale} />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <DocumentRenderer
                material={learningMaterial as DocumentMaterial}
                context={context}
                locale={validLocale}
              />
            </div>
          </div>
        );
      
      case 'character':
        // Use existing character components but with new navigation
        if (learningMaterial.id === 'hangul-story-introduction') {
          return (
            <div className="min-h-screen bg-gray-50">
              <BreadcrumbNav context={context} locale={validLocale} />
              <div className="max-w-6xl mx-auto px-4 py-8">
                <HangulStory 
                  locale={validLocale}
                  onComplete={() => {
                    // Navigate to next material in sequence
                    router.push(`/${validLocale}/${roadmap}/${chapter}/characters-basic-vowels-grouped`);
                  }}
                />
              </div>
            </div>
          );
        } else {
          return (
            <div className="min-h-screen bg-gray-50">
              <BreadcrumbNav context={context} locale={validLocale} />
              <div className="max-w-6xl mx-auto px-4 py-8">
                <CharacterDeck 
                  content={{
                    id: learningMaterial.id,
                    title: learningMaterial.title,
                    description: learningMaterial.description,
                    type: 'character',
                    category: 'character',
                    difficulty: learningMaterial.difficulty,
                    estimatedDuration: learningMaterial.estimatedTime,
                    metadata: learningMaterial.content
                  }}
                  locale={validLocale}
                />
              </div>
            </div>
          );
        }
      
      case 'words':
      case 'sentences':
      case 'practice':
      case 'test':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Coming Soon
              </h2>
              <p className="text-gray-600 mb-6">
                {learningMaterial.type} materials are currently in development.
              </p>
              <button
                onClick={() => router.push(`/${validLocale}/${roadmap}`)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Back to Chapter
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-4 opacity-50">❓</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Unknown Material Type
              </h2>
              <p className="text-gray-600 mb-6">
                This material type is not supported yet.
              </p>
              <button
                onClick={() => router.push(`/${validLocale}/${roadmap}`)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Back to Chapter
              </button>
            </div>
          </div>
        );
    }
  };

  return renderMaterial();
}