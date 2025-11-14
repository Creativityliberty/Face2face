# Installation Rate Limiting

## Commande à exécuter

```bash
cd backend
npm install @fastify/rate-limit
```

## Configuration dans src/index.ts

Ajouter après les imports:

```typescript
import rateLimit from '@fastify/rate-limit';
```

Dans `registerPlugins()`, ajouter:

```typescript
// Rate limiting global
await fastify.register(rateLimit, {
  global: true,
  max: 100,                    // 100 requêtes
  timeWindow: '1 minute',      // par minute
  errorResponseBuilder: (request, context) => ({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Trop de requêtes. Réessayez dans ${context.after}`
    }
  })
});
```

Fichier complet mis à jour créé dans: backend/src/index.ts.new
