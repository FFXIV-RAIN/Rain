import { Client } from 'discord.js';
import { autoRoleSetup } from './auto-role';
import { modMailSetup } from './mod-mail';

const client = new Client({
    partials: [
        'GUILD_MEMBER',
    ],
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
    ]
});

client.on('ready', async () => {
    if (!client.user || !client.application) return;

    console.log(`${client.user.username} is online.`);

    await Promise.all([
        autoRoleSetup(client),
        modMailSetup(client),
    ]);
});


client.login(process.env.DISCORD_TOKEN);