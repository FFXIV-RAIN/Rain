import { Sequelize } from 'sequelize-typescript'
import { logger } from '../utils/logger';
import { CONFIG } from '../config';

export const db = new Sequelize(CONFIG.DATABASE_URL, {
  models: [__dirname + '/models/**/*.ts'],
  logging: logger.trace.bind(logger),
  sync: {
    alter: true,
  },
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

export async function setup() {
  logger.info('Syncing database...');

  await db.sync();

  logger.info('Database synced!');

  return db;
}