import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizConfig, Answers, Submission } from '../../types';
import { DEFAULT_QUIZ_CONFIG } from '../../constants';

interface AppStore {
  // State
  quizConfig: QuizConfig;
  currentStepId: string;
  answers: Answers;
  isBuilderMode: boolean;
  history: string[];
  submissions: Submission[];
  
  // Actions
  setQuizConfig: (config: QuizConfig) => void;
  navigateToStep: (stepId: string) => void;
  addAnswer: (questionId: string, answer: any) => void;
  toggleBuilderMode: () => void;
  goBack: () => void;
  goToNext: () => void;
  reset: () => void;
  addSubmission: (submission: Submission) => void;
  
  // Computed
  getCurrentStep: () => any;
  getCurrentStepIndex: () => number;
  canGoBack: () => boolean;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      quizConfig: DEFAULT_QUIZ_CONFIG,
      currentStepId: DEFAULT_QUIZ_CONFIG.steps[0]?.id || '',
      answers: {},
      isBuilderMode: false,
      history: [DEFAULT_QUIZ_CONFIG.steps[0]?.id || ''],
      submissions: [],
      
      // Actions
      setQuizConfig: (config) => {
        set({ 
          quizConfig: config,
          currentStepId: config.steps[0]?.id || '',
          history: [config.steps[0]?.id || '']
        });
      },
      
      navigateToStep: (stepId) => {
        set(state => ({
          currentStepId: stepId,
          history: [...state.history, stepId]
        }));
      },
      
      addAnswer: (questionId, answer) => {
        set(state => ({
          answers: { ...state.answers, [questionId]: answer }
        }));
      },
      
      toggleBuilderMode: () => {
        set(state => ({ isBuilderMode: !state.isBuilderMode }));
      },
      
      goBack: () => {
        set(state => {
          if (state.history.length > 1) {
            const newHistory = state.history.slice(0, -1);
            return {
              history: newHistory,
              currentStepId: newHistory[newHistory.length - 1]
            };
          }
          return state;
        });
      },
      // New action: goToNext - advance to next step if possible
      goToNext: () => {
        set(state => {
          const currentIndex = state.quizConfig.steps.findIndex(s => s.id === state.currentStepId);
          const nextIndex = currentIndex + 1;
          if (nextIndex < state.quizConfig.steps.length) {
            const nextStepId = state.quizConfig.steps[nextIndex].id;
            return {
              currentStepId: nextStepId,
              history: [...state.history, nextStepId]
            };
          }
          // already at last step, keep state unchanged
          return state;
        });
      },
      
      reset: () => {
        set({
          currentStepId: DEFAULT_QUIZ_CONFIG.steps[0]?.id || '',
          answers: {},
          history: [DEFAULT_QUIZ_CONFIG.steps[0]?.id || ''],
          isBuilderMode: false
        });
      },
      
      // Computed
      getCurrentStep: () => {
        const state = get();
        return state.quizConfig.steps.find(s => s.id === state.currentStepId);
      },
      
      getCurrentStepIndex: () => {
        const state = get();
        return state.quizConfig.steps.findIndex(s => s.id === state.currentStepId);
      },
      
      canGoBack: () => {
        const state = get();
        return state.history.length > 1;
      },
      
      addSubmission: (submission: Submission) => {
        set((state) => ({
          submissions: [...state.submissions, submission]
        }));
      }
    }),
    { 
      name: 'funnel-storage',
      partialize: (state) => ({
        quizConfig: state.quizConfig,
        answers: state.answers,
        submissions: state.submissions
      })
    }
  )
);
