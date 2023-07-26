import {Logger} from '@flarie/core';
import {db} from '../db';

export async function setup() {
    Logger.info('Syncing database...');

    await db.sync();

    Logger.info('Database synced!');

    return db;
 }
