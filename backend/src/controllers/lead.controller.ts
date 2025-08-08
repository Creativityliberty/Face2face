import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../utils/database';

// Validation schemas
const createLeadSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  answers: z.any().optional(),
  funnelId: z.string().cuid()
});

const leadParamsSchema = z.object({
  funnelId: z.string().cuid()
});

const exportQuerySchema = z.object({
  format: z.enum(['json', 'csv']).default('json')
});

export class LeadController {
  static async createLead(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, email, phone, answers, funnelId } = createLeadSchema.parse(request.body);

      // Check if funnel exists and is published
      const funnel = await prisma.funnel.findFirst({
        where: { 
          id: funnelId,
          isPublished: true 
        }
      });

      if (!funnel) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Funnel not found or not published'
        });
      }

      const lead = await prisma.lead.create({
        data: {
          name,
          email,
          phone,
          answers,
          funnelId
        }
      });

      return reply.status(201).send(lead);
    } catch (error) {
      console.error('Create lead error:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to create lead'
      });
    }
  }

  static async getFunnelLeads(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.userId;
      const { funnelId } = leadParamsSchema.parse(request.params);
      
      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      // Check if funnel belongs to user
      const funnel = await prisma.funnel.findFirst({
        where: { 
          id: funnelId,
          userId 
        }
      });

      if (!funnel) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Funnel not found'
        });
      }

      const leads = await prisma.lead.findMany({
        where: { funnelId },
        orderBy: { createdAt: 'desc' }
      });

      return reply.send(leads);
    } catch (error) {
      console.error('Get funnel leads error:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch leads'
      });
    }
  }

  static async exportLeads(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.userId;
      const { funnelId } = leadParamsSchema.parse(request.params);
      const { format } = exportQuerySchema.parse(request.query);
      
      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      // Check if funnel belongs to user
      const funnel = await prisma.funnel.findFirst({
        where: { 
          id: funnelId,
          userId 
        }
      });

      if (!funnel) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Funnel not found'
        });
      }

      const leads = await prisma.lead.findMany({
        where: { funnelId },
        orderBy: { createdAt: 'desc' }
      });

      if (format === 'csv') {
        // Convert to CSV format
        const csvHeaders = ['Name', 'Email', 'Phone', 'Created At', 'Answers'];
        const csvRows = leads.map((lead: any) => [
          lead.name || '',
          lead.email || '',
          lead.phone || '',
          lead.createdAt.toISOString(),
          JSON.stringify(lead.answers || {})
        ]);

        const csvContent = [
          csvHeaders.join(','),
          ...csvRows.map((row: string[]) => row.map((field: string) => `"${field}"`).join(','))
        ].join('\n');

        reply.header('Content-Type', 'text/csv');
        reply.header('Content-Disposition', `attachment; filename="funnel-${funnelId}-leads.csv"`);
        return reply.send(csvContent);
      }

      return reply.send(leads);
    } catch (error) {
      console.error('Export leads error:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to export leads'
      });
    }
  }

  static async getLeadStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.userId;
      
      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      // Get lead statistics for user's funnels
      const stats = await prisma.lead.groupBy({
        by: ['funnelId'],
        where: {
          funnel: {
            userId
          }
        },
        _count: {
          id: true
        },
        _min: {
          createdAt: true
        },
        _max: {
          createdAt: true
        }
      });

      const totalLeads = await prisma.lead.count({
        where: {
          funnel: {
            userId
          }
        }
      });

      // Get leads from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentLeads = await prisma.lead.count({
        where: {
          funnel: {
            userId
          },
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      });

      return reply.send({
        totalLeads,
        recentLeads,
        funnelStats: stats
      });
    } catch (error) {
      console.error('Get lead stats error:', error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch lead statistics'
      });
    }
  }
}
