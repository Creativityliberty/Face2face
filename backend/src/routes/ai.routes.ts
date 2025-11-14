/**
 * AI Routes - Secure Gemini API Proxy
 *
 * This endpoint securely handles AI generation requests by keeping
 * the Gemini API key on the backend (never exposed to client).
 *
 * Security features:
 * - API key stored server-side only
 * - Retry logic with exponential backoff
 * - Error sanitization (no sensitive info exposed)
 * - Rate limiting via Fastify plugins
 */

import { FastifyPluginAsync } from 'fastify';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini AI with server-side API key
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  return new GoogleGenAI({ apiKey });
};

// System instruction for funnel generation
const FUNNEL_SYSTEM_INSTRUCTION = `You are an expert in creating high-converting quiz funnels for coaching businesses.

When given a prompt, generate a complete quiz funnel configuration in JSON format.

The funnel should:
- Have 5-7 engaging questions that qualify leads
- Include a lead capture form at step 3-4
- Use empathetic, benefit-focused language
- Be mobile-friendly and accessible

Return ONLY valid JSON matching the QuizConfig schema.`;

export const aiRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/ai/generate-funnel
   *
   * Generate a quiz funnel from a text prompt
   *
   * Body:
   * {
   *   "prompt": "Create a funnel for...",
   *   "model": "gemini-2.5-pro" (optional)
   * }
   *
   * Response:
   * {
   *   "success": true,
   *   "data": { QuizConfig object }
   * }
   */
  fastify.post<{
    Body: {
      prompt: string;
      model?: 'gemini-2.5-pro' | 'gemini-2.5-flash';
    };
  }>('/generate-funnel', async (request, reply) => {
    const { prompt, model = 'gemini-2.5-pro' } = request.body;

    // Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return reply.status(400).send({
        success: false,
        error: 'Prompt is required and must be a non-empty string'
      });
    }

    if (prompt.length > 5000) {
      return reply.status(400).send({
        success: false,
        error: 'Prompt is too long (max 5000 characters)'
      });
    }

    try {
      const ai = getAI();

      // Generate funnel with retry logic
      fastify.log.info({ model, promptLength: prompt.length }, 'Generating funnel with AI');

      const response = await retryWithBackoff(
        async () => {
          return await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction: FUNNEL_SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json'
            }
          });
        },
        3,
        2000
      );

      // Parse and validate response
      const text = response.text;

      if (!text || typeof text !== 'string') {
        fastify.log.error('AI response text is empty or invalid');
        return reply.status(500).send({
          success: false,
          error: 'AI generated an empty response. Please try again.'
        });
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        fastify.log.error({ text }, 'Failed to parse AI response as JSON');
        return reply.status(500).send({
          success: false,
          error: 'AI generated invalid JSON. Please try again.'
        });
      }

      fastify.log.info('Funnel generated successfully');

      return reply.send({
        success: true,
        data
      });

    } catch (error: any) {
      // Log full error for debugging (server-side only)
      fastify.log.error({ error: error.message, stack: error.stack }, 'AI generation failed');

      // Sanitized error response (never expose API key or sensitive details)
      const statusCode = error.code || 500;
      const isRateLimited = error?.error?.code === 429;
      const isOverloaded = error?.error?.code === 503 || error?.error?.status === 'UNAVAILABLE';

      return reply.status(statusCode).send({
        success: false,
        error: isRateLimited
          ? 'Too many requests. Please try again in a moment.'
          : isOverloaded
          ? 'AI service is currently overloaded. Please try again in a few minutes.'
          : 'Failed to generate funnel. Please try again.',
        retryable: isOverloaded || isRateLimited
      });
    }
  });
};

/**
 * Retry helper with exponential backoff
 *
 * Retries the function on specific errors (503, UNAVAILABLE)
 * with exponential delay: 2s → 4s → 8s
 */
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

      // Only retry on overload errors
      if (error?.error?.code === 503 || error?.error?.status === 'UNAVAILABLE') {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`[AI Route] API overloaded, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // For other errors, fail immediately
      throw error;
    }
  }

  throw lastError || new Error('Max retries reached');
}
