import { FastifyInstance } from 'fastify';
import { LeadController } from '../controllers/lead.controller';
import { authMiddleware } from '../middleware/auth';

export async function leadRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post('/', LeadController.createLead);
  
  // Protected routes
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authMiddleware);
    
    fastify.get('/stats', LeadController.getLeadStats);
    fastify.get('/funnel/:funnelId', LeadController.getFunnelLeads);
    fastify.get('/funnel/:funnelId/export', LeadController.exportLeads);
  });
}
