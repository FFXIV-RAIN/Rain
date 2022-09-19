import {WelcomeConfig} from '../db/models/modules/WelcomeConfig';

export class WelcomeConfigService {
    static async findByGuildId(guildId: string): Promise<WelcomeConfig|null> {
        return await WelcomeConfig.findByPk(guildId);
    }
}