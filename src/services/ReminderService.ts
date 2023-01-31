import {APIInteractionGuildMember} from 'discord-api-types/v10';
import {Guild, Channel, GuildMember, PartialGuildMember} from 'discord.js';
import {RainError} from '@rain/bot';
import {logger} from '../utils/logger';
import {ReminderConfigService} from './ReminderConfigService';
import {Reminder} from '../db/models/modules/Reminders/Reminder';
import {Timestamp} from 'src/utils/timestamp';
import {Op} from 'sequelize';

export class ReminderService {
    static async createReminder(guild: Guild|null, member: GuildMember | APIInteractionGuildMember | PartialGuildMember | null, channel: Channel|null, minutes: number, message: string): Promise<Reminder> {
        if (!guild) {
            throw RainError.Builder.new()
                .message('No guild was specified!')
                .error()
                .build();
        }

        if (!channel) {
            throw RainError.Builder.new()
                .message('No channel was specified!')
                .error()
                .build();
        }

        if (!member) {
            throw RainError.Builder.new()
                .message('No guild member was specified!')
                .error()
                .build();
        }

        const reminder = await ReminderConfigService.findByGuildId(guild.id);
    
        logger.trace('ReminderConfig:', reminder);

        if (!reminder) {
            throw RainError.Builder.new()
                .message('Failed to retrieve the reminder config!')
                .error()
                .build();
        }

        if (reminder.disabled) {
            throw RainError.Builder.new()
                .message('The reminder module is currently disabled :3')
                .info()
                .build();
        }

        return Reminder.create({
            guildId: guild.id,
            channelId: channel.id,
            date: new Date(Timestamp.now().add(Timestamp.UnitTypes.MINUTE, minutes).ms),
            message,
            userId: member.user.id
        });
    }

    static async findUpcommingReminders(): Promise<Reminder[]> {
        return await Reminder.findAll({
            where: {
                date: {
                    [Op.gte]: Timestamp.now().round(Timestamp.UnitTypes.MINUTE).timeOfDay() / Timestamp.UNIT_TYPE_TO_UNIT[Timestamp.UnitTypes.MINUTE]
                }
            }
        });
    }

    static async delete(id: number) {
        await Reminder.destroy({
            where: {
                id
            }
        })
    }
}