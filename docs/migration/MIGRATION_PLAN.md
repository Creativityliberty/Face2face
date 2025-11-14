# Plan de Migration - Architecture des Agents IA

## Vue d'Ensemble

Ce document décrit le plan détaillé de migration de l'architecture actuelle vers la nouvelle architecture modulaire des agents IA.

**Durée estimée:** 6-8 semaines
**Risque:** Moyen
**Impact utilisateur:** Minimal (migration transparente)

---

## Principes de Migration

### Stratégie: Strangler Fig Pattern

Nous utiliserons le pattern "Strangler Fig" pour migrer progressivement sans interruption de service:

1. **Créer** la nouvelle architecture en parallèle
2. **Router** progressivement le trafic vers les nouveaux agents
3. **Déprécier** l'ancienne architecture quand 100% migré
4. **Supprimer** l'ancien code après validation

### Critères de Succès

- ✅ Aucune régression fonctionnelle
- ✅ Temps de réponse ≤ architecture actuelle
- ✅ Taux d'erreur ≤ 0.5%
- ✅ Couverture de tests ≥ 80%
- ✅ Documentation complète

---

## Phase 1: Fondations (Semaine 1-2)

### Objectif
Créer la structure de base des agents sans toucher au code existant.

### Tâches

#### Semaine 1

##### 1.1 Créer la structure de répertoires

```bash
mkdir -p src/agents/{core,funnel,analysis,validation,utils}
mkdir -p src/agents/{funnel,analysis,validation,utils}/{__tests__}
mkdir -p src/agents/utils/{cache,monitoring,retry}
mkdir -p docs/{architecture,migration,api}
```

**Fichiers à créer:**
- `src/agents/core/BaseAgent.ts`
- `src/agents/core/AgentOrchestrator.ts`
- `src/agents/core/AgentConfig.ts`
- `src/agents/core/types.ts`

**Checklist:**
- [ ] Structure créée
- [ ] Types de base définis
- [ ] Configuration centralisée
- [ ] Tests unitaires de base

**Livrable:** Structure complète avec types et config

---

##### 1.2 Implémenter BaseAgent

```typescript
// src/agents/core/BaseAgent.ts
import { AgentConfig } from './AgentConfig';
import { AgentMonitoring } from '../utils/monitoring/AgentMonitoring';

export abstract class BaseAgent<TInput, TOutput> {
  protected config: AgentConfig;
  protected monitoring: AgentMonitoring;

  constructor(config: AgentConfig) {
    this.config = config;
    this.monitoring = new AgentMonitoring(this.name);
  }

  abstract get name(): string;
  abstract execute(input: TInput): Promise<TOutput>;

  async run(input: TInput): Promise<TOutput> {
    const startTime = Date.now();

    try {
      this.monitoring.trackStart(this.name);
      const result = await this.execute(input);
      this.monitoring.trackSuccess(this.name, Date.now() - startTime);
      return result;
    } catch (error) {
      this.monitoring.trackError(this.name, error as Error);
      throw error;
    }
  }
}
```

**Tests:**
```typescript
// src/agents/core/__tests__/BaseAgent.test.ts
describe('BaseAgent', () => {
  it('should track metrics on success', async () => {
    // Test implementation
  });

  it('should track metrics on error', async () => {
    // Test implementation
  });
});
```

**Checklist:**
- [ ] BaseAgent implémenté
- [ ] Tests unitaires passent
- [ ] Documentation JSDoc
- [ ] Revue de code

---

##### 1.3 Implémenter système de monitoring

```typescript
// src/agents/utils/monitoring/AgentMonitoring.ts
export class AgentMonitoring {
  private logger: Logger;
  private metrics: Map<string, Metric>;

  constructor(agentName: string) {
    this.logger = new Logger(agentName);
    this.metrics = new Map();
  }

  trackStart(agentName: string): void {
    this.logger.info(`Agent ${agentName} started`);
  }

  trackSuccess(agentName: string, duration: number): void {
    this.logger.info(`Agent ${agentName} completed in ${duration}ms`);
    this.recordMetric('duration', duration);
  }

  trackError(agentName: string, error: Error): void {
    this.logger.error(`Agent ${agentName} failed:`, error);
    this.recordMetric('errors', 1);
  }

  private recordMetric(name: string, value: number): void {
    // Implementation
  }
}
```

