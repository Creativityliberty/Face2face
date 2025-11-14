# Modifications Requises - Backend

Ce fichier liste les modifications à apporter au backend pour implémenter les améliorations P0.

## ✅ Fichiers Créés

1. `/backend/src/config/security.ts` - Configuration de sécurité (rate limiting, validation JWT)

## 🔧 Modifications à Faire

### 1. Installer le package rate-limit

```bash
cd backend
npm install @fastify/rate-limit
```

### 2. Modifier `src/index.ts`

**Ajouter l'import en haut du fichier:**

```typescript
import rateLimit from '@fastify/rate-limit';
import { validateEnvironment, rateLimitConfig } from './config/security';
```

**Dans la fonction `registerPlugins()`, ajouter AVANT le CORS:**

```typescript
// Rate limiting global (SÉCURITÉ P0)
await fastify.register(rateLimit, rateLimitConfig);
```

**Au début de la fonction `start()`, ajouter:**

```typescript
async function start() {
  try {
    // Valider l'environnement au démarrage (SÉCURITÉ P0)
    console.log('🔒 Validation de la sécurité...');
    validateEnvironment();

    console.log('🔧 Starting server initialization...');
    // ... reste du code
```

### 3. Créer/Modifier `.env` pour ajouter les variables de sécurité

```env
# JWT (REQUIS - minimum 32 caractères!)
JWT_SECRET=your-super-secret-key-minimum-32-characters-long

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=1 minute
AUTH_RATE_LIMIT_MAX=5
AUTH_RATE_LIMIT_WINDOW=1 minute
```

### 4. Tester

```bash
cd backend
npm run dev
```

Vous devriez voir:
```
✅ JWT_SECRET validé (longueur: XX caractères)
✅ Toutes les variables d'environnement requises sont présentes
```

### 5. Tester le rate limiting

Faire plus de 100 requêtes en 1 minute → devrait retourner erreur 429:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Trop de requêtes. Réessayez dans ...",
    "retryAfter": "..."
  }
}
```

## 📋 Checklist

- [ ] `npm install @fastify/rate-limit` exécuté
- [ ] `src/index.ts` modifié (imports + registerPlugins + start)
- [ ] `.env` créé/mis à jour avec JWT_SECRET (≥32 chars)
- [ ] Server démarre sans erreur
- [ ] Rate limiting fonctionne (test avec > 100 requêtes)
- [ ] Validation JWT_SECRET fonctionne (test avec JWT_SECRET trop court)

## 🎯 Résultat Attendu

- ✅ Rate limiting actif sur toute l'API (100 req/min par défaut)
- ✅ JWT_SECRET validé au démarrage
- ✅ Erreur claire si JWT_SECRET manquant ou trop court
- ✅ Messages d'erreur cohérents pour rate limit

## 🔒 Sécurité Améliorée

Ces modifications implémentent 2 tâches P0 critiques:
- **BE-001**: Rate limiting global ✅
- **BE-003**: Validation JWT_SECRET au démarrage ✅

**Impact:** Protection contre brute force, DoS, et erreurs de configuration JWT.
