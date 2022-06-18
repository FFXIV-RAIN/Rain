import { Sequelize } from 'sequelize-typescript'
import { logger } from '../utils/logger';
import { CONFIG } from '../config';

export const db = new Sequelize(CONFIG.DATABASE_URL, {
  models: [__dirname + '/models/**/*.ts'],
  logging: logger.silly.bind(logger),
  sync: {
    alter: true,
  },
  define: {
    underscored: true,
  },
  dialectOptions: {
    ssl: CONFIG.DATABASE_URL.includes('localhost') ? false : {
      rejectUnauthorized: false
    }
  }
});