**Checklist:**
- [ ] Logger structuré implémenté
- [ ] Métriques basiques
- [ ] Tests unitaires
- [ ] Documentation

---

#### Semaine 2

##### 1.4 Implémenter système de configuration

```typescript
// src/agents/core/AgentConfig.ts
import { z } from 'zod';

const AgentConfigSchema = z.object({
  gemini: z.object({
    apiKey: z.string().min(1),
    model: z.string(),
    timeout: z.number().min(1000).max(60000),
    maxRetries: z.number().min(0).max(5),
    temperature: z.number().min(0).max(1)
  }),
  cache: z.object({
    enabled: z.boolean(),
    ttl: z.number().min(0),
    maxSize: z.number().min(0)
  }),
  limits: z.object({
    maxSteps: z.number().min(1).max(20),
    maxPromptLength: z.number().min(0),
    maxAudioSize: z.number().min(0)
  })
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

export function loadConfig(): AgentConfig {
  const config = {
    gemini: {
      apiKey: process.env.VITE_GEMINI_API_KEY || '',
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      timeout: parseInt(process.env.AI_TIMEOUT || '30000'),
      maxRetries: parseInt(process.env.AI_MAX_RETRIES || '3'),
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7')
    },
    cache: {
      enabled: process.env.CACHE_ENABLED !== 'false',
      ttl: parseInt(process.env.CACHE_TTL || '3600'),
      maxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000')
    },
    limits: {
      maxSteps: parseInt(process.env.MAX_STEPS || '15'),
      maxPromptLength: parseInt(process.env.MAX_PROMPT_LENGTH || '5000'),
      maxAudioSize: parseInt(process.env.MAX_AUDIO_SIZE || '10485760')
    }
  };

  return AgentConfigSchema.parse(config);
}
```

**Variables d'environnement à ajouter:**
```env
# .env.example
VITE_GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-pro
AI_TIMEOUT=30000
AI_MAX_RETRIES=3
AI_TEMPERATURE=0.7

CACHE_ENABLED=true
CACHE_TTL=3600
CACHE_MAX_SIZE=1000

MAX_STEPS=15
MAX_PROMPT_LENGTH=5000
MAX_AUDIO_SIZE=10485760
```

**Checklist:**
- [ ] Schema Zod validé
- [ ] Variables d'env documentées
- [ ] Tests de validation
- [ ] Exemple de config

---

##### 1.5 Créer AgentOrchestrator de base

```typescript
// src/agents/core/AgentOrchestrator.ts
import { BaseAgent } from './BaseAgent';
import { AgentConfig, loadConfig } from './AgentConfig';

export class AgentOrchestrator {
  private agents: Map<string, BaseAgent<any, any>>;
  private config: AgentConfig;

  constructor(config?: Partial<AgentConfig>) {
    this.config = { ...loadConfig(), ...config };
    this.agents = new Map();
  }

  registerAgent(name: string, agent: BaseAgent<any, any>): void {
    this.agents.set(name, agent);
  }

  getAgent<T extends BaseAgent<any, any>>(name: string): T {
    const agent = this.agents.get(name);
    if (!agent) {
      throw new Error(`Agent ${name} not found`);
    }
    return agent as T;
  }

  async shutdown(): Promise<void> {
    // Cleanup logic
    this.agents.clear();
  }
}
```

**Tests:**
```typescript
describe('AgentOrchestrator', () => {
  it('should register and retrieve agents', () => {
    // Test implementation
  });

  it('should throw on unknown agent', () => {
    // Test implementation
  });
});
```

**Checklist:**
- [ ] Orchestrator basique
- [ ] Registration d'agents
- [ ] Tests unitaires
- [ ] Documentation

---

### Livrable Phase 1
- ✅ Structure complète `/src/agents/`
- ✅ BaseAgent avec monitoring
- ✅ Configuration centralisée validée
- ✅ Orchestrator de base
- ✅ Tests unitaires (couverture ≥ 80%)
- ✅ Documentation

---

## Phase 2: Migration FunnelGenerator (Semaine 3-4)

