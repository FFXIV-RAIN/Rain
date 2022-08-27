import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { CONFIG } from '../config';
import { RainCommand } from '../../types/command';
import { logger } from '../utils/logger';

export class Commands {
    static async deployCommands(commands: RainCommand[]) {
        const rest = new REST({ version: '9' }).setToken(CONFIG.DISCORD_TOKEN);

        try {
            await rest.put(Routes.applicationCommands(CONFIG.CLIENT_ID), { body: [] })

            logger.info('Successfully deleted all application commands.');

            await rest.put(Routes.applicationCommands(CONFIG.CLIENT_ID), {
                body: commands.map(({ data }) => data.toJSON())
            });

            logger.info('Successfully registered application commands.');
        } catch (error) {
            console.error(error);
        }
    }
}