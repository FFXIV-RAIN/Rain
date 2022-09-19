import {AutoRoleAssignments} from '../db/models/modules/AutoRole/AutoRoleAssignments';
import {AutoRoleConfig} from '../db/models/modules/AutoRole/AutoRoleConfig';

export class AutoRoleConfigService {
    static async findByGuildId(guildId: string, includeAssignments?: boolean): Promise<AutoRoleConfig|null> {
        return await AutoRoleConfig.findByPk(guildId, {
            include: includeAssignments ? [AutoRoleAssignments] : []
       });
    }
}