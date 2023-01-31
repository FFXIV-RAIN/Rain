import {ReminderConfig} from '../db/models/modules/Reminders/ReminderConfig';

export class ReminderConfigService {
    static async findByGuildId(guildId: string): Promise<ReminderConfig|null> {
        let config = await ReminderConfig.findByPk(guildId);

        if (!config) {
            config = await ReminderConfig.create({
                guildId,
                enabled: true
            });
        }

        return config;
    }
}