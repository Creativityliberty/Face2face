# 🔐 SÉCURITÉ: Protéger la Clé API Gemini (URGENT)

## ⚠️ **Problème Actuel**

**Votre clé API Gemini est exposée côté client (browser) !**

```
AIzaSyDqgVmsByyoE6dAKUsK9Ftd3t9-_JJQtuc
```

**Dangers:**
- ❌ Visible dans le code source JavaScript
- ❌ N'importe qui peut la copier
- ❌ Utilisation de votre quota sans contrôle
- ❌ Coûts potentiels illimités

---

## ✅ **Solution: Déplacer l'API vers Backend**

### **Architecture Sécurisée**

**AVANT (Actuel - NON SÉCURISÉ):**
```
Browser → Gemini API (clé visible)
```

**APRÈS (Sécurisé):**
```
Browser → Backend Face2Face → Gemini API (clé cachée)
```

---

## 🔧 **Implémentation**

### **1. Créer Route Backend `/api/ai/generate-funnel`**

**Fichier:** `backend/src/routes/ai.routes.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import { GoogleGenAI } from '@google/genai';

// Clé API côté serveur (sécurisée)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY // Dans .env backend
});

export const aiRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/ai/generate-funnel
   * Génère un funnel depuis un prompt
   */
  fastify.post('/generate-funnel', async (request, reply) => {
    const { prompt, model = 'gemini-2.5-pro' } = request.body as {
      prompt: string;
      model?: string;
    };

    // Validation
    if (!prompt || prompt.trim().length === 0) {
      return reply.status(400).send({
        success: false,
        error: 'Prompt is required'
      });
    }

    try {
      // Retry logic avec backoff
      const response = await retryWithBackoff(
        async () => await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: `...`, // Votre system instruction
            responseMimeType: 'application/json'
          }
        }),
        3,
        2000
      );

      return reply.send({
        success: true,
        data: JSON.parse(response.text)
      });
    } catch (error: any) {
      fastify.log.error('AI generation failed:', error);

      // NE PAS exposer la clé API dans l'erreur !
      return reply.status(error.code || 500).send({
        success: false,
        error: 'Failed to generate funnel. Please try again.',
        // Ne pas inclure error.message (contient parfois des infos sensibles)
      });
    }
  });
};

// Helper retry logic
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (error?.error?.code === 503 || error?.error?.status === 'UNAVAILABLE') {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`API overloaded, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error('Max retries reached');
}
```

---

### **2. Enregistrer Route dans `backend/src/index.ts`**

```typescript
import { aiRoutes } from './routes/ai.routes';

// Dans registerRoutes()
await fastify.register(aiRoutes, { prefix: '/api/ai' });
```

---

### **3. Ajouter Variable d'Environnement Backend**

**Fichier:** `backend/.env`

```env
# Gemini API Key (BACKEND ONLY - NEVER expose to frontend)
GEMINI_API_KEY=AIzaSyDqgVmsByyoE6dAKUsK9Ftd3t9-_JJQtuc
```

**Render Dashboard:**
- Settings → Environment Variables
- Ajouter: `GEMINI_API_KEY=AIzaSyDqgVmsByyoE6dAKUsK9Ftd3t9-_JJQtuc`

---

### **4. Modifier Frontend `lib/api.ts`**

**Créer fonction appel backend:**

```typescript
// lib/api.ts
export async function generateFunnelFromBackend(
  prompt: string,
  model: 'gemini-2.5-pro' | 'gemini-2.5-flash' = 'gemini-2.5-pro'
): Promise<QuizConfig> {
  const response = await apiFetch('/ai/generate-funnel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt, model })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate funnel');
  }

  const result = await response.json();
  return result.data;
}
```

---

### **5. Modifier Composant AIAssistant**

**Remplacer appel direct par appel backend:**

**AVANT:**
```typescript
import { generateFunnelFromPrompt } from '../lib/ai';

const funnel = await generateFunnelFromPrompt(prompt);
```

**APRÈS:**
```typescript
import { generateFunnelFromBackend } from '../lib/api';

