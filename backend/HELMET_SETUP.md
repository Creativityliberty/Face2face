# Installation Helmet.js - Sécurité Headers (BE-002)

## ✅ Objectif

Ajouter des **security headers** HTTP standards pour protéger l'application contre les vulnérabilités web courantes.

## 🔒 Headers Ajoutés

Helmet.js configure automatiquement ces headers de sécurité :

- **Content-Security-Policy**: Prévient XSS, injection de scripts
- **X-Frame-Options**: Prévient clickjacking
- **X-Content-Type-Options**: Prévient MIME sniffing
- **Strict-Transport-Security**: Force HTTPS
- **X-DNS-Prefetch-Control**: Contrôle DNS prefetching
- **X-Download-Options**: Pour IE8+
- **X-Permitted-Cross-Domain-Policies**: Pour Flash/PDF

## 📦 Installation

```bash
cd backend
npm install @fastify/helmet
```

## 🔧 Intégration dans `src/index.ts`

### 1. Ajouter l'import en haut du fichier

```typescript
import helmet from '@fastify/helmet';
import { config } from 'dotenv';
```

### 2. Dans `registerPlugins()`, ajouter AVANT le CORS

```typescript
async function registerPlugins() {
  // Security headers (HELMET.JS - BE-002)
  await fastify.register(helmet, {
    global: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Pour CSS inline (Tailwind)
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'], // Pour images externes
        connectSrc: ["'self'"], // Pour API calls
        fontSrc: ["'self'", 'https:', 'data:'], // Pour Google Fonts
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Désactivé pour compatibilité
  });

  // CORS configuration (APRÈS Helmet)
  await fastify.register(cors, {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.CORS_ORIGIN || 'https://yourdomain.com'
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  });

  // ... reste du code
}
```

## 🌐 Configuration CORS Améliorée (BE-004)

**⚠️ IMPORTANT:** Ne jamais utiliser `origin: true` en production !

### Variables d'environnement à ajouter dans `.env`

```env
# Production
CORS_ORIGIN=https://yourdomain.com

# Development (optionnel, `true` par défaut)
# CORS_ORIGIN=http://localhost:5173
```

## ✅ Vérification

### 1. Démarrer le serveur

```bash
npm run dev
```

Vous devriez voir :
```
✅ Plugins registered successfully
```

### 2. Tester les headers

```bash
curl -I http://localhost:3001/health
```

**Résultat attendu:**
```http
HTTP/1.1 200 OK
content-security-policy: default-src 'self';base-uri 'self';...
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
strict-transport-security: max-age=15552000; includeSubDomains
x-dns-prefetch-control: off
x-download-options: noopen
x-permitted-cross-domain-policies: none
...
```

### 3. Tester avec un navigateur

Ouvrir **DevTools → Network → Headers** sur n'importe quelle requête API.

Vérifier la présence des headers de sécurité dans la réponse.

## 📊 Impact Sécurité

**Avant:**
- ❌ Pas de protection XSS
- ❌ Pas de protection clickjacking
- ❌ Pas de CSP
- ❌ CORS ouvert à tous (`origin: true`)

**Après:**
- ✅ CSP configuré
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff
- ✅ HSTS activé
- ✅ CORS restreint en production

## 🎯 Conformité

- ✅ OWASP Top 10 - A3 (XSS)
- ✅ OWASP Top 10 - A5 (Security Misconfiguration)
- ✅ OWASP Top 10 - A7 (CORS)

## 🚀 Déploiement

### Checklist avant production

- [ ] `npm install @fastify/helmet` exécuté
- [ ] Code intégré dans `src/index.ts`
- [ ] `CORS_ORIGIN` configuré dans `.env` production
- [ ] Headers vérifiés avec `curl -I`
- [ ] Tests CSP sur frontend (console pour violations)
- [ ] Build réussit (`npm run build`)

## ⚠️ Troubleshooting

### Problème: CSP bloque des ressources externes

**Solution:** Ajouter les domaines autorisés dans la CSP

```typescript
contentSecurityPolicy: {
  directives: {
    imgSrc: ["'self'", 'data:', 'https:', 'https://cdn.example.com'],
    scriptSrc: ["'self'", 'https://cdn.example.com'],
  }
}
```

### Problème: CORS bloque les requêtes en dev

**Solution:** Vérifier que `NODE_ENV !== 'production'` utilise `origin: true`

```typescript
origin: process.env.NODE_ENV === 'production'
  ? process.env.CORS_ORIGIN
  : true, // ← Autorise tout en dev
```

## 📚 Ressources

- **Helmet.js:** https://helmetjs.github.io/
- **@fastify/helmet:** https://github.com/fastify/fastify-helmet
- **CSP:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- **OWASP Headers:** https://owasp.org/www-project-secure-headers/

---

**Résultat: Backend sécurisé avec headers standards! 🛡️**

*P0 Critical - BE-002 ✅*
