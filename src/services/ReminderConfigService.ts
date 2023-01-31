import {ReminderConfig} from '../db/models/modules/Reminders/ReminderConfig';

export class ReminderConfigService {
    static async findByGuildId(guildId: string): Promise<ReminderConfig|null> {
        return await ReminderConfig.findByPk(guildId);
    }
}