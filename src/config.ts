import {Environment} from '../types/environment';
import {LOG_LEVEL} from '../types/logger'

export function isFeatureFlagEnabled(name: string) {
    return Boolean(process.env[`FF_${name}`] || 'true');
}

export function get<T>(defaultValue: T, ...names: string[]): T {
    for (const name of names) {
        const value = process.env[name];

        if (!value) continue;

        return value as unknown as T;
   }

    return defaultValue;
}

export interface Config {
    DATABASE_URL: string;
    DISCORD_TOKEN: string;
    ENVIRONMENT: Environment;
    LOG_LEVEL: LOG_LEVEL;
    IS_LIVE: boolean;
    VERSION: string;
}

export interface FeatureFlags {
    AUTO_ROLE: boolean;
    WELCOME: boolean;
}

const ENVIRONMENT = get<Environment>(Environment.LOCAL, 'ENVIRONMENT');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) throw new Error(`Token cannot be null or undefined`);

export const CONFIG: Config = {
    DISCORD_TOKEN,
    DATABASE_URL: get('sqlite::memory:', 'DATABASE_URL'),
    ENVIRONMENT,
    LOG_LEVEL: get<LOG_LEVEL>(LOG_LEVEL.INFO, 'LOG_LEVEL'),
    IS_LIVE: ENVIRONMENT === Environment.LIVE,
    // TODO: Make this read the latest git tag and use 'local' otherwise
    VERSION: '0.1.0',
}