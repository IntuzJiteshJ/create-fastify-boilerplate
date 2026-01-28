/**
 * Copies .github/PULL_REQUEST_TEMPLATE.md from templates into the project.
 */

import { join } from 'path';
import { copyFile, mkdir } from 'fs/promises';
import { getTemplatesPath } from './utils.js';

/**
 * @param {{ projectPath: string }} context
 */
export async function copyPrTemplate(context) {
  const { projectPath } = context;
  const templates = getTemplatesPath();
  const src = join(templates, '.github', 'PULL_REQUEST_TEMPLATE.md');
  const destDir = join(projectPath, '.github');
  const dest = join(destDir, 'PULL_REQUEST_TEMPLATE.md');

  const { existsSync } = await import('fs');
  if (!existsSync(src)) return;

  await mkdir(destDir, { recursive: true });
  await copyFile(src, dest);
}
