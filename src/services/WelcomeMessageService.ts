import {APIInteractionGuildMember} from 'discord-api-types/v9';
import {Guild, GuildMember, MessageOptions, PartialGuildMember} from 'discord.js';
import {logger} from '../utils/logger';
import {convertMessageTemplateToMessage} from '../utils/message';
import {GuildMessageTemplateService} from './GuildMessageTemplateService';
import {WelcomeConfigService} from './WelcomeConfigService';

export class WelcomeMessageService {
    static async createWelcomeMessage(guild: Guild|null, member: GuildMember | APIInteractionGuildMember | PartialGuildMember | null): Promise<WelcomeMessageService.MessageContainer|null> {
        if (!guild || !member) return null;

        const welcome = await WelcomeConfigService.findByGuildId(guild.id);
    
        logger.trace('WelcomeConfig:', welcome, 'Bot:', member.user.bot);
    
        if (!welcome || welcome.disabled || !welcome.channelId || !welcome.messageTemplateId || (welcome.ignoreBots && member.user.bot)) return null;

        logger.trace(`Getting Template...`);
    
        const messageTemplate = await GuildMessageTemplateService.findById(welcome.messageTemplateId);
    
        logger.trace(`Template retrieved! (exists: ${Boolean(messageTemplate)})`);
    
        if (!messageTemplate) return null;
    
        logger.trace(`Sending welcome message...`);
        
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