/**
 * Installs and configures Husky, ESLint, and Prettier.
 * Pre-commit: ESLint (--max-warnings 0), tsc --noEmit, Prettier check.
 * Pre-push: npm audit --audit-level=critical.
 */

import { execa } from 'execa';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

/**
 * @param {{ projectPath: string }} context
 */
export async function setupQualityGates(context) {
  const { projectPath } = context;

  // Install lint/format and Husky
  await execa(
    'npm',
    [
      'install',
      '-D',
      'husky',
      'eslint',
      '@eslint/js',
      'typescript-eslint',
      'eslint-config-prettier',
      'prettier',
    ],
    { cwd: projectPath, stdio: 'inherit' }
  ).catch((err) => {
    throw new Error(`Quality gates install failed: ${err.message}`);
  });

  // Husky init
  await execa('npx', ['husky', 'init'], { cwd: projectPath, stdio: 'inherit' }).catch(() => {
    // husky init may fail if no git; we already did git init
  });

  const huskyDir = join(projectPath, '.husky');
  await mkdir(huskyDir, { recursive: true });

  const preCommit = `#!/bin/sh
npm run lint
npm run typecheck
npm run format:check
`;
  await writeFile(join(huskyDir, 'pre-commit'), preCommit, { mode: 0o755 });

  const prePush = `#!/bin/sh
npm audit --audit-level=critical
`;
  await writeFile(join(huskyDir, 'pre-push'), prePush, { mode: 0o755 });

  // ESLint config (flat config for ESLint 9+)
  const eslintConfig = `import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      parserOptions: { project: true },
      globals: { process: 'readonly', __dirname: 'readonly', __filename: 'readonly' },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
`;
  await writeFile(join(projectPath, 'eslint.config.js'), eslintConfig);

  // Prettier config
  const prettierConfig = JSON.stringify(
    { semi: true, singleQuote: true, tabWidth: 2, trailingComma: 'es5' },
    null,
    2
  );
  await writeFile(join(projectPath, '.prettierrc'), prettierConfig);

  // Prettier ignore (node_modules, coverage, etc.)
  const prettierIgnore = `node_modules
coverage
dist
.stryker-tmp
*.min.js
`;
  await writeFile(join(projectPath, '.prettierignore'), prettierIgnore);
}
