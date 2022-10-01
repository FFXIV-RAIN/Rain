import type {BitFieldResolvable, GatewayIntentsString, Partials} from 'discord.js';

export type RainSharedConfig = {
    clientId: string;
    token: string;
    partials?: Partials[];
    intents: BitFieldResolvable<GatewayIntentsString, number>;
}