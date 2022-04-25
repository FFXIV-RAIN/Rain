import { Environment } from './types/environment';
import { LOG_LEVEL } from './types/logger'

export function isFeatureFlagEnabled(name: string) {
    return Boolean(process.env[`FF_${name}`] || 'true');
}

export interface Config {
    DISCORD_TOKEN: string;
    ENVIRONMENT: Environment;
    LOG_LEVEL: LOG_LEVEL;
    REDIS_URL: string | null;
    IS_LIVE: boolean;

    WELCOME_CHANNEL_ID: string;
}

export interface FeatureFlags {
    AUTO_ROLE: boolean;
    WELCOME: boolean;
}

const environment = process.env.ENVIRONMENT as Environment || Environment.LOCAL;

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) throw new Error(`Token cannot be null or undefined`);

export const CONFIG: Config = {
    DISCORD_TOKEN,

    ENVIRONMENT: environment,
    LOG_LEVEL: LOG_LEVEL.INFO,
    REDIS_URL: process.env.REDISTOGO_URL || process.env.REDIS_URL || null, 
    IS_LIVE: environment === Environment.LIVE,

    WELCOME_CHANNEL_ID: process.env.WELCOME_CHANNEL_ID || '965692783589474375',
}