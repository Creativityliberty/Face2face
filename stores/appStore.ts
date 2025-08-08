import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizConfig, Answers, Submission } from '../types';
import { DEFAULT_QUIZ_CONFIG } from '../constants';

export interface AppStore {
  // Auth State
  user: { id: string; email: string; name: string; } | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Funnel State
  quizConfig: QuizConfig;
  currentStepId: string;
  answers: Answers;
  isBuilderMode: boolean;
  history: string[];
  isQuizCompleted: boolean;
  hasError: boolean;
  submissions: Submission[];

  // Actions
  setUser: (user: any, tokens: { accessToken: string; refreshToken: string; }) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setQuizConfig: (config: QuizConfig) => void;
  navigateToStep: (stepId: string) => void;
  addAnswer: (questionId: string, answer: any) => void;
  toggleBuilderMode: () => void;
  goBack: () => void;
  goToNext: () => void;
  reset: () => void;
  setQuizCompleted: (completed: boolean) => void;
  setError: (hasError: boolean) => void;
  restartQuiz: () => void;
  addSubmission: (submission: Submission) => void;
  updateSubmission: (submissionId: string, updates: Partial<Submission>) => void;

  // Computed
  isAuthenticated: () => boolean;
  getCurrentStep: () => any;
  getCurrentStepIndex: () => number;
  canGoBack: () => boolean;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      quizConfig: DEFAULT_QUIZ_CONFIG,
      currentStepId: DEFAULT_QUIZ_CONFIG.steps[0]?.id || '',
      answers: {},
      isBuilderMode: false,
      history: [DEFAULT_QUIZ_CONFIG.steps[0]?.id || ''],
      isQuizCompleted: false,
      hasError: false,
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

      setUser: (user, tokens) => {
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      reset: () => {
        set({
          currentStepId: DEFAULT_QUIZ_CONFIG.steps[0]?.id || '',
          answers: {},
          history: [DEFAULT_QUIZ_CONFIG.steps[0]?.id || ''],
          user: null,
          accessToken: null,
          refreshToken: null,
          isQuizCompleted: false,
          hasError: false,
        });
      },

      setQuizCompleted: (completed) => {
        set({ isQuizCompleted: completed });
      },

      setError: (hasError) => {
        set({ hasError });
      },

      restartQuiz: () => {
        set({
          currentStepId: DEFAULT_QUIZ_CONFIG.steps[0]?.id || '',
          answers: {},
          history: [DEFAULT_QUIZ_CONFIG.steps[0]?.id || ''],
          isQuizCompleted: false,
          hasError: false,
        });
      },

      addSubmission: (submission) => {
        set(state => ({
          submissions: [...state.submissions, submission]
        }));
      },

      updateSubmission: (submissionId, updates) => {
        set(state => ({
          submissions: state.submissions.map(sub =>
            sub.id === submissionId ? { ...sub, ...updates } : sub
          )
        }));
      },

      // Computed
      isAuthenticated: () => {
        const state = get();
        return !!state.accessToken;
      },

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

      goToNext: () => {
        const state = get();
        const currentIndex = state.quizConfig.steps.findIndex(s => s.id === state.currentStepId);
        if (currentIndex >= 0 && currentIndex < state.quizConfig.steps.length - 1) {
          const nextStep = state.quizConfig.steps[currentIndex + 1];
          set(prevState => ({
            currentStepId: nextStep.id,
            history: [...prevState.history, nextStep.id]
          }));
        }
      }
    }),
    {
      name: 'funnel-storage',
      partialize: (state) => ({
        quizConfig: state.quizConfig,
        answers: state.answers
      })
    }
  )
);