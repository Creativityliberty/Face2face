import React from 'react';
import { FaceSmileIcon, FaceFrownIcon, MinusCircleIcon } from '../icons';
import { AIAnalysisResult } from '../../types';

interface SentimentDisplayProps {
  sentiment: AIAnalysisResult['sentiment'];
}

export const SentimentDisplay: React.FC<SentimentDisplayProps> = ({ sentiment }) => {
  const sentimentMap = {
    Positive: { 
      icon: FaceSmileIcon, 
      color: 'text-green-600', 
      bgColor: 'bg-green-100',
      label: 'Positive' 
    },
    Negative: { 
      icon: FaceFrownIcon, 
      color: 'text-red-600', 
      bgColor: 'bg-red-100',
      label: 'Negative' 
    },
    Neutral: { 
      icon: MinusCircleIcon, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-100',
      label: 'Neutral' 
    },
  };

  const { icon: Icon, color, bgColor, label } = sentimentMap[sentiment];

  return (
    <div className={`inline-flex items-center space-x-1.5 text-sm font-medium px-2.5 py-1 rounded-full ${bgColor}`}>
      <Icon className={`w-4 h-4 ${color}`} />
      <span className={color}>{label}</span>
    </div>
  );
};