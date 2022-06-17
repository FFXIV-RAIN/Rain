import { Client, Intents } from 'discord.js';
import { CONFIG } from './config';

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
    
    client.on('ready', async () => {
        if (!client.user || !client.application) return;
    
        console.log(`${client.user.username} is online.`);
    });
    
    await client.login(CONFIG.DISCORD_TOKEN);

    return client;
}