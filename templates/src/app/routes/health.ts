/**
 * Health check endpoint for load balancers and monitoring.
 */

import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export async function healthRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok' });
  });
}