const funnel = await generateFunnelFromBackend(prompt);
```

---

### **6. SUPPRIMER Variable Frontend**

**Fichier:** `.env` (frontend)

```env
# ❌ SUPPRIMER CETTE LIGNE (non sécurisée)
# API_KEY=AIzaSyDqgVmsByyoE6dAKUsK9Ftd3t9-_JJQtuc
```

---

## 🔒 **Sécurité Renforcée**

### **Backend: Ajouter Rate Limiting sur `/api/ai`**

**Éviter abus:**

```typescript
// backend/src/index.ts
import rateLimit from '@fastify/rate-limit';

// Rate limit spécifique pour AI endpoints
await fastify.register(rateLimit, {
  max: 10, // 10 requêtes max
  timeWindow: '1 minute',
  prefix: '/api/ai'
});
```

---

### **Backend: Ajouter Auth sur `/api/ai`**

**Réserver aux utilisateurs connectés:**

```typescript
fastify.post('/generate-funnel', {
  preHandler: [fastify.authenticate] // Middleware JWT
}, async (request, reply) => {
  // Seuls les users authentifiés peuvent générer
});
```

---

## 📊 **Avantages Architecture Sécurisée**

| Avant (Client-side) | Après (Server-side) |
|---------------------|---------------------|
| ❌ Clé visible browser | ✅ Clé cachée backend |
| ❌ Quota non contrôlé | ✅ Rate limiting possible |
| ❌ Coûts illimités | ✅ Auth + quotas par user |
| ❌ Clé dans Git/logs | ✅ Variable d'env sécurisée |
| ❌ Erreurs exposent clé | ✅ Erreurs sanitisées |

---

## ⚡ **Migration Rapide (15 min)**

### **Étape 1: Backend (5 min)**
```bash
cd backend
# Créer ai.routes.ts
# Ajouter import dans index.ts
# Ajouter GEMINI_API_KEY dans .env
npm run dev # Tester
```

### **Étape 2: Frontend (5 min)**
```bash
# Modifier lib/api.ts (ajouter generateFunnelFromBackend)
# Modifier AIAssistant.tsx (utiliser nouvelle fonction)
# Supprimer API_KEY dans .env
npm run dev # Tester
```

### **Étape 3: Deploy (5 min)**
```bash
# Ajouter GEMINI_API_KEY sur Render Dashboard
git push # Auto-deploy
```

---

## 🔥 **URGENT: Révoquer Clé Actuelle**

**La clé exposée `AIzaSyD...` doit être révoquée IMMÉDIATEMENT !**

### **1. Aller sur Google Cloud Console**
https://console.cloud.google.com/apis/credentials

### **2. Trouver clé `AIzaSyDqgVmsByyoE6dAKUsK9Ftd3t9-_JJQtuc`**

### **3. Cliquer "Supprimer" ou "Révoquer"**

### **4. Créer nouvelle clé**
- Copier nouvelle clé
- Ajouter dans `backend/.env`
- Ajouter sur Render Dashboard
- **NE JAMAIS** mettre dans frontend

---

## ✅ **Checklist Sécurité**

- [ ] Créer `backend/src/routes/ai.routes.ts`
- [ ] Enregistrer route dans `index.ts`
- [ ] Ajouter `GEMINI_API_KEY` dans `backend/.env`
- [ ] Ajouter `GEMINI_API_KEY` sur Render Dashboard
- [ ] Créer `generateFunnelFromBackend()` dans `lib/api.ts`
- [ ] Modifier `AIAssistant.tsx` pour utiliser backend
- [ ] Supprimer `API_KEY` du frontend `.env`
- [ ] Révoquer ancienne clé sur Google Cloud Console
- [ ] Créer nouvelle clé Gemini
- [ ] Tester génération funnel
- [ ] Commit + push
- [ ] Vérifier clé invisible dans browser DevTools

---

## 🎯 **Résultat Final**

**Après migration:**
- ✅ Clé API invisible côté client
- ✅ Quota contrôlé par backend
- ✅ Rate limiting actif
- ✅ Authentification possible
- ✅ Logs backend sécurisés
- ✅ Erreurs sanitisées
- ✅ AUCUNE info sensible exposée

**Sécurité: CRITIQUE → SÉCURISÉ ! 🔒**

---

**À FAIRE IMMÉDIATEMENT:**
1. Révoquer clé exposée
2. Implémenter backend AI route
3. Tester
4. Deploy

**Temps estimé: 15-20 minutes**
**Impact: Sécurité CRITIQUE résolue ✅**
