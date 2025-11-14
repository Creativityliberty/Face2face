/**
 * Système de monitoring pour les agents IA
 * Tracks métriques, logs et erreurs
 */

export class AgentMonitoring {
  private agentName: string;
  private config: {
    enabled: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };

  // Métriques en mémoire
  private metrics: Map<string, number> = new Map();

  constructor(
    agentName: string,
    config: { enabled: boolean; logLevel: 'debug' | 'info' | 'warn' | 'error' }
  ) {
    this.agentName = agentName;
    this.config = config;
  }

  /**
   * Track début d'exécution
   */
  trackStart(agentName: string): void {
    if (!this.config.enabled) return;

    this.log('info', `Agent ${agentName} démarré`);
    this.incrementMetric(`${agentName}.starts`);
  }

  /**
   * Track succès
   */
  trackSuccess(agentName: string, duration: number): void {
    if (!this.config.enabled) return;

    this.log('info', `Agent ${agentName} terminé avec succès en ${duration}ms`);
    this.incrementMetric(`${agentName}.successes`);
    this.recordMetric(`${agentName}.duration`, duration);
  }

  /**
   * Track erreur
   */
  trackError(agentName: string, error: Error): void {
    if (!this.config.enabled) return;

    this.log('error', `Agent ${agentName} a échoué: ${error.message}`, {
      error: error.message,
      stack: error.stack,
    });
    this.incrementMetric(`${agentName}.errors`);
  }

  /**
   * Track cache hit
   */
  trackCacheHit(agentName: string): void {
    if (!this.config.enabled) return;

    this.log('debug', `Agent ${agentName} - cache hit`);
    this.incrementMetric(`${agentName}.cache_hits`);
  }

  /**
   * Track cache miss
   */
  trackCacheMiss(agentName: string): void {
    if (!this.config.enabled) return;

    this.log('debug', `Agent ${agentName} - cache miss`);
    this.incrementMetric(`${agentName}.cache_misses`);
  }

  /**
   * Log un message
   */
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    if (!this.config.enabled) return;

    // Vérifier si on doit logger ce niveau
    const levels: Record<string, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    if (levels[level] < levels[this.config.logLevel]) {
      return;
    }

    // Log structuré
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      agent: this.agentName,
      message,
      ...(data && { data }),
    };

    // Console log (en prod, envoyer à un service de logging)
    if (level === 'error') {
      console.error('[Agent Error]', logEntry);
    } else if (level === 'warn') {
      console.warn('[Agent Warning]', logEntry);
    } else if (level === 'debug') {
      console.debug('[Agent Debug]', logEntry);
    } else {
      console.log('[Agent Info]', logEntry);
    }
  }

  /**
   * Incrémente une métrique
   */
  private incrementMetric(key: string): void {
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + 1);
  }

  /**
   * Enregistre une métrique (pour durées, etc.)
   */
  private recordMetric(key: string, value: number): void {
    // Pour simplifier, on garde juste la dernière valeur
    // En prod, utiliser un système de métriques approprié (Prometheus, DataDog, etc.)
    this.metrics.set(key, value);
  }

  /**
   * Récupère toutes les métriques
   */
  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Reset les métriques
   */
  resetMetrics(): void {
    this.metrics.clear();
  }
}
