import { Logger } from '@flarie/logger';
import { Sequelize } from 'sequelize-typescript';
import { CONFIG } from '../config';

export const db = new Sequelize(CONFIG.DATABASE_URL, {
  models: [__dirname + '/models/**/*.ts'],
  logging: Logger.silly.bind(Logger),
  sync: {
    alter: true,
  },
  define: {
    underscored: true,
  },
  dialectOptions: {
    ssl: CONFIG.DATABASE_URL.includes('localhost')
      ? false
      : {
          rejectUnauthorized: false,
        },
  },
});
