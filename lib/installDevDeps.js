/**
 * Installs dev dependencies (TypeScript, ts-node, nodemon, @types/node)
 * and writes tsconfig.json into the project.
 */

import { execa } from 'execa';
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { getTemplatesPath } from './utils.js';

const DEV_DEPS = [
  'typescript',
  'ts-node',
  'nodemon',
  '@types/node',
];

/**
 * @param {import('./index.js').Context} context
 */
export async function installDevDeps(context) {
  const { projectPath } = context;
  try {
    await execa('npm', ['install', '-D', ...DEV_DEPS], {
      cwd: projectPath,
      stdio: 'inherit',
    });
  } catch (err) {
    throw new Error(`Dev dependencies install failed: ${err.message}`);
  }

  const templates = getTemplatesPath();
  const tsconfigSrc = join(templates, 'tsconfig.json');
  const tsconfigDest = join(projectPath, 'tsconfig.json');
  const content = await readFile(tsconfigSrc, 'utf-8');
  await writeFile(tsconfigDest, content);
}
