import { dbSetup, discordSetup, guildsStartup, guildsSetup } from './.setup';
import { setups } from './modules';
import { Guilds } from './services/guilds.service';
import { logger } from './utils/logger';

export async function setup() {
    const [bot] = await Promise.all([
        discordSetup(),
        dbSetup()
    ]);

    logger.info('Initializing post startup setup...');

    await Promise.all([
        guildsStartup(bot),
    ]);

    logger.info('Starting up modules...');

    await Promise.all(setups.map((setup) => setup(bot)));

    if (!bot.user) return;

    console.log(`${bot.user.username} is online.`);
    logger.info(`Invite Link: https://discord.com/api/oauth2/authorize?client_id=966131732476739595&permissions=8&scope=bot`)

    bot.on('guildCreate', (guild) => guildsSetup(guild.id));
    bot.on('guildDelete', (guild) => Guilds.setInactiveStatus(guild.id, true));
}

setup();