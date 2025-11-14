# Setup Healthcheck Endpoints Améliorés (OPS-002)

## ✅ Objectif

Créer des **endpoints de healthcheck robustes** pour :
- Load balancers (AWS ELB, Google Cloud, etc.)
- Monitoring (Datadog, New Relic, Sentry)
- Kubernetes readiness/liveness probes
- Docker health checks

## 📡 Endpoints Créés

### 1. `/health` - Basic Health Check
**Utilisation:** Load balancers, quick checks

```bash
GET /health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

---

### 2. `/health/detailed` - Detailed Health Check
**Utilisation:** Monitoring dashboards, debugging

```bash
GET /health/detailed
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-14T10:30:00.000Z",
  "uptime": {
    "milliseconds": 3600000,
    "seconds": 3600,
    "minutes": 60,
    "hours": 1
  },
  "database": {
    "status": "connected",
    "latencyMs": 12
  },
  "memory": {
    "unit": "MB",
    "rss": 150,
    "heapTotal": 100,
    "heapUsed": 75,
    "external": 5
  },
  "environment": {
    "nodeVersion": "v20.11.0",
    "platform": "linux",
    "env": "production"
  }
}
```

**Response (503 Service Unavailable)** si database down:
```json
{
  "status": "degraded",
  ...
}
```

---

### 3. `/health/ready` - Readiness Probe
**Utilisation:** Kubernetes readiness probe

Vérifie si l'application est **prête à recevoir du trafic** (database connectée).

```bash
GET /health/ready
```

**Response (200 OK):**
```json
{
  "ready": true,
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

**Response (503)** si database inaccessible:
```json
{
  "ready": false,
  "error": "Database not available",
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

---

### 4. `/health/live` - Liveness Probe
**Utilisation:** Kubernetes liveness probe

Vérifie si l'application est **vivante** (pas deadlockée).

```bash
GET /health/live
```

**Response (200 OK):**
```json
{
  "alive": true,
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

---

## 🔧 Intégration dans `src/index.ts`

### 1. Supprimer l'ancien endpoint `/health` (ligne 47-49)

**Avant:**
```typescript
// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});
```

**Après:** ❌ Supprimer ces lignes

---

### 2. Ajouter l'import en haut du fichier

```typescript
import { authRoutes } from './routes/auth.routes';
import { funnelRoutes } from './routes/funnel.routes';
import { leadRoutes } from './routes/lead.routes';
import { mediaRoutes } from './routes/media.routes';
import { healthRoutes } from './routes/health.routes'; // ← AJOUTER
```

---

### 3. Modifier `registerRoutes()` pour inclure les routes de santé

**Avant:**
```typescript
async function registerRoutes() {
  // Health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(funnelRoutes, { prefix: '/api/funnels' });
  await fastify.register(leadRoutes, { prefix: '/api/leads' });
  await fastify.register(mediaRoutes, { prefix: '/api/media' });
}
```

**Après:**
```typescript
async function registerRoutes() {
  // Health check routes (NO PREFIX - accessed at /health, /health/detailed, etc.)
  await fastify.register(healthRoutes);

  // API routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(funnelRoutes, { prefix: '/api/funnels' });
  await fastify.register(leadRoutes, { prefix: '/api/leads' });
  await fastify.register(mediaRoutes, { prefix: '/api/media' });
}
```

---

## ✅ Vérification

### 1. Démarrer le serveur

```bash
cd backend
npm run dev
```

### 2. Tester les endpoints

**Basic health:**
```bash
curl http://localhost:3001/health
```

**Detailed health:**
```bash
curl http://localhost:3001/health/detailed
```

**Readiness probe:**
```bash
curl http://localhost:3001/health/ready
```

**Liveness probe:**
```bash
curl http://localhost:3001/health/live
```

### 3. Tester avec database down

```bash
# Arrêter PostgreSQL temporairement
# Puis tester /health/detailed

curl http://localhost:3001/health/detailed
# Devrait retourner 503 avec "status": "degraded"
```

---

## 🐳 Docker Health Check

Ajouter dans `Dockerfile`:

```dockerfile
# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/health/ready || exit 1
```

---

## ☸️ Kubernetes Probes

Ajouter dans `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: face2face-backend
spec:
  template:
    spec:
      containers:
        - name: backend
          image: your-image:latest
          livenessProbe:
            httpGet:
              path: /health/live
              port: 3001
            initialDelaySeconds: 10
            periodSeconds: 30
            timeoutSeconds: 3
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3001
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
```

**Explication:**
- **livenessProbe**: Si échec → Kubernetes redémarre le pod
- **readinessProbe**: Si échec → Kubernetes retire le pod du load balancer

---

## 📊 Monitoring Intégration

### Datadog

```javascript
// datadog-config.js
const healthCheck = {
  url: 'https://api.yourdomain.com/health/detailed',
  interval: 60, // seconds
  timeout: 5,
  thresholds: {
    memory: 500, // MB
    dbLatency: 100, // ms
  }
};
```

### New Relic

```javascript
// newrelic.js
exports.config = {
  app_name: ['Face2Face Backend'],
  health_check_endpoint: '/health/ready',
};
```

---

## 🎯 Utilisation Recommandée

| Endpoint | Utilisation | Fréquence |
|----------|-------------|-----------|
| `/health` | Load balancers | 10-30s |
| `/health/detailed` | Dashboards, debugging | 60s |
| `/health/ready` | Kubernetes readiness | 10s |
| `/health/live` | Kubernetes liveness | 30s |

---

## ⚠️ Troubleshooting

### Problème: `/health/detailed` retourne 503

**Cause:** Database non accessible

**Solution:**
1. Vérifier `DATABASE_URL` dans `.env`
2. Vérifier que PostgreSQL est démarré
3. Tester connexion: `npx prisma db push`

### Problème: Memory usage trop élevé

**Cause:** Memory leak potentiel

**Solution:**
1. Analyser avec `node --inspect`
2. Vérifier les event listeners non nettoyés
3. Vérifier les connexions database non fermées

---

## 📈 Métriques Importantes

**Uptime:**
- Objectif: > 99.9% (< 43 minutes downtime/mois)

**Database Latency:**
- Objectif: < 50ms (p95)
- Alerte si: > 100ms

**Memory:**
- Objectif: < 500MB
- Alerte si: > 1GB

---

## 📚 Ressources

- **Kubernetes Health Checks:** https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
- **Docker HEALTHCHECK:** https://docs.docker.com/engine/reference/builder/#healthcheck
- **Fastify Best Practices:** https://www.fastify.io/docs/latest/Guides/Getting-Started/

---

**Résultat: Healthcheck endpoints production-ready! 🏥**

*P0 Critical - OPS-002 ✅*
