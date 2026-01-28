/**
 * Installs StrykerJS and configures it for TypeScript + Vitest with
 * mutation score threshold 60%. Adds test:mutation script.
 */

import { execa } from 'execa';
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';

/**
 * @param {{ projectPath: string }} context
 */
export async function setupStryker(context) {
  const { projectPath } = context;

  await execa(
    'npm',
    ['install', '-D', '@stryker-mutator/core', '@stryker-mutator/vitest-runner', '@stryker-mutator/typescript-checker'],
    { cwd: projectPath, stdio: 'inherit' }
  ).catch((err) => {
    throw new Error(`Stryker install failed: ${err.message}`);
  });

  const strykerConfig = `/** @type { import('@stryker-mutator/core').StrykerOptions } */
export default {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'vitest',
  vitest: { configFile: 'vitest.config.ts' },
  typescriptChecker: {},
  mutate: ['src/**/*.ts', '!src/**/*.test.ts', '!**/node_modules/**'],
  thresholds: { high: 80, low: 60, break: 60 },
};
`;
  await writeFile(join(projectPath, 'stryker.config.js'), strykerConfig);

  const pkgPath = join(projectPath, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
  if (!pkg.scripts['test:mutation']) {
    pkg.scripts['test:mutation'] = 'stryker run';
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2));
  }

  // Document that mutation tests are intended for nightly CI
  const { mkdir } = await import('fs/promises');
  await mkdir(join(projectPath, 'docs'), { recursive: true });
  const mutationDoc = `# Mutation testing

Mutation tests are run with StrykerJS (\`npm run test:mutation\`).

They are intended for **nightly CI** execution rather than every commit, due to runtime.
Minimum mutation score threshold is 60%.
`;
  await writeFile(join(projectPath, 'docs', 'mutation-testing.md'), mutationDoc);
}
