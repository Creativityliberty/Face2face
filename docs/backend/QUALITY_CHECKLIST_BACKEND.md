# Checklist Qualité Backend - Face2Face API

Checklist exhaustive pour garantir la qualité du backend Face2Face.

---

## 🎯 VUE D'ENSEMBLE

**Objectif minimum:** 95/100 checks complétés avant chaque commit backend.

**Sections:**
1. Architecture & Code Quality (20 checks)
2. Sécurité (25 checks)
3. Performance & Scalabilité (18 checks)
4. Database & Prisma (15 checks)
5. API Design (20 checks)
6. Testing (15 checks)
7. Error Handling (12 checks)
8. Documentation (10 checks)

**Total:** 135 checks

---

## 1️⃣ ARCHITECTURE & CODE QUALITY

### Structure du Projet
- [ ] Routes dans `/src/routes/`
- [ ] Controllers dans `/src/controllers/`
- [ ] Services dans `/src/services/`
- [ ] Middleware dans `/src/middleware/`
- [ ] Schemas Zod dans `/src/schemas/`
- [ ] Utils dans `/src/utils/`
- [ ] Types dans `/src/types/`

### TypeScript
- [ ] Compilation TypeScript sans erreurs
- [ ] `strict: true` dans tsconfig.json
- [ ] Tous les paramètres typés
- [ ] Tous les retours de fonction typés
- [ ] Aucun `any` (sauf cas justifiés et documentés)
- [ ] Aucun `@ts-ignore` ou `@ts-expect-error`
- [ ] Interfaces pour tous les objets complexes
- [ ] Enums pour les constantes

### Code Style
- [ ] ESLint 0 warnings
- [ ] Prettier appliqué
- [ ] Naming conventions respectées (camelCase, PascalCase, etc.)
- [ ] Imports organisés (libs externes → internes → relatifs)
- [ ] Pas de code mort (unused imports, variables, functions)
- [ ] Fonctions < 50 lignes
- [ ] Fichiers < 300 lignes
- [ ] JSDoc sur fonctions complexes

---

## 2️⃣ SÉCURITÉ

### Authentication & Authorization
- [ ] JWT secret ≥ 32 caractères (généré aléatoirement)
- [ ] JWT expiration configurée (≤ 7 jours)
- [ ] Passwords hashés avec bcrypt (salt rounds ≥ 12)
- [ ] Aucun password stocké en clair
- [ ] Middleware auth sur toutes les routes protégées
- [ ] Vérification des permissions (user owns resource)
- [ ] Token refresh fonctionnel
- [ ] Logout/revoke token implémenté

### Input Validation
- [ ] Tous les inputs validés avec Zod
- [ ] Sanitization des strings (trim, lowercase si pertinent)
- [ ] Validation des emails
- [ ] Validation des URLs
- [ ] Validation des formats de fichiers
- [ ] Taille max des fichiers uploadés définie
- [ ] Protection contre injections SQL (Prisma = OK)
- [ ] Protection contre XSS

### Security Headers & Config
- [ ] CORS configuré correctement (pas `origin: true` en prod)
- [ ] Helmet.js installé et configuré
- [ ] Rate limiting actif globalement
- [ ] Rate limiting renforcé sur auth endpoints
- [ ] HTTPS obligatoire en production
- [ ] Cookies secure et httpOnly
- [ ] Content Security Policy définie

### Secrets & Environment
- [ ] `.env` dans `.gitignore`
- [ ] `.env.example` documenté
- [ ] Aucun secret hardcodé dans le code
- [ ] Variables d'env validées au démarrage
- [ ] Erreurs ne révèlent pas d'infos sensibles
- [ ] Logs ne contiennent pas de secrets

---

## 3️⃣ PERFORMANCE & SCALABILITÉ

### Database Queries
- [ ] Aucune N+1 query
- [ ] `select` utilisé (pas de `SELECT *`)
- [ ] `include` avec sélection spécifique
- [ ] Pagination sur toutes les listes
- [ ] Indexes sur foreign keys
- [ ] Indexes sur colonnes fréquemment queryées
- [ ] Transactions pour opérations multiples
- [ ] Batch operations (`createMany`, `updateMany`)

