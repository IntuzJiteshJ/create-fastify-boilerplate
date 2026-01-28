/**
 * Copies base project structure from templates into projectPath.
 * Includes optional src/cache and src/jobs only when context.options.redis / .queue are set.
 */

import { join } from 'path';
import { cp, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { getTemplatesPath } from './utils.js';

/**
 * Recursively copy a directory. Creates destination if needed.
 * @param {string} src
 * @param {string} dest
 */
async function copyDir(src, dest) {
  if (!existsSync(src)) return;
  await mkdir(dest, { recursive: true });
  await cp(src, dest, { recursive: true });
}

/**
 * @param {{ projectPath: string, options: { redis: boolean, queue: boolean } }} context
 */
export async function scaffoldStructure(context) {
  const { projectPath, options } = context;
  const templates = getTemplatesPath();
  const srcDest = join(projectPath, 'src');

  await mkdir(srcDest, { recursive: true });

  // Base src layout: app, config, database, index.ts
  await copyDir(join(templates, 'src', 'app'), join(srcDest, 'app'));
  await copyDir(join(templates, 'src', 'config'), join(srcDest, 'config'));
  await copyDir(join(templates, 'src', 'database'), join(srcDest, 'database'));

  const indexSrc = join(templates, 'src', 'index.ts');
  if (existsSync(indexSrc)) {
    const { copyFile } = await import('fs/promises');
    await copyFile(indexSrc, join(srcDest, 'index.ts'));
  }

  if (options.redis) {
    await copyDir(join(templates, 'src', 'cache'), join(srcDest, 'cache'));
  }

  if (options.queue) {
    await copyDir(join(templates, 'src', 'jobs'), join(srcDest, 'jobs'));
  }

  await copyDir(join(templates, 'tests'), join(projectPath, 'tests'));
  await copyDir(join(templates, 'scripts'), join(projectPath, 'scripts'));
}
