# 🚀 Guide de Déploiement Backend sur Render

Guide complet pour déployer le backend Face2Face sur Render avec PostgreSQL.

---

## ✅ Ce qui a été préparé

### 1. **Packages Ajoutés** (`backend/package.json`)

```json
"dependencies": {
  "@fastify/helmet": "^12.0.1",      // Security headers (BE-002)
  "@fastify/rate-limit": "^10.1.1",  // Rate limiting (BE-001)
  "sharp": "^0.33.5"                 // Image optimization (UI-010)
}
```

### 2. **Blueprint Render** (`backend/render.yaml`)

Configuration complète pour déploiement automatique :
- ✅ Web Service (Backend API)
- ✅ PostgreSQL Database (1 GB)
- ✅ Variables d'environnement auto-configurées
- ✅ Healthcheck sur `/health`

### 3. **Variables d'Environnement** (`backend/.env.example`)

Toutes les variables nécessaires sont documentées.

---

## 🎯 Méthode 1: Déploiement via Blueprint (RECOMMANDÉ)

### Étape 1: Pusher le code

Le code est déjà sur GitHub branch `claude/audit-project-agents-structure-01QaEgPfbAEww6EiRSdU6Nri`

### Étape 2: Créer depuis Blueprint

1. **Aller sur Render Dashboard:**
   - https://dashboard.render.com

2. **Cliquer "New" → "Blueprint"**

3. **Connecter le repo GitHub:**
   - Repository: `Creativityliberty/Face2face`
   - Branch: `claude/audit-project-agents-structure-01QaEgPfbAEww6EiRSdU6Nri`

4. **Render va détecter `backend/render.yaml`**
   - ✅ 1 Web Service: `face2face-backend`
   - ✅ 1 Database: `face2face-db`

5. **Configurer les variables:**

   Render va demander de remplir :

   - **JWT_SECRET** ← Utiliser celui-ci (déjà généré) :
     ```
     db11b7a108b576ed6e27b2723b9f290e3c5def74545e49f3e38c3d5414c8bb60
     ```

   - **CORS_ORIGIN** ← URL de votre frontend Vercel :
     ```
     https://votre-app.vercel.app
     ```

   Toutes les autres variables sont auto-configurées ! ✅

6. **Cliquer "Apply"**

   Render va :
   - ✅ Créer la database PostgreSQL
   - ✅ Créer le Web Service
   - ✅ Installer les packages
   - ✅ Builder le TypeScript
   - ✅ Lancer le backend
   - ✅ Exposer l'URL: `https://face2face-backend.onrender.com`

**Durée:** ~5-7 minutes

---

## 🎯 Méthode 2: Déploiement Manuel (Dashboard)

Si vous préférez créer manuellement :

### A. Créer la Database

1. **Dashboard → New → PostgreSQL**

   | Paramètre | Valeur |
   |-----------|--------|
   | Name | `face2face-db` |
   | Region | Ohio (US East) |
   | Plan | Starter ($7/mois) |
   | Database Name | `face2face` |
   | User | `face2face_user` |

2. **Cliquer "Create Database"**

3. **Copier `DATABASE_URL`** (Internal Connection String)
   ```
   postgresql://face2face_user:****@dpg-xyz.ohio-postgres.render.com/face2face
   ```

---

### B. Créer le Web Service

1. **Dashboard → New → Web Service**

2. **Connecter GitHub:**
   - Repository: `Creativityliberty/Face2face`
   - Branch: `claude/audit-project-agents-structure-01QaEgPfbAEww6EiRSdU6Nri`

3. **Configuration:**

   | Paramètre | Valeur |
   |-----------|--------|
   | Name | `face2face-backend` |
   | Region | Ohio (US East) |
   | Branch | `claude/audit-project-agents-structure-01QaEgPfbAEww6EiRSdU6Nri` |
   | Root Directory | `backend` |
   | Runtime | Node |
   | Build Command | `npm install && npm run build` |
   | Start Command | `npm start` |
   | Plan | Starter ($7/mois) |

