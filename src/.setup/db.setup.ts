import { logger } from '../utils/logger';
import { db } from '../db';

export async function setup() {
    logger.info('Syncing database...');
  
    await db.sync();
  
    logger.info('Database synced!');
  
    return db;
  }