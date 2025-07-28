import { DocumentMaterial } from './content-types';
import { JSX } from 'react';

// Dynamic imports for MDX files
const MDX_CONTENT: Record<string, () => Promise<any>> = {
  'hangul-history-introduction': () => import('@/data/markdown/iron5-chapter1-hangul-story.mdx'),
  'vowel-groups-introduction': () => import('@/data/markdown/iron5-chapter2-vowel-groups.mdx'),
  'consonant-groups-introduction': () => import('@/data/markdown/iron5-chapter3-consonant-groups.mdx'),
  'basic-combinations-introduction': () => import('@/data/markdown/iron5-chapter4-basic-combinations.mdx'),
};

// Content metadata registry
const CONTENT_REGISTRY: Record<string, {
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  roadmapTier: string;
  chapterNumber: number;
}> = {
  'hangul-history-introduction': {
    title: 'The Story of Hangul',
    description: 'Discover the fascinating history and philosophy behind Korea\'s scientific writing system',
    estimatedTime: 15,
    difficulty: 'beginner',
    tags: ['history', 'philosophy', 'korean-culture', 'hangul'],
    roadmapTier: 'iron5',
    chapterNumber: 1
  },
  'vowel-groups-introduction': {
    title: 'Understanding Vowel Groups',
    description: 'Learn how Korean vowels are scientifically grouped according to ancient philosophy',
    estimatedTime: 20,
    difficulty: 'beginner',
    tags: ['vowels', 'philosophy', 'cheonjiin', 'pronunciation'],
    roadmapTier: 'iron5',
    chapterNumber: 2
  },
  'consonant-groups-introduction': {
    title: 'Consonant Groups by Pronunciation',
    description: 'Master Korean consonants organized by where and how they\'re pronounced',
    estimatedTime: 25,
    difficulty: 'beginner',
    tags: ['consonants', 'pronunciation', 'phonetics', 'mouth-position'],
    roadmapTier: 'iron5',
    chapterNumber: 3
  },
  'basic-combinations-introduction': {
    title: 'Combining Characters into Syllables',
    description: 'Learn to combine vowels and consonants into readable Korean syllable blocks',
    estimatedTime: 30,
    difficulty: 'beginner',
    tags: ['syllables', 'combination', 'reading', 'writing'],
    roadmapTier: 'iron5',
    chapterNumber: 4
  }
};

export async function getMarkdownContent(id: string): Promise<DocumentMaterial | null> {
  const contentMeta = CONTENT_REGISTRY[id];
  
  if (!contentMeta) {
    return null;
  }

  try {
    // Load MDX content only
    const mdxLoader = MDX_CONTENT[id];
    if (mdxLoader) {
      const mdxModule = await mdxLoader();
      const MDXContent = mdxModule.default as () => JSX.Element;
      
      return {
        id,
        type: 'document',
        title: contentMeta.title,
        description: contentMeta.description,
        content: {
          MDXContent, // The MDX component to render
          tableOfContents: []
        },
        estimatedTime: contentMeta.estimatedTime,
        difficulty: contentMeta.difficulty,
        tags: contentMeta.tags,
        roadmapTier: contentMeta.roadmapTier,
        chapterNumber: contentMeta.chapterNumber
      };
    }
  } catch (error) {
    console.error(`Failed to load MDX content for ${id}:`, error);
  }

  return null;
}

// Get all available content IDs
export function getAvailableContentIds(): string[] {
  return Object.keys(CONTENT_REGISTRY);
}

// Get content by roadmap and chapter
export async function getContentByRoadmapChapter(roadmapTier: string, chapterNumber: number): Promise<DocumentMaterial | null> {
  const contentId = Object.keys(CONTENT_REGISTRY).find(id => {
    const meta = CONTENT_REGISTRY[id];
    return meta.roadmapTier === roadmapTier && meta.chapterNumber === chapterNumber;
  });

  return contentId ? await getMarkdownContent(contentId) : null;
}