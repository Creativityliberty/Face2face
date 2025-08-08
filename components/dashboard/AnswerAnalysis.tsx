import React from 'react';
import { SentimentDisplay } from './SentimentDisplay';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { AIAnalysisResult } from '../../types';

interface AnswerAnalysisProps {
  analysis?: AIAnalysisResult; // optional, may be undefined while loading
  loading?: boolean; // indicates AI analysis is in progress
}

export const AnswerAnalysis: React.FC<AnswerAnalysisProps> = ({ analysis, loading }) => {
  return (
    <div className="mt-3 p-4 bg-blue-50/50 border border-blue-200 rounded-lg space-y-3">
      {loading && (
        <div className="flex justify-center mb-2">
          <LoadingSpinner />
        </div>
      )}
      {analysis && (
        <div>
          <h4 className="text-xs font-semibold uppercase text-blue-800/60 mb-1">Sentiment</h4>
          <SentimentDisplay sentiment={analysis.sentiment} />
        </div>
      )}
      
      {analysis && (
        <div>
          <h4 className="text-xs font-semibold uppercase text-blue-800/60 mb-1.5">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map(keyword => (
              <span 
                key={keyword} 
                className="bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-1 rounded"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {analysis && (
        <div>
          <h4 className="text-xs font-semibold uppercase text-blue-800/60 mb-1">AI Summary</h4>
          <p className="text-blue-900 italic">"{analysis.summary}"</p>
        </div>
      )}
    </div>
  );
};