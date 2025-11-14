/**
 * Orchestrateur central pour tous les agents IA
 * Coordonne et route les requêtes vers les agents appropriés
 */

import type { AgentConfig, Funnel, GenerationSettings, AnalysisResult, AudioAnalysisResult } from './types';
import { BaseAgent } from './BaseAgent';
import { loadConfig } from './AgentConfig';

export class AgentOrchestrator {
  private agents: Map<string, BaseAgent<any, any>>;
  private config: AgentConfig;
  private static instance: AgentOrchestrator | null = null;

  private constructor(config?: Partial<AgentConfig>) {
    this.config = { ...loadConfig(), ...config };
    this.agents = new Map();
  }

  /**
   * Singleton instance
   */
  static getInstance(config?: Partial<AgentConfig>): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator(config);
    }
    return AgentOrchestrator.instance;
  }

  /**
   * Reset singleton (pour tests)
   */
  static resetInstance(): void {
    AgentOrchestrator.instance = null;
  }

  /**
   * Enregistre un agent
   */
  registerAgent(name: string, agent: BaseAgent<any, any>): void {
    this.agents.set(name, agent);
    console.log(`[Orchestrator] Agent "${name}" enregistré`);
  }

  /**
   * Récupère un agent par nom
   */
  getAgent<T extends BaseAgent<any, any>>(name: string): T {
    const agent = this.agents.get(name);
    if (!agent) {
      throw new Error(`Agent "${name}" non trouvé. Agents disponibles: ${Array.from(this.agents.keys()).join(', ')}`);
    }
    return agent as T;
  }

  /**
   * Vérifie si un agent existe
   */
  hasAgent(name: string): boolean {
    return this.agents.has(name);
  }

  /**
   * Liste tous les agents enregistrés
   */
  listAgents(): string[] {
    return Array.from(this.agents.keys());
  }

  /**
   * Génère un funnel complet
   * Route vers le FunnelGeneratorAgent
   */
  async generateFunnel(prompt: string, settings?: GenerationSettings): Promise<Funnel> {
    if (!this.hasAgent('funnel')) {
      throw new Error('FunnelGeneratorAgent non enregistré. Appelez registerAgent() d\'abord.');
    }

    const agent = this.getAgent('funnel');
    return agent.run({ prompt, settings });
  }

  /**
   * Analyse une réponse texte
   * Route vers le TextAnalysisAgent
   */
  async analyzeText(text: string, context: string): Promise<AnalysisResult> {
    if (!this.hasAgent('textAnalysis')) {
      throw new Error('TextAnalysisAgent non enregistré. Appelez registerAgent() d\'abord.');
    }

    const agent = this.getAgent('textAnalysis');
    return agent.run({ text, context });
  }

  /**
   * Analyse une réponse audio
   * Route vers le AudioAnalysisAgent
   */
  async analyzeAudio(audioBlob: Blob, context: string): Promise<AudioAnalysisResult> {
    if (!this.hasAgent('audioAnalysis')) {
      throw new Error('AudioAnalysisAgent non enregistré. Appelez registerAgent() d\'abord.');
    }

    const agent = this.getAgent('audioAnalysis');
    return agent.run({ audioBlob, context });
  }

  /**
   * Récupère la configuration
   */
  getConfig(): AgentConfig {
    return this.config;
  }

  /**
   * Nettoie les ressources
   */
  async shutdown(): Promise<void> {
    console.log('[Orchestrator] Arrêt en cours...');
    this.agents.clear();
    console.log('[Orchestrator] Arrêté');
  }
}

/**
 * Helper pour récupérer l'instance de l'orchestrateur
 */
export function getOrchestrator(config?: Partial<AgentConfig>): AgentOrchestrator {
  return AgentOrchestrator.getInstance(config);
}
