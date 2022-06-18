import { GuildMember } from 'discord.js';
import { chance } from '../__utils__/chance';
import {
    hasRole,
    hasAnyRole,
    wasAnyRoleChanged,
    wasAnyRoleAdded,
    wasAnyRoleRemoved,
    ROLE_CHANGED,
} from '../../src/utils/roles';
import { mockDiscordMember, mockDiscordRoleCache, mockDiscordRoles } from '../__utils__/mock';

describe('utils(Roles)', () => {
    const mockDiscordRolesHas = (hasRole: boolean | ((roleID: string) => boolean)): GuildMember => {
        return mockDiscordMember({
            roles: mockDiscordRoles({
                cache: mockDiscordRoleCache({
                    has: typeof hasRole === 'function' ? jest.fn().mockImplementation(hasRole) : jest.fn().mockReturnValue(hasRole)
                }),
            }),
        });
    };

    describe('func(hasRole)', () => {
        it('should return true if the user has the role', () => {
            const roleID = chance.string();
            const member = mockDiscordRolesHas(true);

            expect(hasRole(member, roleID)).toEqual(true);
            expect(member.roles.cache.has).toHaveBeenCalledWith(roleID);
        });

        it('should return false if the user does not have the role', () => {
            const roleID = chance.string();
            const member = mockDiscordRolesHas(false);

            expect(hasRole(member, roleID)).toEqual(false);
            expect(member.roles.cache.has).toHaveBeenCalledWith(roleID);
        });
    });

    describe('func(hasAnyRole)', () => {
        it('should return true if the user has all of the roles', () => {
            const roleIDs = chance.n(chance.string, 4);
            const member = mockDiscordRolesHas(true);

            expect(hasAnyRole(member, roleIDs)).toEqual(true);
            expect(member.roles.cache.has).toHaveBeenCalledTimes(1);
        });

        it('should return true if the user has any of the roles', () => {
            const roleIDs = chance.n(chance.string, 4);
            const member = mockDiscordRolesHas((roleID) => 
                roleIDs.indexOf(roleID) === (roleIDs.length - 1)
            );

            expect(hasAnyRole(member, roleIDs)).toEqual(true);
            expect(member.roles.cache.has).toHaveBeenCalledTimes(roleIDs.length);
        });

        it('should return false if the user has none of the roles', () => {
            const roleIDs = chance.n(chance.string, 4);
            const member = mockDiscordRolesHas(false);

            expect(hasAnyRole(member, roleIDs)).toEqual(false);
            expect(member.roles.cache.has).toHaveBeenCalledTimes(roleIDs.length);
        });

        it('should support individual roles', () => {
            const roleID = chance.string();
            const member = mockDiscordRolesHas(false);

            expect(hasAnyRole(member, roleID)).toEqual(false);
            expect(member.roles.cache.has).toHaveBeenCalledTimes(1);
        });
    });

    describe('func(wasAnyRoleChanged)', () => {
        it('should return NO_CHANGE if the roles are the same', () => {
            const expectedRoleID = chance.string();
            const member = mockDiscordRolesHas(true);

            expect(wasAnyRoleChanged(member, member, [expectedRoleID])).toEqual(ROLE_CHANGED.NO_CHANGE);
        });
        
        it('should return ADDED if the role was added in the new user', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockDiscordRolesHas(false);
            const newMember = mockDiscordRolesHas(true);

            expect(wasAnyRoleChanged(oldMember, newMember, [expectedRoleID])).toEqual(ROLE_CHANGED.ADDED);
        });
        
        it('should return REMOVED if the role was removed from the new user', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockDiscordRolesHas(true);
            const newMember = mockDiscordRolesHas(false);

            expect(wasAnyRoleChanged(oldMember, newMember, [expectedRoleID])).toEqual(ROLE_CHANGED.REMOVED);
        });
    });

    describe('func(wasAnyRoleAdded)', () => {
        it('should return true if any of the roles were added', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockDiscordRolesHas(false);
            const newMember = mockDiscordRolesHas(true);

            expect(wasAnyRoleAdded(oldMember, newMember, [expectedRoleID])).toEqual(true);
        });
        
        it('should return false if any of the roles were removed', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockDiscordRolesHas(true);
            const newMember = mockDiscordRolesHas(false);

            expect(wasAnyRoleAdded(oldMember, newMember, [expectedRoleID])).toEqual(false);
        });

        it('should return false if there was no change', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockDiscordRolesHas(false);
            const newMember = mockDiscordRolesHas(false);

            expect(wasAnyRoleAdded(oldMember, newMember, [expectedRoleID])).toEqual(false);
        });
    });

    describe('func(wasAnyRoleRemoved)', () => {
        it('should return true if any of the roles were removed', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockDiscordRolesHas(true);
            const newMember = mockDiscordRolesHas(false);

            expect(wasAnyRoleRemoved(oldMember, newMember, [expectedRoleID])).toEqual(true);
        });
        
        it('should return false if any of the roles were added', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockDiscordRolesHas(false);
            const newMember = mockDiscordRolesHas(true);

            expect(wasAnyRoleRemoved(oldMember, newMember, [expectedRoleID])).toEqual(false);
        });

        it('should return false if there was no change', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockDiscordRolesHas(false);
            const newMember = mockDiscordRolesHas(false);

            expect(wasAnyRoleRemoved(oldMember, newMember, [expectedRoleID])).toEqual(false);
        });
    });
});