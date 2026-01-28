/**
 * Installs optional dependencies (ioredis, bullmq) when the user enabled those features.
 * Example cache/jobs files are copied later by scaffoldStructure.
 */

import { execa } from 'execa';

/**
 * @param {{ projectPath: string, options: { redis: boolean, queue: boolean } }} context
 */
export async function installOptionalDeps(context) {
  const { projectPath, options } = context;

  if (options.redis) {
    await execa('npm', ['install', 'ioredis'], { cwd: projectPath, stdio: 'inherit' }).catch(
      (err) => {
        throw new Error(`Redis dependency install failed: ${err.message}`);
      }
    );
  }

  if (options.queue) {
    await execa('npm', ['install', 'bullmq'], { cwd: projectPath, stdio: 'inherit' }).catch(
      (err) => {
        throw new Error(`BullMQ dependency install failed: ${err.message}`);
      }
    );
  }
}
