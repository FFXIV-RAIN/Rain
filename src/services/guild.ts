import { Client } from 'discord.js';
import { Op } from 'sequelize';
import { logger } from '../utils/logger';
import { Config } from '../db/models/Config';
import { Guild } from '../db/models/Guild';

export async function setup(client: Client) {
    logger.info('Verifying all guilds are setup ...');

    const guildIDs = client.guilds.cache.map((_, id) => id);

    const guilds = await Guild.findAll({
        attributes: ['id'],
        where: {
            id: {
                [Op.in]: guildIDs
            }
        }
    });

    // Find the IDs that don't have a guild yet.
    const guildsToSetup = guildIDs.filter((guildID) => 
        !guilds.find((guild) => guild.id === guildID)
    );

    logger.info(`Determined ${guildsToSetup.length} guild(s) need to be set up`);

    if (guildsToSetup.length > 0) {
        await Guild.bulkCreate(guildsToSetup.map((guildID) => ({
            id: guildID,
        })));
    
        await Config.bulkCreate(guildsToSetup.map((guildID) => ({
            guildID,
        })));
    }
}