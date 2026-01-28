/**
 * Installs core runtime dependencies in the project directory.
 * On failure, throws with an actionable message for the user.
 */

import { execa } from 'execa';

const CORE_DEPS = [
  'fastify@^5',
  'pg@^8',
  'sequelize@^6',
  'sequelize-cli@^6',
  '@auth/core',
  'dotenv',
];

/**
 * @param {import('./index.js').Context} context
 */
export async function installCoreDeps(context) {
  const { projectPath } = context;
  try {
    await execa('npm', ['install', ...CORE_DEPS], {
      cwd: projectPath,
      stdio: 'inherit',
    });
  } catch (err) {
    throw new Error(
      `Core dependencies install failed: ${err.message}. Check network and try again.`
    );
  }
}
