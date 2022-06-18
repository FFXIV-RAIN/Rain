import { Client, GuildMember, PartialGuildMember } from 'discord.js';
import { AutoRoleConfig } from '../db/models/modules/AutoRoleConfig';
import { RoleDiff } from '../utils/role-diff';
import { DiffCacheManager } from '../managers/diff-cache.manager';
import { logger } from '../utils/logger';
import { Configs } from '../services/configs.service';

async function autoVerifyBot(config: AutoRoleConfig, diff: RoleDiff, member: GuildMember | PartialGuildMember) {
    if (!config.botJoinRoles) return;

    diff.add(...config.botJoinRoles);
}

async function autoVerifyUser(config: AutoRoleConfig, diff: RoleDiff, oldMember: null | GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
    if (!config.memberJoinRoles) return;

    logger.trace('Old:', oldMember, 'New:', newMember);

    if ((!oldMember || oldMember.pending) && !newMember.pending) {
        logger.info('User verified, adding roles...');

        diff.add(...config.memberJoinRoles);
    }
}

export async function autoVerify(config: AutoRoleConfig, diff: RoleDiff, oldMember: null | GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
    // TODO: Verify if this logic works for non-screening discord servers
    if (newMember.user.bot) {
        autoVerifyBot(config, diff, newMember);
    } else {
        autoVerifyUser(config, diff, oldMember, newMember);
    }
}

export async function onGuildMemberUpdate(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
    const config = await Configs.autoRole(newMember.guild.id);

    if (!config || !config.enabled) return;

    const diff = DiffCacheManager.diff(newMember);

    autoVerify(config, diff, oldMember, newMember);

    await DiffCacheManager.commit(newMember);
}

export async function onGuildMemberAdd(member: GuildMember | PartialGuildMember) {
    const config = await Configs.autoRole(member.guild.id);

    if (!config || !config.enabled) return;

    const diff = DiffCacheManager.diff(member);

    autoVerify(config, diff, null, member);

    await DiffCacheManager.commit(member);
}

export function setup(client: Client) {
    client.on('guildMemberAdd', onGuildMemberAdd);
    client.on('guildMemberUpdate', onGuildMemberUpdate);
}