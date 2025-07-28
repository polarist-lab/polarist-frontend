'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/lib/i18n/config';
import { OnboardingStep, SelfAssessmentResult, MiniTestResult, LevelAssessmentResult } from '@/lib/types';
import { OnboardingManager } from '@/lib/onboarding-manager';

// Import onboarding components
import { WelcomeModal } from './welcome-modal';
import { SelfAssessment } from './self-assessment';
import { MiniTest } from './mini-test';
import { AssessmentResults } from './assessment-results';
import { Recommendations } from './recommendations';

interface OnboardingFlowProps {
  locale: Locale;
  onComplete: () => void;
}

export function OnboardingFlow({ locale, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selfAssessmentResult, setSelfAssessmentResult] = useState<SelfAssessmentResult | null>(null);
  const [miniTestResult, setMiniTestResult] = useState<MiniTestResult | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<LevelAssessmentResult | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 온보딩 상태 확인 및 초기화
  useEffect(() => {
    const state = OnboardingManager.getOnboardingState();
    
    if (state.hasCompletedOnboarding || state.skipOnboarding) {
      // 이미 완료되었으면 표시하지 않음
      onComplete();
      return;
    }

    if (state.isFirstVisit) {
      // 첫 방문이면 환영 화면부터
      setCurrentStep('welcome');
      setIsVisible(true);
    } else {
      // 진행 중이던 단계가 있으면 해당 단계부터
      setCurrentStep(state.currentStep);
      setIsVisible(true);
    }
  }, [onComplete]);

  const handleStartAssessment = () => {
    OnboardingManager.proceedToStep('self-assessment');
    setCurrentStep('self-assessment');
  };

  const handleSkipOnboarding = () => {
    OnboardingManager.skipOnboarding();
    setIsVisible(false);
    onComplete();
  };

  const handleSelfAssessmentComplete = (result: SelfAssessmentResult) => {
    setSelfAssessmentResult(result);
    OnboardingManager.proceedToStep('mini-test');
    setCurrentStep('mini-test');
  };

  const handleMiniTestComplete = (result: MiniTestResult) => {
    setMiniTestResult(result);
    
    // 자가진단과 미니테스트 결과를 종합하여 최종 평가 생성
    if (selfAssessmentResult) {
      const fullResult = OnboardingManager.saveAssessmentResult(selfAssessmentResult, result);
      setAssessmentResult(fullResult);
      OnboardingManager.proceedToStep('results');
      setCurrentStep('results');
    }
  };

  const handleViewRecommendations = () => {
    OnboardingManager.proceedToStep('recommendations');
    setCurrentStep('recommendations');
  };

  const handleRetakeTest = () => {
    // 평가 다시하기
    setSelfAssessmentResult(null);
    setMiniTestResult(null);
    setAssessmentResult(null);
    OnboardingManager.proceedToStep('self-assessment');
    setCurrentStep('self-assessment');
  };

  const handleOnboardingComplete = () => {
    OnboardingManager.completeOnboarding(assessmentResult || undefined);
    setIsVisible(false);
    onComplete();
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
  };

  const handleBackToSelfAssessment = () => {
    setCurrentStep('self-assessment');
  };

  const handleBackToResults = () => {
    setCurrentStep('results');
  };

  if (!isVisible) {
    return null;
  }

  // 단계별 렌더링
  switch (currentStep) {
    case 'welcome':
      return (
        <WelcomeModal
          locale={locale}
          onStartAssessment={handleStartAssessment}
          onSkip={handleSkipOnboarding}
        />
      );

    case 'self-assessment':
      return (
        <SelfAssessment
          locale={locale}
          onComplete={handleSelfAssessmentComplete}
          onBack={handleBackToWelcome}
        />
      );

    case 'mini-test':
      if (!selfAssessmentResult) {
        // 자가진단 결과가 없으면 다시 돌아가기
        setCurrentStep('self-assessment');
        return null;
      }
      return (
        <MiniTest
          locale={locale}
          selfAssessment={selfAssessmentResult}
          onComplete={handleMiniTestComplete}
          onBack={handleBackToSelfAssessment}
        />
      );

    case 'results':
      if (!assessmentResult) {
        // 평가 결과가 없으면 테스트로 돌아가기
        setCurrentStep('mini-test');
        return null;
      }
      return (
        <AssessmentResults
          locale={locale}
          result={assessmentResult}
          onViewRecommendations={handleViewRecommendations}
          onRetakeTest={handleRetakeTest}
        />
      );

    case 'recommendations':
      if (!assessmentResult) {
        // 평가 결과가 없으면 결과 화면으로 돌아가기
        setCurrentStep('results');
        return null;
      }
      return (
        <Recommendations
          locale={locale}
          result={assessmentResult}
          onComplete={handleOnboardingComplete}
          onBack={handleBackToResults}
        />
      );

    case 'complete':
      // 완료 상태는 표시하지 않고 바로 종료
      handleOnboardingComplete();
      return null;

    default:
      return null;
  }
}