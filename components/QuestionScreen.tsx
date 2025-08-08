import React, { useState } from 'react';
import { Button, Textarea, BackButton } from './ui';
import { MediaRecorder } from './screens/MediaRecorder';
import { type QuestionStep, type QuestionOption } from '../types';

interface QuestionScreenProps {
  stepData: QuestionStep;
  onAnswer: (answer: any, option?: QuestionOption) => void;
  onBack: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({ stepData, onAnswer, onBack }) => {
  const [textAnswer, setTextAnswer] = useState('');

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textAnswer.trim()) {
      onAnswer(textAnswer);
    }
  };

  const renderAnswerInput = () => {
    switch (stepData.answerInput.type) {
      case 'buttons':
        return (
          <div className="space-y-3 sm:space-y-2">
            {(stepData.options || []).map((option, index) => (
              <Button
                key={option.id}
                onClick={() => onAnswer(option.text, option)}
                variant="primary"
                className={`w-full text-left justify-start p-4 sm:p-4 text-base sm:text-lg font-medium touch-manipulation min-h-[48px] ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${
                  index === (stepData.options?.length || 1) - 1 ? 'rounded-b-lg' : 'rounded-none'
                }`}
              >
                <span className="break-words">{option.text}</span>
              </Button>
            ))}
          </div>
        );

      case 'text':
        return (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <Textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
              className="bg-white/90 text-brand-text placeholder:text-brand-text/50 text-base sm:text-lg min-h-[120px] touch-manipulation"
            />
            <Button
              type="submit"
              disabled={!textAnswer.trim()}
              className="w-full touch-manipulation min-h-[48px]"
              size="lg"
            >
              Submit Answer
            </Button>
          </form>
        );

      case 'voice':
        return (
          <MediaRecorder
            type="voice"
            onSubmit={(data) => onAnswer(data)}
          />
        );

      case 'video':
        return (
          <MediaRecorder
            type="video"
            onSubmit={(data) => onAnswer(data)}
          />
        );

      default:
        return (
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600">Unknown answer type</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-slide-in">
      <div className="mb-8">
        <BackButton onClick={onBack}>
          {stepData.question}
        </BackButton>
      </div>
      {renderAnswerInput()}
    </div>
  );
};