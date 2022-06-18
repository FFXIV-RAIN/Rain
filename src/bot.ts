import { dbSetup, discordSetup, guildsSetup } from './.setup';
import { setups } from './modules';
import { logger } from './utils/logger';

export async function setup() {
    const [bot] = await Promise.all([
        discordSetup(),
        dbSetup()
    ]);

    logger.info('Initializing post startup setup...');

    await Promise.all([
        guildsSetup(bot),
    ]);

    logger.info('Starting up modules...');

    await Promise.all(setups.map((setup) => setup(bot)));

    if (!bot.user) return;

    console.log(`${bot.user.username} is online.`);
}

setup();