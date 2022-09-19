import {Client, GuildMember, PartialGuildMember} from 'discord.js';
import {logger} from '../utils/logger';
import {Configs} from '../services/configs.service';
import {convertMessageTemplateToMessage} from '../utils/message';
import {IModule} from '../@types/module';
import {GuildMessageTemplateService} from '../services/GuildMessageTemplateService';

export class WelcomeModule implements IModule {
    name = 'Welcome Message';

    async onGuildMemberAdd(client: Client, member: GuildMember | PartialGuildMember) {
        const welcome = await Configs.welcome(member.guild.id);
    
        logger.trace('WelcomeConfig:', welcome, 'Bot:', member.user.bot);
    
        if (!welcome || welcome.disabled || !welcome.channelId || !welcome.messageTemplateId || (welcome.ignoreBots && member.user.bot)) return;

        logger.trace(`Getting Template...`);
    
        const messageTemplate = await GuildMessageTemplateService.findById(welcome.messageTemplateId);
    
        logger.trace(`Template retrieved! (exists: ${Boolean(messageTemplate)})`);
    
        if (!messageTemplate) return;

        logger.trace(`Getting channel...`);

        const channel = client.channels.cache.get(welcome.channelId);
    
        logger.trace(`Channel retrieved! (exists: ${Boolean(channel)})`);
    
        if (!channel || !channel.isText()) return;
    
        logger.trace(`Sending welcome message...`);
        
        await channel.send(convertMessageTemplateToMessage(messageTemplate, {
            guild: {
                name: member.guild.name,
            },
            user: {
                id: member.user.id,
            }
        }));
    }
}