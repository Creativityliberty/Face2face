/**
 * Health Check Routes
 * OPS-002: Enhanced healthcheck endpoints with database connectivity, memory, uptime
 */

import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Timestamp de démarrage du serveur
const startTime = Date.now();

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * GET /health
   * Basic health check - Fast response for load balancers
   */
  fastify.get('/health', async (request, reply) => {
    return reply.status(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /health/detailed
   * Detailed health check with database, memory, uptime
   */
  fastify.get('/health/detailed', async (request, reply) => {
    const uptime = Date.now() - startTime;
    const memoryUsage = process.memoryUsage();

    // Check database connectivity
    let dbStatus = 'unknown';
    let dbLatency = 0;

    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStart;
      dbStatus = 'connected';
    } catch (error) {
      fastify.log.error('Database health check failed:', error);
      dbStatus = 'disconnected';
    }

    // Memory usage in MB
    const memory = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // Resident Set Size
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
    };

    // Overall health status
    const isHealthy = dbStatus === 'connected';
    const status = isHealthy ? 'healthy' : 'degraded';

    return reply.status(isHealthy ? 200 : 503).send({
      status,
      timestamp: new Date().toISOString(),
      uptime: {
        milliseconds: uptime,
        seconds: Math.floor(uptime / 1000),
        minutes: Math.floor(uptime / 1000 / 60),
        hours: Math.floor(uptime / 1000 / 60 / 60),
      },
      database: {
        status: dbStatus,
        latencyMs: dbLatency,
      },
      memory: {
        unit: 'MB',
        ...memory,
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        env: process.env.NODE_ENV || 'development',
      },
    });
  });

  /**
   * GET /health/ready
   * Readiness probe - Checks if app is ready to serve traffic
   * Used by Kubernetes/Docker health checks
   */
  fastify.get('/health/ready', async (request, reply) => {
    try {
      // Check database connectivity
      await prisma.$queryRaw`SELECT 1`;

      return reply.status(200).send({
        ready: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      fastify.log.error('Readiness check failed:', error);
      return reply.status(503).send({
        ready: false,
        error: 'Database not available',
        timestamp: new Date().toISOString(),
      });
    }
  });

  /**
   * GET /health/live
   * Liveness probe - Checks if app is alive (not deadlocked)
   * Used by Kubernetes/Docker health checks
   */
  fastify.get('/health/live', async (request, reply) => {
    // Simple check - if this responds, the app is alive
    return reply.status(200).send({
      alive: true,
      timestamp: new Date().toISOString(),
    });
  });
};
