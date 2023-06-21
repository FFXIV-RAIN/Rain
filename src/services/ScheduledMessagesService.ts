import {Op} from 'sequelize';
import {ScheduledMessage} from '../db/models/modules/ScheduledMessages/ScheduledMessage';
import {Timestamp} from '../utils/timestamp';
import {ScheduledMessagesConfig} from '../db/models/modules/ScheduledMessages/ScheduledMessagesConfig';

export class ScheduledMessagesService {
    static async findAllByGuildID(guildId: string): Promise<ScheduledMessage[]|null> {
        return await ScheduledMessage.findAll({
            where: {
                guildId
            }
        });
    }

    static async findUpcommingMessages(): Promise<ScheduledMessage[]> {
        const dayOfWeek = Timestamp.now().dayOfWeek(true);

        return await ScheduledMessage.findAll({
            where: {
                [dayOfWeek]: true,
                minutes: {
                    [Op.gte]: Timestamp.now().round(Timestamp.UnitTypes.MINUTE).timeOfDay() / Timestamp.UNIT_TYPE_TO_UNIT[Timestamp.UnitTypes.MINUTE]
                }
            },
            include: [{
                model: ScheduledMessagesConfig,
                where: {
                    enabled: true
                },
                attributes: [],
                required: true
            }]
        });
    }

    static async findNextMessageByGuildID(guildId: string): Promise<ScheduledMessage|null> {
        const dayOfWeek = Timestamp.now().dayOfWeek(true);

        return await ScheduledMessage.findOne({
            where: {
                guildId,
                [dayOfWeek]: true,
                minutes: {
                    [Op.gte]: Timestamp.now().round(Timestamp.UnitTypes.MINUTE).timeOfDay() / Timestamp.UNIT_TYPE_TO_UNIT[Timestamp.UnitTypes.MINUTE]
                }
            },
            order: [
                ['minutes', 'ASC']
            ]
        });
    }
}