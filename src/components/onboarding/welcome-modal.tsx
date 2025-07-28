'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { useTranslations } from '@/lib/i18n';

interface WelcomeModalProps {
  locale: Locale;
  onStartAssessment: () => void;
  onSkip: () => void;
  onClose?: () => void;
}

export function WelcomeModal({ locale, onStartAssessment, onSkip, onClose }: WelcomeModalProps) {
  const { t } = useTranslations(locale);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-t-2xl">
          <div className="text-center">
            <div className="text-6xl mb-4">🇰🇷</div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to Korean Learning!
            </h1>
            <p className="text-lg opacity-90">
              Let&apos;s find the perfect learning path for you
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🎯 Personalized Learning Experience
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We&apos;ll ask you a few questions and give you a quick assessment to create 
              a customized learning plan that matches your current level and goals.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                📊
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Level Assessment</h3>
                <p className="text-gray-600 text-sm">
                  Quick evaluation to determine your current Korean proficiency
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                🗺️
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Custom Roadmap</h3>
                <p className="text-gray-600 text-sm">
                  Tailored learning path based on your goals and preferences
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                ⚡
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Smart Recommendations</h3>
                <p className="text-gray-600 text-sm">
                  Content suggestions that match your learning style and pace
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
                📈
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Progress Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Monitor your improvement and stay motivated with clear goals
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="font-semibold text-gray-800">
                What does the assessment include?
              </h3>
              <span className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
                ⬇️
              </span>
            </button>

            {showDetails && (
              <div className="mt-4 space-y-4 text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">1</span>
                  <div>
                    <strong>Self-Assessment (2 minutes)</strong>
                    <p className="text-sm">Quick questions about your Korean experience and goals</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">2</span>
                  <div>
                    <strong>Mini Test (5-8 minutes)</strong>
                    <p className="text-sm">Short adaptive test covering character recognition, vocabulary, and basic comprehension</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">3</span>
                  <div>
                    <strong>Personalized Results</strong>
                    <p className="text-sm">Your level assessment and customized learning recommendations</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onStartAssessment}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🚀 Start Assessment (10 min)
            </button>

            <button
              onClick={onSkip}
              className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
            >
              Skip for now
            </button>
          </div>

          {/* Skip explanation */}
          <div className="mt-4 text-center text-sm text-gray-500">
            You can always take the assessment later from your profile settings
          </div>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}