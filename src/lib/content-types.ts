// Learning Material Types and Definitions
import { JSX } from 'react';

export type LearningMaterialType = 'document' | 'words' | 'sentences' | 'practice' | 'test' | 'character';

export interface LearningMaterial {
  id: string;
  type: LearningMaterialType;
  title: string;
  description: string;
  content: unknown; // Type varies based on material type
  estimatedTime: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  prerequisites?: string[];
  roadmapTier: string; // e.g., 'iron5', 'silver3'
  chapterNumber: number;
}

export interface DocumentMaterial extends LearningMaterial {
  type: 'document';
  content: {
    MDXContent?: () => JSX.Element;
    markdown?: string;
    tableOfContents?: {
      title: string;
      anchor: string;
      level: number;
    }[];
  };
}

export interface WordsMaterial extends LearningMaterial {
  type: 'words';
  content: {
    words: {
      korean: string;
      romanization: string;
      english: string;
      audioUrl?: string;
      examples: {
        korean: string;
        romanization: string;
        english: string;
      }[];
    }[];
    studyMode: 'flashcard' | 'matching' | 'typing';
  };
}

export interface SentencesMaterial extends LearningMaterial {
  type: 'sentences';
  content: {
    sentences: {
      korean: string;
      romanization: string;
      english: string;
      audioUrl?: string;
      grammar?: string[];
      vocabulary?: string[];
    }[];
    studyMode: 'reading' | 'listening' | 'speaking' | 'translation';
  };
}

export interface PracticeMaterial extends LearningMaterial {
  type: 'practice';
  content: {
    exercises: {
      type: 'multiple-choice' | 'fill-blank' | 'translation' | 'speaking';
      question: string;
      options?: string[];
      correctAnswer: string | string[];
      explanation: string;
      audioUrl?: string;
    }[];
  };
}

export interface TestMaterial extends LearningMaterial {
  type: 'test';
  content: {
    questions: {
      type: 'multiple-choice' | 'fill-blank' | 'essay' | 'speaking';
      question: string;
      options?: string[];
      correctAnswer: string | string[];
      points: number;
      explanation: string;
    }[];
    timeLimit: number; // in minutes
    passingScore: number; // percentage
    retakeAllowed: boolean;
  };
}

export interface CharacterMaterial extends LearningMaterial {
  type: 'character';
  content: {
    characterType: 'vowel' | 'consonant' | 'syllable' | 'grouped';
    groupId?: string; // For grouped characters
  };
}

// Roadmap and Chapter Structure
export interface RoadmapChapter {
  id: string;
  roadmapTier: string;
  chapterNumber: number;
  title: string;
  description: string;
  materials: LearningMaterial[];
  unlocked: boolean;
  completed: boolean;
  estimatedTime: number; // total time for all materials
}

export interface RoadmapTierData {
  id: string; // e.g., 'iron5'
  tier: string; // e.g., 'Iron'
  rank: string; // e.g., '5'
  title: string;
  description: string;
  chapters: RoadmapChapter[];
  unlocked: boolean;
  completed: boolean;
  color: {
    primary: string;
    secondary: string;
    bg: string;
    border: string;
  };
}

// Context for learning material navigation
export interface LearningContext {
  roadmapTier: string; // e.g., 'iron5'
  chapterNumber: number;
  materialId: string;
  materialType: LearningMaterialType;
  
  // Navigation helpers
  previousMaterial?: {
    id: string;
    title: string;
    href: string;
  };
  nextMaterial?: {
    id: string;
    title: string;
    href: string;
  };
  
  // Breadcrumb data
  breadcrumb: {
    roadmapTitle: string;
    chapterTitle: string;
    materialTitle: string;
  };
}