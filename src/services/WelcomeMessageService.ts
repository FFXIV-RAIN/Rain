import {APIInteractionGuildMember} from 'discord-api-types/v10';
import {Guild, GuildMember, MessageOptions, PartialGuildMember} from 'discord.js';
import {LOG_LEVEL} from '../@types/logger';
import {RainError} from '../errors/RainError';
import {logger} from '../utils/logger';
import {convertMessageTemplateToMessage} from '../utils/message';
import {GuildMessageTemplateService} from './GuildMessageTemplateService';
import {WelcomeConfigService} from './WelcomeConfigService';

export class WelcomeMessageService {
    static async createWelcomeMessage(guild: Guild|null, member: GuildMember | APIInteractionGuildMember | PartialGuildMember | null): Promise<WelcomeMessageService.MessageContainer> {
        if (!guild) {
            throw RainError.Builder.new()
                .message('No guild was specified!')
                .level(LOG_LEVEL.ERROR)
                .build();
        }

        if (!member) {
            throw RainError.Builder.new()
                .message('No guild member was specified!')
                .level(LOG_LEVEL.ERROR)
                .build();
        }

        const welcome = await WelcomeConfigService.findByGuildId(guild.id);
    
        logger.trace('WelcomeConfig:', welcome, 'Bot:', member.user.bot);

        if (!welcome) {
            throw RainError.Builder.new()
                .message('Failed to retrieve the welcome config!')
                .level(LOG_LEVEL.ERROR)
                .build();
        }

        if (welcome.disabled) {
            throw RainError.Builder.new()
                .message('The welcome module is currently disabled :3')
                .level(LOG_LEVEL.INFO)
                .build();
        }

        if (!welcome.channelId) {
            throw RainError.Builder.new()
                .message('Please provide a channel id! :3')
                .level(LOG_LEVEL.WARN)
                .build();
        }

        if (!welcome.messageTemplateId) {
            throw RainError.Builder.new()
                .message(`How did this happen?!? There's no template!`)
                .level(LOG_LEVEL.ERROR)
                .build();
        }

        if (welcome.ignoreBots && member.user.bot) {
            throw RainError.Builder.new()
                .message(`Bot detected, ignoring!`)
                .level(LOG_LEVEL.TRACE)
                .build();
        }

        logger.trace(`Getting Template...`);
    
        const messageTemplate = await GuildMessageTemplateService.findById(welcome.messageTemplateId);
    
        logger.trace(`Template retrieved! (exists: ${Boolean(messageTemplate)})`);
    
        if (!messageTemplate) {
            throw RainError.Builder.new()
                .message(`You seem to have lost your template!`)
                .level(LOG_LEVEL.ERROR)
                .build();
        }
    
        logger.trace(`Returning welcome message...`);
        
        return {
            channelId: welcome.channelId,
            message: convertMessageTemplateToMessage(messageTemplate, {
                guild: {
                    name: guild.name,
                },
                user: {
                    id: member.user.id,
                }
            })
        };
    }
}

export namespace WelcomeMessageService {
    export type MessageContainer = {
        channelId: string;
        message: MessageOptions;
    }
}