# Sous-Agents Backend - Face2Face API

Documentation détaillée de chaque sous-agent backend spécialisé.

---

## 📋 VUE D'ENSEMBLE

Le backend Face2Face utilise **8 sous-agents spécialisés** qui travaillent ensemble sous la coordination de l'Agent Backend Principal.

```
Agent Backend Principal
├── 1. Agent API Routes
├── 2. Agent Controllers
├── 3. Agent Database
├── 4. Agent Validation
├── 5. Agent Authentication
├── 6. Agent Error Handling
├── 7. Agent Testing
└── 8. Agent Performance
```

---

## 1️⃣ AGENT API ROUTES

### Mission
Créer et maintenir tous les endpoints REST de l'API.

### Responsabilités
- Définir les routes HTTP
- Paramètres et query strings
- Schemas de validation
- Documentation OpenAPI/Swagger

### Structure de Route Standard

```typescript
// src/routes/resource.routes.ts
import { FastifyInstance } from 'fastify';
import { resourceController } from '../controllers/resource.controller';
import { authenticate } from '../middleware/auth';
import {
  listResourceSchema,
  getResourceSchema,
  createResourceSchema,
  updateResourceSchema,
  deleteResourceSchema
} from '../schemas/resource.schemas';

export async function resourceRoutes(fastify: FastifyInstance) {
  // GET /api/resources - Liste
  fastify.get('/', {
    schema: listResourceSchema,
    handler: resourceController.list
  });

  // GET /api/resources/:id - Détail
  fastify.get('/:id', {
    schema: getResourceSchema,
    handler: resourceController.getById
  });

  // POST /api/resources - Créer (authentifié)
  fastify.post('/', {
    onRequest: [authenticate],
    schema: createResourceSchema,
    handler: resourceController.create
  });

  // PUT /api/resources/:id - Mettre à jour (authentifié)
  fastify.put('/:id', {
    onRequest: [authenticate],
    schema: updateResourceSchema,
    handler: resourceController.update
  });

  // DELETE /api/resources/:id - Supprimer (authentifié)
  fastify.delete('/:id', {
    onRequest: [authenticate],
    schema: deleteResourceSchema,
    handler: resourceController.delete
  });
}
```

### Schemas de Validation

```typescript
// src/schemas/resource.schemas.ts
export const listResourceSchema = {
  description: 'Liste toutes les ressources',
  tags: ['Resources'],
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      search: { type: 'string' },
      sortBy: { type: 'string', enum: ['createdAt', 'updatedAt', 'name'] },
      sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
    }
  },
  response: {
    200: {
      description: 'Liste des ressources',
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' }
          }
        }
      }
    }
  }
};

export const createResourceSchema = {
  description: 'Crée une nouvelle ressource',
  tags: ['Resources'],
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', minLength: 3, maxLength: 100 },
      description: { type: 'string', maxLength: 500 }
    }
  },
  response: {
    201: {
      description: 'Ressource créée',
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { $ref: 'Resource#' }
      }
    }
  }
};
```

### Checklist Agent API Routes

- [ ] Routes suivent convention REST
- [ ] Validation schemas définis
- [ ] Auth middleware sur routes protégées
- [ ] Documentation OpenAPI complète
- [ ] Query parameters validés
- [ ] Response schemas documentés

---

## 2️⃣ AGENT CONTROLLERS

### Mission
Implémenter la logique métier de l'application.

### Responsabilités
- Traiter les requêtes
- Orchestrer les services
- Transformer les données
- Gérer les transactions

### Structure de Controller Standard

