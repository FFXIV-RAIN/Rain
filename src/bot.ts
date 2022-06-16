import { Client, Intents } from 'discord.js';
import { CONFIG } from './config';
import { autoRoleSetup } from './bot/auto-role';
import { welcomeSetup } from './bot/welcome';

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

    await Promise.all([
        autoRoleSetup(client),
        welcomeSetup(client),
    ]);
});


client.login(CONFIG.DISCORD_TOKEN);