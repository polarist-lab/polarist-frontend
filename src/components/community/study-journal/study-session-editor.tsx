'use client';

import { useState, useEffect } from 'react';
import { StudySession, StudySessionType, StudyNote } from '@/lib/community/types';
import { Locale } from '@/lib/i18n/config';

interface StudySessionEditorProps {
  locale: Locale;
  initialSession?: StudySession | null;
  onSave: (session: Omit<StudySession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function StudySessionEditor({
  locale,
  initialSession,
  onSave,
  onCancel
}: StudySessionEditorProps) {
  const [type, setType] = useState<StudySessionType>(initialSession?.type || 'vocabulary');
  const [title, setTitle] = useState(initialSession?.title || '');
  const [description, setDescription] = useState(initialSession?.description || '');
  const [startTime, setStartTime] = useState(
    initialSession?.startTime 
      ? new Date(initialSession.startTime.getTime() - initialSession.startTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  );
  const [duration, setDuration] = useState(initialSession?.duration || 30);
  const [goals, setGoals] = useState<string[]>(initialSession?.goals || []);
  const [achievements, setAchievements] = useState<string[]>(initialSession?.achievements || []);
  const [challenges, setChallenges] = useState<string[]>(initialSession?.challenges || []);
  const [materials, setMaterials] = useState<string[]>(initialSession?.materials || []);
  const [newVocabulary, setNewVocabulary] = useState<string[]>(initialSession?.newVocabulary || []);
  const [reviewItems, setReviewItems] = useState<string[]>(initialSession?.reviewItems || []);
  const [mood, setMood] = useState(initialSession?.mood || 3);
  const [satisfaction, setSatisfaction] = useState(initialSession?.satisfaction || 3);
  const [notes, setNotes] = useState<StudyNote[]>(initialSession?.notes || []);

  // Temporary input states
  const [goalInput, setGoalInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [challengeInput, setChallengeInput] = useState('');
  const [materialInput, setMaterialInput] = useState('');
  const [vocabularyInput, setVocabularyInput] = useState('');
  const [reviewInput, setReviewInput] = useState('');

  const sessionTypes = [
    { id: 'vocabulary', ko: '어휘', en: 'Vocabulary', icon: '📝' },
    { id: 'grammar', ko: '문법', en: 'Grammar', icon: '📚' },
    { id: 'listening', ko: '듣기', en: 'Listening', icon: '👂' },
    { id: 'speaking', ko: '말하기', en: 'Speaking', icon: '🗣️' },
    { id: 'reading', ko: '읽기', en: 'Reading', icon: '📖' },
    { id: 'writing', ko: '쓰기', en: 'Writing', icon: '✍️' },
    { id: 'review', ko: '복습', en: 'Review', icon: '🔄' },
    { id: 'exam-prep', ko: '시험준비', en: 'Exam Prep', icon: '📋' }
  ] as const;

  const addToList = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, inputSetter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim()) {
      setter(prev => [...prev, value.trim()]);
      inputSetter('');
    }
  };

  const removeFromList = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent, value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, inputSetter: React.Dispatch<React.SetStateAction<string>>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addToList(value, setter, inputSetter);
    }
  };

  const getMoodEmoji = (moodValue: number) => {
    switch (moodValue) {
      case 1: return '😞';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '😄';
      default: return '😐';
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const sessionData = {
      type,
      title: title.trim(),
      description: description.trim(),
      startTime: new Date(startTime),
      endTime: new Date(new Date(startTime).getTime() + duration * 60000),
      duration,
      goals,
      achievements,
      challenges,
      notes,
      mood,
      satisfaction,
      materials,
      newVocabulary,
      reviewItems
    };

    onSave(sessionData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {initialSession ? 'Edit Study Session' : 'New Study Session'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as StudySessionType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sessionTypes.map((sessionType) => (
                  <option key={sessionType.id} value={sessionType.id}>
                    {sessionType.icon} {sessionType[locale]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="600"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What did you study today?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your study session..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Mood & Satisfaction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood {getMoodEmoji(mood)}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>😞 Bad</span>
                <span>😄 Great</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Satisfaction ({satisfaction}/5)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={satisfaction}
                onChange={(e) => setSatisfaction(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Poor</span>
                <span>5 Excellent</span>
              </div>
            </div>
          </div>

          {/* Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goals
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, goalInput, setGoals, setGoalInput)}
                    placeholder="Add a goal..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => addToList(goalInput, setGoals, setGoalInput)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {goals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                      <span>{goal}</span>
                      <button
                        onClick={() => removeFromList(index, setGoals)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Achievements
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, achievementInput, setAchievements, setAchievementInput)}
                    placeholder="What did you accomplish?"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => addToList(achievementInput, setAchievements, setAchievementInput)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded text-sm">
                      <span>{achievement}</span>
                      <button
                        onClick={() => removeFromList(index, setAchievements)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Challenges */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenges
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={challengeInput}
                    onChange={(e) => setChallengeInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, challengeInput, setChallenges, setChallengeInput)}
                    placeholder="What was difficult?"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => addToList(challengeInput, setChallenges, setChallengeInput)}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {challenges.map((challenge, index) => (
                    <div key={index} className="flex items-center justify-between bg-orange-50 p-2 rounded text-sm">
                      <span>{challenge}</span>
                      <button
                        onClick={() => removeFromList(index, setChallenges)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materials Used
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, materialInput, setMaterials, setMaterialInput)}
                    placeholder="Books, apps, videos..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => addToList(materialInput, setMaterials, setMaterialInput)}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {materials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between bg-purple-50 p-2 rounded text-sm">
                      <span>{material}</span>
                      <button
                        onClick={() => removeFromList(index, setMaterials)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* New Vocabulary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Vocabulary
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={vocabularyInput}
                    onChange={(e) => setVocabularyInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, vocabularyInput, setNewVocabulary, setVocabularyInput)}
                    placeholder="New words learned..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => addToList(vocabularyInput, setNewVocabulary, setVocabularyInput)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {newVocabulary.map((word, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                    >
                      {word}
                      <button
                        onClick={() => removeFromList(index, setNewVocabulary)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Review Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items to Review
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reviewInput}
                    onChange={(e) => setReviewInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, reviewInput, setReviewItems, setReviewInput)}
                    placeholder="Things to review later..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => addToList(reviewInput, setReviewItems, setReviewInput)}
                    className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {reviewItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-yellow-50 p-2 rounded text-sm">
                      <span>{item}</span>
                      <button
                        onClick={() => removeFromList(index, setReviewItems)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}