/**
 * Prompts for optional features: Redis caching and background job queue.
 * Stores choices in context.options (redis, queue).
 */

import { confirm } from '@inquirer/prompts';

/**
 * @param {import('./index.js').Context} context
 */
export async function promptOptionalFeatures(context) {
  context.options.redis = await confirm({
    message: 'Enable Redis-based caching?',
    default: false,
  });

  context.options.queue = await confirm({
    message: 'Enable background job queue?',
    default: false,
  });
}
