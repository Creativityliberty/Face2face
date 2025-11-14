/**
 * Configuration centralisée pour tous les agents IA
 */

import type { AgentConfig } from './types';

/**
 * Configuration par défaut des agents
 */
export const defaultConfig: AgentConfig = {
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-pro',
    timeout: parseInt(import.meta.env.VITE_AI_TIMEOUT || '30000'),
    maxRetries: parseInt(import.meta.env.VITE_AI_MAX_RETRIES || '3'),
    temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE || '0.7'),
  },
  cache: {
    enabled: import.meta.env.VITE_CACHE_ENABLED !== 'false',
    ttl: parseInt(import.meta.env.VITE_CACHE_TTL || '3600'), // 1 hour
    maxSize: parseInt(import.meta.env.VITE_CACHE_MAX_SIZE || '1000'),
  },
  limits: {
    maxSteps: parseInt(import.meta.env.VITE_MAX_STEPS || '15'),
    maxPromptLength: parseInt(import.meta.env.VITE_MAX_PROMPT_LENGTH || '5000'),
    maxAudioSize: parseInt(import.meta.env.VITE_MAX_AUDIO_SIZE || '10485760'), // 10MB
  },
  monitoring: {
    enabled: import.meta.env.VITE_MONITORING_ENABLED !== 'false',
    logLevel: (import.meta.env.VITE_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
  },
};

/**
 * Valide la configuration des agents
 * Lance une erreur si la configuration est invalide
 */
export function validateConfig(config: AgentConfig): void {
  // Valider API Key
  if (!config.gemini.apiKey) {
    throw new Error('VITE_GEMINI_API_KEY est requis pour utiliser les agents IA');
  }

  if (config.gemini.apiKey.length < 20) {
    throw new Error('VITE_GEMINI_API_KEY semble invalide (trop court)');
  }

  // Valider timeout
  if (config.gemini.timeout < 1000 || config.gemini.timeout > 60000) {
    throw new Error('Timeout doit être entre 1s et 60s');
  }

  // Valider maxSteps
  if (config.limits.maxSteps < 1 || config.limits.maxSteps > 20) {
    throw new Error('MaxSteps doit être entre 1 et 20');
  }

  // Valider maxRetries
  if (config.gemini.maxRetries < 0 || config.gemini.maxRetries > 5) {
    throw new Error('MaxRetries doit être entre 0 et 5');
  }

  // Valider temperature
  if (config.gemini.temperature < 0 || config.gemini.temperature > 1) {
    throw new Error('Temperature doit être entre 0 et 1');
  }
}

/**
 * Charge et valide la configuration
 */
export function loadConfig(): AgentConfig {
  const config = { ...defaultConfig };
  validateConfig(config);
  return config;
}