4. **Advanced → Add Environment Variables:**

   Cliquer "Add Environment Variable" pour chaque :

   ```env
   NODE_ENV=production
   PORT=10000
   HOST=0.0.0.0

   # Database (copier depuis l'étape A.3)
   DATABASE_URL=postgresql://face2face_user:****@dpg-xyz.ohio-postgres.render.com/face2face

   # JWT Secret (utiliser celui généré)
   JWT_SECRET=db11b7a108b576ed6e27b2723b9f290e3c5def74545e49f3e38c3d5414c8bb60

   # CORS (URL Vercel frontend)
   CORS_ORIGIN=https://votre-app.vercel.app

   # Optionnels
   MAX_FILE_SIZE=10485760
   RATE_LIMIT_MAX=100
   ```

5. **Advanced → Health Check Path:**
   ```
   /health
   ```

6. **Cliquer "Create Web Service"**

**Durée:** ~5-7 minutes

---

## ✅ Vérification Post-Déploiement

### 1. Check Build Logs

Dans Render Dashboard → `face2face-backend` → Logs

**Vérifier:**
```
✅ npm install successful
✅ Prisma generate successful
✅ TypeScript build successful
✅ Server running at http://0.0.0.0:10000
✅ Health check available at /health
```

---

### 2. Test Healthcheck

```bash
# Basic health
curl https://face2face-backend.onrender.com/health

# Devrait retourner:
{
  "status": "ok",
  "timestamp": "2025-11-14T14:00:00.000Z"
}
```

```bash
# Detailed health (avec database check)
curl https://face2face-backend.onrender.com/health/detailed

# Devrait retourner:
{
  "status": "healthy",
  "database": {
    "status": "connected",
    "latencyMs": 15
  },
  "memory": { ... },
  "uptime": { ... }
}
```

---

### 3. Test Database Connection

Dans Render Dashboard → `face2face-db` → Connect

Tester connexion :
```bash
psql postgresql://face2face_user:****@dpg-xyz.ohio-postgres.render.com/face2face

# Une fois connecté:
\dt  # Lister les tables Prisma
```

---

### 4. Run Prisma Migrations

**Important:** Après le premier déploiement, pusher les migrations :

```bash
# Dans Render Dashboard → face2face-backend → Shell
npx prisma migrate deploy
```

Ou configurez un **Deploy Hook** :

Dashboard → face2face-backend → Settings → Deploy Hook

Puis dans `backend/package.json` :
```json
"scripts": {
  "build": "prisma migrate deploy && tsc"
}
```

---

## 🔗 Connecter Frontend à Backend

### 1. Récupérer l'URL Backend

Dans Render Dashboard → `face2face-backend` → Settings

**URL:** `https://face2face-backend.onrender.com`

---

### 2. Configurer Vercel

Dans Vercel Dashboard → Face2Face → Settings → Environment Variables

**Ajouter/Modifier:**
```env
VITE_API_URL=https://face2face-backend.onrender.com/api
```

**⚠️ Important:** Ajouter `/api` à la fin !

---

### 3. Re-déployer Frontend

Vercel va automatiquement re-déployer avec la nouvelle variable.

Ou forcer un redéploiement :
```bash
vercel --prod
```

---

## 🧪 Tests End-to-End

### 1. Test Registration

```bash
curl -X POST https://face2face-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "name": "Test User"
  }'
```

**Attendu:** Status 200, JWT token retourné

---

### 2. Test Login

```bash
curl -X POST https://face2face-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }'
```

**Attendu:** Status 200, JWT token retourné

---

### 3. Test Rate Limiting

```bash
# Faire 110 requêtes rapidement
for i in {1..110}; do
  curl -I https://face2face-backend.onrender.com/api/auth/me
done
```

**Attendu:**
- Requêtes 1-100: Status 200 ou 401
- Requêtes 101+: Status 429 (Too Many Requests)

---

### 4. Test Security Headers

```bash
curl -I https://face2face-backend.onrender.com/health
```

**Attendu:**
```http
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
strict-transport-security: max-age=15552000; includeSubDomains
content-security-policy: default-src 'self'; ...
```

---

## 📊 Monitoring

### Render Dashboard

**Metrics disponibles:**
- CPU usage
- Memory usage
- Request count
- Response times
- Error rates

**Logs:**
- Real-time logs
- Filtres par niveau (info, warn, error)

---

### Healthcheck Monitoring

Configurer un service externe pour pinger régulièrement :
- UptimeRobot (gratuit)
- Pingdom
- StatusCake

**URL à monitorer:**
```
https://face2face-backend.onrender.com/health/ready
```

**Fréquence:** Toutes les 5 minutes

