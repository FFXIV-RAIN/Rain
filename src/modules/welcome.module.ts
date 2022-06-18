import { Client, GuildMember, PartialGuildMember } from 'discord.js';
import { logger } from '../utils/logger';
import { Configs } from '../services/configs.service';
import { parseMessage } from '../utils/message';

export async function onGuildMemberAdd(this: Client, member: GuildMember | PartialGuildMember) {
    const welcome = await Configs.welcome(member.guild.id);

    logger.trace('WelcomeConfig:', welcome, 'Bot:', member.user.bot);

    if (!welcome || welcome.disabled || !welcome.channelId || !welcome.message || (welcome.ignoreBots && member.user.bot)) return;

    logger.trace(`Getting channel...`);

    const channel = await this.channels.cache.get(welcome.channelId);

    logger.trace(`Channel retrieved! (exists: ${Boolean(channel)})`);

    if (!channel || !channel.isText()) return;

    logger.trace(`Sending welcome message...`);
    
    channel.send({
        embeds: [{
            image: {
                url: 'https://imgur.com/1SjRXpE.png'
            },
            description: parseMessage(welcome.message, {
                user: {
                    id: member.user.id,
                }
            }),
            color: '#F7A8B8',
        }],
    });
}

export function setup(client: Client) {
    client.on('guildMemberAdd', onGuildMemberAdd);
}