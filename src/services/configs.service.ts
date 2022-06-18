import { Config } from '../db/models/Config';
import { WelcomeConfig } from '../db/models/modules/WelcomeConfig';
import { AutoRoleConfig } from '../db/models/modules/AutoRoleConfig';

export class Configs {
    static async config(guildId: string): Promise<Config|null> {
        return await Config.findByPk(guildId);
    }

    static async autoRole(guildId: string): Promise<AutoRoleConfig|null> {
        return await AutoRoleConfig.findByPk(guildId);
    }

    static async welcome(guildId: string): Promise<WelcomeConfig|null> {
        return await WelcomeConfig.findByPk(guildId);
    }
}