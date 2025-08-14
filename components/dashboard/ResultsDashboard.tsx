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
  // Track which submissions are expanded in the list view
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
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
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {(submission.contactInfo.name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {submission.contactInfo.name || 'Utilisateur Anonyme'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {submission.contactInfo.email}
                        </p>
                      </div>
                    </div>
                    
                    {submission.contactInfo.phone && (
                      <p className="text-sm text-gray-500 ml-13">
                        📞 {submission.contactInfo.phone}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-3 mt-2 ml-13">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {submission.analyzedAnswers.length} réponse{submission.analyzedAnswers.length !== 1 ? 's' : ''}
                      </span>
                      {submission.contactInfo.subscribed && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Abonné
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Soumis le {formatSubmissionDate(submission.timestamp)} à {formatSubmissionTime(submission.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Toggle button for inline answers */}
                <div className="mt-2 flex justify-end">
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newSet = new Set(expandedIds);
                      if (newSet.has(submission.id)) {
                        newSet.delete(submission.id);
                      } else {
                        newSet.add(submission.id);
                      }
                      setExpandedIds(newSet);
                    }}
                  >
                    {expandedIds.has(submission.id) ? 'Hide Answers' : 'Show Answers'}
                  </button>
                </div>
                {expandedIds.has(submission.id) && (
                  <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">💬 Réponses détaillées :</h4>
                    {submission.analyzedAnswers.map((answer, index) => (
                      <div key={answer.questionId} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 mb-2">{answer.questionText}</p>
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                              <p className="text-gray-700 font-medium">
                                {typeof answer.answer === 'string'
                                  ? answer.answer
                                  : answer.answer?.url ? `📎 Fichier média: ${answer.answer.url}` : '❌ Pas de réponse'}
                              </p>
                            </div>
                            {answer.analysis && (
                              <div className="mt-2 text-xs text-gray-500">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full ${
                                  answer.analysis.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                                  answer.analysis.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {answer.analysis.sentiment === 'Positive' ? '😊' : 
                                   answer.analysis.sentiment === 'Negative' ? '😔' : '😐'} 
                                  {answer.analysis.sentiment}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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