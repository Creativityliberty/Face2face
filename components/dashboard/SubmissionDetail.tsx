import React from 'react';
import { BackButton, Card } from '../ui';
import { AnswerCard } from './AnswerCard';
import { Submission } from '../../types';
import { formatSubmissionDateTime } from '../../resultsDashboardMockData';

interface SubmissionDetailProps {
  submission: Submission;
  onBack: () => void;
  onAnalyze: (submissionId: string, questionId: string) => Promise<void>;
}

export const SubmissionDetail: React.FC<SubmissionDetailProps> = ({ 
  submission, 
  onBack, 
  onAnalyze 
}) => {
  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} className="mb-6">
        Back to all submissions
      </BackButton>
      
      <Card className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {submission.contactInfo.name}
        </h3>
        <p className="text-gray-500 mb-1">
          {submission.contactInfo.email}
          {submission.contactInfo.phone && ` | ${submission.contactInfo.phone}`}
        </p>
        <p className="text-sm text-gray-400">
          Submitted on: {formatSubmissionDateTime(submission.timestamp)}
        </p>
        {submission.contactInfo.subscribed && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Subscribed
            </span>
          </div>
        )}
      </Card>
      
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Answers</h4>
        {submission.analyzedAnswers.map(answer => (
          <AnswerCard 
            key={answer.questionId} 
            answer={answer} 
            submissionId={submission.id} 
            onAnalyze={onAnalyze} 
          />
        ))}
      </div>
    </div>
  );
};