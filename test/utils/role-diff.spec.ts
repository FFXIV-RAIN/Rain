import { GuildMember } from 'discord.js';
import { ROLES } from '../../src/roles';
import { RoleDiff } from '../../src/utils/role-diff';
import { mockDiscordMember } from '../__utils__/mock';

describe('utils(RoleDiff)', () => {
    describe('func(add)', () => {
        it('should support adding roles', () => {
            const diff = new RoleDiff();

            diff.add(ROLES.STAFF);

            expect(diff.roles).toEqual([ROLES.STAFF]);
        });
        
        it('should support adding multiple roles', () => {
            const diff = new RoleDiff();

            diff.add(ROLES.STAFF, ROLES.BAKERS);

            expect(diff.roles).toEqual([ROLES.STAFF, ROLES.BAKERS]);
        });
        
        it('should dedupe roles', () => {
            const diff = new RoleDiff();

            diff.add(ROLES.STAFF);
            diff.add(ROLES.STAFF);

            expect(diff.roles).toEqual([ROLES.STAFF]);
        });
    });

    describe('func(remove)', () => {
        it('should support removing roles', () => {
            const diff = new RoleDiff([ROLES.STAFF]);

            diff.remove(ROLES.STAFF);

            expect(diff.roles).toEqual([]);
        });
        
        it('should support removing multiple roles', () => {
            const diff = new RoleDiff([ROLES.STAFF, ROLES.BAKERS]);

            diff.remove(ROLES.STAFF, ROLES.BAKERS);

            expect(diff.roles).toEqual([]);
        });
        
        it('should ignore roles that do not exist', () => {
            const diff = new RoleDiff();

            diff.remove(ROLES.STAFF);

            expect(diff.roles).toEqual([]);
        });
    });

    describe('func(commit)', () => {
        let member: GuildMember;

        beforeEach(() => {
            member = mockDiscordMember();
        });

        it('should not commit if no changes have occurred', async () => {
            const diff = new RoleDiff([ROLES.STAFF]);

            diff.add(ROLES.STAFF);

            expect(member.roles.set).not.toHaveBeenCalled();
        });

        it('should support adding roles', async () => {
            const diff = new RoleDiff();

            diff.add(ROLES.STAFF);

            await diff.commit(member);

            expect(member.roles.set).toHaveBeenCalledWith([ROLES.STAFF]);
        });

        it('should support removing roles', async () => {
            const diff = new RoleDiff([ROLES.STAFF]);

            diff.remove(ROLES.STAFF);

            await diff.commit(member);

            expect(member.roles.set).toHaveBeenCalledWith([]);
        });

        it('should support adding and removing roles', async () => {
            const diff = new RoleDiff([ROLES.STAFF]);

            diff.add(ROLES.BAKERS);
            diff.remove(ROLES.STAFF);

            await diff.commit(member);

            expect(member.roles.set).toHaveBeenCalledWith([ROLES.BAKERS]);
        });
    });
});