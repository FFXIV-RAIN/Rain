import {GuildMessageEmbedFieldTemplate} from '../db/models/Guild/GuildMessageEmbedFieldTemplate';
import {GuildMessageEmbedTemplate} from '../db/models/Guild/GuildMessageEmbedTemplate';
import {GuildMessageTemplate} from '../db/models/Guild/GuildMessageTemplate';

export class GuildMessageTemplateService {
    static async findById(id: number): Promise<GuildMessageTemplate|null> {
        return await GuildMessageTemplate.findByPk(id, {
            include: [{
                model: GuildMessageEmbedTemplate,
                include: [GuildMessageEmbedFieldTemplate]
            }],
        });
    }
}