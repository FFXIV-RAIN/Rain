import { Environment } from './types/environment';
import { LOG_LEVEL } from './types/logger'

export function isFeatureFlagEnabled(config: Config, name: string) {
    return config.IS_LIVE || Boolean(process.env[`FF_${name}`]);
}

export interface Config {
    ENVIRONMENT: Environment;
    LOG_LEVEL: LOG_LEVEL;
    REDIS_URL: string | null;
    IS_LIVE: boolean;
}

export interface FeatureFlags {
    AUTO_ROLE: boolean;
}

const environment = process.env.ENVIRONMENT as Environment || Environment.LOCAL;

export const CONFIG: Config = {
    ENVIRONMENT: environment,
    LOG_LEVEL: LOG_LEVEL.INFO,
    REDIS_URL: process.env.REDISTOGO_URL || process.env.REDIS_URL || null, 
    IS_LIVE: environment === Environment.LIVE,
}

export const FEATURE_FLAGS: FeatureFlags = {
    AUTO_ROLE: isFeatureFlagEnabled(CONFIG, 'AUTO_ROLE'),
}