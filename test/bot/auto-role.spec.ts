import { ROLES } from '../../src/roles';
import { autoAssignGuestAndStaff, autoVerify, onGuildMemberAdd } from '../../src/bot/auto-role';
import { RoleDiff } from '../../src/utils/role-diff';
import { mockMember, mockMemberUser, mockMemberRoles, mockMemberRoleCache } from '../__utils__/mock';
import { DiffCacheManager } from '../../src/managers/diff-cache-manager';

jest.mock('../../src/managers/diff-cache-manager');

const MockedManager = jest.mocked(DiffCacheManager);

describe('bot(AutoRole)', () => {
    let diff: RoleDiff;

    beforeEach(() => {
        diff = new RoleDiff();
        jest.spyOn(diff, 'add');
        jest.spyOn(diff, 'remove');
        jest.spyOn(diff, 'commit').mockResolvedValue();

        MockedManager.diff.mockReturnValue(diff);
    });

    describe('func(autoVerify)', () => {
        it('should add the join roles if a member has been accepted', () => {
            const oldMember = mockMember({
                pending: true
            });
            const newMember = mockMember({
                pending: false
            });

            autoVerify(diff, oldMember, newMember);

            expect(diff.added).toEqual([
                ROLES.GUESTS,
                ROLES.PRONOUNS_HEADER,
                ROLES.PRONOUNS_FOOTER,
            ]);
        });

        it('should not add the join roles if a member has not been accepted', () => {
            const oldMember = mockMember({
                pending: true
            });
            const newMember = mockMember({
                pending: true
            });

            autoVerify(diff, oldMember, newMember);

            expect(diff.added).toEqual([]);
        });

        it('should not add the join roles if a member was accepted previously', () => {
            const oldMember = mockMember({
                pending: false
            });
            const newMember = mockMember({
                pending: false
            });

            autoVerify(diff, oldMember, newMember);

            expect(diff.added).toEqual([]);
        });
    });

    describe('func(autoAssignGuestAndStaff)', () => {
        it('should do nothing if no staff roles were added or removed', () => {
            const oldMember = mockMember();
            const newMember = mockMember();

            autoAssignGuestAndStaff(diff, oldMember, newMember);

            expect(diff.added).toEqual([]);
            expect(diff.removed).toEqual([]);
        });

        it('should add STAFF and remove GUESTS if a staff role was added', () => {
            const oldMember = mockMember({
                roles: mockMemberRoles({
                    cache: mockMemberRoleCache({
                        has: jest.fn().mockReturnValue(false),
                    }),
                }),
            });
            const newMember = mockMember({
                roles: mockMemberRoles({
                    cache: mockMemberRoleCache({
                        has: jest.fn().mockReturnValue(true),
                    }),
                }),
            });

            autoAssignGuestAndStaff(diff, oldMember, newMember);

            expect(diff.added).toEqual([ROLES.STAFF]);
            expect(diff.removed).toEqual([ROLES.GUESTS]);
        });

        it('should add GUESTS and remove STAFF if a staff role was removed', () => {
            const oldMember = mockMember({
                roles: mockMemberRoles({
                    cache: mockMemberRoleCache({
                        has: jest.fn().mockReturnValue(true),
                    }),
                }),
            });
            const newMember = mockMember({
                roles: mockMemberRoles({
                    cache: mockMemberRoleCache({
                        has: jest.fn().mockReturnValue(false),
                    }),
                }),
            });

            autoAssignGuestAndStaff(diff, oldMember, newMember);

            expect(diff.added).toEqual([ROLES.GUESTS]);
            expect(diff.removed).toEqual([ROLES.STAFF]);
        });
    });

    describe('func(onGuildMemberAdd)', () => {
        it('should add the bot role if a user is a bot', async () => {
            const member = mockMember({
                user: mockMemberUser({
                    bot: true
                }),
            });

            await onGuildMemberAdd(member);

            expect(diff.add).toHaveBeenCalledWith(ROLES.BOTS);
            expect(diff.remove).not.toHaveBeenCalled();
            expect(MockedManager.commit).toHaveBeenCalledWith(member);
        });

        it('should not add the bot role if a user is not a bot', async () => {
            const member = mockMember({
                user: mockMemberUser({
                    bot: false
                }),
            });

            await onGuildMemberAdd(member);

            expect(diff.add).not.toHaveBeenCalledWith(ROLES.BOTS);
            expect(diff.remove).not.toHaveBeenCalled();
            expect(MockedManager.commit).toHaveBeenCalledWith(member);
        });
    });
});