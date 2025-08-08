import { Submission, AIAnalysisResult } from './types';

// Date and time formatting functions
export const formatSubmissionDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};

export const formatSubmissionTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

export const formatSubmissionDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

// Mock data for Results Dashboard
export const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    timestamp: Date.now() - 86400000, // 1 day ago
    contactInfo: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0123',
      subscribed: true
    },
    analyzedAnswers: [
      {
        questionId: 'step-2',
        questionText: "What's your biggest life challenge?",
        answer: 'Repetitive Negative Beliefs',
        analysis: {
          sentiment: 'Negative' as const,
          keywords: ['negative', 'beliefs', 'repetitive', 'challenge'],
          summary: 'User struggles with recurring negative thought patterns that impact their daily life.'
        }
      },
      {
        questionId: 'step-4',
        questionText: 'In one sentence, what holds you back MOST from healing?',
        answer: 'I keep doubting myself and my ability to change.',
        analysis: {
          sentiment: 'Negative' as const,
          keywords: ['doubt', 'self-doubt', 'change', 'ability'],
          summary: 'Self-doubt appears to be the primary barrier to personal growth and healing.'
        }
      }
    ]
  },
  {
    id: 'sub-2',
    timestamp: Date.now() - 172800000, // 2 days ago
    contactInfo: {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1-555-0456',
      subscribed: false
    },
    analyzedAnswers: [
      {
        questionId: 'step-2',
        questionText: "What's your biggest life challenge?",
        answer: 'Emotional Dysfunction (Sadness/Anxiety)',
      },
      {
        questionId: 'step-4',
        questionText: 'In one sentence, what holds you back MOST from healing?',
        answer: 'Fear of vulnerability and opening up to others.',
      }
    ]
  },
  {
    id: 'sub-3',
    timestamp: Date.now() - 259200000, // 3 days ago
    contactInfo: {
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@email.com',
      phone: '',
      subscribed: true
    },
    analyzedAnswers: [
      {
        questionId: 'step-2',
        questionText: "What's your biggest life challenge?",
        answer: 'Relational Dysfunction (Family, Work)',
        analysis: {
          sentiment: 'Neutral' as const,
          keywords: ['relationships', 'family', 'work', 'dysfunction'],
          summary: 'User identifies relationship challenges in both personal and professional contexts.'
        }
      },
      {
        questionId: 'step-4',
        questionText: 'In one sentence, what holds you back MOST from healing?',
        answer: 'I struggle to set healthy boundaries with people.',
        analysis: {
          sentiment: 'Neutral' as const,
          keywords: ['boundaries', 'healthy', 'people', 'struggle'],
          summary: 'Boundary-setting difficulties appear to be the main obstacle to healing.'
        }
      }
    ]
  },
  {
    id: 'sub-4',
    timestamp: Date.now() - 345600000, // 4 days ago
    contactInfo: {
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1-555-0789',
      subscribed: true
    },
    analyzedAnswers: [
      {
        questionId: 'step-2',
        questionText: "What's your biggest life challenge?",
        answer: 'Emotional Dysfunction (Sadness/Anxiety)',
        analysis: {
          sentiment: 'Positive' as const,
          keywords: ['growth', 'awareness', 'progress', 'healing'],
          summary: 'User shows positive awareness and readiness for emotional growth and healing.'
        }
      },
      {
        questionId: 'step-4',
        questionText: 'In one sentence, what holds you back MOST from healing?',
        answer: 'I am ready to embrace change and grow beyond my current limitations.',
        analysis: {
          sentiment: 'Positive' as const,
          keywords: ['ready', 'embrace', 'change', 'grow', 'limitations'],
          summary: 'User demonstrates a positive mindset and readiness for personal transformation.'
        }
      }
    ]
  }
];

// Mock AI analysis function
export const mockAnalyzeAnswer = async (submissionId: string, questionId: string): Promise<AIAnalysisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock analysis results
  const mockAnalyses: AIAnalysisResult[] = [
    {
      sentiment: 'Positive',
      keywords: ['growth', 'progress', 'healing', 'positive'],
      summary: 'User shows positive attitude towards personal development and growth.'
    },
    {
      sentiment: 'Negative',
      keywords: ['struggle', 'difficulty', 'challenge', 'barrier'],
      summary: 'User faces significant challenges that require attention and support.'
    },
    {
      sentiment: 'Neutral',
      keywords: ['awareness', 'understanding', 'reflection', 'insight'],
      summary: 'User demonstrates thoughtful reflection and self-awareness.'
    }
  ];
  
  return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
};