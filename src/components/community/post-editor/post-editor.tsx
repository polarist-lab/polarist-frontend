'use client';

import { useState, useEffect } from 'react';
import { Post, PostCategory, PostType, Difficulty, PostTag } from '@/lib/community/types';
import { Locale } from '@/lib/i18n/config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PostEditorProps {
  locale: Locale;
  initialPost?: Partial<Post>;
  onSave: (post: Omit<Post, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PostEditor({
  locale,
  initialPost,
  onSave,
  onCancel,
  isLoading = false
}: PostEditorProps) {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [category, setCategory] = useState<PostCategory>(initialPost?.category || 'general');
  const [type, setType] = useState<PostType>(initialPost?.type || 'text');
  const [difficulty, setDifficulty] = useState<Difficulty>(initialPost?.difficulty || 'beginner');
  const [language, setLanguage] = useState<'ko' | 'en' | 'both'>(initialPost?.language || 'both');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<PostTag[]>(initialPost?.tags || []);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { id: 'grammar', ko: '문법', en: 'Grammar', icon: '📚' },
    { id: 'vocabulary', ko: '어휘', en: 'Vocabulary', icon: '📝' },
    { id: 'pronunciation', ko: '발음', en: 'Pronunciation', icon: '🗣️' },
    { id: 'culture', ko: '문화', en: 'Culture', icon: '🎭' },
    { id: 'exam', ko: '시험', en: 'Exam Prep', icon: '📋' },
    { id: 'conversation', ko: '회화', en: 'Conversation', icon: '💬' },
    { id: 'writing', ko: '쓰기', en: 'Writing', icon: '✍️' },
    { id: 'listening', ko: '듣기', en: 'Listening', icon: '👂' },
    { id: 'reading', ko: '읽기', en: 'Reading', icon: '📖' },
    { id: 'general', ko: '일반', en: 'General', icon: '🌟' }
  ] as const;

  const difficulties = [
    { id: 'beginner', ko: '초급', en: 'Beginner' },
    { id: 'intermediate', ko: '중급', en: 'Intermediate' },
    { id: 'advanced', ko: '고급', en: 'Advanced' }
  ] as const;

  const languages = [
    { id: 'ko', ko: '한국어', en: 'Korean' },
    { id: 'en', ko: '영어', en: 'English' },
    { id: 'both', ko: '한국어+영어', en: 'Korean+English' }
  ] as const;

  // Calculate estimated read time
  const estimatedReadTime = Math.max(1, Math.ceil(content.split(' ').length / 200));

  // Generate excerpt
  const excerpt = content.length > 150 ? content.substring(0, 150) + '...' : content;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.some(tag => tag.name === trimmedTag)) {
      const newTag: PostTag = {
        id: `tag_${Date.now()}`,
        name: trimmedTag,
        category: category
      };
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const postData = {
      title: title.trim(),
      content: content.trim(),
      excerpt,
      category,
      type,
      difficulty,
      tags,
      media: [], // TODO: Implement media upload
      interactions: {
        likes: 0,
        dislikes: 0,
        comments: 0,
        bookmarks: 0,
        shares: 0,
        views: 0
      },
      isBookmarked: false,
      userLiked: false,
      publishedAt: new Date(),
      isPublished: true,
      language,
      estimatedReadTime,
      koreanLevel: difficulty === 'beginner' ? '초급' : difficulty === 'intermediate' ? '중급' : '고급'
    };

    onSave(postData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Cancel
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={isLoading || !title.trim() || !content.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!showPreview ? (
          /* Editor Mode */
          <div className="space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Write an engaging title..."
                className={`w-full text-3xl font-bold border-none outline-none bg-transparent placeholder-gray-400 ${
                  errors.title ? 'text-red-600' : 'text-gray-900'
                }`}
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Post Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PostCategory)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat[locale]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff.id} value={diff.id}>
                        {diff[locale]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'ko' | 'en' | 'both')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang[locale]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    #{tag.name}
                    <button
                      onClick={() => handleRemoveTag(tag.id)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tags..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-3">
                <h3 className="text-lg font-semibold text-gray-900">Content</h3>
                <p className="text-sm text-gray-500">
                  Use Markdown for formatting. ~{estimatedReadTime} min read
                </p>
              </div>
              
              <div className="p-6">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here using Markdown...

Examples:
# Heading 1
## Heading 2
**Bold text**
*Italic text*
- Bullet points
1. Numbered lists
> Quotes
\`code\`"
                  className={`w-full h-96 border border-gray-300 rounded-lg p-4 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.content ? 'border-red-300' : ''
                  }`}
                />
                {errors.content && (
                  <p className="text-red-600 text-sm mt-2">{errors.content}</p>
                )}
                
                <div className="mt-2 text-sm text-gray-500">
                  {content.length} characters
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">~{estimatedReadTime} min read</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{title || 'Untitled'}</h1>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <span key={tag.id} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                    #{tag.name}
                  </span>
                ))}
              </div>
              
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || '*No content yet...*'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}