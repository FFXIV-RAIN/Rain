import { GuildMember, PartialGuildMember } from 'discord.js';
import { debounce } from '../utils/debounce';
import { RoleDiff } from '../utils/role-diff';

export class DiffCacheManager {
    private static diffs: {
        [key: string]: RoleDiff;
    } = {};

    public static diff(member: GuildMember|PartialGuildMember): RoleDiff {
        if (!DiffCacheManager.diffs[member.id]) {
            DiffCacheManager.diffs[member.id] = new RoleDiff(member.roles.cache.map((role) => role.id));
        }

        return DiffCacheManager.diffs[member.id];
    }

    static commit(member: GuildMember|PartialGuildMember) {
        const diff = DiffCacheManager.diff(member);

        if (!diff) return;

        debounce(`commit-${member.id}`, async () => {
            await diff.commit(member);

            delete DiffCacheManager.diffs[member.id];
        });
    }
}