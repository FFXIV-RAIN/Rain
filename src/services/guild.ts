import { Client } from 'discord.js';
import { Op } from 'sequelize';
import { logger } from '../utils/logger';
import { Config } from '../db/models/Config';
import { Guild } from '../db/models/Guild';
import { WelcomeConfig } from '../db/models/modules/WelcomeConfig';
import { AutoRoleConfig } from '../db/models/modules/AutoRoleConfig';

export async function setup(client: Client) {
    logger.info('Verifying all guilds are setup ...');

    const guildIds = client.guilds.cache.map((_, id) => id);

    const guilds = await Guild.findAll({
        attributes: ['id'],
        where: {
            id: {
                [Op.in]: guildIds
            }
        }
    });

    // Find the IDs that don't have a guild yet.
    const guildsToSetup = guildIds.filter((guildId) => 
        !guilds.find((guild) => guild.id === guildId)
    );

    logger.info(`Determined ${guildsToSetup.length} guild(s) need to be set up`);

    if (guildsToSetup.length > 0) {
        await Guild.bulkCreate(guildsToSetup.map((guildId) => ({
            id: guildId,
        })));
    
        await Config.bulkCreate(guildsToSetup.map((guildId) => ({
            guildId,
        })));
    
        await WelcomeConfig.bulkCreate(guildsToSetup.map((guildId) => ({
            guildId,
        })));
    
        await AutoRoleConfig.bulkCreate(guildsToSetup.map((guildId) => ({
            guildId,
            enabled: true,
            joinRoles: [
                '966503428429856768'
            ]
        })));
    }
}