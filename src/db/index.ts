import { Sequelize } from 'sequelize-typescript'
import { logger } from '../utils/logger';

export const db = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  models: [__dirname + '/models'],
  logging: logger.trace.bind(logger)
});

export async function setup() {
    await db.sync({
        alter: true,
    });

    return db;
}