#!/usr/bin/env node

/**
 * create-fastify-boilerplate CLI entry point.
 * Validates Node version (>=18) and delegates to the main orchestration flow.
 */

import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const MIN_NODE_MAJOR = 18;

const nodeVersion = process.version.slice(1);
const nodeMajor = parseInt(nodeVersion.split('.')[0], 10);

if (nodeMajor < MIN_NODE_MAJOR) {
  console.error(
    `Error: create-fastify-boilerplate requires Node.js ${MIN_NODE_MAJOR} or later. You have ${process.version}.`
  );
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const libPath = join(__dirname, '..', 'lib', 'index.js');
const libUrl = pathToFileURL(libPath).href;

import(libUrl).then(({ main }) => main()).catch((err) => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