### Caching
- [ ] Redis configuré (ou cache équivalent)
- [ ] Cache sur queries lourdes
- [ ] TTL approprié (1h par défaut)
- [ ] Invalidation de cache lors des updates
- [ ] Cache warming si nécessaire
- [ ] Cache hit rate monitoring

### API Performance
- [ ] Temps de réponse < 200ms (p95)
- [ ] Temps de réponse < 500ms (p99)
- [ ] Payload response compressé (gzip)
- [ ] Response size < 1MB (pagination si plus)
- [ ] Lazy loading des relations
- [ ] Pas de computation lourde dans requests

### Monitoring & Metrics
- [ ] Logs structurés (JSON)
- [ ] Logging levels appropriés (info, warn, error)
- [ ] Métriques de temps de réponse
- [ ] Métriques de taux d'erreur
- [ ] Sentry (ou équivalent) configuré en prod
- [ ] Health check endpoint (`/health`)

---

## 4️⃣ DATABASE & PRISMA

### Schema Prisma
- [ ] Tous les models ont `id` (cuid)
- [ ] Tous les models ont `createdAt`
- [ ] Tous les models ont `updatedAt`
- [ ] Relations correctement définies
- [ ] `onDelete` configuré (Cascade vs SetNull vs Restrict)
- [ ] `@@map` pour noms de tables snake_case
- [ ] `@@index` sur colonnes appropriées
- [ ] Enums Prisma pour constantes

### Migrations
- [ ] Migration créée pour chaque changement de schema
- [ ] Migration nommée explicitement
- [ ] Migration testée localement avant commit
- [ ] Pas de migration dangereuse (data loss) sans backup
- [ ] Rollback plan documenté
- [ ] Seed data pour développement
- [ ] Production database backups configurés

---

## 5️⃣ API DESIGN

### REST Conventions
- [ ] Verbes HTTP appropriés (GET, POST, PUT, DELETE)
- [ ] Endpoints suivent pattern `/api/resource` et `/api/resource/:id`
- [ ] Pluriel pour collections (`/funnels`, `/leads`)
- [ ] Actions custom explicites (`/funnels/:id/publish`)
- [ ] Query params pour filtrage/pagination
- [ ] Pas de verbes dans URLs

### Request/Response Format
- [ ] Format de response standard utilisé partout
- [ ] Success: `{ success: true, data: {...} }`
- [ ] Error: `{ success: false, error: {...} }`
- [ ] Metadata incluse si pagination (`meta: { page, limit, total }`)
- [ ] Status codes corrects (200, 201, 204, 400, 401, 403, 404, 500)
- [ ] Content-Type: application/json

### Versioning & Documentation
- [ ] API versionnée si breaking changes (`/api/v1/`, `/api/v2/`)
- [ ] Documentation OpenAPI/Swagger
- [ ] Schemas de validation documentés
- [ ] Exemples de requests/responses
- [ ] Codes d'erreur documentés
- [ ] Rate limits documentés

### Validation
- [ ] Body validation sur POST/PUT
- [ ] Query params validation sur GET
- [ ] Path params validation
- [ ] File upload validation (type, size)
- [ ] Messages d'erreur clairs en français
- [ ] Validation errors format cohérent

---

## 6️⃣ TESTING

### Coverage
- [ ] Tests unitaires présents
- [ ] Tests d'intégration présents
- [ ] Coverage statements ≥ 80%
- [ ] Coverage branches ≥ 75%
- [ ] Coverage functions ≥ 80%
- [ ] Coverage lines ≥ 80%

### Test Quality
- [ ] Tests isolés (pas de dépendances entre tests)
- [ ] Setup/teardown approprié
- [ ] Mocks pour services externes
- [ ] Tests des cas d'erreur
- [ ] Tests des edge cases
- [ ] Tests de validation
- [ ] Tests d'authentification
- [ ] Tests de permissions

### CI/CD
- [ ] Tests run automatiquement (GitHub Actions, etc.)
- [ ] Build vérifié avant merge
- [ ] Linting vérifié avant merge

