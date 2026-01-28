/**
 * Creates project directory, initial package.json, git init, and .gitignore.
 * Fails if directory already exists (idempotent-safe: no overwrite).
 */

import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { execa } from 'execa';
/**
 * @param {import('./index.js').Context} context
 */
export async function initProject(context) {
  const { projectName, projectPath } = context;

  if (existsSync(projectPath)) {
    throw new Error(
      `Directory "${projectName}" already exists. Choose another name or remove it.`
    );
  }

  await mkdir(projectPath, { recursive: true });

  // package.json: ESM for Node 18+, top-level await, alignment with TS/ESLint
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    // type: "module" — ESM for Node 18+, top-level await, and alignment with TS/ESLint
    type: 'module',
    engines: { node: '>=18' },
    scripts: {
      dev: 'nodemon --exec node --loader ts-node/esm src/index.ts',
      build: 'tsc',
      start: 'node dist/index.js',
      test: 'vitest run',
      'test:watch': 'vitest',
      'test:coverage': 'vitest run --coverage',
      'test:mutation': 'stryker run',
      lint: 'eslint . --max-warnings 0',
      'lint:fix': 'eslint . --fix',
      format: 'prettier --write .',
      'format:check': 'prettier --check .',
      'typecheck': 'tsc --noEmit',
    },
  };

  await writeFile(
    join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  const gitignore = `# Dependencies
node_modules/

# Build
dist/
build/

# Environment
.env
.env.local
.env.*.local

# Coverage and mutation
coverage/
.stryker-tmp/

# Logs and OS
*.log
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.swp
*.swo
`;

  await writeFile(join(projectPath, '.gitignore'), gitignore);

  await execa('git', ['init'], { cwd: projectPath, stdio: 'inherit' });
}
