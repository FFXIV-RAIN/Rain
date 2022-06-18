import { autoVerify, onGuildMemberAdd } from '../../src/modules/auto-role.module';
import { RoleDiff } from '../../src/utils/role-diff';
import { mockDiscordMember, mockDiscordUser, mockDiscordRoles, mockDiscordRoleCache } from '../__utils__/mock';
import { DiffCacheManager } from '../../src/managers/diff-cache.manager';
import { Configs } from '../../src/services/configs.service';
import { chance } from '../__utils__/chance';
import { AutoRoleConfig } from '../../src/db/models/modules/AutoRoleConfig';

jest.mock('../../src/services/configs.service');
jest.mock('../../src/managers/diff-cache.manager');

const MockedManager = jest.mocked(DiffCacheManager);
const MockedConfigs = jest.mocked(Configs);

describe('bot(AutoRole)', () => {
    const memberJoinRoles = [chance.string()];
    const botJoinRoles = [chance.string()];
    const config = {
        guildId: chance.string(),
        enabled: true,
        disabled: false,
        memberJoinRoles,
        botJoinRoles,
    } as unknown as AutoRoleConfig;

    let diff: RoleDiff;

    beforeEach(() => {
        diff = new RoleDiff();
        jest.spyOn(diff, 'add');
        jest.spyOn(diff, 'remove');
        jest.spyOn(diff, 'commit').mockResolvedValue();

        MockedManager.diff.mockReturnValue(diff);

        MockedConfigs.autoRole.mockResolvedValue(config);
    });

    describe('func(autoVerify)', () => {
        it('should add the join roles if a member has been accepted', async () => {
            const oldMember = mockDiscordMember({
                pending: true,
            });
            const newMember = mockDiscordMember({
                pending: false,
            });

            await autoVerify(config, diff, oldMember, newMember);

            expect(diff.roles).toEqual(memberJoinRoles);
        });

        it('should not add the join roles if a member has not been accepted', async () => {
            const oldMember = mockDiscordMember({
                pending: true
            });
            const newMember = mockDiscordMember({
                pending: true
            });

            await autoVerify(config, diff, oldMember, newMember);

            expect(diff.roles).toEqual([]);
        });

        it('should not add the join roles if a member was accepted previously', async () => {
            const oldMember = mockDiscordMember({
                pending: false
            });
            const newMember = mockDiscordMember({
                pending: false
            });

            await autoVerify(config, diff, oldMember, newMember);

            expect(diff.roles).toEqual([]);
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