import { act } from 'react';
// import { useAppStore } from './appStore'; // removed to avoid shared instance
import { DEFAULT_QUIZ_CONFIG } from '../../constants';

// Mock localStorage for zustand persist
class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() { this.store = {}; }
  getItem(key: string) { return this.store[key] ?? null; }
  setItem(key: string, value: string) { this.store[key] = value; }
  removeItem(key: string) { delete this.store[key]; }
}

Object.defineProperty(window, 'localStorage', { value: new LocalStorageMock() });

describe('useAppStore', () => {
  beforeEach(() => {
    // reset store state by re‑creating the hook (zustand does not expose a reset, so we clear persisted storage)
    (window.localStorage as any).clear();
    // re‑import to get fresh store instance
    jest.resetModules();
  });

  it('has correct default state', () => {
    const { getState } = require('./appStore').useAppStore;
    const state = getState();
    expect(state.quizConfig).toEqual(DEFAULT_QUIZ_CONFIG);
    expect(state.currentStepId).toBe(DEFAULT_QUIZ_CONFIG.steps[0]?.id || '');
    expect(state.answers).toEqual({});
    expect(state.isBuilderMode).toBe(false);
    expect(state.history).toEqual([DEFAULT_QUIZ_CONFIG.steps[0]?.id || '']);
  });

  it('can navigate to a step and go back', () => {
    const { getState, setState } = require('./appStore').useAppStore;
    const store = require('./appStore').useAppStore;
    const stepId = DEFAULT_QUIZ_CONFIG.steps[1]?.id || 'second';
    act(() => {
      store.getState().navigateToStep(stepId);
    });
    let state = store.getState();
    expect(state.currentStepId).toBe(stepId);
    expect(state.history).toContain(stepId);
    act(() => {
      store.getState().goBack();
    });
    state = store.getState();
    expect(state.currentStepId).toBe(DEFAULT_QUIZ_CONFIG.steps[0]?.id || '');
    expect(state.history.length).toBe(1);
  });

  it('adds an answer', () => {
    const store = require('./appStore').useAppStore;
    act(() => {
      store.getState().addAnswer('q1', 'my answer');
    });
    const state = store.getState();
    expect(state.answers).toEqual({ q1: 'my answer' });
  });

  it('toggles builder mode', () => {
    const store = require('./appStore').useAppStore;
    const initial = store.getState().isBuilderMode;
    act(() => {
      store.getState().toggleBuilderMode();
    });
    expect(store.getState().isBuilderMode).toBe(!initial);
  });

  it('resets to initial state', () => {
    const store = require('./appStore').useAppStore;
    act(() => {
      store.getState().addAnswer('q1', 'a');
      store.getState().toggleBuilderMode();
    });
    act(() => {
      store.getState().reset();
    });
    const state = store.getState();
    expect(state.answers).toEqual({});
    expect(state.isBuilderMode).toBe(false);
    expect(state.currentStepId).toBe(DEFAULT_QUIZ_CONFIG.steps[0]?.id || '');
  });
});
