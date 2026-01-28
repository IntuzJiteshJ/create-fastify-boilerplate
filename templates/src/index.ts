/**
 * Application entry point. Loads env, builds the Fastify app, and starts the server.
 */

import 'dotenv/config';
import { buildApp } from './app/server.js';

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

async function start() {
  const app = await buildApp();
  try {
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
