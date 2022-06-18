import { Client, GuildMember, PartialGuildMember } from 'discord.js';
import { RoleDiff } from '../utils/role-diff';
import { DiffCacheManager } from '../managers/diff-cache.manager';
import { logger } from '../utils/logger';
import { Configs } from '../services/configs.service';

export async function autoVerify(diff: RoleDiff, oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
    const config = await Configs.autoRole(newMember.guild.id);

    if (!config || !config.enabled || !config.memberJoinRoles) return;

    // TODO: Verify if this logic works for non-screening discord servers
    if (oldMember.pending && !newMember.pending) {
        logger.info('User verified, adding roles...');

        diff.add(...config.memberJoinRoles);
    }
}

export async function onGuildMemberUpdate(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
    const diff = DiffCacheManager.diff(newMember);

    autoVerify(diff, oldMember, newMember);

    await DiffCacheManager.commit(newMember);
}

export async function onGuildMemberAdd(member: GuildMember | PartialGuildMember) {
    const config = await Configs.autoRole(member.guild.id);

    if (!config || !config.enabled) return;

    const diff = DiffCacheManager.diff(member);

    if (member.user.bot && config.botJoinRoles) {
        diff.add(...config.botJoinRoles);
    }

    await DiffCacheManager.commit(member);
}

export function setup(client: Client) {
    client.on('guildMemberAdd', onGuildMemberAdd);
    client.on('guildMemberUpdate', onGuildMemberUpdate);
}