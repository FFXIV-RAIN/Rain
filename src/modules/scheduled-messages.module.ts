import {Client} from 'discord.js';
import {ScheduledMessagesService} from '../services/scheduled-messages.service';
import {IModule} from '../../types/module';
import {logger} from '../utils/logger';

export class ScheduledMessagesModule implements IModule {
    name = 'Scheduled Messages';

    async onTick(client: Client, msOfLastUpdate: number) {
        const upcommingMessages = await ScheduledMessagesService.findUpcommingMessages(msOfLastUpdate);

        logger.info(`Detected ${upcommingMessages.length} upcomming message(s)...`);

        for (const message of upcommingMessages) {
            console.log(message);
        }
    }
}