'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LearningContent, ContentFilter, WordbookMetadata, SentenceMetadata, RoadmapMetadata, CharacterMetadata } from '@/lib/types';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';

interface GroupedContentViewProps {
  content: LearningContent[];
  locale: Locale;
  filter?: ContentFilter;
  className?: string;
}

interface ContentCardProps {
  content: LearningContent;
  onSelect: (content: LearningContent) => void;
  locale: Locale;
  variant: 'roadmap' | 'wordbook' | 'sentence' | 'character';
}

function ContentCard({ content, onSelect, locale, variant }: ContentCardProps) {
  const { t } = useTranslations(locale);

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
        const cMeta = content.metadata as CharacterMetadata;
        return `${cMeta?.characterCount || 0} characters`;
      default:
        return '';
    }
  };

  // 콘텐츠 타입별 고유한 스타일링
  const getCardStyles = () => {
    switch (variant) {
      case 'roadmap':
        return {
          container: 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:border-orange-300 hover:shadow-orange-100',
          icon: 'text-4xl',
          title: 'text-xl font-bold text-orange-800',
          description: 'text-orange-700 h-12',
          accent: 'bg-gradient-to-r from-orange-500 to-red-500'
        };
      case 'wordbook':
        return {
          container: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 hover:shadow-blue-100',
          icon: 'text-3xl',
          title: 'text-lg font-bold text-blue-800',
          description: 'text-blue-700 h-10',
          accent: 'bg-gradient-to-r from-blue-500 to-indigo-500'
        };
      case 'sentence':
        return {
          container: 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 hover:border-teal-300 hover:shadow-teal-100',
          icon: 'text-2xl',
          title: 'text-base font-semibold text-teal-800',
          description: 'text-teal-700 h-8 text-sm',
          accent: 'bg-gradient-to-r from-teal-500 to-cyan-500'
        };
      case 'character':
        return {
          container: 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:border-purple-300 hover:shadow-purple-100',
          icon: 'text-2xl',
          title: 'text-sm font-semibold text-purple-800',
          description: 'text-purple-700 h-6 text-xs',
          accent: 'bg-gradient-to-r from-purple-500 to-violet-500'
        };
      default:
        return {
          container: 'bg-white border-gray-200 hover:border-gray-300',
          icon: 'text-2xl',
          title: 'text-base font-semibold text-gray-800',
          description: 'text-gray-600',
          accent: 'bg-gray-500'
        };
    }
  };

  const styles = getCardStyles();

  return (
    <div
      onClick={() => onSelect(content)}
      className={`${styles.container} border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={styles.icon}>{content.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className={`${styles.title} group-hover:text-opacity-80 transition-colors truncate`}>
              {content.title}
            </h3>
          </div>
        </div>
        
        {variant === 'roadmap' && (
          <div className="text-orange-600 text-xs bg-orange-100 px-2 py-1 rounded-full">
            PATH
          </div>
        )}
      </div>

      {/* Description */}
      <p className={`${styles.description} leading-tight mb-3 overflow-hidden`}>
        {content.description}
      </p>

      {/* Progress bar for roadmaps */}
      {variant === 'roadmap' && (
        <div className="mb-3">
          <div className="w-full bg-orange-200 rounded-full h-1.5">
            <div 
              className={`${styles.accent} h-1.5 rounded-full transition-all duration-300`}
              style={{ width: '25%' }} // 실제 진도율 계산 가능
            />
          </div>
          <div className="text-xs text-orange-600 mt-1">Step 1 of 4</div>
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

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>⏱️</span>
          <span>{content.estimatedDuration}min</span>
        </div>
      </div>

      {/* Hover Effect */}
      <div className={`${styles.accent} h-1 rounded-b-xl mx-[-1rem] mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  );
}

