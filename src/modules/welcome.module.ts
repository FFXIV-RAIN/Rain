import {Client, GuildMember, PartialGuildMember} from 'discord.js';
import {logger} from '../utils/logger';
import {Configs} from '../services/configs.service';
import {parseMessage} from '../utils/message';
import {IModule} from '../../types/module';

export class WelcomeModule implements IModule {
    name = 'Welcome Message';

    async onGuildMemberAdd(client: Client, member: GuildMember | PartialGuildMember) {
        const welcome = await Configs.welcome(member.guild.id);
    
        logger.trace('WelcomeConfig:', welcome, 'Bot:', member.user.bot);
    
        if (!welcome || welcome.disabled || !welcome.channelId || !welcome.message || (welcome.ignoreBots && member.user.bot)) return;
    
        logger.trace(`Getting channel...`);
    
        const channel = await client.channels.cache.get(welcome.channelId);
    
        logger.trace(`Channel retrieved! (exists: ${Boolean(channel)})`);
    
        if (!channel || !channel.isText()) return;
    
        logger.trace(`Sending welcome message...`);
        
        await channel.send({
            embeds: [{
                image: {
                    url: 'https://imgur.com/1SjRXpE.png'
               },
                description: parseMessage(welcome.message, {
                    guild: {
                        name: member.guild.name,
                    },
                    user: {
                        id: member.user.id,
                    }
                }),
                color: '#F7A8B8',
           }],
       });
    }
}