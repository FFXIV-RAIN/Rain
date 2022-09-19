import {Op} from 'sequelize';
import {logger} from '../utils/logger';
import {GuildConfig} from '../db/models/Guild/GuildConfig';
import {Guild} from '../db/models/Guild/Guild';
import {WelcomeConfig} from '../db/models/modules/WelcomeConfig';
import {AutoRoleConfig} from '../db/models/modules/AutoRole/AutoRoleConfig';
import {ScheduledMessagesConfig} from '../db/models/modules/ScheduledMessages/ScheduledMessagesConfig';
import {RainBot} from '../@rain/bot';

export async function setup(...guilds: string[]) {
    await Guild.bulkCreate(guilds.map((guildId) => ({
        id: guildId,
    })));

    await Promise.all([
        GuildConfig.bulkCreate(guilds.map((guildId) => ({
            guildId,
        }))),

        WelcomeConfig.bulkCreate(guilds.map((guildId) => ({
            guildId,
            enabled: false,
        }))),

        AutoRoleConfig.bulkCreate(guilds.map((guildId) => ({
            guildId,
            enabled: false,
            joinRoles: []
        }))),

        ScheduledMessagesConfig.bulkCreate(guilds.map((guildId) => ({
            guildId,
            enabled: false,
        })))
    ]);
}

export async function startup(bot: RainBot) {
    logger.info('Verifying all guilds are setup ...');

    const guildIds = bot.client.guilds.cache.map((_, id) => id);

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
        await setup(...guildsToSetup);
    }
}