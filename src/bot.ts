import { Client, Intents } from 'discord.js';
import { FEATURE_FLAGS } from './config';
import { autoRoleSetup } from './funtionality/auto-role';
import { welcomeSetup } from './funtionality/welcome';

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
        FEATURE_FLAGS.AUTO_ROLE && autoRoleSetup(client),
        FEATURE_FLAGS.WELCOME && welcomeSetup(client),
    ]);
});


client.login(process.env.DISCORD_TOKEN);