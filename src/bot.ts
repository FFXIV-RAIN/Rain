import { Client } from 'discord.js';
import { config } from './config';
import { autoRoleSetup } from './funtionality/auto-role';
import { modMailSetup } from './funtionality/mod-mail';
import { logger } from './utils/logger';

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

    const promises = [];

    if (config.isLive) {
        await promises.push(
            config.isLive && autoRoleSetup(client),
            config.isLive && modMailSetup(client),
        );
    } else {
        logger.info('Not running on the live environment, skipping AutoRoles and ModMail setup...');
    }
    
    await Promise.all(promises);
});


client.login(process.env.DISCORD_TOKEN);