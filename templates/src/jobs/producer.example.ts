/**
 * Example BullMQ queue producer. Use when background job queue is enabled.
 */

import { Queue } from 'bullmq';

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';

export const connection = {
  host: redisUrl.includes('://') ? new URL(redisUrl).hostname : 'localhost',
  port: redisUrl.includes('://') ? parseInt(new URL(redisUrl).port || '6379', 10) : 6379,
};

export const exampleQueue = new Queue('example-queue', { connection });

export async function addExampleJob(data: { message: string }): Promise<void> {
  await exampleQueue.add('example-job', data);
}
