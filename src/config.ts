import { Environment } from './types/environment';
import { LOG_LEVEL } from './types/logger'

export function isFeatureFlagEnabled(name: string) {
    return Boolean(process.env[`FF_${name}`] || 'true');
}

export interface Config {
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

export const CONFIG: Config = {
    ENVIRONMENT: environment,
    LOG_LEVEL: LOG_LEVEL.INFO,
    REDIS_URL: process.env.REDISTOGO_URL || process.env.REDIS_URL || null, 
    IS_LIVE: environment === Environment.LIVE,

    WELCOME_CHANNEL_ID: '965692783589474375',
}

export const FEATURE_FLAGS: FeatureFlags = {
    AUTO_ROLE: isFeatureFlagEnabled('AUTO_ROLE'),
    WELCOME: isFeatureFlagEnabled('WELCOME'),
}