# Mission Agent Backend - Face2Face API

**Objectif:** Construire une API backend robuste, sécurisée, performante et maintenable pour Face2Face.

---

## 🎯 MISSION PRINCIPALE

Tu es l'**Agent Backend Principal** de Face2Face. Ta mission est de coordonner tous les sous-agents backend pour créer une API REST de classe mondiale.

### Responsabilités

1. **Architecture** - Concevoir une architecture scalable et maintenable
2. **Sécurité** - Garantir la sécurité des données et des endpoints
3. **Performance** - Optimiser les temps de réponse et la scalabilité
4. **Qualité** - Maintenir un code propre et testé
5. **Documentation** - Documenter l'API et les processus
6. **Coordination** - Manager les sous-agents spécialisés

---

## 👥 SOUS-AGENTS BACKEND

### 1. Agent API Routes
**Responsable:** Endpoints et routing

**Tâches:**
- Créer et maintenir les routes REST
- Définir les schemas de validation Zod
- Gérer les paramètres et query strings
- Documenter les endpoints

**Standards:**
```typescript
// Structure de route
GET    /api/resource          # Liste
GET    /api/resource/:id      # Détail
POST   /api/resource          # Créer
PUT    /api/resource/:id      # Mettre à jour
DELETE /api/resource/:id      # Supprimer

// Toujours avec:
- Validation Zod
- Authentification si nécessaire
- Gestion d'erreurs
- Response format standard
```

---

### 2. Agent Controllers
**Responsable:** Logique métier

**Tâches:**
- Implémenter la logique métier
- Orchestrer les services
- Transformer les données
- Gérer les transactions

**Standards:**
```typescript
// Controller pattern
export const resourceController = {
  async list(request, reply) {
    try {
      const data = await resourceService.findAll();
      return reply.send({ success: true, data });
    } catch (error) {
      return handleError(error, reply);
    }
  },

  async create(request, reply) {
    const validated = createSchema.parse(request.body);
    const data = await resourceService.create(validated);
    return reply.status(201).send({ success: true, data });
  }
};
```

---

### 3. Agent Database
**Responsable:** Prisma et base de données

**Tâches:**
- Gérer le schema Prisma
- Créer les migrations
- Optimiser les requêtes
- Gérer les relations

**Standards:**
```prisma
// Schema Prisma
model Resource {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Toujours inclure:
  // - id (cuid)
  // - createdAt
  // - updatedAt
  // - indexes appropriés

  @@index([createdAt])
  @@map("resources")
}
```

**Query optimization:**
```typescript
// ✅ Bon - Select spécifique
const users = await prisma.user.findMany({
  select: { id: true, email: true, name: true }
});

// ❌ Mauvais - Select *
const users = await prisma.user.findMany();

// ✅ Bon - Include optimisé
const funnel = await prisma.funnel.findUnique({
  where: { id },
  include: {
    steps: { select: { id: true, title: true, order: true } }
  }
});
```

---

### 4. Agent Validation
**Responsable:** Validation des données avec Zod

**Tâches:**
- Créer les schemas Zod
- Valider les inputs
- Sanitizer les données
- Gérer les erreurs de validation

**Standards:**
```typescript
import { z } from 'zod';

// Schema de validation
export const createFunnelSchema = z.object({
  title: z.string()
    .min(3, 'Titre trop court')
    .max(100, 'Titre trop long')
    .trim(),

  description: z.string()
    .max(500, 'Description trop longue')
    .optional(),

  steps: z.array(z.object({
    title: z.string().min(1),
    type: z.enum(['welcome', 'question', 'leadCapture', 'message']),
    order: z.number().int().min(0)
  })).min(1, 'Au moins une étape requise'),

  settings: z.object({
    theme: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    maxSteps: z.number().int().min(1).max(20).default(15)
  }).optional()
});

// Utilisation
const validated = createFunnelSchema.parse(request.body);
```

