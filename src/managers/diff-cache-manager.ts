import { GuildMember, PartialGuildMember } from 'discord.js';
import { debounce } from '../utils/debounce';
import { RoleDiff } from '../utils/role-diff';

export class DiffCacheManager {
    private static diffs: {
        [key: string]: RoleDiff;
    } = {};

    public static diff(member: GuildMember | PartialGuildMember): RoleDiff;
    public static diff(member: GuildMember | PartialGuildMember, diff: RoleDiff|null): null;
    public static diff(member: GuildMember | PartialGuildMember, diff?: RoleDiff|null): RoleDiff|null {
        if (diff instanceof RoleDiff) {
            DiffCacheManager.diffs[member.id] = diff;
        } else if (diff === null) {
            delete DiffCacheManager.diffs[member.id];
        } else {
            if (!DiffCacheManager.diffs[member.id]) {
                DiffCacheManager.diffs[member.id] = new RoleDiff();
            }

            return DiffCacheManager.diffs[member.id];
        }

        return null;
    }

    static commit(member: GuildMember | PartialGuildMember) {
        const diff = DiffCacheManager.diff(member);

        if (!diff) return;

        debounce(`commit-${member.id}`, async () => {
            await diff.commit(member);

            DiffCacheManager.diff(member, null);
        });
    }
}