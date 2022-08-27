import {RainCommand} from '../../types/command';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';

const COMMAND_DIR = __dirname;
let cache: RainCommand[] | null = null;

export async function getRainCommands() {
    logger.silly('[getRainCommands] Checking cache...');

    if (cache === null) {
        logger.info('Discovering commands...');
        const files = await fs.readdir(COMMAND_DIR);
        const commandFiles = files.filter((file) => file !== 'index.ts' && file.endsWith('.ts'));

        logger.info(`Discovered ${commandFiles.length} command(s)...`);
    
        cache = await Promise.all(commandFiles.map(async (file) => {
            const {command} = await import(path.join(COMMAND_DIR, file));
            return command;
        }));
    }

    return cache;
}