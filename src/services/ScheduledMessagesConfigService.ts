import {ScheduledMessagesConfig} from '../db/models/modules/ScheduledMessages/ScheduledMessagesConfig';

export class ScheduledMessagesConfigService {
    static async findByGuildID(guildId: string): Promise<ScheduledMessagesConfig|null> {
        return await ScheduledMessagesConfig.findByPk(guildId);
    }
}