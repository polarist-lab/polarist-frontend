import { Difficulty, Category } from '@/lib/types';

// 미리 정의된 단어장 설정들
export interface WordbookPreset {
  id: string;
  titleKey: string; // 번역 키
  descriptionKey: string; // 번역 키
  icon: string;
  color: string;
  difficulties: Difficulty[];
  categories?: Category[];
  wordCount: number;
  minFrequency: number;
}

export const WORDBOOK_PRESETS: WordbookPreset[] = [
  // 난이도별 단어장
  {
    id: 'absolute-beginner',
    titleKey: 'wordbooks.absoluteBeginner',
    descriptionKey: 'wordbooks.absoluteBeginnerDesc',
    icon: '🌱',
    color: 'bg-green-500',
    difficulties: ['absolute-beginner'],
    wordCount: 50,
    minFrequency: 70,
  },
  {
    id: 'beginner',
    titleKey: 'wordbooks.beginner',
    descriptionKey: 'wordbooks.beginnerDesc',
    icon: '📚',
    color: 'bg-blue-500',
    difficulties: ['beginner'],
    wordCount: 100,
    minFrequency: 50,
  },
  {
    id: 'intermediate',
    titleKey: 'wordbooks.intermediate',
    descriptionKey: 'wordbooks.intermediateDesc',
    icon: '🎯',
    color: 'bg-yellow-500',
    difficulties: ['intermediate'],
    wordCount: 150,
    minFrequency: 30,
  },
  {
    id: 'advanced',
    titleKey: 'wordbooks.advanced',
    descriptionKey: 'wordbooks.advancedDesc',
    icon: '🚀',
    color: 'bg-purple-500',
    difficulties: ['advanced', 'upper-intermediate'],
    wordCount: 200,
    minFrequency: 10,
  },
  
  // 테마별 단어장
  {
    id: 'daily-conversation',
    titleKey: 'wordbooks.dailyConversation',
    descriptionKey: 'wordbooks.dailyConversationDesc',
    icon: '💬',
    color: 'bg-pink-500',
    difficulties: ['absolute-beginner', 'beginner'],
    categories: ['basic', 'greetings', 'emotions'],
    wordCount: 80,
    minFrequency: 60,
  },
  {
    id: 'food-restaurant',
    titleKey: 'wordbooks.foodRestaurant',
    descriptionKey: 'wordbooks.foodRestaurantDesc',
    icon: '🍜',
    color: 'bg-orange-500',
    difficulties: ['beginner', 'intermediate'],
    categories: ['food', 'restaurant'],
    wordCount: 120,
    minFrequency: 40,
  },
  {
    id: 'travel-transportation',
    titleKey: 'wordbooks.travelTransportation',
    descriptionKey: 'wordbooks.travelTransportationDesc',
    icon: '✈️',
    color: 'bg-cyan-500',
    difficulties: ['beginner', 'intermediate'],
    categories: ['travel', 'transportation'],
    wordCount: 100,
    minFrequency: 30,
  },
  {
    id: 'family-relationships',
    titleKey: 'wordbooks.familyRelationships',
    descriptionKey: 'wordbooks.familyRelationshipsDesc',
    icon: '👨‍👩‍👧‍👦',
    color: 'bg-red-500',
    difficulties: ['absolute-beginner', 'beginner'],
    categories: ['family'],
    wordCount: 60,
    minFrequency: 50,
  },
  {
    id: 'business-work',
    titleKey: 'wordbooks.businessWork',
    descriptionKey: 'wordbooks.businessWorkDesc',
    icon: '💼',
    color: 'bg-gray-600',
    difficulties: ['intermediate', 'advanced'],
    categories: ['business', 'work'],
    wordCount: 150,
    minFrequency: 20,
  },
  {
    id: 'k-pop-culture',
    titleKey: 'wordbooks.kPopCulture',
    descriptionKey: 'wordbooks.kPopCultureDesc',
    icon: '🎵',
    color: 'bg-indigo-500',
    difficulties: ['beginner', 'intermediate'],
    categories: ['music', 'culture', 'entertainment'],
    wordCount: 100,
    minFrequency: 25,
  },
  {
    id: 'health-body',
    titleKey: 'wordbooks.healthBody',
    descriptionKey: 'wordbooks.healthBodyDesc',
    icon: '💪',
    color: 'bg-teal-500',
    difficulties: ['beginner', 'intermediate'],
    categories: ['health', 'body'],
    wordCount: 90,
    minFrequency: 35,
  },
  {
    id: 'technology-modern',
    titleKey: 'wordbooks.technologyModern',
    descriptionKey: 'wordbooks.technologyModernDesc',
    icon: '📱',
    color: 'bg-slate-600',
    difficulties: ['intermediate', 'advanced'],
    categories: ['technology'],
    wordCount: 120,
    minFrequency: 15,
  },
];

// 난이도별로 그룹화
export const DIFFICULTY_GROUPS = [
  {
    id: 'beginner-group',
    titleKey: 'wordbooks.beginnerLevel',
    presets: WORDBOOK_PRESETS.filter(preset => 
      preset.difficulties.includes('absolute-beginner') || 
      preset.difficulties.includes('beginner')
    ),
  },
  {
    id: 'intermediate-group', 
    titleKey: 'wordbooks.intermediateLevel',
    presets: WORDBOOK_PRESETS.filter(preset => 
      preset.difficulties.includes('intermediate')
    ),
  },
  {
    id: 'advanced-group',
    titleKey: 'wordbooks.advancedLevel', 
    presets: WORDBOOK_PRESETS.filter(preset => 
      preset.difficulties.includes('advanced') || 
      preset.difficulties.includes('upper-intermediate')
    ),
  },
];