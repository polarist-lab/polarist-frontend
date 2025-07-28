'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LearningContent, ContentFilter, ContentType, WordbookMetadata, SentenceMetadata, RoadmapMetadata } from '@/lib/types';
import { ContentManager } from '@/lib/content-manager';
import { LearningTracker } from '@/lib/learning-tracker';
import { AdvancedContentFilter } from './advanced-content-filter';
import { ContentCreator } from './content-creator';
import { GroupedContentView } from './content-sections/grouped-content-view';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';

interface UnifiedContentSelectorProps {
  locale: Locale;
  defaultFilter?: ContentFilter;
  className?: string;
}

interface ContentCardProps {
  content: LearningContent;
  progress?: any;
  onSelect: (content: LearningContent) => void;
  locale: Locale;
}

function ContentCard({ content, progress, onSelect, locale }: ContentCardProps) {
  const { t } = useTranslations(locale);

  const getContentTypeIcon = () => {
    switch (content.type) {
      case 'wordbook': return '📖';
      case 'sentence': return '💬';
      case 'roadmap': return '🗺️';
      case 'character': return '🔤';
      case 'grammar': return '📖';
      default: return '📚';
    }
  };

  const getAuthorTypeIcon = () => {
    switch (content.authorType) {
      case 'official': return '🏢';
      case 'community': return '👥';
      case 'user': return '👤';
      default: return '📝';
    }
  };

  const getDifficultyColor = () => {
    switch (content.difficulty) {
      case 'absolute-beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'beginner': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'upper-intermediate': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      case 'expert': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMetadataText = () => {
    switch (content.type) {
      case 'wordbook':
        const wbMeta = content.metadata as WordbookMetadata;
        return `${wbMeta?.wordCount || 0} words`;
      case 'sentence':
        const sMeta = content.metadata as SentenceMetadata;
        return `${sMeta?.sentenceCount || 0} sentences`;
      case 'roadmap':
        const rMeta = content.metadata as RoadmapMetadata;
        return `${rMeta?.contentIds?.length || 0} steps`;
      case 'character':
        const cMeta = content.metadata as any;
        return `${cMeta?.characterCount || 0} characters`;
      case 'grammar':
        const gMeta = content.metadata as any;
        return `${gMeta?.ruleCount || 0} rules`;
      default:
        return '';
    }
  };

  return (
    <div
      onClick={() => onSelect(content)}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{content.icon || getContentTypeIcon()}</span>
          <div>
            <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {content.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                {getAuthorTypeIcon()} {t(`content.${content.authorType}`)}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">
                ⏱️ {content.estimatedDuration}min
              </span>
            </div>
          </div>
        </div>

        {/* Completion Badge */}
        {progress?.isCompleted && (
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            ✓
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {content.description}
      </p>

      {/* Progress Bar */}
      {progress && progress.completionPercentage > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress.completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                progress.isCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress.completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor()}`}>
            {content.difficulty}
          </span>
          <span className="text-xs text-gray-500">
            {getMetadataText()}
          </span>
        </div>

        {/* Prerequisites indicator */}
        {content.prerequisites && content.prerequisites.length > 0 && (
          <div className="text-xs text-amber-600 flex items-center gap-1">
            🔒 {content.prerequisites.length} prereq
          </div>
        )}
      </div>

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {content.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {content.tags.length > 3 && (
            <span className="text-xs text-gray-400">
              +{content.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function UnifiedContentSelector({ 
  locale, 
  defaultFilter = {}, 
  className = ''
}: UnifiedContentSelectorProps) {
  const { t } = useTranslations(locale);
  const router = useRouter();
  
  const [filter, setFilter] = useState<ContentFilter>(defaultFilter);
  const [allContent, setAllContent] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'grouped'>('grouped');
  const [showCreator, setShowCreator] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load content and initialize
  useEffect(() => {
    const loadContent = () => {
      setLoading(true);
      // Initialize content database if needed
      const content = ContentManager.getAllContent();
      if (content.length === 0) {
        // Load preset content
        import('@/data/content-presets').then(({ ALL_CONTENT_PRESETS }) => {
          ALL_CONTENT_PRESETS.forEach(preset => {
            ContentManager.saveContent(preset);
          });
          setAllContent(ContentManager.getAllContent());
          setLoading(false);
        });
      } else {
        setAllContent(content);
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Filter and search content
  const filteredContent = useMemo(() => {
    let content = allContent;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      content = content.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    return ContentManager.getFilteredContent(filter).filter(item =>
      content.some(c => c.id === item.id)
    );
  }, [allContent, filter, searchQuery]);

  // Get progress for all content
  const progressMap = useMemo(() => {
    const progress = LearningTracker.getContentProgress();
    return new Map(progress.map(p => [p.contentId, p]));
  }, []);

  const handleContentSelect = (content: LearningContent) => {
    // Record content selection
    LearningTracker.startContent(content.id, content.type, 
      content.type === 'wordbook' ? (content.metadata as WordbookMetadata)?.wordCount || 50 :
      content.type === 'sentence' ? (content.metadata as SentenceMetadata)?.sentenceCount || 20 :
      (content.metadata as RoadmapMetadata)?.contentIds?.length || 5
    );

    // Navigate to appropriate page
    switch (content.type) {
      case 'wordbook':
        const wordbookId = content.id.replace('wordbook-', '');
        router.push(`/${locale}/study?wordbook=${wordbookId}`);
        break;
      case 'sentence':
        router.push(`/${locale}/sentences/${content.id}`);
        break;
      case 'roadmap':
        router.push(`/${locale}/roadmap/${content.id}`);
        break;
    }
  };

  const getStatsText = () => {
    const total = filteredContent.length;
    const completed = filteredContent.filter(c => 
      progressMap.get(c.id)?.isCompleted
    ).length;
    const inProgress = filteredContent.filter(c => {
      const progress = progressMap.get(c.id);
      return progress && !progress.isCompleted && progress.itemsCompleted > 0;
    }).length;

    return `${total} items • ${completed} completed • ${inProgress} in progress`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`unified-content-selector ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {t('content.selectContent')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('content.selectContentDesc')}
            </p>
          </div>

          <button
            onClick={() => setShowCreator(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            ✨ {t('content.createCustom')}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grouped'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🗂️ Grouped
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 List
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AdvancedContentFilter
          initialFilter={filter}
          onFilterChange={setFilter}
          locale={locale}
        />

        {/* Stats */}
        <div className="text-sm text-gray-600 mt-4">
          {getStatsText()}
        </div>
      </div>

      {/* Content Grid/List/Grouped */}
      {filteredContent.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No content found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or search terms.
          </p>
          <button
            onClick={() => {
              setFilter({});
              setSearchQuery('');
            }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grouped' ? (
        <GroupedContentView
          content={filteredContent}
          locale={locale}
          filter={filter}
        />
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredContent.map(content => (
            <ContentCard
              key={content.id}
              content={content}
              progress={progressMap.get(content.id)}
              onSelect={handleContentSelect}
              locale={locale}
            />
          ))}
        </div>
      )}

      {/* Content Creator Modal */}
      {showCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-screen overflow-y-auto">
            <ContentCreator
              locale={locale}
              onClose={() => {
                setShowCreator(false);
                // Refresh content after creation
                setAllContent(ContentManager.getAllContent());
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}