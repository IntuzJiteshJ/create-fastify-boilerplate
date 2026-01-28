/**
 * Builds and returns the Fastify application instance.
 * Register plugins and routes here.
 */

import Fastify from 'fastify';
import { healthRoutes } from './routes/health.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(healthRoutes, { prefix: '/' });

  return app;
}
