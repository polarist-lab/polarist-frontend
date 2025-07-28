'use client';

import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';

interface ThreadedRoadmapProps {
  locale: Locale;
  currentTier?: string;
  completedTiers?: string[];
}

interface RoadmapTier {
  id: string;
  tier: string;
  rank: string;
  title: string;
  description: string;
  lessons: number;
  estimatedTime: string;
  status: 'completed' | 'current' | 'locked';
  href: string;
  color: {
    primary: string;
    secondary: string;
    bg: string;
    border: string;
  };
}

export function ThreadedRoadmap({ 
  locale, 
  currentTier = 'Iron5',
  completedTiers = []
}: ThreadedRoadmapProps) {
  const router = useRouter();

  const roadmapTiers: RoadmapTier[] = [
    // Iron Tier
    {
      id: 'iron5',
      tier: 'Iron',
      rank: '5',
      title: 'Getting Started with Korean',
      description: 'Learn the fundamentals of Hangul through history, philosophy, and basic characters',
      lessons: 4,
      estimatedTime: '1-2 weeks',
      status: 'current',
      href: `/iron5`,
      color: {
        primary: 'text-gray-700',
        secondary: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200'
      }
    },
    {
      id: 'iron4',
      tier: 'Iron',
      rank: '4',
      title: 'Building Vocabulary',
      description: 'Expand your character knowledge and learn your first Korean words',
      lessons: 6,
      estimatedTime: '2-3 weeks',
      status: 'locked',
      href: `/iron4`,
      color: {
        primary: 'text-gray-700',
        secondary: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200'
      }
    },
    {
      id: 'iron3',
      tier: 'Iron',
      rank: '3',
      title: 'Basic Grammar',
      description: 'Understand sentence structure and basic grammar patterns',
      lessons: 8,
      estimatedTime: '3-4 weeks',
      status: 'locked',
      href: `/iron3`,
      color: {
        primary: 'text-gray-700',
        secondary: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200'
      }
    },
    {
      id: 'iron2',
      tier: 'Iron',
      rank: '2',
      title: 'Practical Conversations',
      description: 'Learn real-world expressions and conversation skills',
      lessons: 10,
      estimatedTime: '4-5 weeks',
      status: 'locked',
      href: `/iron2`,
      color: {
        primary: 'text-gray-700',
        secondary: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200'
      }
    },
    {
      id: 'iron1',
      tier: 'Iron',
      rank: '1',
      title: 'Iron Mastery',
      description: 'Complete foundational Korean skills and prepare for Silver tier',
      lessons: 12,
      estimatedTime: '5-6 weeks',
      status: 'locked',
      href: `/iron1`,
      color: {
        primary: 'text-gray-700',
        secondary: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200'
      }
    },

    // Silver Tier
    {
      id: 'silver5',
      tier: 'Silver',
      rank: '5',
      title: 'Intermediate Foundation',
      description: 'Build intermediate vocabulary and grammar structures',
      lessons: 8,
      estimatedTime: '2-3 weeks',
      status: 'locked',
      href: `/silver5`,
      color: {
        primary: 'text-slate-700',
        secondary: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200'
      }
    },
    {
      id: 'silver4',
      tier: 'Silver',
      rank: '4',
      title: 'Complex Expressions',
      description: 'Learn nuanced expressions and cultural contexts',
      lessons: 10,
      estimatedTime: '3-4 weeks',
      status: 'locked',
      href: `/silver4`,
      color: {
        primary: 'text-slate-700',
        secondary: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200'
      }
    },
    {
      id: 'silver3',
      tier: 'Silver',
      rank: '3',
      title: 'Formal Communication',
      description: 'Master formal speech and business Korean',
      lessons: 12,
      estimatedTime: '4-5 weeks',
      status: 'locked',
      href: `/silver3`,
      color: {
        primary: 'text-slate-700',
        secondary: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200'
      }
    },
    {
      id: 'silver2',
      tier: 'Silver',
      rank: '2',
      title: 'Media & Literature',
      description: 'Understand Korean media, news, and simple literature',
      lessons: 14,
      estimatedTime: '5-6 weeks',
      status: 'locked',
      href: `/silver2`,
      color: {
        primary: 'text-slate-700',
        secondary: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200'
      }
    },
    {
      id: 'silver1',
      tier: 'Silver',
      rank: '1',
      title: 'Silver Mastery',
      description: 'Complete intermediate Korean and prepare for Gold tier',
      lessons: 16,
      estimatedTime: '6-7 weeks',
      status: 'locked',
      href: `/silver1`,
      color: {
        primary: 'text-slate-700',
        secondary: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200'
      }
    },

    // Gold Tier
    {
      id: 'gold5',
      tier: 'Gold',
      rank: '5',
      title: 'Advanced Communication',
      description: 'Develop advanced speaking and listening skills',
      lessons: 12,
      estimatedTime: '4-5 weeks',
      status: 'locked',
      href: `/gold5`,
      color: {
        primary: 'text-yellow-700',
        secondary: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200'
      }
    },
    {
      id: 'gold4',
      tier: 'Gold',
      rank: '4',
      title: 'Academic Korean',
      description: 'Learn academic vocabulary and formal writing',
      lessons: 14,
      estimatedTime: '5-6 weeks',
      status: 'locked',
      href: `/gold4`,
      color: {
        primary: 'text-yellow-700',
        secondary: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200'
      }
    },
    {
      id: 'gold3',
      tier: 'Gold',
      rank: '3',
      title: 'Professional Korean',
      description: 'Master workplace communication and presentations',
      lessons: 16,
      estimatedTime: '6-7 weeks',
      status: 'locked',
      href: `/gold3`,
      color: {
        primary: 'text-yellow-700',
        secondary: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200'
      }
    },
    {
      id: 'gold2',
      tier: 'Gold',
      rank: '2',
      title: 'Cultural Fluency',
      description: 'Deep understanding of Korean culture and idioms',
      lessons: 18,
      estimatedTime: '7-8 weeks',
      status: 'locked',
      href: `/gold2`,
      color: {
        primary: 'text-yellow-700',
        secondary: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200'
      }
    },
    {
      id: 'gold1',
      tier: 'Gold',
      rank: '1',
      title: 'Gold Mastery',
      description: 'Complete advanced Korean and prepare for Platinum tier',
      lessons: 20,
      estimatedTime: '8-9 weeks',
      status: 'locked',
      href: `/gold1`,
      color: {
        primary: 'text-yellow-700',
        secondary: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200'
      }
    },

    // Platinum Tier
    {
      id: 'platinum5',
      tier: 'Platinum',
      rank: '5',
      title: 'Expert Communication',
      description: 'Develop expert-level communication skills',
      lessons: 16,
      estimatedTime: '6-7 weeks',
      status: 'locked',
      href: `/platinum5`,
      color: {
        primary: 'text-purple-700',
        secondary: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
      }
    },
    {
      id: 'platinum4',
      tier: 'Platinum',
      rank: '4',
      title: 'Specialized Fields',
      description: 'Master specialized vocabulary in various fields',
      lessons: 18,
      estimatedTime: '7-8 weeks',
      status: 'locked',
      href: `/platinum4`,
      color: {
        primary: 'text-purple-700',
        secondary: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
      }
    },
    {
      id: 'platinum3',
      tier: 'Platinum',
      rank: '3',
      title: 'Literary Korean',
      description: 'Understand classical and modern Korean literature',
      lessons: 20,
      estimatedTime: '8-9 weeks',
      status: 'locked',
      href: `/platinum3`,
      color: {
        primary: 'text-purple-700',
        secondary: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
      }
    },
    {
      id: 'platinum2',
      tier: 'Platinum',
      rank: '2',
      title: 'Native-level Expression',
      description: 'Achieve near-native expression and understanding',
      lessons: 22,
      estimatedTime: '9-10 weeks',
      status: 'locked',
      href: `/platinum2`,
      color: {
        primary: 'text-purple-700',
        secondary: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
      }
    },
    {
      id: 'platinum1',
      tier: 'Platinum',
      rank: '1',
      title: 'Platinum Mastery',
      description: 'Complete expert Korean and prepare for Diamond tier',
      lessons: 24,
      estimatedTime: '10-11 weeks',
      status: 'locked',
      href: `/platinum1`,
      color: {
        primary: 'text-purple-700',
        secondary: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
      }
    },

    // Diamond Tier
    {
      id: 'diamond5',
      tier: 'Diamond',
      rank: '5',
      title: 'Master Level',
      description: 'Achieve master-level Korean proficiency',
      lessons: 20,
      estimatedTime: '8-9 weeks',
      status: 'locked',
      href: `/diamond5`,
      color: {
        primary: 'text-cyan-700',
        secondary: 'text-cyan-600',
        bg: 'bg-cyan-50',
        border: 'border-cyan-200'
      }
    },
    {
      id: 'diamond4',
      tier: 'Diamond',
      rank: '4',
      title: 'Research & Analysis',
      description: 'Conduct research and analysis in Korean',
      lessons: 22,
      estimatedTime: '9-10 weeks',
      status: 'locked',
      href: `/diamond4`,
      color: {
        primary: 'text-cyan-700',
        secondary: 'text-cyan-600',
        bg: 'bg-cyan-50',
        border: 'border-cyan-200'
      }
    },
    {
      id: 'diamond3',
      tier: 'Diamond',
      rank: '3',
      title: 'Creative Expression',
      description: 'Create original content and artistic expression',
      lessons: 24,
      estimatedTime: '10-11 weeks',
      status: 'locked',
      href: `/diamond3`,
      color: {
        primary: 'text-cyan-700',
        secondary: 'text-cyan-600',
        bg: 'bg-cyan-50',
        border: 'border-cyan-200'
      }
    },
    {
      id: 'diamond2',
      tier: 'Diamond',
      rank: '2',
      title: 'Teaching & Mentoring',
      description: 'Teach and mentor others in Korean language',
      lessons: 26,
      estimatedTime: '11-12 weeks',
      status: 'locked',
      href: `/diamond2`,
      color: {
        primary: 'text-cyan-700',
        secondary: 'text-cyan-600',
        bg: 'bg-cyan-50',
        border: 'border-cyan-200'
      }
    },
    {
      id: 'diamond1',
      tier: 'Diamond',
      rank: '1',
      title: 'Grand Master',
      description: 'Achieve the highest level of Korean mastery',
      lessons: 28,
      estimatedTime: '12+ weeks',
      status: 'locked',
      href: `/diamond1`,
      color: {
        primary: 'text-cyan-700',
        secondary: 'text-cyan-600',
        bg: 'bg-cyan-50',
        border: 'border-cyan-200'
      }
    }
  ];

  const getStatusIcon = (status: RoadmapTier['status']) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'current':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        );
      case 'locked':
        return (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        );
    }
  };

  const getChapterCardClass = (status: RoadmapTier['status'], tier: RoadmapTier) => {
    const baseClasses = `${tier.color.bg} ${tier.color.border}`;
    
    switch (status) {
      case 'completed':
        return `${baseClasses} ring-2 ring-green-200 border-green-300`;
      case 'current':
        return `${baseClasses} ring-2 ring-blue-200 border-blue-300`;
      case 'locked':
        return `${baseClasses} cursor-not-allowed opacity-60`;
    }
  };

  const handleTierClick = (tier: RoadmapTier) => {
    if (tier.status === 'locked') return;
    router.push(`/${locale}${tier.href}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Learn Korean
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Master Korean through a structured, game-like progression from Iron to Diamond.
          Complete each tier to unlock the next level and advance your skills.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
          <span className="text-sm text-gray-500">0 of 25 tiers completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>

      {/* Tiers Thread */}
      <div className="space-y-0">
        {roadmapTiers.map((tier, index) => (
          <div key={tier.id} className="relative">
            {/* Connecting Line */}
            {index > 0 && (
              <div className="absolute left-4 -top-4 w-0.5 h-8 bg-gray-200"></div>
            )}
            
            {/* Tier Card */}
            <div 
              className={`relative flex items-start gap-4 p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${getChapterCardClass(tier.status, tier)}`}
              onClick={() => handleTierClick(tier)}
            >
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(tier.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-xl font-bold group-hover:text-blue-600 transition-colors ${tier.color.primary}`}>
                    {tier.tier} {tier.rank}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${tier.color.bg} ${tier.color.secondary}`}>
                    {tier.lessons} lessons
                  </span>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {tier.title}
                </h4>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {tier.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    ⏱️ {tier.estimatedTime}
                  </span>
                  
                  {tier.status !== 'locked' && (
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      {tier.status === 'completed' ? 'Review' : 'Start'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Current Tier Indicator */}
              {tier.status === 'current' && (
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                  <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Current
                  </div>
                </div>
              )}
            </div>

            {/* Continue Line */}
            {index < roadmapTiers.length - 1 && (
              <div className="absolute left-4 bottom-0 w-0.5 h-4 bg-gray-200"></div>
            )}
          </div>
        ))}
      </div>

      {/* Community Section */}
      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💬</span>
              <h3 className="text-xl font-bold text-gray-900">Community</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Connect with fellow learners, share progress, and discover helpful tips from the community.
            </p>
            <button
              onClick={() => router.push(`/${locale}/community`)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Posts
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📖</span>
              <h3 className="text-xl font-bold text-gray-900">Study Journal</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Track your learning progress, set goals, and maintain a personal study record.
            </p>
            <button
              onClick={() => router.push(`/${locale}/community/journal`)}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Open Journal
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to start your Korean journey?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Begin with Iron 5 to learn the beautiful story behind Hangul and master the fundamental characters 
            through scientific grouping based on ancient Korean philosophy.
          </p>
          <button
            onClick={() => router.push(`/${locale}/iron5`)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            Start Iron 5
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}