```typescript
// src/controllers/funnel.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { funnelService } from '../services/funnel.service';
import { AppError } from '../utils/errors';
import { createFunnelSchema, updateFunnelSchema } from '../schemas/funnel.schemas';

export const funnelController = {
  /**
   * Liste tous les funnels de l'utilisateur
   */
  async list(
    request: FastifyRequest<{
      Querystring: { page?: number; limit?: number; search?: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { page = 1, limit = 20, search } = request.query;
      const userId = request.user!.id;

      const result = await funnelService.findAll({
        userId,
        page,
        limit,
        search
      });

      return reply.send({
        success: true,
        data: result.funnels,
        meta: {
          page,
          limit,
          total: result.total
        }
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupère un funnel par ID
   */
  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const userId = request.user!.id;

    const funnel = await funnelService.findById(id, userId);

    if (!funnel) {
      throw new AppError('NOT_FOUND', 'Funnel introuvable', 404);
    }

    return reply.send({
      success: true,
      data: funnel
    });
  },

  /**
   * Crée un nouveau funnel
   */
  async create(
    request: FastifyRequest<{
      Body: z.infer<typeof createFunnelSchema>;
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const data = createFunnelSchema.parse(request.body);

    const funnel = await funnelService.create({
      ...data,
      userId
    });

    return reply.status(201).send({
      success: true,
      data: funnel
    });
  },

  /**
   * Met à jour un funnel
   */
  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: z.infer<typeof updateFunnelSchema>;
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const userId = request.user!.id;
    const data = updateFunnelSchema.parse(request.body);

    // Vérifier que le funnel appartient à l'utilisateur
    const existing = await funnelService.findById(id, userId);
    if (!existing) {
      throw new AppError('NOT_FOUND', 'Funnel introuvable', 404);
    }

    const funnel = await funnelService.update(id, data);

    return reply.send({
      success: true,
      data: funnel
    });
  },

  /**
   * Supprime un funnel
   */
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const userId = request.user!.id;

    // Vérifier que le funnel appartient à l'utilisateur
    const existing = await funnelService.findById(id, userId);
    if (!existing) {
      throw new AppError('NOT_FOUND', 'Funnel introuvable', 404);
    }

    await funnelService.delete(id);

    return reply.status(204).send();
  },

  /**
   * Publie un funnel
   */
  async publish(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const userId = request.user!.id;

    const funnel = await funnelService.publish(id, userId);

    return reply.send({
      success: true,
      data: funnel
    });
  }
};
```

### Service Layer

```typescript
// src/services/funnel.service.ts
import { prisma } from '../utils/database';

export const funnelService = {
  async findAll({ userId, page, limit, search }: {
    userId: string;
    page: number;
    limit: number;
    search?: string;
  }) {
    const where = {
      userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [funnels, total] = await Promise.all([
      prisma.funnel.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { leads: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.funnel.count({ where })
    ]);

    return { funnels, total };
  },

  async findById(id: string, userId: string) {
    return prisma.funnel.findFirst({
      where: { id, userId },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    });
  },

  async create(data: any) {
    return prisma.funnel.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
        steps: {
          create: data.steps
        }
      },
      include: {
        steps: true
      }
    });
  },

  async update(id: string, data: any) {
    return prisma.funnel.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        steps: data.steps ? {
          deleteMany: {},
          create: data.steps
        } : undefined
      },
      include: {
        steps: true
      }
    });
  },

  async delete(id: string) {
    return prisma.funnel.delete({ where: { id } });
  },

  async publish(id: string, userId: string) {
    const funnel = await prisma.funnel.findFirst({
      where: { id, userId }
    });

    if (!funnel) {
      throw new AppError('NOT_FOUND', 'Funnel introuvable', 404);
    }

    return prisma.funnel.update({
      where: { id },
      data: { isPublished: true }
    });
  }
};
```

### Checklist Agent Controllers

- [ ] Logique métier dans services (pas dans controllers)
- [ ] Validation des inputs avec Zod
- [ ] Vérification des permissions
- [ ] Gestion des erreurs avec try/catch
- [ ] JSDoc sur fonctions complexes
- [ ] TypeScript strict

---

## 3️⃣ AGENT DATABASE

### Mission
Gérer Prisma et toutes les interactions avec la base de données.

### Responsabilités
- Schema Prisma
- Migrations
- Optimisation des requêtes
- Indexes

### Schema Prisma

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  funnels   Funnel[]

  @@index([email])
  @@map("users")
}

model Funnel {
  id          String   @id @default(cuid())
  title       String
  description String?
  isPublished Boolean  @default(false)
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user  User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  steps FunnelStep[]
  leads Lead[]

  @@index([userId, createdAt])
  @@index([isPublished])
  @@map("funnels")
}

model FunnelStep {
  id       String @id @default(cuid())
  funnelId String
  order    Int
  type     String // 'welcome' | 'question' | 'leadCapture' | 'message'
  title    String
  content  String?
  settings Json?

  funnel Funnel @relation(fields: [funnelId], references: [id], onDelete: Cascade)

  @@index([funnelId, order])
  @@map("funnel_steps")
}

model Lead {
  id        String   @id @default(cuid())
  funnelId  String
  email     String?
  name      String?
  phone     String?
  responses Json?
  createdAt DateTime @default(now())

  funnel Funnel @relation(fields: [funnelId], references: [id], onDelete: Cascade)

  @@index([funnelId, createdAt])
  @@index([email])
  @@map("leads")
}
```

### Migrations

```bash
# Créer une migration
npx prisma migrate dev --name add_funnel_settings

# Appliquer en production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

### Query Optimization

