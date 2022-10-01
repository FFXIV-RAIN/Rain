import type {BitFieldResolvable, GatewayIntentsString, Partials} from 'discord.js';
import {LOG_LEVEL} from '@rain/logger';

export interface RSConfig {
    clientId: string;
    token: string;
    partials?: Partials[];
    intents: BitFieldResolvable<GatewayIntentsString, number>;
    logLevel?: LOG_LEVEL;
}

export interface SanitizedRSConfig extends RSConfig {
    logLevel: LOG_LEVEL;
}