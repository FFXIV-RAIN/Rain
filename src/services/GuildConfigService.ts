import {GuildConfig} from '../db/models/Guild/GuildConfig';

export class GuildConfigService {
    static async findByGuildId(guildId: string): Promise<GuildConfig|null> {
        return await GuildConfig.findByPk(guildId);
    }
}