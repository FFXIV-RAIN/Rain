import {Guild} from '../db/models/Guild/Guild';

export class Guilds {
    static async setInactiveStatus(guildId: string, inactive: boolean) {
        await Guild.update({
            inactive,
       }, {
            where: {
                id: guildId,
           }
       });
   }
}