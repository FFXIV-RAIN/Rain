import { GuildMember, GuildMemberRoleManager, PartialGuildMember } from 'discord.js';
import { chance } from '../__utils__/chance';
import {
    hasRole,
    hasAnyRole,
    wasAnyRoleChanged,
    wasAnyRoleAdded,
    wasAnyRoleRemoved,
    ROLE_CHANGED,
} from '../../src/utils/roles';
import { mockMember, mockMemberRoleCache, mockMemberRoles } from '../__utils__/mock';

describe('utils(Roles)', () => {
    const mockMemberRolesHas = (hasRole: boolean | ((roleID: string) => boolean)): GuildMember => {
        return mockMember({
            roles: mockMemberRoles({
                cache: mockMemberRoleCache({
                    has: typeof hasRole === 'function' ? jest.fn().mockImplementation(hasRole) : jest.fn().mockReturnValue(hasRole)
                }),
            }),
        });
    };

    describe('func(hasRole)', () => {
        it('should return true if the user has the role', () => {
            const roleID = chance.string();
            const member = mockMemberRolesHas(true);

            expect(hasRole(member, roleID)).toEqual(true);
            expect(member.roles.cache.has).toHaveBeenCalledWith(roleID);
        });

        it('should return false if the user does not have the role', () => {
            const roleID = chance.string();
            const member = mockMemberRolesHas(false);

            expect(hasRole(member, roleID)).toEqual(false);
            expect(member.roles.cache.has).toHaveBeenCalledWith(roleID);
        });
    });

    describe('func(hasAnyRole)', () => {
        it('should return true if the user has all of the roles', () => {
            const roleIDs = chance.n(chance.string, 4);
            const member = mockMemberRolesHas(true);

            expect(hasAnyRole(member, roleIDs)).toEqual(true);
            expect(member.roles.cache.has).toHaveBeenCalledTimes(1);
        });

        it('should return true if the user has any of the roles', () => {
            const roleIDs = chance.n(chance.string, 4);
            const member = mockMemberRolesHas((roleID) => 
                roleIDs.indexOf(roleID) === (roleIDs.length - 1)
            );

            expect(hasAnyRole(member, roleIDs)).toEqual(true);
            expect(member.roles.cache.has).toHaveBeenCalledTimes(roleIDs.length);
        });

        it('should return false if the user has none of the roles', () => {
            const roleIDs = chance.n(chance.string, 4);
            const member = mockMemberRolesHas(false);

            expect(hasAnyRole(member, roleIDs)).toEqual(false);
            expect(member.roles.cache.has).toHaveBeenCalledTimes(roleIDs.length);
        });

        it('should support individual roles', () => {
            const roleID = chance.string();
            const member = mockMemberRolesHas(false);

            expect(hasAnyRole(member, roleID)).toEqual(false);
            expect(member.roles.cache.has).toHaveBeenCalledTimes(1);
        });
    });

    describe('func(wasAnyRoleChanged)', () => {
        it('should return NO_CHANGE if the roles are the same', () => {
            const expectedRoleID = chance.string();
            const member = mockMemberRolesHas(true);

            expect(wasAnyRoleChanged(member, member, [expectedRoleID])).toEqual(ROLE_CHANGED.NO_CHANGE);
        });
        
        it('should return ADDED if the role was added in the new user', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockMemberRolesHas(false);
            const newMember = mockMemberRolesHas(true);

            expect(wasAnyRoleChanged(oldMember, newMember, [expectedRoleID])).toEqual(ROLE_CHANGED.ADDED);
        });
        
        it('should return REMOVED if the role was removed from the new user', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockMemberRolesHas(true);
            const newMember = mockMemberRolesHas(false);

            expect(wasAnyRoleChanged(oldMember, newMember, [expectedRoleID])).toEqual(ROLE_CHANGED.REMOVED);
        });
    });

    describe('func(wasAnyRoleAdded)', () => {
        it('should return true if any of the roles were added', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockMemberRolesHas(false);
            const newMember = mockMemberRolesHas(true);

            expect(wasAnyRoleAdded(oldMember, newMember, [expectedRoleID])).toEqual(true);
        });
        
        it('should return false if any of the roles were removed', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockMemberRolesHas(true);
            const newMember = mockMemberRolesHas(false);

            expect(wasAnyRoleAdded(oldMember, newMember, [expectedRoleID])).toEqual(false);
        });

        it('should return false if there was no change', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockMemberRolesHas(false);
            const newMember = mockMemberRolesHas(false);

            expect(wasAnyRoleAdded(oldMember, newMember, [expectedRoleID])).toEqual(false);
        });
    });

    describe('func(wasAnyRoleRemoved)', () => {
        it('should return true if any of the roles were removed', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockMemberRolesHas(true);
            const newMember = mockMemberRolesHas(false);

            expect(wasAnyRoleRemoved(oldMember, newMember, [expectedRoleID])).toEqual(true);
        });
        
        it('should return false if any of the roles were added', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockMemberRolesHas(false);
            const newMember = mockMemberRolesHas(true);

            expect(wasAnyRoleRemoved(oldMember, newMember, [expectedRoleID])).toEqual(false);
        });

        it('should return false if there was no change', () => {
            const expectedRoleID = chance.string();
            const oldMember = mockMemberRolesHas(false);
            const newMember = mockMemberRolesHas(false);

            expect(wasAnyRoleRemoved(oldMember, newMember, [expectedRoleID])).toEqual(false);
        });
    });
});