import React from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { QuestionScreen } from './QuestionScreen';
import { MessageScreen } from './MessageScreen';
import { LeadCaptureScreen } from './LeadCaptureScreen';
import { QuizCompletionScreen } from './screens/QuizCompletionScreen';
import { LeadConfirmationScreen } from './screens/LeadConfirmationScreen';
import { ErrorBoundary } from './screens/ErrorBoundary';
import { ProgressBar } from './ProgressBar';
import { useAppStore } from '../src/stores/appStore';
import { StepType, type QuizStep, type QuestionStep, type MessageStep, type LeadCaptureStep, type WelcomeStep, type QuestionOption, type QuizConfig } from '../types';
import apiFetch from '../lib/api';

interface QuizContainerProps {
  step: number;
  quizSteps: QuizStep[];
  config?: QuizConfig;
  onNext: () => void;
  onBack: () => void;
  onAnswer: (questionId: string, answer: string | { type: 'voice' | 'video'; url: string }) => void;
  onStart: () => void;
  onQuizComplete?: () => void;
  onEditFunnel: () => void;
  onRestartQuiz: () => void;
  totalAnswers: number;
  onSaveSubmission?: (contactInfo: any) => void;
}

export const QuizContainer: React.FC<QuizContainerProps> = ({ 
  step, 
  quizSteps, 
  config, 
  onNext, 
  onBack, 
  onAnswer, 
  onStart,
  onQuizComplete,
  onEditFunnel,
  onRestartQuiz,
  totalAnswers,
  onSaveSubmission
}) => {
  const [leadCaptureData, setLeadCaptureData] = React.useState<any>(null);
  const { answers, quizConfig, addSubmission } = useAppStore();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const currentStepData = quizSteps[step];
  
  const buildWhatsAppUrl = (raw?: string) => {
    if (!raw) return undefined;
    const digits = raw.replace(/[^0-9]/g, '');
    if (!digits) return undefined;
    return `https://wa.me/${digits}`;
  };
  const redirectTarget = config?.redirectUrl || buildWhatsAppUrl(config?.whatsappNumber);
  
  // Check if we should show lead confirmation
  if (showConfirmation && leadCaptureData) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="w-full max-w-2xl px-8">
          <LeadConfirmationScreen
            contactInfo={leadCaptureData}
            redirectUrl={redirectTarget}
            onRestartQuiz={() => {
              setShowConfirmation(false);
              setLeadCaptureData(null);
              onRestartQuiz();
            }}
          />
        </div>
      </div>
    );
  }

  // Check if quiz is completed (reached the end)
  const isQuizCompleted = step >= quizSteps.length;
  
  if (isQuizCompleted) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="w-full max-w-2xl px-8">
          <QuizCompletionScreen
            onEditFunnel={onEditFunnel || (() => {})}
            onRestartQuiz={onRestartQuiz || (() => {})}
            totalAnswers={totalAnswers}
          />
        </div>
      </div>
    );
  }

  if (!currentStepData) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="w-full max-w-2xl px-8">
          <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 mb-4">Quiz step not found.</p>
            {onEditFunnel && (
              <button
                onClick={onEditFunnel}
                className="text-yellow-600 hover:text-yellow-800 underline"
              >
                Edit this funnel to fix the issue
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Extract a funnelId from URL if present (supports search and hash fragments)
  const getFunnelIdFromUrl = (): string | null => {
    try {
      const search = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.substring(1));
      return (
        search.get('funnelId') ||
        hash.get('funnelId') ||
        search.get('id') ||
        hash.get('id') ||
        null
      );
    } catch {
      return null;
    }
  };

  // Build analyzedAnswers array for Results dashboard from current answers and quiz steps
  const buildAnalyzedAnswers = () => {
    const list: { questionId: string; questionText: string; answer: any }[] = [];
    for (const step of quizSteps) {
      if (step.type === StepType.Question) {
        const q = step as QuestionStep;
        const ans = (answers as any)[q.id];
        if (ans !== undefined) {
          list.push({ questionId: q.id, questionText: q.question, answer: ans });
        }
      }
    }
    return list;
  };

  const handleLeadCaptureSubmit = async (contactInfo: any) => {
    // Handle lead capture submission
    console.log('Lead captured:', contactInfo);

    // Try to send to backend if we have a valid funnelId
    const funnelId = getFunnelIdFromUrl();
    let finalId = `local-${Date.now()}`;
    const analyzedAnswers = buildAnalyzedAnswers();

    if (funnelId) {
      try {
        const res = await apiFetch('/leads', {
          method: 'POST',
          body: JSON.stringify({
            name: contactInfo.name,
            email: contactInfo.email,
            phone: contactInfo.phone,
            subscribed: contactInfo.subscribed,
            answers: answers,
            funnelId,
          }),
        });
        if (res.ok) {
          const lead = await res.json();
          // Prisma returns createdAt as ISO string; normalize to number timestamp
          finalId = lead.id || finalId;
          const createdAt = lead.createdAt ? Date.parse(lead.createdAt) : Date.now();
          addSubmission({
            id: finalId,
            timestamp: createdAt,
            contactInfo,
            analyzedAnswers,
          } as any);
        } else {
          console.warn('Lead API returned non-OK status', res.status);
          // Fallback to local-only submission
          addSubmission({
            id: finalId,
            timestamp: Date.now(),
            contactInfo,
            analyzedAnswers,
          } as any);
        }
      } catch (err) {
        console.error('Lead API request failed:', err);
        // Fallback to local-only submission
        addSubmission({
          id: finalId,
          timestamp: Date.now(),
          contactInfo,
          analyzedAnswers,
        } as any);
      }
    } else {
      // No funnelId available (e.g., local/shared config). Save locally for dashboard.
      addSubmission({
        id: finalId,
        timestamp: Date.now(),
        contactInfo,
        analyzedAnswers,
      } as any);
    }

    // Store lead data and show confirmation
    setLeadCaptureData(contactInfo);
    setShowConfirmation(true);

    // Mark quiz as completed
    if (onQuizComplete) {
      onQuizComplete();
    }
  };

  const renderStep = () => {
    switch (currentStepData.type) {
      case StepType.Welcome: {
        const data = currentStepData as WelcomeStep;
        return (
          <WelcomeScreen
            title={data.title}
            buttonText={data.buttonText}
            onStart={onStart}
          />
        );
      }
      case StepType.Question: {
        const data = currentStepData as QuestionStep;
        return (
          <QuestionScreen
            stepData={data}
            onAnswer={(answer, option) => onAnswer(data.id, answer, option)}
            onBack={onBack}
          />
        );
      }
      case StepType.Message: {
        const data = currentStepData as MessageStep;
        return (
          <MessageScreen
            title={data.title}
            buttonText={data.buttonText}
            onContinue={onNext}
            onBack={onBack}
          />
        );
      }
      case StepType.LeadCapture: {
        const data = currentStepData as LeadCaptureStep;
        return (
          <LeadCaptureScreen 
            stepData={data} 
            onSaveSubmission={handleLeadCaptureSubmit}
          />
        );
      }
      default:
        return (
          <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-800">Unknown step type</p>
          </div>
        );
    }
  };

  return (
    <ErrorBoundary onEditFunnel={onEditFunnel} onRetry={() => window.location.reload()}>
      {/* Progress Bar - Quick Win #1 */}
      <ProgressBar
        currentStep={step}
        totalSteps={quizSteps.length}
        showText={true}
        fixed={true}
      />

      <div className="h-full w-full flex flex-col justify-center items-center pt-12">
        <div key={currentStepData.id} className="w-full max-w-2xl px-8">
          {renderStep()}
        </div>
      </div>
    </ErrorBoundary>
  );
};