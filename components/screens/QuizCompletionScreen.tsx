import React from 'react';
import { Button, Card } from '../ui';
import { PencilSquareIcon, SparklesIcon } from '../icons';

interface QuizCompletionScreenProps {
  onEditFunnel: () => void;
  onRestartQuiz: () => void;
  totalAnswers: number;
}

export const QuizCompletionScreen: React.FC<QuizCompletionScreenProps> = ({
  onEditFunnel,
  onRestartQuiz,
  totalAnswers
}) => {
  return (
    <div className="w-full max-w-md mx-auto animate-slide-in text-center">
      <Card className="p-8">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
          <p className="text-gray-600">
            Thank you for completing the funnel. You provided {totalAnswers} answer{totalAnswers !== 1 ? 's' : ''}.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onEditFunnel}
            variant="primary"
            size="lg"
            className="w-full"
          >
            <PencilSquareIcon className="w-5 h-5 mr-2" />
            Edit This Funnel
          </Button>
          
          <Button
            onClick={onRestartQuiz}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Start Over
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Want to create your own funnel? Use the builder to customize every step!
          </p>
        </div>
      </Card>
    </div>
  );
};