```typescript
// ❌ Mauvais - N+1 query
const funnels = await prisma.funnel.findMany();
for (const funnel of funnels) {
  const steps = await prisma.funnelStep.findMany({
    where: { funnelId: funnel.id }
  });
}

// ✅ Bon - Include
const funnels = await prisma.funnel.findMany({
  include: {
    steps: true
  }
});

// ✅ Meilleur - Select uniquement ce dont on a besoin
const funnels = await prisma.funnel.findMany({
  select: {
    id: true,
    title: true,
    steps: {
      select: {
        id: true,
        title: true,
        order: true
      }
    }
  }
});

// ✅ Excellent - Batch operations
await prisma.funnelStep.createMany({
  data: steps
});
```

### Indexes Strategy

```prisma
// Single column index
@@index([userId])

// Composite index (important: ordre des colonnes!)
@@index([userId, createdAt])  // Pour queries: WHERE userId = ? ORDER BY createdAt

// Unique index
@@unique([email])

// Index sur relation
@@index([funnelId])
```

### Checklist Agent Database

- [ ] Tous les models ont id, createdAt, updatedAt
- [ ] Relations correctement définies
- [ ] Indexes sur foreign keys
- [ ] Indexes sur colonnes fréquemment queriyées
- [ ] onDelete configuré (Cascade vs SetNull)
- [ ] Pas de N+1 queries
- [ ] Select uniquement colonnes nécessaires

---

## 4️⃣ AGENT VALIDATION

### Mission
Valider toutes les données entrantes avec Zod.

### Responsabilités
- Créer schemas Zod
- Valider inputs
- Sanitizer données
- Messages d'erreur clairs

### Schemas Zod Complets

```typescript
// src/schemas/funnel.schemas.ts
import { z } from 'zod';

// Enum pour types d'étapes
const FunnelStepType = z.enum([
  'welcome',
  'question',
  'leadCapture',
  'message'
]);

// Schema pour une étape
const funnelStepSchema = z.object({
  type: FunnelStepType,
  title: z.string()
    .min(1, 'Le titre est requis')
    .max(200, 'Titre trop long (max 200 caractères)'),

  content: z.string()
    .max(2000, 'Contenu trop long (max 2000 caractères)')
    .optional(),

  order: z.number()
    .int('L\'ordre doit être un entier')
    .min(0, 'L\'ordre ne peut être négatif'),

  settings: z.object({
    required: z.boolean().optional(),
    multipleChoice: z.boolean().optional(),
    options: z.array(z.string()).optional()
  }).optional()
});

// Schema création funnel
export const createFunnelSchema = z.object({
  title: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre est trop long (max 100 caractères)')
    .trim(),

  description: z.string()
    .max(500, 'La description est trop longue (max 500 caractères)')
    .trim()
    .optional(),

  steps: z.array(funnelStepSchema)
    .min(1, 'Au moins une étape est requise')
    .max(15, 'Maximum 15 étapes autorisées')
    .refine(
      (steps) => {
        const orders = steps.map(s => s.order);
        return new Set(orders).size === orders.length;
      },
      { message: 'Les ordres des étapes doivent être uniques' }
    ),

  settings: z.object({
    theme: z.object({
      primaryColor: z.string()
        .regex(/^#[0-9A-F]{6}$/i, 'Couleur invalide (format: #RRGGBB)'),
      backgroundColor: z.string()
        .regex(/^#[0-9A-F]{6}$/i, 'Couleur invalide')
        .optional()
    }).optional(),

    branding: z.object({
      logo: z.string().url('URL de logo invalide').optional(),
      companyName: z.string().max(100).optional()
    }).optional()
  }).optional()
});

// Schema mise à jour (partiel)
export const updateFunnelSchema = createFunnelSchema.partial();

// Schema pour lead
export const createLeadSchema = z.object({
  email: z.string()
    .email('Email invalide')
    .toLowerCase()
    .trim(),

  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Nom trop long')
    .trim()
    .optional(),

  phone: z.string()
    .regex(/^\+?[0-9\s\-()]{10,20}$/, 'Numéro de téléphone invalide')
    .optional(),

  responses: z.record(z.any())
    .optional()
});

// Schema auth
export const registerSchema = z.object({
  email: z.string()
    .email('Email invalide')
    .toLowerCase()
    .trim(),

  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Mot de passe trop long')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),

  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Nom trop long')
    .trim()
    .optional()
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide').toLowerCase(),
  password: z.string().min(1, 'Mot de passe requis')
});
```

### Validation Personnalisée

```typescript
// Custom validators
const isValidSlug = (str: string) => /^[a-z0-9-]+$/.test(str);

const slugSchema = z.string()
  .refine(isValidSlug, {
    message: 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'
  });

// Validation conditionnelle
const questionStepSchema = z.object({
  type: z.literal('question'),
  required: z.boolean(),
  options: z.array(z.string()).optional()
}).refine(
  (data) => {
    if (data.required && (!data.options || data.options.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Les questions requises doivent avoir des options',
    path: ['options']
  }
);
```

