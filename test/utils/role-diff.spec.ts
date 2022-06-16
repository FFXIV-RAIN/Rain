import { GuildMember } from 'discord.js';
import { ROLES } from '../../src/roles';
import { RoleDiff } from '../../src/utils/role-diff';
import { chance } from '../__utils__/chance';
import { mockMember } from '../__utils__/mock';

describe('utils(RoleDiff)', () => {
    describe('func(add)', () => {
        it('should support adding roles', () => {
            const diff = new RoleDiff();

            diff.add(ROLES.STAFF);

            expect(diff.added).toEqual([ROLES.STAFF]);
            expect(diff.removed).toEqual([]);
        });
        
        it('should support adding multiple roles', () => {
            const diff = new RoleDiff();

            diff.add(ROLES.STAFF, ROLES.BAKERS);

            expect(diff.added).toEqual([ROLES.STAFF, ROLES.BAKERS]);
            expect(diff.removed).toEqual([]);
        });
        
        it('should support adding removed roles', () => {
            const diff = new RoleDiff();

            diff.remove(ROLES.STAFF);
            diff.add(ROLES.STAFF);

            expect(diff.added).toEqual([ROLES.STAFF]);
            expect(diff.removed).toEqual([]);
        });
        
        it('should dedupe roles', () => {
            const diff = new RoleDiff();

            diff.add(ROLES.STAFF);
            diff.add(ROLES.STAFF);

            expect(diff.added).toEqual([ROLES.STAFF]);
            expect(diff.removed).toEqual([]);
        });
    });

    describe('func(remove)', () => {
        it('should support removing roles', () => {
            const diff = new RoleDiff();

            diff.remove(ROLES.STAFF);

            expect(diff.removed).toEqual([ROLES.STAFF]);
            expect(diff.added).toEqual([]);
        });
        
        it('should support removing multiple roles', () => {
            const diff = new RoleDiff();

            diff.remove(ROLES.STAFF, ROLES.BAKERS);

            expect(diff.removed).toEqual([ROLES.STAFF, ROLES.BAKERS]);
            expect(diff.added).toEqual([]);
        });
        
        it('should support removing added roles', () => {
            const diff = new RoleDiff();

            diff.add(ROLES.STAFF);
            diff.remove(ROLES.STAFF);

            expect(diff.removed).toEqual([ROLES.STAFF]);
            expect(diff.added).toEqual([]);
        });
        
        it('should dedupe roles', () => {
            const diff = new RoleDiff();

            diff.remove(ROLES.STAFF);
            diff.remove(ROLES.STAFF);

            expect(diff.removed).toEqual([ROLES.STAFF]);
            expect(diff.added).toEqual([]);
        });
    });

    describe('func(commit)', () => {
        let member: GuildMember;

        beforeEach(() => {
            member = mockMember();
        });

        it('should support adding roles', async () => {
            const diff = new RoleDiff();

            diff.add(ROLES.STAFF);

            await diff.commit(member);

            expect(diff.added).toEqual([]);
            expect(diff.removed).toEqual([]);
            expect(member.roles.add).toHaveBeenCalledWith([ROLES.STAFF]);
            expect(member.roles.remove).not.toHaveBeenCalled();
            expect(member.roles.add).toHaveBeenCalledTimes(1);
            expect(member.roles.remove).toHaveBeenCalledTimes(0);
        });

        it('should support removing roles', async () => {
            const diff = new RoleDiff();

            diff.remove(ROLES.STAFF);

            await diff.commit(member);

            expect(diff.added).toEqual([]);
            expect(diff.removed).toEqual([]);
            expect(member.roles.add).not.toHaveBeenCalled();
            expect(member.roles.remove).toHaveBeenCalledWith([ROLES.STAFF]);
        });

        it('should support adding and removing roles', async () => {
            const diff = new RoleDiff();

            diff.add(ROLES.BAKERS);
            diff.remove(ROLES.STAFF);

            await diff.commit(member);

            expect(diff.added).toEqual([]);
            expect(diff.removed).toEqual([]);
            expect(member.roles.add).toHaveBeenCalledWith([ROLES.BAKERS]);
            expect(member.roles.remove).toHaveBeenCalledWith([ROLES.STAFF]);
        });
    });
});