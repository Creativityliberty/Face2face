# Documentation Backend - Face2Face API

Documentation complète de l'API backend Face2Face (Fastify + Prisma + PostgreSQL).

---

## 📚 VUE D'ENSEMBLE

Backend REST API robuste et sécurisée pour l'application Face2Face.

### Stack Technique

- **Framework:** Fastify 5.x (Node.js)
- **Database:** PostgreSQL avec Prisma ORM
- **Auth:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Language:** TypeScript 5.x
- **Cache:** Redis (optionnel)
- **Monitoring:** Sentry (production)

### Architecture

```
Client (Frontend)
    ↓
API Gateway (Fastify)
    ↓
Middleware (Auth, Validation, Rate Limit)
    ↓
Routes → Controllers → Services
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

---

## 📄 DOCUMENTS

### 1. Agent Backend Mission
**Fichier:** `/.clinerules/backend-agent-mission.md`

**Description:** Mission complète de l'Agent Backend Principal et des 8 sous-agents

**Sous-Agents:**
1. Agent API Routes - Endpoints et routing
2. Agent Controllers - Logique métier
3. Agent Database - Prisma et optimisation
4. Agent Validation - Zod schemas
5. Agent Authentication - Sécurité et JWT
6. Agent Error Handling - Gestion des erreurs
7. Agent Testing - Tests automatisés
8. Agent Performance - Cache et monitoring

**Utilisation:**
```bash
# L'agent IA lit automatiquement ce fichier
# Consultez-le pour comprendre les standards backend
```

---

### 2. Sous-Agents Détaillés
**Fichier:** `/docs/backend/SUB_AGENTS.md`

**Description:** Documentation détaillée de chaque sous-agent avec exemples de code

**Contenu:**
- Agent API Routes (routing, schemas OpenAPI)
- Agent Controllers (logique métier, services)
- Agent Database (Prisma schema, migrations, optimization)
- Agent Validation (Zod schemas complets)
- Agent Authentication (JWT, bcrypt, middleware)

**Exemples de code complets fournis pour chaque pattern!**

---

### 3. Checklist Qualité Backend
**Fichier:** `/docs/backend/QUALITY_CHECKLIST_BACKEND.md`

**Description:** 135 checks pour garantir la qualité du backend

**Sections:**
- Architecture & Code Quality (20 checks)
- Sécurité (25 checks)
- Performance & Scalabilité (18 checks)
- Database & Prisma (15 checks)
- API Design (20 checks)
- Testing (15 checks)
- Error Handling (12 checks)
- Documentation (10 checks)

**Objectif: ≥ 95% avant chaque commit**

---

## 🏗️ ARCHITECTURE BACKEND

### Structure des Dossiers

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── routes/              # Routes REST
│   │   ├── auth.routes.ts
│   │   ├── funnel.routes.ts
│   │   ├── lead.routes.ts
│   │   └── media.routes.ts
│   ├── controllers/         # Logique métier
│   │   ├── auth.controller.ts
│   │   ├── funnel.controller.ts
│   │   └── lead.controller.ts
│   ├── services/            # Services métier
│   ├── middleware/          # Auth, validation, etc.
│   ├── schemas/             # Validation Zod
│   ├── utils/               # Utilitaires
│   └── types/               # Types TypeScript
├── prisma/
│   ├── schema.prisma       # Schema DB
│   ├── migrations/         # Migrations SQL
│   └── seed.ts             # Seed data
├── tests/                  # Tests
├── .env                    # Variables d'env
└── package.json
```

---

## 🔧 STACK DÉTAILLÉE

### Fastify (API Framework)

**Pourquoi Fastify?**
- ⚡ Plus rapide qu'Express (2-3x)
- 🔒 Sécurité intégrée
- ✅ Validation de schema native
- 📝 TypeScript first-class support

**Plugins utilisés:**
```json
{
  "@fastify/cors": "CORS configuration",
  "@fastify/jwt": "JWT authentication",
  "@fastify/multipart": "File uploads",
  "@fastify/static": "Serve static files",
  "@fastify/helmet": "Security headers",
  "@fastify/rate-limit": "Rate limiting"
}
```

---

### Prisma ORM

**Pourquoi Prisma?**
- 🔒 Type-safe (TypeScript)
- 🚫 Prévient SQL injection
- 📊 Migrations automatiques
- ⚡ Query optimization
- 🔍 Prisma Studio (GUI)

**Commandes principales:**
```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name add_feature

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed
```

---

### Zod (Validation)

