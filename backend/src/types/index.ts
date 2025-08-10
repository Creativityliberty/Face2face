import { User, Funnel, Lead, Media, Plan } from '@prisma/client';

// Database Models
export type { User, Funnel, Lead, Media, Plan };

// API Request/Response Types
export interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export interface CreateFunnelRequest {
  title: string;
  description?: string;
  config: any; // QuizConfig from frontend types
}

export interface UpdateFunnelRequest {
  title?: string;
  description?: string;
  config?: any;
  isPublished?: boolean;
}

export interface CreateLeadRequest {
  name?: string;
  email?: string;
  phone?: string;
  subscribed?: boolean;
  answers?: any;
  funnelId: string;
}

export interface FunnelAnalytics {
  totalViews: number;
  totalLeads: number;
  conversionRate: number;
  stepAnalytics: StepAnalytics[];
}

export interface StepAnalytics {
  stepId: string;
  views: number;
  completions: number;
  dropoffRate: number;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  plan: Plan;
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

// File Upload Types
export interface UploadedFile {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}