### Objectif
Migrer la génération de funnels vers le nouveau système tout en gardant l'ancien fonctionnel.

### Architecture de Transition

```typescript
// lib/ai.ts (existant, adapter pour router)
import { getOrchestrator } from './src/agents/core/AgentOrchestrator';

export async function generateFunnelFromPrompt(
  prompt: string,
  settings?: GenerationSettings
): Promise<Funnel> {
  // Feature flag pour migration progressive
  const useNewArchitecture = process.env.USE_NEW_AGENTS === 'true';

  if (useNewArchitecture) {
    const orchestrator = getOrchestrator();
    return orchestrator.generateFunnel(prompt, settings);
  }

  // Ancien code (deprecated)
  return legacyGenerateFunnel(prompt, settings);
}

async function legacyGenerateFunnel(
  prompt: string,
  settings?: GenerationSettings
): Promise<Funnel> {
  // Code actuel...
}
```

---

#### Semaine 3

##### 2.1 Implémenter FunnelGeneratorAgent

```typescript
// src/agents/funnel/FunnelGeneratorAgent.ts
import { BaseAgent } from '../core/BaseAgent';
import { Funnel, FunnelInput } from '../core/types';

export class FunnelGeneratorAgent extends BaseAgent<FunnelInput, Funnel> {
  get name(): string {
    return 'FunnelGenerator';
  }

  async execute(input: FunnelInput): Promise<Funnel> {
    const { prompt, settings } = input;

    // 1. Validate input
    this.validateInput(input);

    // 2. Generate structure
    const structure = await this.generateStructure(prompt, settings);

    // 3. Generate content
    const withContent = await this.generateContent(structure, settings);

    // 4. Add media suggestions
    const withMedia = await this.addMediaSuggestions(withContent);

    // 5. Validate output
    return this.validateOutput(withMedia);
  }

  private validateInput(input: FunnelInput): void {
    if (!input.prompt || input.prompt.length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    if (input.prompt.length > this.config.limits.maxPromptLength) {
      throw new Error(`Prompt too long (max ${this.config.limits.maxPromptLength} chars)`);
    }
  }

  private async generateStructure(
    prompt: string,
    settings?: GenerationSettings
  ): Promise<FunnelStructure> {
    const systemPrompt = this.buildSystemPrompt(settings);
    const userPrompt = this.buildUserPrompt(prompt, settings);

    const response = await this.callGemini(systemPrompt, userPrompt);
    return this.parseStructure(response);
  }

  // ... autres méthodes
}
```

**Migration des fonctions existantes:**
- `generateFunnelFromPrompt()` → `FunnelGeneratorAgent.execute()`
- `buildSystemPrompt()` → `FunnelGeneratorAgent.buildSystemPrompt()`
- `buildUserPrompt()` → `FunnelGeneratorAgent.buildUserPrompt()`

**Checklist:**
- [ ] FunnelGeneratorAgent implémenté
- [ ] Toutes les fonctions migrées
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Feature flag configuré

---

##### 2.2 Tests comparatifs

```typescript
// src/agents/funnel/__tests__/migration.test.ts
describe('FunnelGenerator Migration', () => {
  const testPrompts = [
    'Create a funnel for selling online courses',
    'Lead magnet for SaaS product',
    'E-commerce checkout flow'
  ];

  it('should produce identical results to legacy', async () => {
    for (const prompt of testPrompts) {
      const legacyResult = await legacyGenerateFunnel(prompt);
      const newResult = await new FunnelGeneratorAgent(config).run({ prompt });

      // Compare structure
      expect(newResult.steps.length).toBe(legacyResult.steps.length);
      expect(newResult.title).toBe(legacyResult.title);

      // Compare content quality (semantic similarity)
      for (let i = 0; i < newResult.steps.length; i++) {
        const similarity = calculateSimilarity(
          newResult.steps[i].content,
          legacyResult.steps[i].content
        );
        expect(similarity).toBeGreaterThan(0.8);
      }
    }
  });

  it('should have similar performance', async () => {
    const prompt = testPrompts[0];

    const legacyStart = Date.now();
    await legacyGenerateFunnel(prompt);
    const legacyDuration = Date.now() - legacyStart;

    const newStart = Date.now();
    await new FunnelGeneratorAgent(config).run({ prompt });
    const newDuration = Date.now() - newStart;

    // New architecture should be within 20% of legacy
    expect(newDuration).toBeLessThan(legacyDuration * 1.2);
  });
});
```