export function GroupedContentView({ content, locale, filter, className = '' }: GroupedContentViewProps) {
  const { t } = useTranslations(locale);
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['roadmaps', 'wordbooks']));

  // 콘텐츠를 타입별로 그룹화 (문자는 하위타입별로 세분화)
  const groupedContent = useMemo(() => {
    const groups = {
      roadmaps: content.filter(c => c.type === 'roadmap'),
      wordbooks: content.filter(c => c.type === 'wordbook'),
      sentences: content.filter(c => c.type === 'sentence'),
      characters: {
        vowels: content.filter(c => 
          c.type === 'character' && 
          (c.metadata as CharacterMetadata)?.characterType === 'vowel'
        ),
        consonants: content.filter(c => 
          c.type === 'character' && 
          (c.metadata as CharacterMetadata)?.characterType === 'consonant'
        ),
        combinations: content.filter(c => 
          c.type === 'character' && 
          ['complex-vowel', 'double-consonant'].includes((c.metadata as CharacterMetadata)?.characterType)
        )
      }
    };

    return groups;
  }, [content]);

  const handleContentSelect = (content: LearningContent) => {
    // 네비게이션 로직
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
      case 'character':
        router.push(`/${locale}/characters/${content.id}`);
        break;
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'roadmaps': return '🗺️';
      case 'wordbooks': return '📖';
      case 'sentences': return '💬';
      case 'vowels': return '🅰️';
      case 'consonants': return '🔤';
      case 'combinations': return '🔗';
      default: return '📚';
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'roadmaps': return 'Learning Roadmaps';
      case 'wordbooks': return 'Word Collections';
      case 'sentences': return 'Sentence Practice';
      case 'vowels': return 'Korean Vowels';
      case 'consonants': return 'Korean Consonants';
      case 'combinations': return 'Character Combinations';
      default: return 'Content';
    }
  };

  const getSectionDescription = (section: string) => {
    switch (section) {
      case 'roadmaps': return 'Structured learning paths to guide your Korean journey';
      case 'wordbooks': return 'Vocabulary collections organized by topic and difficulty';
      case 'sentences': return 'Practice real Korean sentences with grammar focus';
      case 'vowels': return 'Master basic Korean vowel sounds and characters';
      case 'consonants': return 'Learn Korean consonants and their pronunciations';
      case 'combinations': return 'Advanced character combinations and complex sounds';
      default: return '';
    }
  };

  const getGridClass = (section: string) => {
    switch (section) {
      case 'roadmaps': return 'grid-cols-1 lg:grid-cols-2 gap-6';
      case 'wordbooks': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
      case 'sentences': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3';
      case 'vowels':
      case 'consonants':
      case 'combinations': return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    }
  };

  const renderSection = (sectionId: string, items: LearningContent[], variant: 'roadmap' | 'wordbook' | 'sentence' | 'character') => {
    if (items.length === 0) return null;

    const isExpanded = expandedSections.has(sectionId);

    return (
      <div key={sectionId} className="mb-8">
        <button
          onClick={() => toggleSection(sectionId)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors mb-4"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">{getSectionIcon(sectionId)}</span>
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-800">
                {getSectionTitle(sectionId)}
              </h2>
              <p className="text-sm text-gray-600">
                {getSectionDescription(sectionId)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {items.length} items
            </span>
            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ⬇️
            </span>
          </div>
        </button>

        {isExpanded && (
          <div className={`grid ${getGridClass(sectionId)} animate-in slide-in-from-top duration-300`}>
            {items.map(item => (
              <ContentCard
                key={item.id}
                content={item}
                onSelect={handleContentSelect}
                locale={locale}
                variant={variant}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`grouped-content-view ${className}`}>
      {/* Roadmaps Section */}
      {renderSection('roadmaps', groupedContent.roadmaps, 'roadmap')}

      {/* Wordbooks Section */}
      {renderSection('wordbooks', groupedContent.wordbooks, 'wordbook')}

      {/* Sentences Section */}
      {renderSection('sentences', groupedContent.sentences, 'sentence')}

      {/* Character Sections */}
      <div className="mb-8">
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200 mb-4">
          <span className="text-3xl">🔤</span>
          <div>
            <h2 className="text-xl font-bold text-purple-800">
              Korean Characters (Hangul)
            </h2>
            <p className="text-sm text-purple-600">
              Master the Korean writing system step by step
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {renderSection('vowels', groupedContent.characters.vowels, 'character')}
          {renderSection('consonants', groupedContent.characters.consonants, 'character')}
          {renderSection('combinations', groupedContent.characters.combinations, 'character')}
        </div>
      </div>

      {/* Empty State */}
      {content.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">📚</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No content available
          </h3>
          <p className="text-gray-600">
            Content will appear here as it becomes available.
          </p>
        </div>
      )}
    </div>
  );
}