import {setup as botSetup} from './discord';
import {setup as dbSetup} from './db';
import {setup as guildSetup} from './services/guild';
import { setups } from './modules';
import { logger } from './utils/logger';

export async function setup() {
    const [bot] = await Promise.all([
        botSetup(),
        dbSetup()
    ]);

    logger.info('Initializing post startup setup...');

    await Promise.all([
        guildSetup(bot),
    ]);

    logger.info('Starting up modules...');

    await Promise.all(setups.map((setup) => setup(bot)));
}

setup();