import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../utils/database';
import { CreateFunnelRequest, UpdateFunnelRequest, FunnelAnalytics } from '../types';

// Validation schemas
const createFunnelSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  config: z.any() // QuizConfig from frontend
});

const updateFunnelSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  config: z.any().optional(),
  isPublished: z.boolean().optional()
});

const funnelParamsSchema = z.object({
  id: z.string().cuid()
});

export class FunnelController {
  static async getFunnels(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.userId;
      
      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      const funnels = await prisma.funnel.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          description: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { leads: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      return reply.send(funnels);
    } catch (error) {
      console.error('Get funnels error:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch funnels'
      });
    }
  }

  static async getFunnel(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.userId;
      const { id } = funnelParamsSchema.parse(request.params);
      
      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      const funnel = await prisma.funnel.findFirst({
        where: { 
          id,
          userId 
        },
        include: {
          _count: {
            select: { leads: true }
          }
        }
      });

      if (!funnel) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Funnel not found'
        });
      }

      return reply.send(funnel);
    } catch (error) {
      console.error('Get funnel error:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch funnel'
      });
    }
  }

  static async createFunnel(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.userId;
      const { title, description, config } = createFunnelSchema.parse(request.body);
      
      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      const funnel = await prisma.funnel.create({
        data: {
          title,
          description,
          config,
          userId
        },
        include: {
          _count: {
            select: { leads: true }
          }
        }
      });

      return reply.status(201).send(funnel);
    } catch (error) {
      console.error('Create funnel error:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to create funnel'
      });
    }
  }

  static async updateFunnel(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.userId;
      const { id } = funnelParamsSchema.parse(request.params);
      const updateData = updateFunnelSchema.parse(request.body);
      
      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      // Check if funnel exists and belongs to user
      const existingFunnel = await prisma.funnel.findFirst({
        where: { id, userId }
      });

      if (!existingFunnel) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Funnel not found'
        });
      }

      const funnel = await prisma.funnel.update({
        where: { id },
        data: updateData,
        include: {
          _count: {
            select: { leads: true }
          }
        }
      });

      return reply.send(funnel);
    } catch (error) {
      console.error('Update funnel error:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to update funnel'
      });
    }
  }

  static async deleteFunnel(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.userId;
      const { id } = funnelParamsSchema.parse(request.params);
      
      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      // Check if funnel exists and belongs to user
      const existingFunnel = await prisma.funnel.findFirst({
        where: { id, userId }
      });

      if (!existingFunnel) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Funnel not found'
        });
      }

      await prisma.funnel.delete({
        where: { id }
      });

      return reply.status(204).send();
    } catch (error) {
      console.error('Delete funnel error:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to delete funnel'
      });
    }
  }

  static async getPublicFunnel(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = funnelParamsSchema.parse(request.params);

      const funnel = await prisma.funnel.findFirst({
        where: { 
          id,
          isPublished: true 
        },
        select: {
          id: true,
          title: true,
          description: true,
          config: true,
          createdAt: true
        }
      });

      if (!funnel) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Funnel not found or not published'
        });
      }

      return reply.send(funnel);
    } catch (error) {
      console.error('Get public funnel error:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch funnel'
      });
    }
  }

  static async getFunnelAnalytics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.userId;
      const { id } = funnelParamsSchema.parse(request.params);
      
      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      // Check if funnel exists and belongs to user
      const funnel = await prisma.funnel.findFirst({
        where: { id, userId },
        include: {
          leads: true
        }
      });

      if (!funnel) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Funnel not found'
        });
      }

      // Calculate basic analytics
      const totalLeads = funnel.leads.length;
      const totalViews = totalLeads * 1.5; // Placeholder - would track actual views
      const conversionRate = totalViews > 0 ? (totalLeads / totalViews) * 100 : 0;

      const analytics: FunnelAnalytics = {
        totalViews: Math.round(totalViews),
        totalLeads,
        conversionRate: Math.round(conversionRate * 100) / 100,
        stepAnalytics: [] // Would implement step-by-step analytics
      };

      return reply.send(analytics);
    } catch (error) {
      console.error('Get funnel analytics error:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch analytics'
      });
    }
  }
}
