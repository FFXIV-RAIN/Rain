import {dbSetup, discordSetup, guildsStartup, guildsSetup} from './.setup';
import {RainBot} from './@rain/bot';
import {CONFIG} from './config';
import {modules} from './modules';
import {Guilds} from './services/guilds.service';
import {logger} from './utils/logger';

export async function startup() {
    logger.info(`Starting up Rain v${CONFIG.VERSION}`);

    const [client] = await Promise.all([
        discordSetup(),
        dbSetup()
    ]);

    const bot = new RainBot(client);

    logger.info('Initializing post startup setup...');

    await Promise.all([
        guildsStartup(bot),
    ]);

    logger.info('Starting up modules...');

    bot.addModules(modules);

    if (!bot.client.user) return;

    logger.info(`${bot.client.user.username} is online.`);
    logger.info(`Invite Link: https://discord.com/api/oauth2/authorize?client_id=${CONFIG.CLIENT_ID}&permissions=8&scope=bot`)

    bot.client.on('guildCreate', (guild) => guildsSetup(guild.id));
    bot.client.on('guildDelete', (guild) => Guilds.setInactiveStatus(guild.id, true));
}

startup();