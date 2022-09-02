import {Op} from 'sequelize';
import {ScheduledMessage} from '../db/models/modules/ScheduledMessages/ScheduledMessage';
import {ScheduledMessagesConfig} from '../db/models/modules/ScheduledMessages/ScheduledMessagesConfig';
import {Timestamp} from '../utils/timestamp';

export class ScheduledMessagesService {
    static async findConfigByGuildID(guildId: string): Promise<ScheduledMessagesConfig|null> {
        return await ScheduledMessagesConfig.findByPk(guildId);
    }

    static async findUpcommingMessages(startTime: number): Promise<ScheduledMessage[]> {
        return await ScheduledMessage.findAll({
            where: {
                date: {
                    [Op.between]: [
                        startTime, 
                        new Timestamp(startTime).ceil(Timestamp.UnitTypes.MINUTE).ms
                    ]
                }
            }
        });
    }

    static async findMessagesByGuildID(guildId: string): Promise<ScheduledMessage|null> {
        return await ScheduledMessage.findByPk(guildId);
    }
}