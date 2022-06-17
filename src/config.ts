import { Environment } from './types/environment';
import { LOG_LEVEL } from './types/logger'

export function isFeatureFlagEnabled(name: string) {
    return Boolean(process.env[`FF_${name}`] || 'true');
}

export function get(defaultValue: string, ...names: string[]): string {
    return names.find((name) => process.env[name]) || defaultValue;
}

export interface Config {
    DATABASE_URL: string;
    DISCORD_TOKEN: string;
    ENVIRONMENT: Environment;
    LOG_LEVEL: LOG_LEVEL;
    IS_LIVE: boolean;
}

export interface FeatureFlags {
    AUTO_ROLE: boolean;
    WELCOME: boolean;
}

const ENVIRONMENT = get(Environment.LOCAL, 'ENVIRONMENT') as Environment;

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) throw new Error(`Token cannot be null or undefined`);

export const CONFIG: Config = {
    DISCORD_TOKEN,
    
    DATABASE_URL: get('sqlite::memory:', 'DATABASE_URL'),
    ENVIRONMENT,
    LOG_LEVEL: LOG_LEVEL.INFO,
    IS_LIVE: ENVIRONMENT === Environment.LIVE,
}