/**
 * Prompts for project name and validates it.
 * Rules: only a-z, 0-9, -, _; must start with a letter; length 3–50.
 * Re-prompts on invalid input with a clear message.
 */

import { input } from '@inquirer/prompts';

const PROJECT_NAME_REGEX = /^[a-z][a-z0-9_-]{2,49}$/;
const VALIDATION_MESSAGE =
  'Only lowercase letters, numbers, dashes, and underscores; must start with a letter; 3–50 characters.';

/**
 * Validates project name per requirements.
 * @param {string} name
 * @returns {boolean}
 */
function isValidProjectName(name) {
  if (typeof name !== 'string' || name.length < 3 || name.length > 50) return false;
  if (!/^[a-z]/.test(name)) return false;
  return /^[a-z0-9_-]+$/.test(name);
}

/**
 * Prompts user for project name until valid.
 * @returns {Promise<string>} Valid project name
 */
export async function promptProjectName() {
  const name = await input({
    message: 'Project name:',
    default: 'my-fastify-app',
    validate: (value) => {
      const trimmed = (value || '').trim();
      if (!trimmed) return 'Project name is required.';
      if (!isValidProjectName(trimmed)) return VALIDATION_MESSAGE;
      return true;
    },
  });
  return name.trim();
}
