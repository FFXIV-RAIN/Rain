import {setup as botSetup} from './discord';
import {setup as dbSetup} from './db';
import {setup as guildSetup} from './services/guild';
import {setup as welcomeSetup} from './modules/welcome';
// import {setup as autoRoleSetup} from './modules/auto-role';
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

    logger.info('Starting up functionality...');

    await Promise.all([
        welcomeSetup(bot),
        // autoRoleSetup(bot),
    ]);
}

setup();