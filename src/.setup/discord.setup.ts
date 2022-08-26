import {Client, Intents} from 'discord.js';
import {CONFIG} from '../config';

export async function setup() {
    const client = new Client({
        partials: [
            'GUILD_MEMBER',
        ],
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
        ]
   });
    
    await client.login(CONFIG.DISCORD_TOKEN);

    return client;
}