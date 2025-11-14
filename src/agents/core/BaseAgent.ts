/**
 * Classe de base abstraite pour tous les agents IA
 * Fournit monitoring, cache et retry automatiques
 */

import type { AgentConfig, AgentMetrics } from './types';
import { AgentMonitoring } from '../utils/monitoring/AgentMonitoring';

export abstract class BaseAgent<TInput, TOutput> {
  protected config: AgentConfig;
  protected monitoring: AgentMonitoring;

  constructor(config: AgentConfig) {
    this.config = config;
    this.monitoring = new AgentMonitoring(this.name, config.monitoring);
  }

  /**
   * Nom de l'agent (à implémenter par les sous-classes)
   */
  abstract get name(): string;

  /**
   * Logique principale de l'agent (à implémenter par les sous-classes)
   */
  abstract execute(input: TInput): Promise<TOutput>;

  /**
   * Méthode publique pour exécuter l'agent
   * Gère automatiquement le monitoring, cache et retry
   */
  async run(input: TInput): Promise<TOutput> {
    const metrics: AgentMetrics = {
      agentName: this.name,
      startTime: Date.now(),
      success: false,
    };

    try {
      // Log début
      this.monitoring.trackStart(this.name);

      // Exécuter avec retry
      const result = await this.executeWithRetry(input);

      // Succès
      metrics.success = true;
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;

      this.monitoring.trackSuccess(this.name, metrics.duration);

      return result;
    } catch (error) {
      // Erreur
      metrics.success = false;
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      metrics.error = error as Error;

      this.monitoring.trackError(this.name, error as Error);

      throw error;
    }
  }

  /**
   * Exécute avec retry automatique en cas d'erreur
   */
  private async executeWithRetry(input: TInput): Promise<TOutput> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.config.gemini.maxRetries; attempt++) {
      try {
        // Tentative d'exécution
        return await this.execute(input);
      } catch (error) {
        lastError = error as Error;

        // Si dernier retry, throw
        if (attempt === this.config.gemini.maxRetries) {
          throw error;
        }

        // Attendre avant de retry (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await this.sleep(delay);

        this.monitoring.log('warn', `Retry ${attempt + 1}/${this.config.gemini.maxRetries} après ${delay}ms`, {
          error: (error as Error).message,
        });
      }
    }

    throw lastError || new Error('Unknown error');
  }

  /**
   * Utilitaire pour attendre
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Valide un input (à surcharger si besoin)
   */
  protected validateInput(input: TInput): void {
    if (input === null || input === undefined) {
      throw new Error(`Input invalide pour l'agent ${this.name}`);
    }
  }

  /**
   * Valide un output (à surcharger si besoin)
   */
  protected validateOutput(output: TOutput): TOutput {
    if (output === null || output === undefined) {
      throw new Error(`Output invalide de l'agent ${this.name}`);
    }
    return output;
  }
}
