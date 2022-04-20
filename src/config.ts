import { LOG_LEVEL } from './types/logger'

export interface Config {
    logLevel: LOG_LEVEL;
    redisURL: string | null;
}

export const config: Config = {
    logLevel: LOG_LEVEL.INFO,
    redisURL: process.env.REDISTOGO_URL || process.env.REDIS_URL || null, 
}