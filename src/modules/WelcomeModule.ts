import {Client, GuildMember, PartialGuildMember} from 'discord.js';
import {logger} from '../utils/logger';
import {IModule} from '../@types/module';
import {WelcomeMessageService} from '../services/WelcomeMessageService';

export class WelcomeModule implements IModule {
    name = 'Welcome Message';

    async onGuildMemberAdd(client: Client, member: GuildMember | PartialGuildMember) {
        const container = await WelcomeMessageService.createWelcomeMessage(member.guild, member);
    
        logger.trace(`Getting channel...`);

        const channel = client.channels.cache.get(container.channelId);
    
        logger.trace(`Channel retrieved! (exists: ${Boolean(channel)})`);
    
        if (!channel || !channel.isTextBased()) return;
    
        logger.trace(`Sending welcome message...`);
        
        await channel.send(container.message);
    }
}