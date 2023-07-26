import { config } from 'dotenv';
import { LogLevel } from '@flarie/core';
import { Environment } from './@types/environment';

export function isFeatureFlagEnabled(name: string) {
  return Boolean(process.env[`FF_${name}`] || 'true');
}

export function get<T = string>(defaultValue: T, ...names: string[]): T {
  for (const name of names) {
    const value = process.env[name];

    if (!value) continue;

    return value as unknown as T;
  }

  return defaultValue;
}

export interface Config {
  DISCORD_CLIENT_ID: string;
  DISCORD_TOKEN: string;
  DATABASE_URL: string;
  ENVIRONMENT: Environment;
  LOG_LEVEL: LogLevel;
  IS_LIVE: boolean;
  VERSION: string;
  VERSION_LINK: string;
}

export interface FeatureFlags {
  AUTO_ROLE: boolean;
  WELCOME: boolean;
}

const ENVIRONMENT = get<Environment>(Environment.LOCAL, 'ENVIRONMENT');

config({
  path: `.env.${ENVIRONMENT}`,
});

const REQUIRED_KEYS: (keyof Config)[] = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID'];

const missingKeys = REQUIRED_KEYS.filter((key) => !process.env[key]);

if (missingKeys.length) {
  console.error(
    `The following environment variables were missing! ("${missingKeys.join('", "')}")`
  );
  process.exit(1);
}

const VERSION = get('local', 'RENDER_GIT_COMMIT');

export const CONFIG: Config = {
  // TODO: Figure out how to get Typescript to respect the required keys above
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID as string,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN as string,
  DATABASE_URL: get('sqlite::memory:', 'DATABASE_URL'),
  ENVIRONMENT,
  LOG_LEVEL: get<LogLevel>(LogLevel.INFO, 'LOG_LEVEL'),
  IS_LIVE: ENVIRONMENT === Environment.LIVE,
  VERSION,
  VERSION_LINK: VERSION
    ? `https://github.com/rain-cafe-xiv/rain-bot/commit/${VERSION}`
    : 'https://github.com/rain-cafe-xiv/rain-bot',
};
