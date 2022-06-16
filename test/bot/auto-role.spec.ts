import { ROLES } from '../../src/roles';
import { autoAssignGuestAndStaff, autoVerify, onGuildMemberAdd } from '../../src/bot/auto-role';
import { RoleDiff } from '../../src/utils/role-diff';
import { mockMember, mockMemberUser, mockMemberRoles, mockMemberRoleCache } from '../__utils__/mock';

describe('bot(AutoRole)', () => {
    describe('func(autoVerify)', () => {
        it('should add the join roles if a member has been accepted', () => {
            const diff = new RoleDiff();
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
            const diff = new RoleDiff();
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
            const diff = new RoleDiff();
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
            const diff = new RoleDiff();
            const oldMember = mockMember();
            const newMember = mockMember();

            autoAssignGuestAndStaff(diff, oldMember, newMember);

            expect(diff.added).toEqual([]);
            expect(diff.removed).toEqual([]);
        });

        it('should add STAFF and remove GUESTS if a staff role was added', () => {
            const diff = new RoleDiff();
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
            const diff = new RoleDiff();
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
        beforeEach(() => {
            jest.spyOn(RoleDiff.prototype, 'add');
            jest.spyOn(RoleDiff.prototype, 'remove');
            jest.spyOn(RoleDiff.prototype, 'submit');

            (RoleDiff.prototype.add as any).mockClear();
            (RoleDiff.prototype.remove as any).mockClear();
            (RoleDiff.prototype.submit as any).mockClear();
        });

        it('should add the bot role if a user is a bot', async () => {
            const member = mockMember({
                user: mockMemberUser({
                    bot: true
                }),
            });

            await onGuildMemberAdd(member);

            expect(RoleDiff.prototype.add).toHaveBeenCalledWith(ROLES.BOTS);
            expect(RoleDiff.prototype.remove).not.toHaveBeenCalled();
            expect(RoleDiff.prototype.submit).toHaveBeenCalledWith(member);
        });

        it('should not add the bot role if a user is not a bot', async () => {
            const member = mockMember({
                user: mockMemberUser({
                    bot: false
                }),
            });

            await onGuildMemberAdd(member);

            expect(RoleDiff.prototype.add).not.toHaveBeenCalledWith(ROLES.BOTS);
            expect(RoleDiff.prototype.remove).not.toHaveBeenCalled();
            expect(RoleDiff.prototype.submit).toHaveBeenCalledWith(member);
        });
    });
});