**Checklist:**
- [ ] Tests comparatifs passent
- [ ] Performance ≥ legacy
- [ ] Qualité ≥ legacy
- [ ] Documentation des différences

---

#### Semaine 4

##### 2.3 Déploiement Canary

**Stratégie:**
1. 10% du trafic → nouveau système
2. Monitor pendant 48h
3. Si OK → 50% du trafic
4. Monitor pendant 48h
5. Si OK → 100% du trafic

**Configuration:**
```typescript
// src/agents/canary.ts
export function shouldUseNewAgent(): boolean {
  const canaryPercent = parseInt(process.env.CANARY_PERCENT || '0');
  return Math.random() * 100 < canaryPercent;
}

// lib/ai.ts
export async function generateFunnelFromPrompt(
  prompt: string,
  settings?: GenerationSettings
): Promise<Funnel> {
  if (shouldUseNewAgent()) {
    const orchestrator = getOrchestrator();
    return orchestrator.generateFunnel(prompt, settings);
  }

  return legacyGenerateFunnel(prompt, settings);
}
```

**Monitoring:**
```typescript
// src/agents/utils/monitoring/CanaryMonitoring.ts
export class CanaryMonitoring {
  trackGeneration(isNew: boolean, duration: number, success: boolean): void {
    // Log to analytics
    analytics.track('funnel_generation', {
      architecture: isNew ? 'new' : 'legacy',
      duration,
      success
    });
  }
}
```

**Variables d'environnement:**
```env
CANARY_PERCENT=10  # Start with 10%
```

**Checklist:**
- [ ] Canary release configuré
- [ ] Monitoring en place
- [ ] Rollback plan documenté
- [ ] Alertes configurées

---

##### 2.4 Validation et rollout

**Métriques à surveiller:**
- Taux d'erreur (doit être < 0.5%)
- Temps de réponse p95 (doit être ≤ legacy)
- Taux de satisfaction utilisateur
- Coût par génération

**Rollout schedule:**
```
Day 1-2:   10% traffic → new architecture
Day 3-4:   25% traffic
Day 5-6:   50% traffic
Day 7-8:   75% traffic
Day 9-10: 100% traffic
```

**Critères de rollback:**
- Taux d'erreur > 1%
- Temps de réponse > 150% du legacy
- > 5 rapports de bugs critiques

**Checklist:**
- [ ] 100% trafic sur nouvelle architecture
- [ ] Métriques stables pendant 7 jours
- [ ] Aucun bug critique
- [ ] Feedback utilisateur positif

---

### Livrable Phase 2
- ✅ FunnelGeneratorAgent complet
- ✅ Tests comparatifs passent
- ✅ Canary deployment réussi
- ✅ 100% trafic migré
- ✅ Ancien code marqué deprecated

---

## Phase 3: Migration AnalysisAgents (Semaine 5-6)

### Objectif
Migrer les agents d'analyse (texte + audio) vers la nouvelle architecture.

#### Semaine 5

##### 3.1 TextAnalysisAgent

```typescript
// src/agents/analysis/TextAnalysisAgent.ts
export class TextAnalysisAgent extends BaseAgent<TextAnalysisInput, AnalysisResult> {
  get name(): string {
    return 'TextAnalysis';
  }

  async execute(input: TextAnalysisInput): Promise<AnalysisResult> {
    const { text, questionContext } = input;

    const systemPrompt = this.buildAnalysisPrompt(questionContext);
    const response = await this.callGemini(systemPrompt, text);

    return this.parseAnalysis(response);
  }

  private buildAnalysisPrompt(context: string): string {
    return `You are analyzing a user's text response to: "${context}"

Analyze the response for:
- Sentiment (positive, neutral, negative)
- Key themes and topics
- Intent and motivation
- Pain points mentioned
- Opportunities identified

Provide a structured analysis.`;
  }

  private parseAnalysis(response: string): AnalysisResult {
    // Parsing logic
  }
}
```

