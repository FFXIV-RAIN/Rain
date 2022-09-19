import {Guild} from '../db/models/Guild/Guild';

export class GuildService {
    static async findByGuildId(guildId: string): Promise<Guild|null> {
        return await Guild.findByPk(guildId);
    }
    
    static async setInactiveStatus(guildId: string, inactive: boolean) {
        await Guild.update({
            inactive,
       }, {
            where: {
                id: guildId,
           }
       });
   }
}