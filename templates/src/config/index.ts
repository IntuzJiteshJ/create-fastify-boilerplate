/**
 * Environment and app config. dotenv is loaded from index.ts before this runs.
 */

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT || '3000') || 3000,
  host: process.env.HOST ?? '0.0.0.0',
  // Add database, Redis, etc. as needed
  db: {
    url: process.env.DATABASE_URL ?? '',
  },
} as const;