---

## 💰 Coûts Render

### Plan Hobby Actuel

| Service | Plan | Coût |
|---------|------|------|
| Web Service | Starter | $7/mois |
| PostgreSQL | Starter (1 GB) | $7/mois |
| Build Minutes | 500 free | $0 |
| **Total** | | **$14/mois** |

**Build Minutes:**
- 500 min gratuits/mois
- Ensuite: $5 / 1000 min
- Build backend: ~3-5 min/deploy

**Trafic/Bandwidth:**
- Illimité sur plan Starter ✅

---

## 🔧 Maintenance

### Auto-Deploy depuis GitHub

Render déploie automatiquement à chaque push sur la branche configurée.

**Désactiver auto-deploy:**
Dashboard → face2face-backend → Settings → Auto-Deploy → OFF

---

### Scaling

**Upgrade vers plan Standard ($25/mois):**
- 2 GB RAM (vs 512 MB)
- Plus de CPU
- Autoscaling disponible

---

### Backups Database

**Plan Starter:** Pas de backups automatiques

**Solution:**
1. Upgrade vers Standard ($20/mois) → Backups quotidiens
2. Ou script de backup manuel via cron job

---

## ⚠️ Troubleshooting

### Problème: Build fail "Module not found"

**Cause:** Package manquant dans `package.json`

**Solution:**
```bash
cd backend
npm install
git add package-lock.json
git commit -m "fix: Update package-lock"
git push
```

---

### Problème: Database connection timeout

**Cause:** `DATABASE_URL` incorrecte ou database non démarrée

**Solution:**
1. Vérifier que database est "Available" (pas "Suspended")
2. Copier à nouveau Internal Connection String
3. Mettre à jour variable `DATABASE_URL` sur Web Service

---

### Problème: CORS error depuis frontend

**Cause:** `CORS_ORIGIN` mal configuré ou manquant

**Solution:**
1. Vérifier `CORS_ORIGIN=https://votre-app.vercel.app` (pas de / final)
2. Redémarrer Web Service
3. Vérifier que frontend utilise bien cette URL backend

---

### Problème: Rate limiting trop agressif

**Cause:** `RATE_LIMIT_MAX` trop bas pour votre usage

**Solution:**
1. Augmenter `RATE_LIMIT_MAX` (ex: 200, 500)
2. Redémarrer Web Service

---

## 📚 Ressources

- **Render Docs:** https://render.com/docs
- **Render Status:** https://status.render.com
- **Prisma Docs:** https://www.prisma.io/docs
- **Fastify Docs:** https://www.fastify.io

---

## ✅ Checklist Finale

- [ ] Database créée et "Available"
- [ ] Web Service déployé et "Live"
- [ ] Variables d'environnement configurées
- [ ] Healthcheck `/health` retourne 200
- [ ] Database connectivity check réussit
- [ ] Prisma migrations appliquées
- [ ] Frontend Vercel pointe vers backend Render
- [ ] Tests auth (register, login) réussissent
- [ ] Rate limiting fonctionne (429 après limite)
- [ ] Security headers présents (helmet)
- [ ] Logs accessibles sans erreur

---

## 🎉 Résultat Final

**Backend URL:** `https://face2face-backend.onrender.com`

**Endpoints disponibles:**
```
GET  /health              - Basic health check
GET  /health/detailed     - Detailed health + DB check
GET  /health/ready        - Readiness probe (K8s)
GET  /health/live         - Liveness probe (K8s)

POST /api/auth/register   - User registration
POST /api/auth/login      - User login
GET  /api/auth/me         - Current user (requires JWT)

GET  /api/funnels         - List funnels
POST /api/funnels         - Create funnel
GET  /api/funnels/:id     - Get funnel

POST /api/media/upload    - Upload media file
GET  /api/media/recent    - Recent uploads

POST /api/leads           - Create lead
GET  /api/leads           - List leads
```

**Features actives:**
- ✅ Security headers (Helmet.js)
- ✅ Rate limiting (100 req/min)
- ✅ JWT authentication
- ✅ PostgreSQL database
- ✅ File uploads
- ✅ Health monitoring
- ✅ CORS configured
- ✅ TypeScript compiled
- ✅ Auto-deploy from GitHub

---

**🚀 Backend production-ready sur Render !**

*Coût: $14/mois | Déploiement: ~5-7 minutes*