**Migration de:**
- `src/lib/ai.ts:analyzeTextResponse()` → `TextAnalysisAgent`

**Checklist:**
- [ ] TextAnalysisAgent implémenté
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Feature flag

---

##### 3.2 AudioAnalysisAgent

```typescript
// src/agents/analysis/AudioAnalysisAgent.ts
export class AudioAnalysisAgent extends BaseAgent<AudioAnalysisInput, AudioAnalysisResult> {
  private textAnalysisAgent: TextAnalysisAgent;

  constructor(config: AgentConfig) {
    super(config);
    this.textAnalysisAgent = new TextAnalysisAgent(config);
  }

  get name(): string {
    return 'AudioAnalysis';
  }

  async execute(input: AudioAnalysisInput): Promise<AudioAnalysisResult> {
    const { audioBlob, questionContext } = input;

    // 1. Transcribe audio
    const transcript = await this.transcribeAudio(audioBlob);

    // 2. Analyze transcript
    const analysis = await this.textAnalysisAgent.run({
      text: transcript,
      questionContext
    });

    return {
      transcript,
      analysis
    };
  }

  private async transcribeAudio(blob: Blob): Promise<string> {
    // Speech-to-text logic
  }
}
```

**Migration de:**
- `src/lib/ai.ts:transcribeAndAnalyzeAudio()` → `AudioAnalysisAgent`

**Checklist:**
- [ ] AudioAnalysisAgent implémenté
- [ ] Tests avec audio réel
- [ ] Performance optimisée
- [ ] Feature flag

---

#### Semaine 6

##### 3.3 Déploiement des agents d'analyse

**Même stratégie canary que Phase 2:**
```
Day 1-2:   10% → new
Day 3-4:   50% → new
Day 5-6:  100% → new
```

**Adapter les composants frontend:**
```typescript
// components/dashboard/AnswerAnalysis.tsx
import { getOrchestrator } from '@/src/agents/core/AgentOrchestrator';

export function AnswerAnalysis({ answer, question }: Props) {
  const analyzeAnswer = async () => {
    const orchestrator = getOrchestrator();

    if (answer.type === 'audio') {
      return orchestrator.analyzeAudio(answer.audioBlob, question.text);
    } else {
      return orchestrator.analyzeText(answer.text, question.text);
    }
  };

  // ... rest of component
}
```

**Checklist:**
- [ ] Frontend adapté
- [ ] Canary deployment
- [ ] 100% trafic migré
- [ ] Tests E2E passent

---

### Livrable Phase 3
- ✅ TextAnalysisAgent complet
- ✅ AudioAnalysisAgent complet
- ✅ Frontend intégré
- ✅ 100% trafic migré
- ✅ Tests E2E passent

---

## Phase 4: Optimisations (Semaine 7-8)

### Objectif
Ajouter cache, monitoring avancé, et optimisations.

#### Semaine 7

##### 4.1 Système de cache

```typescript
// src/agents/utils/cache/PromptCache.ts
import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

export class PromptCache {
  private cache: LRUCache<string, any>;

  constructor(options: { max: number; ttl: number }) {
    this.cache = new LRUCache({
      max: options.max,
      ttl: options.ttl * 1000,
      updateAgeOnGet: true,
      updateAgeOnHas: false
    });
  }

  async get<T>(prompt: string): Promise<T | undefined> {
    const key = this.hashPrompt(prompt);
    return this.cache.get(key) as T | undefined;
  }

  async set<T>(prompt: string, value: T): Promise<void> {
    const key = this.hashPrompt(prompt);
    this.cache.set(key, value);
  }

  private hashPrompt(prompt: string): string {
    const normalized = prompt.toLowerCase().trim();
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}
```

**Intégration dans BaseAgent:**
```typescript
// src/agents/core/BaseAgent.ts (updated)
async run(input: TInput): Promise<TOutput> {
  // Check cache first
  if (this.cache) {
    const cached = await this.cache.get(JSON.stringify(input));
    if (cached) {
      this.monitoring.trackCacheHit(this.name);
      return cached;
    }
  }

  const result = await this.execute(input);

  // Store in cache
  if (this.cache) {
    await this.cache.set(JSON.stringify(input), result);
  }

  return result;
}
```