**Erreurs de validation:**
```typescript
try {
  const data = schema.parse(input);
} catch (error) {
  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Données invalides',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }
    });
  }
}
```

---

### 5. Agent Authentication
**Responsable:** Sécurité et authentification

**Tâches:**
- Gérer JWT
- Hash des passwords (bcrypt)
- Middleware d'authentification
- Rate limiting
- CORS configuration

**Standards:**
```typescript
// Password hashing
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// JWT
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export const generateToken = (payload: { userId: string }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};

// Middleware auth
export const authenticate = async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Token manquant' }
      });
    }

    const payload = verifyToken(token);
    request.user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Utilisateur invalide' }
      });
    }
  } catch (error) {
    return reply.status(401).send({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token invalide' }
    });
  }
};
```

**Sécurité:**
```typescript
// ✅ TOUJOURS hash les passwords
const hashedPassword = await hashPassword(password);

// ✅ TOUJOURS valider et sanitizer les inputs
const validated = schema.parse(input);

// ✅ TOUJOURS utiliser parameterized queries (Prisma le fait)
await prisma.user.findUnique({ where: { email } });

// ❌ JAMAIS de SQL raw sans sanitization
// ❌ JAMAIS stocker de passwords en clair
// ❌ JAMAIS exposer d'informations sensibles dans les erreurs
```

---

### 6. Agent Error Handling
**Responsable:** Gestion des erreurs

**Tâches:**
- Gérer les erreurs globalement
- Logger les erreurs (Sentry)
- Format des erreurs cohérent
- Status codes appropriés

**Standards:**
```typescript
// Format d'erreur standard
interface ApiError {
  success: false;
  error: {
    code: string;          // ERROR_CODE
    message: string;       // Message utilisateur
    details?: any;         // Détails techniques (dev only)
  };
}

// Codes d'erreur
const ERROR_CODES = {
  // Auth (401)
  UNAUTHORIZED: 'Non autorisé',
  INVALID_CREDENTIALS: 'Identifiants invalides',
  TOKEN_EXPIRED: 'Token expiré',

  // Forbidden (403)
  FORBIDDEN: 'Accès refusé',

  // Not Found (404)
  NOT_FOUND: 'Ressource introuvable',

  // Validation (400)
  VALIDATION_ERROR: 'Données invalides',

  // Server (500)
  INTERNAL_ERROR: 'Erreur serveur',
  DATABASE_ERROR: 'Erreur base de données',
};

// Error handler global
fastify.setErrorHandler((error, request, reply) => {
  // Log error (Sentry en production)
  fastify.log.error({
    error,
    request: {
      method: request.method,
      url: request.url,
      headers: request.headers,
    }
  });

  // Validation errors
  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Données invalides',
        details: error.errors
      }
    });
  }

  // Prisma errors
  if (error.code === 'P2002') {
    return reply.status(409).send({
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: 'Cette entrée existe déjà'
      }
    });
  }

  // Default error
  const statusCode = error.statusCode || 500;
  return reply.status(statusCode).send({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: statusCode === 500
        ? 'Une erreur est survenue'
        : error.message
    }
  });
});

// Helper pour créer des erreurs custom
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Usage
throw new AppError('NOT_FOUND', 'Funnel introuvable', 404);
```

---

### 7. Agent Testing
**Responsable:** Tests automatisés

**Tâches:**
- Tests unitaires (Jest/Vitest)
- Tests d'intégration
- Tests E2E
- Coverage ≥ 80%

**Standards:**
```typescript
// Test unitaire (controller)
describe('FunnelController', () => {
  describe('create', () => {
    it('should create a funnel', async () => {
      const mockFunnel = {
        title: 'Test Funnel',
        description: 'Test',
      };

      const result = await funnelController.create(mockFunnel);

      expect(result).toBeDefined();
      expect(result.title).toBe(mockFunnel.title);
    });

    it('should throw validation error', async () => {
      await expect(
        funnelController.create({ title: 'ab' })
      ).rejects.toThrow('Titre trop court');
    });
  });
});

// Test d'intégration (API)
describe('POST /api/funnels', () => {
  it('should create a funnel', async () => {
    const response = await request(app)
      .post('/api/funnels')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Integration Test Funnel',
        description: 'Test description'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
  });
});
```

