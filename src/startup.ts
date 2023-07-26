// import {ActivityType, Partials} from 'discord.js';
// import {RainBot} from '@rain/bot';
import {dbSetup} from './.setup';
// import {dbSetup, guildsStartup, guildsSetup} from './.setup';
import {commands} from './commands';
import {CONFIG} from './config';
// import {modules} from './modules';
// import {GuildService} from './services/GuildService';
// import {logger} from './utils/logger';
import {Flarie, Logger} from '@flarie/core';
import {DiscordPlatform, Partials} from '@flarie/discord';

export async function startup() {
    Logger.info(`Starting up Rain v${CONFIG.VERSION}`);

    await dbSetup();

    const flarie = new Flarie({
        platform: new DiscordPlatform({
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
        commands,
        level: CONFIG.LOG_LEVEL
    });

    flarie.on('ready', () => {
      flarie.send('966502697341698108', '987612495625719829', 'Rawr!');
    });

    // const [bot, commands] = await Promise.all([
    //     RainBot.Initialize({
    //         clientId: CONFIG.DISCORD_CLIENT_ID,
    //         token: CONFIG.DISCORD_TOKEN,
    //         partials: [
    //             Partials.GuildMember,
    //         ],
    //         intents: [
    //             'Guilds',
    //             'GuildMembers',
    //         ]
    //     }),
    //     getRainCommands(),
    //     dbSetup()
    // ]);

    // logger.info('Initializing post startup setup...');

    // bot.setStatus('online');
    // bot.setActivity(ActivityType.Listening, 'your hopes and dreams~');

    // await Promise.all([
    //     bot.commands.publish(commands),
    //     guildsStartup(bot),
    // ]);

    // logger.info('Starting up modules...');

    // bot.addModules(modules);

    // if (!bot.authenticated) {
    //     logger.error('Failed to authenticate, shutting down...');
    //     process.exit(1);
    // }

    // logger.info(`${bot.username} is online.`);
    // logger.info(`Invite Link: https://discord.com/api/oauth2/authorize?client_id=${CONFIG.DISCORD_CLIENT_ID}&permissions=8&scope=bot`)

    // bot.client.on('guildCreate', (guild) => guildsSetup(guild.id));
    // bot.client.on('guildDelete', (guild) => GuildService.setInactiveStatus(guild.id, true));
}

startup();

// process.on('SIGTERM', () => {
//     logger.info('Acknowledged request for the heat death of the universe, terminating...');
// });
