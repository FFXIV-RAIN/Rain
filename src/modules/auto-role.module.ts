import {Client, GuildMember, PartialGuildMember} from 'discord.js';
import {AutoRoleConfig} from '../db/models/modules/AutoRole/AutoRoleConfig';
import {RoleDiff} from '../utils/role-diff';
import {DiffCacheManager} from '../managers/diff-cache.manager';
import {logger} from '../utils/logger';
import {Configs} from '../services/configs.service';
import {hasAnyRole} from '../utils/roles';
import {IModule} from '../../types/module';

export class AutoRoleModule implements IModule {
    name = 'Automatic Roles';

    async onGuildMemberAdd(_client: Client, member: GuildMember | PartialGuildMember) {
        const config = await Configs.autoRole(member.guild.id);
    
        if (!config || !config.enabled) return;
        
        const diff = DiffCacheManager.diff(member);
    
        await this.autoVerify(config, diff, null, member);
    
        await DiffCacheManager.commit(member);
    }

    async onGuildMemberUpdate(_client: Client, oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
        const config = await Configs.autoRole(newMember.guild.id, true);

        if (!config || !config.enabled) return;

        const diff = DiffCacheManager.diff(newMember);

        await this.autoVerify(config, diff, oldMember, newMember);
        await this.autoAssignments(config, diff, oldMember, newMember);

        logger.info(diff.roles);

        await DiffCacheManager.commit(newMember);
    }

    private autoVerify(config: AutoRoleConfig, diff: RoleDiff, oldMember: null | GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
        if (newMember.user.bot) {
            this.autoVerifyBot(config, diff);
       } else {
            this.autoVerifyUser(config, diff, oldMember, newMember);
       }
    }

    private autoVerifyBot(config: AutoRoleConfig, diff: RoleDiff) {
        if (!config.botJoinRoles) return;
    
        diff.add(...config.botJoinRoles);
    }

    private autoVerifyUser(config: AutoRoleConfig, diff: RoleDiff, oldMember: null | GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
        if (!config.memberJoinRoles) return;
    
        logger.trace('Old:', oldMember, 'New:', newMember);
    
        if ((!oldMember || oldMember.pending) && !newMember.pending) {
            logger.info('User verified, adding roles...');
    
            diff.add(...config.memberJoinRoles);
       }
    }

    private autoAssignments(config: AutoRoleConfig, diff: RoleDiff, oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
        if (!config.assignments || config.assignments.length === 0) return;
    
        logger.trace('Auto Assignments!');
    
        for (const assignment of config.assignments) {
            if (assignment.disabled || !assignment.validationRoles) continue;
    
            logger.trace('Validation roles detected...');
    
            const previouslyHadRole = hasAnyRole(oldMember, assignment.validationRoles);
            const currentlyHasRole = hasAnyRole(newMember, assignment.validationRoles);
    
            if (previouslyHadRole === currentlyHasRole) continue;
    
            logger.trace(`Change detected... (${currentlyHasRole})`);
    
            if (currentlyHasRole) {
                logger.trace('Validation roles added...');
                
                if (assignment.trueRoles) diff.add(...assignment.trueRoles);
                if (assignment.falseRoles) diff.remove(...assignment.falseRoles);
           } else {
                logger.trace('Validation roles removed...');
    
                if (assignment.trueRoles) diff.remove(...assignment.trueRoles);
                if (assignment.falseRoles) diff.add(...assignment.falseRoles);
           }
       }
    }
}
