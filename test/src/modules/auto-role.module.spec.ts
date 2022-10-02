import {RainBot} from '@rain/bot';
import {AutoRoleModule} from 'src/modules/AutoRoleModule';
import {RoleDiff} from 'src/utils/role-diff';
import {mockDiscordMember, mockDiscordUser} from 'test/__utils__/mock';
import {DiffCacheManager} from 'src/managers/DiffCacheManager';
import {AutoRoleConfigService} from 'src/services/AutoRoleConfigService';
import {chance} from 'test/__utils__/chance';
import {AutoRoleConfig} from 'src/db/models/modules/AutoRole/AutoRoleConfig';

jest.mock('src/services/AutoRoleConfigService');
jest.mock('src/managers/DiffCacheManager');

const MockedConfigs = jest.mocked(AutoRoleConfigService);
const MockedManager = jest.mocked(DiffCacheManager);

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

    let module: AutoRoleModule,
        diff: RoleDiff;

    beforeEach(() => {
        module = new AutoRoleModule();
        diff = new RoleDiff();

        jest.spyOn(diff, 'add');
        jest.spyOn(diff, 'remove');
        jest.spyOn(diff, 'commit').mockResolvedValue();

        MockedManager.diff.mockReturnValue(diff);

        MockedConfigs.findByGuildId.mockResolvedValue(config);
    });

    describe('func(onGuildMemberUpdate)', () => {
        it('should add the join roles if a member has been accepted', async () => {
            const oldMember = mockDiscordMember({
                pending: true,
            });
            const newMember = mockDiscordMember({
                pending: false,
            });
            
            await module.onGuildMemberUpdate(null as unknown as RainBot, oldMember, newMember);

            expect(diff.roles).toEqual(memberJoinRoles);
        });

        it('should not add the join roles if a member has not been accepted', async () => {
            const oldMember = mockDiscordMember({
                pending: true
            });
            const newMember = mockDiscordMember({
                pending: true
            });

            await module.onGuildMemberUpdate(null as unknown as RainBot, oldMember, newMember);

            expect(diff.roles).toEqual([]);
        });

        it('should not add the join roles if a member was accepted previously', async () => {
            const oldMember = mockDiscordMember({
                pending: false
            });
            const newMember = mockDiscordMember({
                pending: false
            });

            await module.onGuildMemberUpdate(null as unknown as RainBot, oldMember, newMember);

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

            await module.onGuildMemberAdd(null as unknown as RainBot, member);

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

            await module.onGuildMemberAdd(null as unknown as RainBot, member);

            expect(diff.add).not.toHaveBeenCalledWith(...botJoinRoles);
            expect(diff.remove).not.toHaveBeenCalled();
            expect(MockedManager.commit).toHaveBeenCalledWith(member);
        });
    });
});