---

## 7️⃣ ERROR HANDLING

### Error Management
- [ ] Error handler global configuré
- [ ] Erreurs custom (AppError) utilisées
- [ ] Codes d'erreur constants définis
- [ ] Stack traces loggées (mais pas exposées)
- [ ] Try/catch sur toutes les async operations
- [ ] Erreurs Prisma gérées
- [ ] Erreurs Zod gérées
- [ ] Erreurs réseau gérées

### Error Responses
- [ ] Format d'erreur cohérent partout
- [ ] Messages user-friendly
- [ ] Pas de détails techniques exposés en prod
- [ ] Status code approprié
- [ ] Error code machine-readable
- [ ] Details fournis si validation error

---

## 8️⃣ DOCUMENTATION

### Code Documentation
- [ ] README avec instructions de setup
- [ ] Environment variables documentées (.env.example)
- [ ] Architecture documentée
- [ ] JSDoc sur fonctions publiques
- [ ] Commentaires sur logique complexe

### API Documentation
- [ ] Endpoints listés
- [ ] Request examples fournis
- [ ] Response examples fournis
- [ ] Authentication expliquée
- [ ] Rate limits documentés
- [ ] Error codes documentés

---

## ✅ VALIDATION FINALE

### Pre-commit Checklist

**Code:**
- [ ] TypeScript compile (`npm run build`)
- [ ] ESLint passe (`npm run lint`)
- [ ] Prettier appliqué (`npm run format`)
- [ ] Tests passent (`npm run test`)
- [ ] Coverage ≥ 80%

**Sécurité:**
- [ ] Aucun secret committé
- [ ] Validation sur tous les inputs
- [ ] Auth sur routes protégées
- [ ] Rate limiting actif

**Performance:**
- [ ] Aucune N+1 query
- [ ] Indexes appropriés
- [ ] Pagination sur listes
- [ ] Cache utilisé si pertinent

**Documentation:**
- [ ] Changements documentés
- [ ] CHANGELOG mis à jour
- [ ] API doc mise à jour si nouveaux endpoints

---

## 🏆 SCORE FINAL

```
Total checks complétés / 135 = Score %

≥ 95% = Excellent ✅ (128+ checks)
90-94% = Très bon 👍 (122-127 checks)
80-89% = Bon ⚠️ (108-121 checks)
< 80% = À améliorer ❌ (< 108 checks)
```

**Objectif: ≥ 95% avant chaque commit backend**

---

## 📝 TEMPLATE PR BACKEND

```markdown
## Backend Changes

### Endpoints modifiés/ajoutés
- [ ] POST /api/resource
- [ ] GET /api/resource/:id

### Database Changes
- [ ] Migration créée: `add_new_field`
- [ ] Indexes ajoutés
- [ ] Seed data mis à jour

### Checklist Qualité Backend

**Architecture (8/8)**
- [x] TypeScript strict
- [x] Structure correcte
- [x] Code style

**Sécurité (10/10)**
- [x] Validation Zod
- [x] Auth middleware
- [x] Aucun secret committé

**Performance (6/6)**
- [x] Aucune N+1
- [x] Indexes appropriés
- [x] Pagination

**Tests (5/5)**
- [x] Tests unitaires
- [x] Tests d'intégration
- [x] Coverage ≥ 80%

**Score: 29/29 (100%)** ✅

### Breaking Changes
Non / Oui - [expliquer]

### Migration Required
Non / Oui - [instructions]
```

---

## 🔄 PROCESS D'AMÉLIORATION

### Hebdomadaire
- [ ] Audit 1 endpoint avec cette checklist
- [ ] Fixer items < 90%
- [ ] Update documentation si nécessaire

### Mensuel
- [ ] Audit de sécurité complet
- [ ] Performance audit (slow queries)
- [ ] Dependency updates
- [ ] Test coverage review

### Trimestriel
- [ ] Penetration testing
- [ ] Load testing
- [ ] Database optimization
- [ ] Checklist update

---

**Utilise cette checklist systématiquement. La qualité backend n'est pas négociable. 🛡️**

*Dernière mise à jour: 2025-11-14*
