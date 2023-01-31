import {IModule, Cron, RainBot} from '@rain/bot';
import {logger} from '../utils/logger';
import {ReminderService} from '../services/ReminderService';
import {Reminder} from '../db/models/modules/Reminders/Reminder';
import {Client} from 'discord.js';
import {Timestamp} from 'src/utils/timestamp';

export class ReminderModule implements IModule {
    name = 'Scheduled Messages';
    timeouts: {
        [key: number]: NodeJS.Timeout
    };

    constructor() {
        this.timeouts = [];
    }

    @Cron({
        cron: '0 0 * * *',
        allowInit: true
    })
    public async daily(bot: RainBot) {
        const upcommingReminders = await ReminderService.findUpcommingReminders();

        logger.info(`Detected ${upcommingReminders.length} upcomming reminder(s)...`);
        
        for (const reminder of upcommingReminders) {
            this.add(bot.client, reminder);
        }
    }

    public add(client: Client, reminder: Reminder) {
        if (new Timestamp(reminder.date).isNotToday) return;

        logger.info(`Reminder ${reminder.id} will trigger in ${reminder.timeTill}ms`);
        this.timeout(reminder, async () => {
            const [
                guild,
                channel,
            ] = await Promise.all([
                // TODO: Figure out lazy fetching
                client.guilds.cache.get(reminder.guildId),
                client.channels.cache.get(reminder.channelId)
            ]);

            if (!guild || !channel || !channel.isTextBased()) return;

            await channel.send({
                content: `<@${reminder.userId}> ${reminder.message}`
            });

            await ReminderService.delete(reminder.id);
        });
    }

    public clear(reminder: Reminder) {
        clearTimeout(this.timeouts[reminder.id]);
    }

    private timeout(reminder: Reminder, callback: () => void) {
        this.clear(reminder);
        this.timeouts[reminder.id] = setTimeout(() => {
            callback();
            this.clear(reminder);
        }, reminder.timeTill);
    }
}

export const reminderModule = new ReminderModule();