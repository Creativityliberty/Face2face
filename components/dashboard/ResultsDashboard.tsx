import React, { useState } from 'react';
import { Button, Card } from '../ui';
import { SubmissionDetail } from './SubmissionDetail';
import { Submission } from '../../types';
import { formatSubmissionDate, formatSubmissionTime } from '../../resultsDashboardMockData';

interface ResultsDashboardProps {
  submissions: Submission[];
  onAnalyze: (submissionId: string, questionId: string) => Promise<void>;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ 
  submissions, 
  onAnalyze 
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(submissions.length / itemsPerPage);
  const paginatedSubmissions = submissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (selectedSubmission) {
    return (
      <div className="bg-gray-50 text-gray-800 p-6 md:p-8 overflow-y-auto min-h-screen">
        <div className="max-w-2xl mx-auto">
          <SubmissionDetail 
            submission={selectedSubmission} 
            onBack={() => setSelectedSubmission(null)} 
            onAnalyze={onAnalyze} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-800 p-6 md:p-8 overflow-y-auto min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Funnel Results</h2>
          <p className="text-gray-600">
            {submissions.length > 0
              ? `You have ${submissions.length} submission${submissions.length !== 1 ? 's' : ''}. Click one to view details and analyze responses.`
              : "You don't have any submissions yet. Share your funnel to start collecting results."}
          </p>
        </div>
        
        {submissions.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-500 mb-4">
              Once people complete your funnel, their responses will appear here.
            </p>
            <Button variant="outline">
              Share Your Funnel
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {paginatedSubmissions.map(submission => (
              <Card
                key={submission.id}
                className="p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-brand-rose-dark">
                      {submission.contactInfo.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {submission.contactInfo.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {submission.analyzedAnswers.length} answer{submission.analyzedAnswers.length !== 1 ? 's' : ''}
                      </span>
                      {submission.contactInfo.subscribed && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Subscribed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <p>{formatSubmissionDate(submission.timestamp)}</p>
                    <p>{formatSubmissionTime(submission.timestamp)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};