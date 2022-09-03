import {Op} from 'sequelize/types';
import {ScheduledMessage} from '../db/models/modules/ScheduledMessages/ScheduledMessage';
import {ScheduledMessagesConfig} from '../db/models/modules/ScheduledMessages/ScheduledMessagesConfig';
import {Timestamp} from '../utils/timestamp';

export class ScheduledMessagesService {
    static async findConfigByGuildID(guildId: string): Promise<ScheduledMessagesConfig|null> {
        return await ScheduledMessagesConfig.findByPk(guildId);
    }

    static async findUpcommingMessages(): Promise<ScheduledMessage[]> {
        const dayOfWeek = Timestamp.now().dayOfWeek(true);

        return await ScheduledMessage.findAll({
            where: {
                [dayOfWeek]: true,
                minutes: {
                    [Op.gte]: Timestamp.now().ms % Timestamp.UNIT_TYPE_TO_UNIT[Timestamp.UnitTypes.DAY]
                }
            }
        });
    }

    static async findMessagesByGuildID(guildId: string): Promise<ScheduledMessage|null> {
        return await ScheduledMessage.findByPk(guildId);
    }
}