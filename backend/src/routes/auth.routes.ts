import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

export async function authRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post('/register', AuthController.register);
  fastify.post('/login', AuthController.login);
  fastify.post('/refresh', AuthController.refresh);
  
  // Protected routes
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authMiddleware);
    
    fastify.get('/me', AuthController.me);
  });
}