**Pourquoi Zod?**
- ✅ Type inference automatique
- 🔍 Validation runtime
- 📝 Messages d'erreur custom
- 🎯 Composition de schemas

**Exemple:**
```typescript
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
});

// Type inféré automatiquement!
type CreateUser = z.infer<typeof createUserSchema>;
```

---

## 🔐 SÉCURITÉ

### Authentication Flow

```
1. User Register/Login
   ↓
2. Hash password (bcrypt, 12 rounds)
   ↓
3. Store user in DB
   ↓
4. Generate JWT token (7d expiry)
   ↓
5. Return token to client
   ↓
6. Client stores token (localStorage)
   ↓
7. Client sends token in header: Authorization: Bearer <token>
   ↓
8. Server validates token (middleware)
   ↓
9. Attach user to request
   ↓
10. Controller accesses request.user
```

### Security Checklist

- [x] Passwords hashés avec bcrypt (12 rounds)
- [x] JWT avec secret fort (≥32 chars)
- [x] Rate limiting actif
- [x] CORS configuré
- [x] Helmet headers configurés
- [x] Validation Zod sur tous inputs
- [x] Aucun SQL injection (Prisma)
- [x] Aucun secret hardcodé

---

## 📡 API ENDPOINTS

### Authentication

```
POST   /api/auth/register    # Créer compte
POST   /api/auth/login        # Se connecter
GET    /api/auth/me          # Info utilisateur (auth)
POST   /api/auth/refresh     # Refresh token (auth)
```

### Funnels

```
GET    /api/funnels          # Liste funnels (auth)
GET    /api/funnels/:id      # Détail funnel
POST   /api/funnels          # Créer funnel (auth)
PUT    /api/funnels/:id      # Modifier funnel (auth)
DELETE /api/funnels/:id      # Supprimer funnel (auth)
POST   /api/funnels/:id/publish  # Publier funnel (auth)
```

### Leads

```
GET    /api/leads            # Liste leads (auth)
GET    /api/leads/:id        # Détail lead (auth)
POST   /api/leads            # Créer lead (public)
POST   /api/leads/webhook    # Webhook notifications
```

### Media

```
POST   /api/media/upload     # Upload fichier (auth)
GET    /uploads/:filename    # Serve fichier
```

---

## 🧪 TESTING

### Types de Tests

**Unit Tests (70%)**
```bash
npm run test:unit
```
Tester fonctions isolées (utils, services)

**Integration Tests (25%)**
```bash
npm run test:integration
```
Tester endpoints complets

**E2E Tests (5%)**
```bash
npm run test:e2e
```
Tester scénarios utilisateur complets

### Coverage Requis

```
Statements:   ≥ 80%
Branches:     ≥ 75%
Functions:    ≥ 80%
Lines:        ≥ 80%
```

### Exemple de Test

```typescript
describe('POST /api/funnels', () => {
  it('should create a funnel', async () => {
    const response = await request(app)
      .post('/api/funnels')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Funnel',
        description: 'Description test'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .post('/api/funnels')
      .send({ title: 'Test' });

    expect(response.status).toBe(401);
  });
});
```

---

## 🚀 DÉPLOIEMENT

### Environment Variables

```bash
# .env.production
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

DATABASE_URL="postgresql://user:pass@host:5432/db"

JWT_SECRET="your-32+-character-secret-here"
JWT_EXPIRES_IN="7d"

REDIS_URL="redis://host:6379"

SENTRY_DSN="https://..."

CORS_ORIGIN="https://yourdomain.com"
```

### Deployment Process

```bash
# 1. Install dependencies
npm ci

# 2. Build TypeScript
npm run build

# 3. Run migrations
npx prisma migrate deploy

# 4. Start server
npm start
```

### Vercel/Railway Deploy

```yaml
# railway.json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build && npx prisma generate"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 📊 MONITORING

### Metrics à Tracker

**Performance:**
- Temps de réponse moyen
- Temps de réponse p95/p99
- Requests par seconde

**Erreurs:**
- Taux d'erreur 4xx
- Taux d'erreur 5xx
- Erreurs par endpoint

**Database:**
- Query time moyenne
- Slow queries (> 100ms)
- Connection pool usage

**Business:**
- Créations de funnels
- Leads capturés
- Conversions

### Logging

```typescript
// Structured logging
fastify.log.info({
  action: 'funnel.created',
  userId: user.id,
  funnelId: funnel.id,
  duration: 150
});

