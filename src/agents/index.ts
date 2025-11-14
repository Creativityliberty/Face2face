/**
 * Point d'entrée principal pour les agents IA
 * Exports tous les agents, types et utilitaires
 */

// Core
export { BaseAgent } from './core/BaseAgent';
export { AgentOrchestrator, getOrchestrator } from './core/AgentOrchestrator';
export { loadConfig, validateConfig, defaultConfig } from './core/AgentConfig';

// Types
export type {
  AgentConfig,
  AgentMetrics,
  GenerationSettings,
  Funnel,
  FunnelStep,
  FunnelSettings,
  AnalysisResult,
  AudioAnalysisResult,
} from './core/types';

// Utils
export { AgentMonitoring } from './utils/monitoring/AgentMonitoring';
