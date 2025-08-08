import React from 'react';
import { X, BarChart3 } from 'lucide-react';
import { ResultsDashboard } from './dashboard/ResultsDashboard';
import { mockSubmissions, mockAnalyzeAnswer } from '../resultsDashboardMockData';

interface ResultsPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Funnel Results</h2>
            </div>
            <p className="text-gray-600 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Analyze your submissions and responses</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Close results panel"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <ResultsDashboard 
            submissions={mockSubmissions} 
            onAnalyze={mockAnalyzeAnswer}
          />
        </div>
      </div>
    </div>
  );
};