// ⚠️ Ne JAMAIS logger:
// - Passwords
// - JWT tokens
// - API keys
// - Informations personnelles sensibles
```

---

## 🛠️ DEVELOPMENT

### Setup Local

```bash
# 1. Clone repo
git clone <repo-url>
cd Face2face/backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Éditer .env avec vos credentials

# 4. Setup database
npx prisma migrate dev
npx prisma db seed

# 5. Start dev server
npm run dev
```

### Scripts Disponibles

```bash
npm run dev          # Dev server avec hot reload
npm run build        # Build TypeScript
npm start            # Start production server
npm test             # Run all tests
npm run test:watch   # Tests en mode watch
npm run lint         # ESLint
npm run format       # Prettier
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Create migration
npm run db:seed      # Seed database
```

---

## 🎯 WORKFLOW DE DÉVELOPPEMENT

### 1. Nouvelle Feature

```bash
# 1. Create branch
git checkout -b feature/new-endpoint

# 2. Create migration if needed
npx prisma migrate dev --name add_new_field

# 3. Implement feature
# - Create route
# - Create controller
# - Create service
# - Create Zod schema
# - Add tests

# 4. Run tests
npm test

# 5. Check quality
npm run lint
npm run format

# 6. Commit
git add .
git commit -m "feat: add new endpoint"

# 7. Push
git push origin feature/new-endpoint
```

### 2. Fix Bug

```bash
# 1. Write failing test first
# 2. Fix bug
# 3. Verify test passes
# 4. Commit with "fix:" prefix
```

---

## ✅ CHECKLIST DÉMARRAGE

Pour bien démarrer avec le backend:

- [ ] Lire ce README
- [ ] Parcourir `backend-agent-mission.md`
- [ ] Explorer `SUB_AGENTS.md` (exemples de code)
- [ ] Consulter `QUALITY_CHECKLIST_BACKEND.md`
- [ ] Setup environnement local
- [ ] Lancer Prisma Studio
- [ ] Tester quelques endpoints avec Postman/Insomnia
- [ ] Lire le schema Prisma
- [ ] Comprendre le flow d'authentication
- [ ] Écrire un petit endpoint de test

---

## 📚 RESSOURCES

### Documentation
- Fastify: https://www.fastify.io/docs/latest/
- Prisma: https://www.prisma.io/docs
- Zod: https://zod.dev
- PostgreSQL: https://www.postgresql.org/docs/

### Outils Utiles
- Postman/Insomnia (test API)
- Prisma Studio (DB GUI)
- TablePlus/pgAdmin (PostgreSQL GUI)
- Sentry (error tracking)
- DataDog/New Relic (APM)

---

## 🤝 CONTRIBUTION

### Avant de Commit

1. **Tests:** `npm test` (100% pass)
2. **Lint:** `npm run lint` (0 errors)
3. **Format:** `npm run format`
4. **Build:** `npm run build` (success)
5. **Checklist:** Compléter `QUALITY_CHECKLIST_BACKEND.md` (≥95%)

### Commit Messages

```
feat: add new endpoint
fix: resolve authentication bug
docs: update API documentation
refactor: improve controller structure
test: add integration tests for funnels
perf: optimize database queries
```

---

## 📞 SUPPORT

### Questions Fréquentes

**Q: Comment ajouter un nouvel endpoint?**
A: Voir `SUB_AGENTS.md` section "Agent API Routes"

**Q: Comment optimiser une query lente?**
A: Voir `SUB_AGENTS.md` section "Agent Database"

**Q: Comment gérer une nouvelle erreur?**
A: Voir `backend-agent-mission.md` section "Agent Error Handling"

**Q: Comment ajouter un nouveau champ au schema?**
A:
```bash
# 1. Modifier schema.prisma
# 2. Créer migration
npx prisma migrate dev --name add_field
# 3. Update Zod schemas
# 4. Update TypeScript types
```

---

## 🎉 CONCLUSION

**Avec cette documentation, vous avez tout pour créer un backend robuste et sécurisé!**

### Règles d'Or Backend

1. 🔒 **Sécurité d'abord** - Valider, authentifier, autoriser
2. ⚡ **Performance** - Optimiser queries, cacher, paginer
3. ✅ **Tests** - Coverage ≥ 80%, tests avant fix
4. 📝 **Documentation** - JSDoc, README, CHANGELOG
5. 🧹 **Code propre** - TypeScript strict, ESLint, Prettier

---

**Questions? Ouvrir une issue ou contacter l'équipe Backend!**

*Dernière mise à jour: 2025-11-14*