**Tests:**
```typescript
describe('PromptCache', () => {
  it('should cache and retrieve results', async () => {
    const cache = new PromptCache({ max: 100, ttl: 3600 });

    await cache.set('test prompt', { result: 'cached' });
    const result = await cache.get('test prompt');

    expect(result).toEqual({ result: 'cached' });
  });

  it('should expire after TTL', async () => {
    const cache = new PromptCache({ max: 100, ttl: 1 });

    await cache.set('test', 'value');
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await cache.get('test');
    expect(result).toBeUndefined();
  });
});
```

**Checklist:**
- [ ] Cache implémenté
- [ ] Tests unitaires
- [ ] Intégré dans tous les agents
- [ ] Métriques de cache

---

##### 4.2 Retry logic avancée

```typescript
// src/agents/utils/retry/ExponentialBackoff.ts
export class ExponentialBackoff {
  constructor(
    private options: {
      maxRetries: number;
      baseDelay: number;
      maxDelay?: number;
      shouldRetry?: (error: Error) => boolean;
    }
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt === this.options.maxRetries) {
          break;
        }

        if (this.options.shouldRetry && !this.options.shouldRetry(lastError)) {
          break;
        }

        const delay = this.calculateDelay(attempt);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private calculateDelay(attempt: number): number {
    const delay = this.options.baseDelay * Math.pow(2, attempt);
    return Math.min(delay, this.options.maxDelay || 30000);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

**Intégration:**
```typescript
// src/agents/core/BaseAgent.ts (updated)
private async executeWithRetry(input: TInput): Promise<TOutput> {
  const retry = new ExponentialBackoff({
    maxRetries: this.config.gemini.maxRetries,
    baseDelay: 1000,
    maxDelay: 10000,
    shouldRetry: (error) => {
      // Retry on rate limits and network errors
      return error.message.includes('rate limit') ||
             error.message.includes('network') ||
             error.message.includes('timeout');
    }
  });

  return retry.execute(() => this.execute(input));
}
```

**Checklist:**
- [ ] Retry logic implémentée
- [ ] Tests avec mocks d'erreurs
- [ ] Intégré dans BaseAgent
- [ ] Documentation

---

#### Semaine 8

##### 4.3 Monitoring avancé avec Prometheus

**Installation:**
```bash
npm install prom-client
```

**Configuration:**
```typescript
// src/agents/utils/monitoring/Prometheus.ts
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

export class PrometheusMetrics {
  private registry: Registry;
  private metrics: {
    generationDuration: Histogram;
    apiCalls: Counter;
    errors: Counter;
    cacheHits: Counter;
    activeRequests: Gauge;
  };

  constructor() {
    this.registry = new Registry();

    this.metrics = {
      generationDuration: new Histogram({
        name: 'agent_generation_duration_seconds',
        help: 'Duration of agent generation in seconds',
        labelNames: ['agent', 'status'],
        buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
        registers: [this.registry]
      }),

      apiCalls: new Counter({
        name: 'agent_api_calls_total',
        help: 'Total number of API calls',
        labelNames: ['agent', 'provider', 'status'],
        registers: [this.registry]
      }),

      errors: new Counter({
        name: 'agent_errors_total',
        help: 'Total number of errors',
        labelNames: ['agent', 'error_type'],
        registers: [this.registry]
      }),

      cacheHits: new Counter({
        name: 'agent_cache_hits_total',
        help: 'Total number of cache hits',
        labelNames: ['agent'],
        registers: [this.registry]
      }),

      activeRequests: new Gauge({
        name: 'agent_active_requests',
        help: 'Number of active requests',
        labelNames: ['agent'],
        registers: [this.registry]
      })
    };
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
```

**Endpoint backend:**
```typescript
// backend/src/routes/metrics.ts
import { Router } from 'express';
import { prometheusMetrics } from '../agents/monitoring';

const router = Router();

router.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheusMetrics.contentType);
  const metrics = await prometheusMetrics.getMetrics();
  res.send(metrics);
});

