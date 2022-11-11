import {ScheduledMessagesService} from '../services/ScheduledMessagesService';
import {IModule, Cron, RainBot} from '@rain/bot';
import {logger} from '../utils/logger';
import {ScheduledMessage} from '../db/models/modules/ScheduledMessages/ScheduledMessage';
import {convertMessageTemplateToMessage} from '../utils/message';
import {GuildMessageTemplateService} from '../services/GuildMessageTemplateService';

export class ScheduledMessagesModule implements IModule {
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
        const upcommingMessages = await ScheduledMessagesService.findUpcommingMessages();

        logger.info(`Detected ${upcommingMessages.length} upcomming message(s)...`);
        
        for (const message of upcommingMessages) {
            logger.info(`Message ${message.id} will trigger in ${message.timeTill}ms`);
            this.timeout(message, async () => {
                const [
                    messageTemplate,
                    guild,
                    channel,
                ] = await Promise.all([
                    // TODO: Figure out lazy fetching
                    GuildMessageTemplateService.findById(message.messageTemplateId),
                    bot.client.guilds.cache.get(message.guildId),
                    bot.client.channels.cache.get(message.channelId)
                ]);

                if (!messageTemplate || !guild || !channel || !channel.isTextBased()) return;

                await channel.send(convertMessageTemplateToMessage(messageTemplate, {
                    guild: {
                        name: guild.name,
                    },
                    user: {
                        id: null,
                    }
                }));
            });
        }
    }

    public clear(message: ScheduledMessage) {
        clearTimeout(this.timeouts[message.id]);
    }

    private timeout(message: ScheduledMessage, callback: () => void) {
        this.clear(message);
        this.timeouts[message.id] = setTimeout(() => {
            callback();
            this.clear(message);
        }, message.timeTill);
    }
}

export const scheduledMessagesModule = new ScheduledMessagesModule();