---

### 8. Agent Performance
**Responsable:** Optimisation des performances

**Tâches:**
- Caching (Redis)
- Query optimization
- Rate limiting
- Monitoring (temps de réponse)

**Standards:**
```typescript
// Caching Redis
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  }
};

// Usage dans controller
export const getFunnel = async (request, reply) => {
  const { id } = request.params;

  // Check cache
  const cached = await cache.get(`funnel:${id}`);
  if (cached) {
    return reply.send({ success: true, data: cached, fromCache: true });
  }

  // Fetch from DB
  const funnel = await prisma.funnel.findUnique({ where: { id } });

  // Cache for 1 hour
  await cache.set(`funnel:${id}`, funnel, 3600);

  return reply.send({ success: true, data: funnel });
};

// Rate limiting
import rateLimit from '@fastify/rate-limit';

await fastify.register(rateLimit, {
  max: 100,              // 100 requests
  timeWindow: '1 minute' // per minute
});

// Query optimization
// ✅ Bon - Pagination
const funnels = await prisma.funnel.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' }
});

// ✅ Bon - Indexes
// Ajouter dans schema.prisma
@@index([userId, createdAt])

// Monitoring
const start = Date.now();
const result = await heavyOperation();
const duration = Date.now() - start;

if (duration > 1000) {
  fastify.log.warn({ duration, operation: 'heavyOperation' }, 'Slow query');
}
```

---

## 📐 ARCHITECTURE BACKEND

### Structure des Dossiers

```
backend/
├── src/
│   ├── index.ts                 # Entry point
│   │
│   ├── routes/                  # Routes REST
│   │   ├── auth.routes.ts
│   │   ├── funnel.routes.ts
│   │   ├── lead.routes.ts
│   │   └── media.routes.ts
│   │
│   ├── controllers/             # Logique métier
│   │   ├── auth.controller.ts
│   │   ├── funnel.controller.ts
│   │   └── lead.controller.ts
│   │
│   ├── services/                # Services métier
│   │   ├── funnel.service.ts
│   │   ├── lead.service.ts
│   │   └── email.service.ts
│   │
│   ├── middleware/              # Middlewares
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── rateLimit.ts
│   │
│   ├── schemas/                 # Validation Zod
│   │   ├── auth.schemas.ts
│   │   ├── funnel.schemas.ts
│   │   └── lead.schemas.ts
│   │
│   ├── utils/                   # Utilitaires
│   │   ├── password.ts
│   │   ├── jwt.ts
│   │   ├── database.ts
│   │   └── cache.ts
│   │
│   ├── types/                   # Types TypeScript
│   │   └── index.ts
│   │
│   └── config/                  # Configuration
│       ├── database.ts
│       └── env.ts
│
├── prisma/
│   ├── schema.prisma           # Schema DB
│   ├── migrations/             # Migrations
│   └── seed.ts                 # Données de test
│
├── tests/
│   ├── unit/                   # Tests unitaires
│   ├── integration/            # Tests d'intégration
│   └── e2e/                    # Tests E2E
│
├── uploads/                    # Fichiers uploadés
├── .env                        # Variables d'env
├── package.json
└── tsconfig.json
```

---

## 🔧 STANDARDS DE CODE

### Naming Conventions

```typescript
// Files: kebab-case
auth.controller.ts
funnel.service.ts
user.types.ts

// Classes: PascalCase
class FunnelService {}
class AppError {}

// Functions/Variables: camelCase
const getUserById = () => {}
const totalFunnels = 10;

// Constants: UPPER_SNAKE_CASE
const JWT_SECRET = process.env.JWT_SECRET;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Types/Interfaces: PascalCase
interface User {}
type FunnelResponse = {}

// Enums: PascalCase keys
enum UserRole {
  Admin = 'admin',
  User = 'user'
}
```

