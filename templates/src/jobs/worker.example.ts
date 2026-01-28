/**
 * Example BullMQ worker. Use when background job queue is enabled.
 * Configure REDIS_URL for the queue connection.
 */

import { Worker } from 'bullmq';
import { connection } from './producer.example.js';

const worker = new Worker(
  'example-queue',
  async (job) => {
    console.log('Processing job', job.id, job.data);
    return { done: true };
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log('Job completed', job.id);
});

worker.on('failed', (job, err) => {
  console.error('Job failed', job?.id, err);
});

export { worker };
