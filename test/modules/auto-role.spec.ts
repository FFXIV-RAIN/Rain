import { ROLES } from '../../src/roles';
import { autoAssignGuestAndStaff, autoVerify, onGuildMemberAdd } from '../../src/modules/auto-role';
import { RoleDiff } from '../../src/utils/role-diff';
import { mockDiscordMember, mockDiscordUser, mockDiscordRoles, mockDiscordRoleCache } from '../__utils__/mock';
import { DiffCacheManager } from '../../src/managers/diff-cache-manager';
import { Configs } from '../../src/services/configs.service';
import { chance } from '../__utils__/chance';

jest.mock('../../src/services/configs.service');
jest.mock('../../src/managers/diff-cache-manager');

const MockedManager = jest.mocked(DiffCacheManager);
const MockedConfigs = jest.mocked(Configs);

describe('bot(AutoRole)', () => {
    const memberJoinRoles = [chance.string()];
    const botJoinRoles = [chance.string()];

    let diff: RoleDiff;

    beforeEach(() => {
        diff = new RoleDiff();
        jest.spyOn(diff, 'add');
        jest.spyOn(diff, 'remove');
        jest.spyOn(diff, 'commit').mockResolvedValue();

        MockedManager.diff.mockReturnValue(diff);

        MockedConfigs.autoRole.mockResolvedValue({
            guildId: chance.string(),
            enabled: true,
            disabled: false,
            memberJoinRoles,
            botJoinRoles,
        } as any);
    });

    describe('func(autoVerify)', () => {
        it('should add the join roles if a member has been accepted', async () => {
            const oldMember = mockDiscordMember({
                pending: true
            });
            const newMember = mockDiscordMember({
                pending: false
            });

            await autoVerify(diff, oldMember, newMember);

            expect(diff.roles).toEqual(memberJoinRoles);
        });

        it('should not add the join roles if a member has not been accepted', async () => {
            const oldMember = mockDiscordMember({
                pending: true
            });
            const newMember = mockDiscordMember({
                pending: true
            });

            await autoVerify(diff, oldMember, newMember);

            expect(diff.roles).toEqual([]);
        });

        it('should not add the join roles if a member was accepted previously', async () => {
            const oldMember = mockDiscordMember({
                pending: false
            });
            const newMember = mockDiscordMember({
                pending: false
            });

            await autoVerify(diff, oldMember, newMember);

            expect(diff.roles).toEqual([]);
        });
    });

    describe('func(autoAssignGuestAndStaff)', () => {
        it('should do nothing if no staff roles were added or removed', async () => {
            const oldMember = mockDiscordMember();
            const newMember = mockDiscordMember();

            await autoAssignGuestAndStaff(diff, oldMember, newMember);

            expect(diff.roles).toEqual([]);
        });

        it('should add STAFF and remove GUESTS if a staff role was added', async () => {
            diff.add(ROLES.GUESTS);

            const oldMember = mockDiscordMember({
                roles: mockDiscordRoles({
                    cache: mockDiscordRoleCache({
                        has: jest.fn().mockReturnValue(false),
                    }),
                }),
            });
            const newMember = mockDiscordMember({
                roles: mockDiscordRoles({
                    cache: mockDiscordRoleCache({
                        has: jest.fn().mockReturnValue(true),
                    }),
                }),
            });

            await autoAssignGuestAndStaff(diff, oldMember, newMember);

            expect(diff.roles).toEqual([ROLES.STAFF]);
        });

        it('should add GUESTS and remove STAFF if a staff role was removed', async () => {
            diff.add(ROLES.STAFF);

            const oldMember = mockDiscordMember({
                roles: mockDiscordRoles({
                    cache: mockDiscordRoleCache({
                        has: jest.fn().mockReturnValue(true),
                    }),
                }),
            });
            const newMember = mockDiscordMember({
                roles: mockDiscordRoles({
                    cache: mockDiscordRoleCache({
                        has: jest.fn().mockReturnValue(false),
                    }),
                }),
            });

            await autoAssignGuestAndStaff(diff, oldMember, newMember);

            expect(diff.roles).toEqual([ROLES.GUESTS]);
        });
    });

    describe('func(onGuildMemberAdd)', () => {
        it('should add the bot role if a user is a bot', async () => {
            const member = mockDiscordMember({
                user: mockDiscordUser({
                    bot: true
                }),
            });

            await onGuildMemberAdd(member);

            expect(diff.add).toHaveBeenCalledWith(...botJoinRoles);
            expect(diff.remove).not.toHaveBeenCalled();
            expect(MockedManager.commit).toHaveBeenCalledWith(member);
        });

        it('should not add the bot role if a user is not a bot', async () => {
            const member = mockDiscordMember({
                user: mockDiscordUser({
                    bot: false
                }),
            });

            await onGuildMemberAdd(member);

            expect(diff.add).not.toHaveBeenCalledWith(...botJoinRoles);
            expect(diff.remove).not.toHaveBeenCalled();
            expect(MockedManager.commit).toHaveBeenCalledWith(member);
        });
    });
});