export default router;
```

**Checklist:**
- [ ] Prometheus intégré
- [ ] Endpoint /metrics
- [ ] Dashboard Grafana
- [ ] Alertes configurées

---

##### 4.4 Rate limiting

```typescript
// src/agents/utils/ratelimit/RateLimiter.ts
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private options: {
      maxTokens: number;
      refillRate: number; // tokens per second
    }
  ) {
    this.tokens = options.maxTokens;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();

    if (this.tokens < 1) {
      const waitTime = (1 - this.tokens) / this.options.refillRate * 1000;
      await this.sleep(waitTime);
      this.refill();
    }

    this.tokens -= 1;
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.options.refillRate;

    this.tokens = Math.min(
      this.options.maxTokens,
      this.tokens + tokensToAdd
    );
    this.lastRefill = now;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

**Intégration:**
```typescript
// src/agents/core/AgentOrchestrator.ts (updated)
private rateLimiter = new RateLimiter({
  maxTokens: 100,
  refillRate: 10 // 10 requests per second
});

async generateFunnel(prompt: string, settings?: GenerationSettings): Promise<Funnel> {
  await this.rateLimiter.acquire();

  const agent = this.getAgent<FunnelGeneratorAgent>('funnel');
  return agent.run({ prompt, settings });
}
```

**Checklist:**
- [ ] Rate limiter implémenté
- [ ] Tests de charge
- [ ] Intégré dans orchestrator
- [ ] Configuration par env

---

### Livrable Phase 4
- ✅ Cache LRU fonctionnel
- ✅ Retry logic robuste
- ✅ Monitoring Prometheus
- ✅ Rate limiting
- ✅ Dashboard Grafana
- ✅ Documentation complète

---

## Phase 5: Nettoyage (Semaine 9)

### Objectif
Supprimer l'ancien code et finaliser la migration.

### Tâches

#### 5.1 Supprimer l'ancien code

**Fichiers à supprimer:**
- `/lib/ai.ts` (legacy)
- `/src/lib/ai.ts` (duplicate)

**Fichiers à adapter:**
- `components/builder/AIAssistant.tsx`
- `components/dashboard/AnswerAnalysis.tsx`
- `stores/appStore.ts`

**Migration des imports:**
```typescript
// Avant
import { generateFunnelFromPrompt } from '@/lib/ai';

// Après
import { getOrchestrator } from '@/src/agents/core/AgentOrchestrator';
const orchestrator = getOrchestrator();
const funnel = await orchestrator.generateFunnel(prompt, settings);
```

**Checklist:**
- [ ] Tous les imports migrés
- [ ] Tests E2E passent
- [ ] Aucune référence à l'ancien code
- [ ] Build réussit

---

#### 5.2 Documentation finale

**Documents à créer/mettre à jour:**
- [x] `AUDIT_AGENTS_STRUCTURE.md` (fait)
- [x] `docs/architecture/AGENTS_ARCHITECTURE.md` (fait)
- [x] `docs/migration/MIGRATION_PLAN.md` (ce document)
- [ ] `docs/api/AGENTS_API.md`
- [ ] `docs/developers/CONTRIBUTING.md`
- [ ] `README.md` (mise à jour)

**Checklist:**
- [ ] Documentation API complète
- [ ] Guide développeur mis à jour
- [ ] README avec architecture
- [ ] CHANGELOG mis à jour

---

#### 5.3 Tests finaux

**Suite de tests complète:**
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance

# Load tests
npm run test:load
```

**Critères de succès:**
- ✅ 100% tests passent
- ✅ Couverture ≥ 80%
- ✅ Performance ≥ baseline
- ✅ Load test réussi (1000 req/min)

**Checklist:**
- [ ] Tous les tests passent
- [ ] Couverture satisfaisante
- [ ] Performance validée
- [ ] Load test OK

---

#### 5.4 Déploiement production

**Pre-deployment checklist:**
- [ ] Tous les tests passent
- [ ] Documentation complète
- [ ] Monitoring en place
- [ ] Rollback plan documenté
- [ ] Équipe prévenue

**Deployment steps:**
```bash
# 1. Build production
npm run build

# 2. Run pre-deploy tests
npm run test:pre-deploy

# 3. Deploy to staging
npm run deploy:staging

# 4. Smoke tests staging
npm run test:smoke:staging

# 5. Deploy to production
npm run deploy:production

# 6. Smoke tests production
npm run test:smoke:production

# 7. Monitor for 24h
```

**Post-deployment monitoring (24h):**
- Taux d'erreur < 0.5%
- Temps de réponse p95 < 10s
- Taux de cache hit > 40%
- Satisfaction utilisateur ≥ 9/10

**Checklist:**
- [ ] Déployé en production
- [ ] Monitoring stable 24h
- [ ] Aucun incident
- [ ] Feedback positif

---

### Livrable Phase 5
- ✅ Ancien code supprimé
- ✅ Documentation complète
- ✅ Tous les tests passent
- ✅ Production stable
- ✅ Migration 100% complète

---

## Métriques de Succès Globales

| Métrique | Avant | Cible | Atteint |
|----------|-------|-------|---------|
| Temps de génération (p95) | 35s | <20s | ⏳ |
| Taux d'erreur | 5% | <0.5% | ⏳ |
| Coût par génération | $0.15 | $0.08 | ⏳ |
| Cache hit rate | 0% | >40% | ⏳ |
| Couverture tests | 30% | >80% | ⏳ |
| Score satisfaction | 7/10 | >8.5/10 | ⏳ |

---

## Risques et Mitigation

### Risques Identifiés

#### 1. Régression fonctionnelle
**Probabilité:** Moyenne
**Impact:** Élevé
**Mitigation:**
- Tests comparatifs exhaustifs
- Canary deployment
- Monitoring continu
- Rollback immédiat si problème

#### 2. Dégradation performance
**Probabilité:** Faible
**Impact:** Moyen
**Mitigation:**
- Benchmarks avant/après
- Cache agressif
- Optimisations continues

#### 3. Problèmes de cache
**Probabilité:** Moyenne
**Impact:** Faible
**Mitigation:**
- TTL configurables
- Invalidation manuelle possible
- Monitoring de taux de hit

#### 4. Coûts API augmentés
**Probabilité:** Faible
**Impact:** Moyen
**Mitigation:**
- Cache réduira les appels
- Rate limiting
- Monitoring des coûts

---

## Plan de Rollback

### Triggers de Rollback

- Taux d'erreur > 1%
- Temps de réponse > 50s (p95)
- > 10 rapports de bugs critiques
- Taux de satisfaction < 6/10

### Procédure de Rollback

```bash
# 1. Réactiver l'ancien code
export USE_NEW_AGENTS=false
export CANARY_PERCENT=0

# 2. Redéployer
npm run deploy:rollback

# 3. Vérifier
npm run test:smoke

# 4. Analyser les logs
npm run logs:analyze

# 5. Débugger
npm run debug:migration
```

### Post-Rollback

- Analyser la cause
- Fixer le problème
- Tester en staging
- Re-déployer avec canary

---

## Timeline Globale

```
Week 1-2:   Phase 1 - Fondations
Week 3-4:   Phase 2 - FunnelGenerator Migration
Week 5-6:   Phase 3 - AnalysisAgents Migration
Week 7-8:   Phase 4 - Optimizations
Week 9:     Phase 5 - Cleanup & Production
```

**Durée totale:** 9 semaines
**Effort estimé:** 1.5-2 développeurs full-time

---

## Ressources Nécessaires

### Humaines
- 1-2 développeurs senior full-time
- 1 DevOps engineer (0.5 FTE)
- 1 QA engineer (0.5 FTE)
- 1 Product owner (reviews)

### Infrastructure
- Environnement de staging
- Redis pour cache
- Prometheus + Grafana
- Sentry pour erreurs
- Compte Gemini API (dev + prod)

### Budget Estimé
- Développement: 9 semaines × 2 devs = ~$50-70k
- Infrastructure: ~$500/mois
- API costs (dev): ~$200/mois
- Total: ~$55-75k

---

## Conclusion

Ce plan de migration permettra de moderniser l'architecture des agents IA tout en minimisant les risques et l'impact utilisateur.

**Prochaine étape:** Commencer la Phase 1 - Fondations

---

**Questions / Support:**
- Slack: #face2face-migration
- Email: engineering@face2face.com
- Documentation: https://docs.face2face.com/migration

---

*Plan de migration créé le 2025-11-14 - Version 1.0*
