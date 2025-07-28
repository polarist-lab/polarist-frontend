'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentType, AuthorType, Difficulty, Category, LearningContent, WordbookMetadata, SentenceMetadata, KoreanWord, KoreanSentence } from '@/lib/types';
import { ContentManager } from '@/lib/content-manager';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';

interface ContentCreatorProps {
  locale: Locale;
  initialType?: ContentType;
  onClose?: () => void;
}

export function ContentCreator({ locale, initialType = 'wordbook', onClose }: ContentCreatorProps) {
  const { t } = useTranslations(locale);
  const router = useRouter();
  
  const [contentType, setContentType] = useState<ContentType>(initialType);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner' as Difficulty,
    categories: [] as Category[],
    tags: [] as string[],
    estimatedDuration: 30,
    isPrivate: false,
    
    // Wordbook specific
    wordCount: 20,
    minFrequency: 50,
    selectedWords: [] as KoreanWord[],
    
    // Sentence specific
    sentences: [] as KoreanSentence[],
    grammarFocus: [] as string[],
    
    // General
    customWords: '',
    customSentences: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const availableCategories: Category[] = [
    'basic', 'food', 'family', 'colors', 'numbers', 'greetings', 'time', 'travel',
    'emotions', 'daily-life', 'grammar', 'body', 'clothing', 'technology', 'nature',
    'health', 'education', 'entertainment', 'business', 'sports', 'culture', 'cooking',
    'shopping', 'transportation', 'weather', 'hobbies', 'relationships', 'animals',
    'places', 'music', 'art'
  ];

  const availableGrammarPoints = [
    'present-tense', 'past-tense', 'future-tense', 'honorifics', 'questions',
    'negation', 'comparatives', 'conditionals', 'imperatives', 'suggestions',
    'abilities', 'permissions', 'obligations', 'preferences', 'experiences'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: Category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generateContentId = (title: string, type: ContentType): string => {
    const sanitized = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    return `${type}-${sanitized}-${Date.now()}`;
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in title and description');
      return;
    }

    setIsLoading(true);

    try {
      const contentId = generateContentId(formData.title, contentType);
      
      let metadata: any = {};
      
      if (contentType === 'wordbook') {
        metadata = {
          wordCount: formData.wordCount,
          minFrequency: formData.minFrequency,
          difficulties: [formData.difficulty]
        } as WordbookMetadata;
      } else if (contentType === 'sentence') {
        metadata = {
          sentenceCount: formData.sentences.length,
          grammarFocus: formData.grammarFocus,
          vocabularyLevel: formData.difficulty
        } as SentenceMetadata;
      }

      const newContent: LearningContent = {
        id: contentId,
        type: contentType,
        authorType: 'user' as AuthorType,
        authorId: 'current-user', // 실제로는 로그인한 사용자 ID
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        categories: formData.categories,
        isPublished: !formData.isPrivate,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: formData.tags,
        estimatedDuration: formData.estimatedDuration,
        icon: contentType === 'wordbook' ? '📖' : contentType === 'sentence' ? '💬' : '🗺️',
        color: 'bg-indigo-500',
        metadata
      };

      ContentManager.saveContent(newContent);

      // 성공 메시지
      alert(`${contentType === 'wordbook' ? 'Wordbook' : contentType === 'sentence' ? 'Sentence Collection' : 'Roadmap'} created successfully!`);
      
      if (onClose) {
        onClose();
      } else {
        router.push(`/${locale}`);
      }
    } catch (error) {
      console.error('Failed to create content:', error);
      alert('Failed to create content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
            
            {/* Content Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
              <div className="grid grid-cols-3 gap-4">
                {(['wordbook', 'sentence', 'roadmap'] as ContentType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setContentType(type)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      contentType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {type === 'wordbook' ? '📖' : type === 'sentence' ? '💬' : '🗺️'}
                    </div>
                    <div className="font-medium capitalize">{type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${contentType} title...`}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Describe your ${contentType}...`}
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value as Difficulty)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="absolute-beginner">Absolute Beginner</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="upper-intermediate">Upper Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value) || 30)}
                min="5"
                max="300"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Categories & Tags</h2>
            
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categories (Select all that apply)
              </label>
              <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                {availableCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                      formData.categories.includes(category)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Selected: {formData.categories.length} categories
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add tags..."
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Grammar Focus (for sentences) */}
            {contentType === 'sentence' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Grammar Focus Areas
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {availableGrammarPoints.map(grammar => (
                    <button
                      key={grammar}
                      onClick={() => {
                        const current = formData.grammarFocus;
                        handleInputChange('grammarFocus', 
                          current.includes(grammar)
                            ? current.filter(g => g !== grammar)
                            : [...current, grammar]
                        );
                      }}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        formData.grammarFocus.includes(grammar)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {grammar}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Content & Settings</h2>
            
            {contentType === 'wordbook' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Word Count
                  </label>
                  <input
                    type="number"
                    value={formData.wordCount}
                    onChange={(e) => handleInputChange('wordCount', parseInt(e.target.value) || 20)}
                    min="5"
                    max="500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Frequency Score
                  </label>
                  <input
                    type="number"
                    value={formData.minFrequency}
                    onChange={(e) => handleInputChange('minFrequency', parseInt(e.target.value) || 50)}
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    Higher scores = more common words
                  </div>
                </div>
              </div>
            )}

            {contentType === 'sentence' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Sentences (Optional)
                </label>
                <textarea
                  value={formData.customSentences}
                  onChange={(e) => handleInputChange('customSentences', e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Korean sentences (one per line)..."
                />
                <div className="text-sm text-gray-500 mt-1">
                  Leave empty to use auto-generated sentences based on your categories
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            <div className="border-t pt-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">
                    Make this content private
                  </label>
                  <p className="text-sm text-gray-500">
                    Private content is only visible to you. Public content can be discovered by other users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create New Content</h1>
          <p className="text-gray-600 mt-2">Build your own Korean learning materials</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map(step => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              currentStep >= step
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                currentStep > step ? 'bg-blue-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!formData.title.trim() || !formData.description.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
            className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : '✨ Create Content'}
          </button>
        )}
      </div>
    </div>
  );
}