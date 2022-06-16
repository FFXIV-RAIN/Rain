import { Collection, GuildMember, GuildMemberRoleManager, Role, Snowflake, User } from 'discord.js'
import { chance } from './chance';

export function mockMember(overrides?: any): GuildMember {
    return {
        user: mockMemberUser(),
        roles: mockMemberRoles(),
        ...overrides
    } as unknown as GuildMember;
}

export function mockMemberUser(overrides?: any): User {
    return {
        id: chance.string(),
        ...overrides
    } as unknown as User;
}

export function mockMemberRoles(overrides?: any): GuildMemberRoleManager {
    return {
        add: jest.fn().mockResolvedValue(true),
        remove: jest.fn().mockResolvedValue(true),
        cache: mockMemberRoleCache(),
        ...overrides
    } as unknown as GuildMemberRoleManager;
}

export function mockMemberRoleCache(overrides?: any): Collection<Snowflake, Role> {
    return {
        has: jest.fn().mockReturnValue(true),
        ...overrides
    } as unknown as Collection<Snowflake, Role>;
}