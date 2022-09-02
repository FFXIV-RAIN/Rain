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
    CLIENT_ID: string;
    DISCORD_TOKEN: string;
    DATABASE_URL: string;
    ENVIRONMENT: Environment;
    LOG_LEVEL: LOG_LEVEL;
    IS_LIVE: boolean;
    VERSION: string;
}

export interface FeatureFlags {
    AUTO_ROLE: boolean;
    WELCOME: boolean;
}

const CLIENT_IDS: {
    [key in Environment]: string;
} = {
    [Environment.LIVE]: '966131732476739595',
    [Environment.LOCAL]: '966202122599292948'
};

const ENVIRONMENT = get<Environment>(Environment.LOCAL, 'ENVIRONMENT');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) throw new Error(`Token cannot be null or undefined`);

export const CONFIG: Config = {
    CLIENT_ID: CLIENT_IDS[ENVIRONMENT],
    DISCORD_TOKEN,
    DATABASE_URL: get('sqlite::memory:', 'DATABASE_URL'),
    ENVIRONMENT,
    LOG_LEVEL: get<LOG_LEVEL>(LOG_LEVEL.INFO, 'LOG_LEVEL'),
    IS_LIVE: ENVIRONMENT === Environment.LIVE,
    // TODO: Make this read the latest git tag and use 'local' otherwise
    VERSION: '0.2.0',
}