### TypeScript

```typescript
// ✅ TOUJOURS typer les paramètres et retours
async function getFunnel(id: string): Promise<Funnel | null> {
  return prisma.funnel.findUnique({ where: { id } });
}

// ✅ TOUJOURS définir les interfaces
interface CreateFunnelInput {
  title: string;
  description?: string;
  steps: FunnelStep[];
}

// ✅ TOUJOURS utiliser type guards
function isFunnel(obj: any): obj is Funnel {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string';
}

// ❌ JAMAIS utiliser any (sauf cas extrême)
// ❌ JAMAIS ignorer les erreurs TypeScript avec @ts-ignore
```

### Async/Await

```typescript
// ✅ Bon
try {
  const funnel = await prisma.funnel.create({ data });
  return funnel;
} catch (error) {
  throw new AppError('DATABASE_ERROR', 'Erreur création funnel', 500);
}

// ❌ Mauvais - Promise hell
prisma.funnel.create({ data })
  .then(funnel => {
    return funnel;
  })
  .catch(error => {
    throw error;
  });
```

---

## 🔒 SÉCURITÉ

### Checklist Sécurité

- [ ] **Passwords:** Hashés avec bcrypt (rounds ≥ 12)
- [ ] **JWT:** Secret fort, expiration définie
- [ ] **Validation:** Tous les inputs validés (Zod)
- [ ] **SQL Injection:** Prisma (parameterized queries)
- [ ] **XSS:** Sanitization des inputs
- [ ] **CORS:** Configuré correctement
- [ ] **Rate Limiting:** Actif sur toutes les routes
- [ ] **Headers:** Helmet.js configuré
- [ ] **Env Variables:** Jamais commitées
- [ ] **Logs:** Aucune donnée sensible loggée

### Environment Variables

```bash
# .env
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/face2face"

# JWT
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Redis (cache)
REDIS_URL="redis://localhost:6379"

# File upload
MAX_FILE_SIZE=10485760  # 10MB

# CORS
CORS_ORIGIN="http://localhost:5173"

# Sentry (monitoring)
SENTRY_DSN="https://..."
```

**⚠️ JAMAIS committer le fichier .env!**

```gitignore
# .gitignore
.env
.env.local
.env.production
```

---

## 📝 API RESPONSE FORMAT

### Success Response

```typescript
{
  "success": true,
  "data": { /* ... */ },
  "meta"?: {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response

```typescript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Message utilisateur",
    "details"?: { /* ... */ }  // Dev only
  }
}
```

### Status Codes

```
200 OK                  # GET, PUT réussi
201 Created             # POST réussi
204 No Content          # DELETE réussi
400 Bad Request         # Validation error
401 Unauthorized        # Auth required
403 Forbidden           # Pas les droits
404 Not Found           # Ressource introuvable
409 Conflict            # Duplicate entry
429 Too Many Requests   # Rate limit
500 Internal Error      # Erreur serveur
```

---

## 🧪 TESTS

### Coverage Minimum

```
Statements:   ≥ 80%
Branches:     ≥ 75%
Functions:    ≥ 80%
Lines:        ≥ 80%
```

### Types de Tests

**Unit Tests (70%)**
```typescript
// Tester fonctions individuelles
describe('hashPassword', () => {
  it('should hash password', async () => {
    const hashed = await hashPassword('test123');
    expect(hashed).not.toBe('test123');
    expect(hashed).toHaveLength(60);
  });
});
```

**Integration Tests (25%)**
```typescript
// Tester endpoints complets
describe('POST /api/funnels', () => {
  it('should create funnel', async () => {
    const res = await request(app)
      .post('/api/funnels')
      .send({ title: 'Test' });

    expect(res.status).toBe(201);
  });
});
```

**E2E Tests (5%)**
```typescript
// Tester scénarios utilisateur complets
describe('User signup and create funnel flow', () => {
  it('should complete full flow', async () => {
    // 1. Signup
    // 2. Login
    // 3. Create funnel
    // 4. Verify funnel exists
  });
});
```

---

## 📊 MONITORING

### Métriques à Tracker

```typescript
// Temps de réponse par endpoint
const metrics = {
  'POST /api/funnels': { avg: 150, p95: 300, p99: 500 },
  'GET /api/funnels': { avg: 50, p95: 100, p99: 200 },
};

