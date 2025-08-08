import React, { Suspense, lazy } from 'react';
import { useAppStore } from './stores/appStore';
import { Button, Input, Textarea, Card, Modal, LoadingSpinner, FloatingBuilderButton } from './components/ui';
import { ComponentSize, ButtonVariant } from './enums';
import { mockSubmissions, mockAnalyzeAnswer } from './resultsDashboardMockData';

// Lazy load components for performance
const Builder = lazy(() => import('./components/Builder').then(module => ({ default: module.Builder })));
const QuizContainer = lazy(() => import('./components/QuizContainer').then(module => ({ default: module.QuizContainer })));
const MediaViewer = lazy(() => import('./components/VideoPlayer').then(module => ({ default: module.MediaViewer })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
const ResultsDashboard = lazy(() => import('./components/dashboard/ResultsDashboard').then(module => ({ default: module.ResultsDashboard })));

// Demo component showcasing the new design system
const DesignSystemDemo: React.FC = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [textareaValue, setTextareaValue] = React.useState('');

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Video Funnel Builder - Upgraded Design System</h1>
        <p className="text-gray-600 mb-8">Showcasing the new Tailwind CSS design system with reusable components</p>

        {/* Button Variants */}
        <Card className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Button Components</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" loading>Loading Button</Button>
              <Button variant="primary" disabled>Disabled Button</Button>
            </div>
          </div>
        </Card>

        {/* Input Components */}
        <Card className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Input Components</h2>
          <div className="space-y-4 max-w-md">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              error="Password must be at least 8 characters"
            />
            <Textarea
              label="Message"
              placeholder="Enter your message here..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
          </div>
        </Card>

        {/* Card Variants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card padding="sm">
            <h3 className="font-semibold mb-2">Small Padding</h3>
            <p className="text-gray-600">This card has small padding for compact content.</p>
          </Card>
          <Card padding="md">
            <h3 className="font-semibold mb-2">Medium Padding</h3>
            <p className="text-gray-600">This card has medium padding for balanced content.</p>
          </Card>
          <Card padding="lg">
            <h3 className="font-semibold mb-2">Large Padding</h3>
            <p className="text-gray-600">This card has large padding for spacious content.</p>
          </Card>
        </div>

        {/* Modal Demo */}
        <Card className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Modal Component</h2>
          <Button onClick={() => setShowModal(true)}>Open Modal</Button>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Demo Modal"
            size="md"
          >
            <div className="space-y-4">
              <p>This is a demo modal showcasing the new modal component with Tailwind styling.</p>
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setShowModal(false)}>
                  Confirm
                </Button>
              </div>
            </div>
          </Modal>
        </Card>

        {/* Loading Spinner */}
        <Card className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Loading Components</h2>
          <div className="flex items-center space-x-8">
            <div>
              <p className="mb-2">Small Spinner</p>
              <LoadingSpinner size="sm" />
            </div>
            <div>
              <p className="mb-2">Medium Spinner</p>
              <LoadingSpinner size="md" />
            </div>
            <div>
              <p className="mb-2">Large Spinner</p>
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </Card>

        {/* Responsive Design Demo */}
        <Card>
          <h2 className="text-2xl font-semibold mb-4">Responsive Design</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-brand-rose text-white p-4 rounded-lg text-center">
                <h3 className="font-semibold">Item {item}</h3>
                <p className="text-sm opacity-90">Responsive grid item</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 mt-4 text-sm">
            This grid responds to screen size: 1 column on mobile, 2 on tablet, 4 on desktop.
          </p>
        </Card>
      </div>
    </div>
  );
};

