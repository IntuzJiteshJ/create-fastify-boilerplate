/**
 * Sequelize initialization. Use this to create the Sequelize instance and sync/migrate.
 */

import { Sequelize } from 'sequelize';

const databaseUrl = process.env.DATABASE_URL ?? 'postgres://localhost:5432/app';

export const sequelize = new Sequelize(databaseUrl, {
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
  },
});

export async function connectDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    throw err;
  }
}
