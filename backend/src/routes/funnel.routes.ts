import { FastifyInstance } from 'fastify';
import { FunnelController } from '../controllers/funnel.controller';
import { authMiddleware } from '../middleware/auth';

export async function funnelRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.get('/public/:id', FunnelController.getPublicFunnel);
  
  // Protected routes
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authMiddleware);
    
    fastify.get('/', FunnelController.getFunnels);
    fastify.post('/', FunnelController.createFunnel);
    fastify.get('/:id', FunnelController.getFunnel);
    fastify.put('/:id', FunnelController.updateFunnel);
    fastify.delete('/:id', FunnelController.deleteFunnel);
    fastify.get('/:id/analytics', FunnelController.getFunnelAnalytics);
  });
}
