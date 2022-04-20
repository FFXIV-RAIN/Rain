import { Environment } from './types/environment';
import { LOG_LEVEL } from './types/logger'

export interface Config {
    environment: Environment;
    logLevel: LOG_LEVEL;
    redisURL: string | null;
    isLive: boolean;
}

const environment = process.env.ENVIRONMENT as Environment || Environment.LOCAL;

export const config: Config = {
    environment,
    logLevel: LOG_LEVEL.INFO,
    redisURL: process.env.REDISTOGO_URL || process.env.REDIS_URL || null, 
    isLive: environment === Environment.LIVE,
}