import { GuildConfig } from '../db/models/GuildConfig';
import { WelcomeConfig } from '../db/models/modules/WelcomeConfig';
import { AutoRoleConfig } from '../db/models/modules/AutoRoleConfig';
import { AutoRoleAssignments } from '../db/models/modules/AutoRoleAssignments';

export class Configs {
    static async config(guildId: string): Promise<GuildConfig|null> {
        return await GuildConfig.findByPk(guildId);
    }

    static async autoRole(guildId: string, includeAssignments?: boolean): Promise<AutoRoleConfig|null> {
        return await AutoRoleConfig.findByPk(guildId, {
            include: includeAssignments ? [AutoRoleAssignments] : []
        });
    }

    static async welcome(guildId: string): Promise<WelcomeConfig|null> {
        return await WelcomeConfig.findByPk(guildId);
    }
}