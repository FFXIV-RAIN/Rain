import {Client} from 'discord.js';
import {ScheduledMessagesService} from '../services/scheduled-messages.service';
import {IModule} from '../../types/module';
import {logger} from '../utils/logger';
import {Cron} from '../@rain/bot';
import {ScheduledMessage} from '../db/models/modules/ScheduledMessages/ScheduledMessage';
import {convertMessageTemplateToMessage} from '../utils/message';

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
    public async daily(client: Client) {
        const upcommingMessages = await ScheduledMessagesService.findUpcommingMessages();

        logger.info(`Detected ${upcommingMessages.length} upcomming message(s)...`);
        
        for (const message of upcommingMessages) {
            logger.info(`Message ${message.id} will trigger in ${message.timeTill}ms`);
            this.timeout(message, async () => {
                const guild = await client.guilds.cache.get(message.guildId);

                if (!guild) return;

                const channel = await client.channels.cache.get(message.channelId);

                if (!channel || !channel.isText()) return;

                const processedMessage = convertMessageTemplateToMessage(message.messageTemplate, {
                    guild: {
                        name: guild.name,
                    },
                    user: {
                        id: null,
                    }
                });

                if (!processedMessage) return;

                await channel.send(processedMessage);
            });
        }
    }

    private clear(message: ScheduledMessage) {
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