// Main App component with Zustand integration
const UpgradePreviewApp: React.FC = () => {
  const {
    quizConfig,
    currentStepId,
    isBuilderMode,
    answers,
    isQuizCompleted,
    hasError,
    toggleBuilderMode,
    navigateToStep,
    addAnswer,
    goBack,
    getCurrentStep,
    getCurrentStepIndex,
    canGoBack,
    setQuizCompleted,
    setError,
    restartQuiz
  } = useAppStore();

  const [showDesignSystem, setShowDesignSystem] = React.useState(true);
  const [currentView, setCurrentView] = React.useState<'funnel' | 'results'>('funnel');

  const currentStep = getCurrentStep();
  const currentStepIndex = getCurrentStepIndex();
  const totalAnswers = Object.keys(answers).length;

  const handleNext = React.useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < quizConfig.steps.length) {
      navigateToStep(quizConfig.steps[nextIndex].id);
    } else {
      // Quiz completed
      setQuizCompleted(true);
    }
  }, [currentStepIndex, quizConfig.steps, navigateToStep, setQuizCompleted]);

  const handleAnswer = React.useCallback((questionId: string, answer: any, option?: any) => {
    try {
      addAnswer(questionId, answer);
      if (option?.nextStepId && quizConfig.steps.some(s => s.id === option.nextStepId)) {
        navigateToStep(option.nextStepId);
      } else {
        handleNext();
      }
      // Clear any previous errors
      if (hasError) {
        setError(false);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      setError(true);
    }
  }, [addAnswer, handleNext, navigateToStep, quizConfig.steps, hasError, setError]);

  const handleStart = React.useCallback(() => {
    try {
      if (quizConfig.steps.length > 1) {
        navigateToStep(quizConfig.steps[1].id);
      }
      // Clear any previous errors
      if (hasError) {
        setError(false);
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      setError(true);
    }
  }, [quizConfig.steps, navigateToStep, hasError, setError]);

  const handleQuizComplete = React.useCallback(() => {
    setQuizCompleted(true);
  }, [setQuizCompleted]);

  const handleEditFunnel = React.useCallback(() => {
    toggleBuilderMode();
    setError(false);
  }, [toggleBuilderMode, setError]);

  const handleRestartQuiz = React.useCallback(() => {
    restartQuiz();
    setError(false);
  }, [restartQuiz, setError]);

  const handleAnalyzeAnswer = React.useCallback(async (submissionId: string, questionId: string) => {
    try {
      const analysis = await mockAnalyzeAnswer(submissionId, questionId);
      
      // Update the submission with the new analysis
      const updatedSubmissions = mockSubmissions.map(sub => {
        if (sub.id === submissionId) {
          return {
            ...sub,
            analyzedAnswers: sub.analyzedAnswers.map(answer => 
              answer.questionId === questionId 
                ? { ...answer, analysis }
                : answer
            )
          };
        }
        return sub;
      });
      
      // In a real app, you would update the store here
      console.log('Analysis completed:', analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    }
  }, []);

  if (showDesignSystem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Design System Preview</h1>
            <Button onClick={() => setShowDesignSystem(false)}>
              View Funnel Builder
            </Button>
          </div>
        </div>
        <DesignSystemDemo />
      </div>
    );
  }

  return (
    <div className="bg-black font-primary min-h-screen">
      <main className="relative min-h-screen w-full flex flex-col">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Video Funnel Builder - Upgraded</h1>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setShowDesignSystem(true)}>
                View Design System
              </Button>
              <Button 
                variant={currentView === 'funnel' ? 'primary' : 'outline'}
                onClick={() => setCurrentView('funnel')}
              >
                Funnel Builder
              </Button>
              <Button 
                variant={currentView === 'results' ? 'primary' : 'outline'}
                onClick={() => setCurrentView('results')}
              >
                Results Dashboard
              </Button>
              {currentView === 'funnel' && (
                <Button onClick={toggleBuilderMode}>
                  {isBuilderMode ? 'Preview Funnel' : 'Edit Funnel'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {currentView === 'results' ? (
          <div className="flex-grow">
            <Suspense fallback={<LoadingSpinner className="flex items-center justify-center min-h-screen" />}>
              <ResultsDashboard 
                submissions={mockSubmissions}
                onAnalyze={handleAnalyzeAnswer}
              />
            </Suspense>
          </div>
        ) : (
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2">
            <Suspense fallback={<LoadingSpinner className="flex items-center justify-center min-h-screen" />}>
              {isBuilderMode ? (
                <Builder config={quizConfig} setConfig={useAppStore.getState().setQuizConfig} />
              ) : (
                <QuizContainer
                  step={isQuizCompleted ? quizConfig.steps.length : currentStepIndex}
                  quizSteps={quizConfig.steps}
                  onNext={handleNext}
                  onBack={goBack}
                  onAnswer={handleAnswer}
                  onStart={handleStart}
                  onQuizComplete={handleQuizComplete}
                  onEditFunnel={handleEditFunnel}
                  onRestartQuiz={handleRestartQuiz}
                  totalAnswers={totalAnswers}
                />
              )}
              {currentStep && (
                <MediaViewer
                  media={currentStep.media}
                  isWelcomeScreen={currentStepIndex === 0 && !isBuilderMode}
                />
              )}
            </Suspense>
          </div>
        )}

        <Suspense fallback={<div className="h-16 bg-brand-maroon" />}>
          <Footer isBuilderMode={isBuilderMode} onToggleBuilder={toggleBuilderMode} />
        </Suspense>

        {/* Floating Builder Button - shows when quiz is completed or there's an error */}
        <FloatingBuilderButton
          onClick={handleEditFunnel}
          show={currentView === 'funnel' && !isBuilderMode && (isQuizCompleted || hasError)}
        />
      </main>
    </div>
  );
};

export default UpgradePreviewApp;