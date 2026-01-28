/**
 * Shared utilities for the CLI: logging and path resolution.
 */

import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Log a step message with consistent styling.
 * @param {string} message
 */
export function logStep(message) {
  console.log(chalk.cyan('›'), message);
}

/**
 * Resolve the directory containing the CLI package (for templates).
 * Works when running via npx or node.
 * @returns {string} Absolute path to the CLI root
 */
export function getCliRoot() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // lib/utils.js -> backend/
  return join(__dirname, '..');
}

/**
 * Path to the templates directory inside the CLI package.
 * @returns {string}
 */
export function getTemplatesPath() {
  return join(getCliRoot(), 'templates');
}
