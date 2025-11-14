/**
 * Types communs pour tous les agents IA
 */

export interface AgentConfig {
  gemini: {
    apiKey: string;
    model: string;
    timeout: number;
    maxRetries: number;
    temperature: number;
  };
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  limits: {
    maxSteps: number;
    maxPromptLength: number;
    maxAudioSize: number;
  };
  monitoring: {
    enabled: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

export interface AgentMetrics {
  agentName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  error?: Error;
  cacheHit?: boolean;
}

export interface GenerationSettings {
  language?: string;
  maxSteps?: number;
  tone?: string;
  industry?: string;
}

export interface Funnel {
  id?: string;
  title: string;
  description?: string;
  steps: FunnelStep[];
  settings?: FunnelSettings;
}

export interface FunnelStep {
  id?: string;
  order: number;
  type: 'welcome' | 'question' | 'leadCapture' | 'message';
  title: string;
  content?: string;
  settings?: Record<string, any>;
}

export interface FunnelSettings {
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
  };
  branding?: {
    logo?: string;
    companyName?: string;
  };
}

export interface AnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  themes: string[];
  intent?: string;
  painPoints?: string[];
  opportunities?: string[];
  summary: string;
}

export interface AudioAnalysisResult {
  transcript: string;
  analysis: AnalysisResult;
}
