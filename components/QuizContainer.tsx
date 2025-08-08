import React from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { QuestionScreen } from './QuestionScreen';
import { MessageScreen } from './MessageScreen';
import { LeadCaptureScreen } from './LeadCaptureScreen';
import { QuizCompletionScreen } from './screens/QuizCompletionScreen';
import { LeadConfirmationScreen } from './screens/LeadConfirmationScreen';
import { ErrorBoundary } from './screens/ErrorBoundary';
import { useAppStore } from '../src/stores/appStore';
import { StepType, type QuizStep, type QuestionStep, type MessageStep, type LeadCaptureStep, type WelcomeStep, type QuestionOption, type QuizConfig } from '../types';

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

  const handleLeadCaptureSubmit = (contactInfo: any) => {
    // Handle lead capture submission
    console.log('Lead captured:', contactInfo);
    
    // Create a submission object
    const submission: any = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      contactInfo,
      answers: answers,
      funnelId: 'funnel-' + Date.now(),
      status: 'completed'
    };
    
    // Add to store
    addSubmission(submission);
    
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
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div key={currentStepData.id} className="w-full max-w-2xl px-8">
          {renderStep()}
        </div>
      </div>
    </ErrorBoundary>
  );
};