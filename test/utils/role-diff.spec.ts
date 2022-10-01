import {GuildMember} from 'discord.js';
import {RoleDiff} from '../../src/utils/role-diff';
import {chance} from '../__utils__/chance';
import {mockDiscordMember} from '../__utils__/mock';

describe('utils(RoleDiff)', () => {
    describe('func(add)', () => {
        it('should support adding roles', () => {
            const expectedRole = chance.string();
            const diff = new RoleDiff();

            diff.add(expectedRole);

            expect(diff.roles).toEqual([expectedRole]);
       });
        
        it('should support adding multiple roles', () => {
            const expectedRole = chance.string();
            const otherExpectedRole = chance.string();
            const diff = new RoleDiff();

            diff.add(expectedRole, otherExpectedRole);

            expect(diff.roles).toEqual([expectedRole, otherExpectedRole]);
       });
        
        it('should dedupe roles', () => {
            const expectedRole = chance.string();
            const diff = new RoleDiff();

            diff.add(expectedRole);
            diff.add(expectedRole);

            expect(diff.roles).toEqual([expectedRole]);
       });
   });

    describe('func(remove)', () => {
        it('should support removing roles', () => {
            const unexpectedRole = chance.string();
            const diff = new RoleDiff([unexpectedRole]);

            diff.remove(unexpectedRole);

            expect(diff.roles).toEqual([]);
       });
        
        it('should support removing multiple roles', () => {
            const unexpectedRole = chance.string();
            const otherUnexpectedRole = chance.string();
            const diff = new RoleDiff([unexpectedRole, otherUnexpectedRole]);

            diff.remove(unexpectedRole, otherUnexpectedRole);

            expect(diff.roles).toEqual([]);
       });
        
        it('should ignore roles that do not exist', () => {
            const diff = new RoleDiff();

            diff.remove(chance.string());

            expect(diff.roles).toEqual([]);
       });
   });

    describe('func(commit)', () => {
        let member: GuildMember;

        beforeEach(() => {
            member = mockDiscordMember();
       });

        it('should not commit if no changes have occurred', async () => {
            const role = chance.string();
            const diff = new RoleDiff([role]);

            diff.add(role);

            await diff.commit(member);

            expect(member.roles.set).not.toHaveBeenCalled();
       });

        it('should support adding roles', async () => {
            const role = chance.string();
            const diff = new RoleDiff();

            diff.add(role);

            await diff.commit(member);

            expect(member.roles.set).toHaveBeenCalledWith([role]);
       });

        it('should support removing roles', async () => {
            const role = chance.string();
            const diff = new RoleDiff([role]);

            diff.remove(role);

            await diff.commit(member);

            expect(member.roles.set).toHaveBeenCalledWith([]);
       });

        it('should support adding and removing roles', async () => {
            const unexpectedRole = chance.string();
            const expectedRole = chance.string();
            const diff = new RoleDiff([unexpectedRole]);

            diff.add(expectedRole);
            diff.remove(unexpectedRole);

            await diff.commit(member);

            expect(member.roles.set).toHaveBeenCalledWith([expectedRole]);
       });
   });
});