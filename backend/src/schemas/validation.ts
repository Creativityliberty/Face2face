import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const refreshSchema = z.object({
  refreshToken: z.string()
});

// Funnel Schemas
export const createFunnelSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  config: z.any()
});

export const updateFunnelSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  config: z.any().optional(),
  isPublished: z.boolean().optional()
});

export const funnelParamsSchema = z.object({
  id: z.string().cuid()
});

// Lead Schemas
export const createLeadSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  answers: z.any().optional(),
  funnelId: z.string().cuid()
});

export const leadParamsSchema = z.object({
  funnelId: z.string().cuid()
});

export const exportQuerySchema = z.object({
  format: z.enum(['json', 'csv']).default('json')
});
