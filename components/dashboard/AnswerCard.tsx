import React, { useState } from 'react';
import { Button, Card } from '../ui';
import { SparklesIcon } from '../icons';
import { AnswerAnalysis } from './AnswerAnalysis';
import { Toast } from '../ui';
import { AnalyzedAnswer } from '../../types';

interface AnswerCardProps {
  answer: AnalyzedAnswer;
  submissionId: string;
  onAnalyze: (submissionId: string, questionId: string) => Promise<void>;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({ answer, submissionId, onAnalyze }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeClick = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      await onAnalyze(submissionId, answer.questionId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      console.error("Analysis failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderAnswer = () => {
    if (typeof answer.answer === 'string') {
      return <p className="text-gray-700 whitespace-pre-wrap">{answer.answer}</p>;
    }
    
    if (typeof answer.answer === 'object' && answer.answer.url) {
      if (answer.answer.type === 'video') {
        return (
          <video 
            src={answer.answer.url} 
            controls 
            className="w-full max-w-sm rounded-lg shadow-md" 
          />
        );
      }
      if (answer.answer.type === 'voice') {
        return (
          <audio 
            src={answer.answer.url} 
            controls 
            className="w-full" 
          />
        );
      }
    }
    
    return <p className="text-gray-500 italic">Unrecognized answer format.</p>;
  };

  return (
    <Card className="p-4">
      <p className="text-sm font-medium text-gray-500 mb-2">{answer.questionText}</p>
      <div className="mb-4">{renderAnswer()}</div>
      
      <div className="border-t pt-3">
        {answer.analysis ? (
          <AnswerAnalysis analysis={answer.analysis} loading={isAnalyzing} />
        ) : (
          <div className="space-y-2">
            <Button
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing}
              loading={isAnalyzing}
              variant="outline"
              className="w-full bg-brand-rose/10 hover:bg-brand-rose/20 text-brand-rose-dark border-brand-rose/20"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
            </Button>
            
            {error && (
                <Toast variant="error" message={error} />
              )}
          </div>
        )}
      </div>
    </Card>
  );
};