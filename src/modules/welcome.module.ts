import { Client, GuildMember, PartialGuildMember } from 'discord.js';
import { Configs } from '../services/configs.service';
import { parseMessage } from '../utils/message';

export async function onGuildMemberAdd(this: Client, member: GuildMember | PartialGuildMember) {
    const welcome = await Configs.welcome(member.guild.id);

    if (!welcome || welcome.disabled || !welcome.channelId || !welcome.message) return;

    const channel = await this.channels.cache.get(welcome.channelId);

    if (!channel || !channel.isText()) return;
    
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