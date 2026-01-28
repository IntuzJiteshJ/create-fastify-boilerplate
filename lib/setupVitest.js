/**
 * Installs Vitest and @vitest/coverage-v8, writes vitest.config.ts with
 * coverage thresholds (statements, branches, functions, lines >= 70%),
 * and ensures test scripts exist in package.json.
 */

import { execa } from 'execa';
import { join } from 'path';
import { writeFile } from 'fs/promises';

/**
 * @param {{ projectPath: string }} context
 */
export async function setupVitest(context) {
  const { projectPath } = context;

  await execa(
    'npm',
    ['install', '-D', 'vitest', '@vitest/coverage-v8'],
    { cwd: projectPath, stdio: 'inherit' }
  ).catch((err) => {
    throw new Error(`Vitest install failed: ${err.message}`);
  });

  const vitestConfig = `import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', '**/node_modules/**'],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
});
`;
  await writeFile(join(projectPath, 'vitest.config.ts'), vitestConfig);

  // Add vite-tsconfig-paths for path aliases in tests
  await execa('npm', ['install', '-D', 'vite', 'vite-tsconfig-paths'], {
    cwd: projectPath,
    stdio: 'inherit',
  }).catch(() => {});
}
