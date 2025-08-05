'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KoreanSNSLayout } from '@/components/korean-sns/layout/KoreanSNSLayout';
import { BilingualPostEditor } from '@/components/korean-sns/posts/BilingualPostEditor';
import { RewardNotification, useRewardNotifications } from '@/components/korean-sns/gamification/RewardNotification';
import { AlertModal, ConfirmModal } from '@/components/korean-sns/ui/Modal';
import { BilingualPost } from '@/lib/korean-sns/types';
import { mockUser } from '@/lib/korean-sns/mock-data';

export default function CreatePostPage() {
  const router = useRouter();
  const { notifications, showReward, hideReward } = useRewardNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal states
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (postData: Omit<BilingualPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      console.log('Creating post:', postData);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success reward
      showReward({
        type: 'points',
        title: 'Post Created!',
        description: 'You earned points for sharing your Korean learning journey.',
        points: 10
      });
      
      // In a real app, you would make an API call here
      // const response = await fetch('/api/posts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(postData)
      // });
      
      // Redirect to the post or feed after successful creation
      setTimeout(() => {
        router.push('/korean-sns');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating post:', error);
      setErrorMessage('Failed to create post. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    router.push('/korean-sns');
  };

  const handleSaveDraft = (draftData: Partial<BilingualPost>) => {
    console.log('Saving draft:', draftData);
    
    // In a real app, save to localStorage or API
    localStorage.setItem('korean-sns-draft', JSON.stringify({
      ...draftData,
      savedAt: new Date().toISOString()
    }));
    
    // Show feedback
    showReward({
      type: 'points',
      title: 'Draft Saved',
      description: 'Your post has been saved as a draft.',
      points: 0
    });
  };

  return (
    <>
      <KoreanSNSLayout
        currentUser={mockUser}
        locale="en"
        showSidebar={false}
        showRightPanel={false}
        showFAB={false}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Create New Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your Korean learning journey with the community. Write in English first, then translate to Korean!
            </p>
          </div>

          {/* Post Editor */}
          <BilingualPostEditor
            currentUser={mockUser}
            locale="en"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onSaveDraft={handleSaveDraft}
          />

          {/* Tips Section */}
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              💡 Tips for Great Posts
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Write naturally in English first - don't worry about making it "easy to translate"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Try your best with the Korean translation - mentors will help you improve!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Add voice recordings to practice pronunciation and get feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Use tags to help others find posts about topics they're interested in</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Enable "Request corrections" to learn from experienced learners and native speakers</span>
              </li>
            </ul>
          </div>
        </div>
      </KoreanSNSLayout>

      {/* Reward Notifications */}
      {notifications.map((reward) => (
        <RewardNotification
          key={reward.id}
          reward={reward}
          isVisible={true}
          onClose={() => hideReward(reward.id)}
          locale="en"
          className="fixed top-4 right-4 z-50 max-w-sm"
        />
      ))}

      {/* Error Modal */}
      <AlertModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={errorMessage}
        variant="error"
        locale="en"
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Post"
        message="Are you sure you want to cancel? Your changes will be lost."
        confirmText="Yes, Cancel"
        cancelText="Keep Editing"
        variant="danger"
        locale="en"
      />
    </>
  );
}