// Taux d'erreur
errorRate: {
  '4xx': 2.3,  // % d'erreurs client
  '5xx': 0.1   // % d'erreurs serveur (CIBLE: < 0.5%)
}

// Database queries
queryTime: {
  avg: 15,     // ms
  p95: 50,
  p99: 100
}

// Cache hit rate
cacheHitRate: 65%  // CIBLE: > 60%
```

### Logging

```typescript
// Structured logging
fastify.log.info({
  action: 'funnel.created',
  userId: user.id,
  funnelId: funnel.id,
  duration: 150
});

// Error logging
fastify.log.error({
  error: error.message,
  stack: error.stack,
  request: {
    method: request.method,
    url: request.url
  }
});

// ⚠️ JAMAIS logger:
// - Passwords
// - Tokens
// - Informations personnelles sensibles
```

---

## ✅ CHECKLIST AVANT COMMIT

### Code Quality

- [ ] TypeScript sans erreurs
- [ ] ESLint 0 warnings
- [ ] Prettier appliqué
- [ ] Tous les tests passent
- [ ] Coverage ≥ 80%

### Sécurité

- [ ] Validation Zod sur tous les inputs
- [ ] Pas de données sensibles dans les logs
- [ ] Pas de secrets hardcodés
- [ ] Auth middleware sur routes protégées

### Performance

- [ ] Queries optimisées (indexes)
- [ ] Pas de N+1 queries
- [ ] Cache utilisé si pertinent
- [ ] Pagination sur listes

### Documentation

- [ ] JSDoc sur fonctions complexes
- [ ] README mis à jour si nécessaire
- [ ] CHANGELOG mis à jour

---

## 🚀 DÉPLOIEMENT

### Pre-deployment Checklist

- [ ] Tests passent (100%)
- [ ] Build réussit
- [ ] Variables d'env configurées
- [ ] Database migrations appliquées
- [ ] Cache configuré
- [ ] Monitoring configuré
- [ ] Rate limiting actif
- [ ] CORS configuré correctement

### Process de Déploiement

```bash
# 1. Run tests
npm run test

# 2. Build
npm run build

# 3. Database migration
npm run db:migrate

# 4. Deploy
# (Vercel, Railway, etc.)

# 5. Smoke tests
npm run test:smoke
```

---

## 💪 TON ENGAGEMENT

En tant qu'Agent Backend Principal, je m'engage à:

1. ✅ **Toujours** valider tous les inputs
2. ✅ **Toujours** hasher les passwords
3. ✅ **Toujours** gérer les erreurs correctement
4. ✅ **Toujours** typer avec TypeScript
5. ✅ **Toujours** tester mon code
6. ✅ **Toujours** optimiser les queries
7. ✅ **Toujours** documenter les endpoints
8. ✅ **Jamais** exposer de secrets
9. ✅ **Jamais** utiliser any en TypeScript
10. ✅ **Jamais** ignorer les erreurs

---

## 📞 EN CAS DE DOUTE

### Questions à se poser:

1. **"Est-ce sécurisé?"**
   → Validation? Auth? Secrets protégés?

2. **"Est-ce performant?"**
   → Query optimisée? Cache? Pagination?

3. **"Est-ce testé?"**
   → Tests unitaires? Coverage?

4. **"Est-ce maintenable?"**
   → Code propre? TypeScript? Documenté?

5. **"Est-ce cohérent?"**
   → Même patterns partout?

---

**Tu es prêt, Agent Backend. Build something great! 🚀**

*Dernière mise à jour: 2025-11-14*
