import { Collection, Guild, GuildMember, GuildMemberRoleManager, Role, Snowflake, User } from 'discord.js'
import { chance } from './chance';

export function mockDiscordMember(overrides?: any): GuildMember {
    return {
        guild: mockDiscordGuild(),
        user: mockDiscordUser(),
        roles: mockDiscordRoles(),
        ...overrides
    } as unknown as GuildMember;
}

export function mockDiscordGuild(overrides?: any): Guild {
    return {
        id: chance.string(),
        ...overrides
    } as unknown as Guild;
}

export function mockDiscordUser(overrides?: any): User {
    return {
        id: chance.string(),
        ...overrides
    } as unknown as User;
}

export function mockDiscordRoles(overrides?: any): GuildMemberRoleManager {
    return {
        add: jest.fn().mockResolvedValue(true),
        remove: jest.fn().mockResolvedValue(true),
        set: jest.fn().mockResolvedValue(true),
        cache: mockDiscordRoleCache(),
        ...overrides
    } as unknown as GuildMemberRoleManager;
}

export function mockDiscordRoleCache(overrides?: any): Collection<Snowflake, Role> {
    return {
        has: jest.fn().mockReturnValue(true),
        ...overrides
    } as unknown as Collection<Snowflake, Role>;
}