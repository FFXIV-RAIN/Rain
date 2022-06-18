import { GuildMember, PartialGuildMember } from 'discord.js';

export enum ROLE_CHANGED {
    ADDED = 1,
    NO_CHANGE = 0,
    REMOVED = -1
}

export function hasRole(member: GuildMember | PartialGuildMember, roleID: string): boolean {
    return member.roles.cache.has(roleID);
}

export function hasAllRoles(member: GuildMember | PartialGuildMember, roleID: string | string[]): boolean {
    const roles = Array.isArray(roleID) ? roleID : [roleID];

    return roles.every((roleID: string) => hasRole(member, roleID));
}

export function hasNoRoles(member: GuildMember | PartialGuildMember, roleID: string | string[]): boolean {
    return !hasAnyRole(member, roleID);
}

export function hasAnyRole(member: GuildMember | PartialGuildMember, roleID: string | string[]): boolean {
    const roles = Array.isArray(roleID) ? roleID : [roleID];

    return roles.some((roleID: string) => hasRole(member, roleID));
}

export function wasAnyRoleChanged(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember, roleID: string | string[]): ROLE_CHANGED {
    const oldHasRole = hasAnyRole(oldMember, roleID);
    const newHasRole = hasAnyRole(newMember, roleID);

    if (oldHasRole === newHasRole) {
        return ROLE_CHANGED.NO_CHANGE;
    } else if (!oldHasRole && newHasRole) {
        return ROLE_CHANGED.ADDED;
    }

    return ROLE_CHANGED.REMOVED;
}

export function wasAnyRoleAdded(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember, roleID: string | string[]): boolean {
    return wasAnyRoleChanged(oldMember, newMember, roleID) === ROLE_CHANGED.ADDED;
}

export function wasAnyRoleRemoved(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember, roleID: string | string[]): boolean {
    return wasAnyRoleChanged(oldMember, newMember, roleID) === ROLE_CHANGED.REMOVED;
}