### Gestion des Erreurs Zod

```typescript
import { ZodError } from 'zod';

export function handleValidationError(error: ZodError) {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));

  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Les données fournies sont invalides',
      details: errors
    }
  };
}

// Utilisation
try {
  const validated = createFunnelSchema.parse(data);
} catch (error) {
  if (error instanceof ZodError) {
    return reply.status(400).send(handleValidationError(error));
  }
  throw error;
}
```

### Checklist Agent Validation

- [ ] Tous les inputs validés avec Zod
- [ ] Messages d'erreur en français
- [ ] Sanitization (trim, toLowerCase)
- [ ] Validation custom si nécessaire
- [ ] Types TypeScript inférés de Zod
- [ ] Erreurs formatées correctement

---

## 5️⃣ AGENT AUTHENTICATION

### Mission
Gérer l'authentification et la sécurité.

### Responsabilités
- JWT
- Password hashing
- Middleware auth
- CORS & Security headers
- Rate limiting

### Complete Auth System

```typescript
// src/utils/password.ts
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new AppError('INVALID_TOKEN', 'Token invalide ou expiré', 401);
  }
}

export function refreshToken(token: string): string {
  const payload = verifyToken(token);
  return generateToken({
    userId: payload.userId,
    email: payload.email
  });
}
```

### Auth Middleware

```typescript
// src/middleware/auth.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/jwt';
import { prisma } from '../utils/database';
import { AppError } from '../utils/errors';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      name: string | null;
    };
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Extract token
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'MISSING_TOKEN',
        'Token d\'authentification requis',
        401
      );
    }

    const token = authHeader.substring(7);

    // Verify token
    const payload = verifyToken(token);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      throw new AppError(
        'USER_NOT_FOUND',
        'Utilisateur introuvable',
        401
      );
    }

    // Attach user to request
    request.user = user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      'INVALID_TOKEN',
      'Token invalide ou expiré',
      401
    );
  }
}

// Optional auth (ne throw pas si pas de token)
export async function optionalAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await authenticate(request, reply);
  } catch (error) {
    // Silently fail - user stays undefined
  }
}
```

### Auth Controller

```typescript
// src/controllers/auth.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { registerSchema, loginSchema } from '../schemas/auth.schemas';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { prisma } from '../utils/database';
import { AppError } from '../utils/errors';

export const authController = {
  async register(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const data = registerSchema.parse(request.body);

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existing) {
      throw new AppError(
        'EMAIL_EXISTS',
        'Cet email est déjà utilisé',
        409
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    return reply.status(201).send({
      success: true,
      data: {
        user,
        token
      }
    });
  },

  async login(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const data = loginSchema.parse(request.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new AppError(
        'INVALID_CREDENTIALS',
        'Email ou mot de passe incorrect',
        401
      );
    }

    // Verify password
    const isValid = await verifyPassword(data.password, user.password);

    if (!isValid) {
      throw new AppError(
        'INVALID_CREDENTIALS',
        'Email ou mot de passe incorrect',
        401
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    return reply.send({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      }
    });
  },

  async me(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    return reply.send({
      success: true,
      data: request.user
    });
  },

  async refreshToken(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const token = refreshToken(request.headers.authorization!.substring(7));

    return reply.send({
      success: true,
      data: { token }
    });
  }
};
```

### Security Headers

```typescript
// src/index.ts
import helmet from '@fastify/helmet';

await fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
});
```

### Rate Limiting

```typescript
import rateLimit from '@fastify/rate-limit';

await fastify.register(rateLimit, {
  global: true,
  max: 100,                  // 100 requests
  timeWindow: '1 minute',    // per minute
  errorResponseBuilder: (request, context) => ({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Trop de requêtes. Réessayez dans ${context.after}`
    }
  })
});

// Rate limit spécifique pour auth
fastify.post('/api/auth/login', {
  config: {
    rateLimit: {
      max: 5,
      timeWindow: '1 minute'
    }
  },
  handler: authController.login
});
```

### Checklist Agent Authentication

- [ ] Passwords hashés avec bcrypt (rounds ≥ 12)
- [ ] JWT secret ≥ 32 caractères
- [ ] Token expiration configurée
- [ ] Middleware auth sur routes protégées
- [ ] Rate limiting actif
- [ ] Security headers (Helmet)
- [ ] CORS configuré correctement
- [ ] Aucun secret hardcodé

---

**Suite dans le prochain message avec les agents 6-8...**

*Dernière mise à jour: 2025-11-14*
