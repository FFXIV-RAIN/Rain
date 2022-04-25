import { Client, GuildMember, PartialGuildMember } from 'discord.js';
import { ROLES, STAFF_ROLES } from '../roles';
import { ROLE_CHANGED, wasAnyRoleChanged } from '../utils/roles';

export class AutoRolesDiff {
    private _added: ROLES[] = [];
    private _removed: ROLES[] = [];

    add(...roles: ROLES[]) {
        for (const role of roles) {
            const removedIndex = this._removed.indexOf(role);

            if (removedIndex !== -1) {
                this._removed.splice(removedIndex, 1);
            }

            if (this._added.includes(role)) continue;

            this._added.push(role);
        }
    }
    
    remove(...roles: ROLES[]) {
        for (const role of roles) {
            const addedIndex = this._added.indexOf(role);

            if (addedIndex !== -1) {
                this._added.splice(addedIndex, 1);
            }

            if (this._removed.includes(role)) continue;

            this._removed.push(role);
        }
    }

    get added(): ROLES[] {
        return this._added;
    }

    get removed(): ROLES[] {
        return this._removed;
    }
}

export async function submitDiff(diff: AutoRolesDiff, member: GuildMember | PartialGuildMember) {
    const promises = [];

    if (diff.added.length) {
        console.log(`Auto adding roles from ${member.user.id}: ${diff.added.join(',')}...`);

        promises.push(member.roles.add(diff.added));
    }

    if (diff.removed.length) {
        console.log(`Auto removing roles from ${member.user.id}: ${diff.added.join(',')}...`);
        
        promises.push(member.roles.remove(diff.removed));
    }

    await Promise.all(promises);
}

export function autoVerify(diff: AutoRolesDiff, oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
    if (oldMember.pending && !newMember.pending) {
        console.log('User verified, adding roles...');

        diff.add(
            ROLES.GUESTS,
            ROLES.PRONOUNS_HEADER,
            ROLES.PRONOUNS_FOOTER,
        );
    }
}

export function autoGuestStaff(diff: AutoRolesDiff, oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
    const STAFF_CHANGED = wasAnyRoleChanged(oldMember, newMember, STAFF_ROLES);

    if (STAFF_CHANGED === ROLE_CHANGED.ADDED) {
        diff.remove(ROLES.GUESTS);
        diff.add(ROLES.STAFF);
    } else if (STAFF_CHANGED === ROLE_CHANGED.REMOVED) {
        diff.remove(ROLES.STAFF);
        diff.add(ROLES.GUESTS);
    }
}

export async function onGuildMemberUpdate(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
    const diff = new AutoRolesDiff();

    autoVerify(diff, oldMember, newMember);
    autoGuestStaff(diff, oldMember, newMember);

    await submitDiff(diff, newMember);
}

export async function onGuildMemberAdd(member: GuildMember | PartialGuildMember) {
    const diff = new AutoRolesDiff();

    // TODO: Remove once Sapphire supports Bot Join Roles
    if (member.user.bot) {
        diff.add(ROLES.BOTS);
    }

    await submitDiff(diff, member);
}

export function autoRoleSetup(client: Client) {
    client.on('guildMemberAdd', onGuildMemberAdd);
    client.on('guildMemberUpdate', onGuildMemberUpdate);
}