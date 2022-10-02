import {Partials} from 'discord.js';
import {RainBot} from '@rain/bot';
import {dbSetup, guildsStartup, guildsSetup} from './.setup';
import {getRainCommands} from './commands';
import {CONFIG} from './config';
import {modules} from './modules';
import {GuildService} from './services/GuildService';
import {logger} from './utils/logger';

export async function startup() {
    logger.info(`Starting up Rain v${CONFIG.VERSION}`);

    const [bot, commands] = await Promise.all([
        RainBot.Initialize({
            clientId: CONFIG.DISCORD_CLIENT_ID,
            token: CONFIG.DISCORD_TOKEN,
            partials: [
                Partials.GuildMember,
            ],
            intents: [
                'Guilds',
                'GuildMembers',
            ]
        }),
        getRainCommands(),
        dbSetup()
    ]);

    logger.info('Initializing post startup setup...');

    await Promise.all([
        bot.commands.publish(commands),
        guildsStartup(bot),
    ]);

    logger.info('Starting up modules...');

    bot.addModules(modules);

    if (!bot.client.user) return;

    logger.info(`${bot.client.user.username} is online.`);
    logger.info(`Invite Link: https://discord.com/api/oauth2/authorize?client_id=${CONFIG.DISCORD_CLIENT_ID}&permissions=8&scope=bot`)

    bot.client.on('guildCreate', (guild) => guildsSetup(guild.id));
    bot.client.on('guildDelete', (guild) => GuildService.setInactiveStatus(guild.id, true));
}

startup();

process.on('SIGTERM', () => {
    logger.info('Acknowledged request for the heat death of the universe, terminating...');
});