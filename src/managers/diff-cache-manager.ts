import { GuildMember, PartialGuildMember } from 'discord.js';
import { debounce } from '../utils/debounce';
import { RoleDiff } from '../utils/role-diff';

export class DiffCacheManager {
    private static diffs: {
        [key: string]: RoleDiff;
    } = {};

    public static diff(id: string): RoleDiff;
    public static diff(id: string, diff: RoleDiff|null): null;
    public static diff(id: string, diff?: RoleDiff|null): RoleDiff|null {
        if (diff instanceof RoleDiff) {
            DiffCacheManager.diffs[id] = diff;
        } else if (diff === null) {
            delete DiffCacheManager.diffs[id];
        } else {
            if (!DiffCacheManager.diffs[id]) {
                DiffCacheManager.diffs[id] = new RoleDiff();
            }

            return DiffCacheManager.diffs[id];
        }

        return null;
    }

    static submit(id: string, member: GuildMember | PartialGuildMember) {
        const diff = DiffCacheManager.diff(id);

        if (!diff) return;

        debounce(`submit-${id}`, async () => {
            await diff.submit(member);

            DiffCacheManager.diff(id, null);
        });
    }
}