import {GuildMessageTemplate} from '../db/models/Guild/GuildMessageTemplate';

export class GuildMessageTemplateService {
    static async findById(id: number): Promise<GuildMessageTemplate|null> {
        return await GuildMessageTemplate.findByPk(id);
    }
}