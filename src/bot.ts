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

    bot.on('guildCreate', (guild) => guildsSetup(guild.id));
    bot.on('guildDelete', (guild) => Guilds.setInactiveStatus(guild.id, true));
}

setup();