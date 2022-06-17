import { Client, GuildMember, PartialGuildMember } from 'discord.js';
import { userMention, roleMention, channelMention, inlineCode, formatEmoji } from '@discordjs/builders';
import endent from 'endent';
import { ROLES } from '../roles';
import { WelcomeConfig } from '../db/models/modules/WelcomeConfig';

export async function onGuildMemberAdd(this: Client, member: GuildMember | PartialGuildMember) {
    const welcome = await WelcomeConfig.findByPk(member.guild.id);

    if (!welcome || welcome.disabled || !welcome.channelID) return;

    const channel = await this.channels.cache.get(welcome.channelID);

    if (!channel || !channel.isText()) return;

    channel.send({
        embeds: [{
            image: {
                url: 'https://imgur.com/1SjRXpE.png'
            },
            description: endent`
                **Welcome to Rainbow Café, ${userMention(member.user.id)}** ${formatEmoji('966058854519537775')}
                　
                Please read and accept the rules below! Afterward, you'll be granted the 'Guest' role. This role is for players that aren't part of the FC!
                　
                If you are part of the FC head on over to ${channelMention('966194062329774141')} after accepting the rules and type ${inlineCode('!verifyme')} and it'll setup your rank!
                　
                - ${roleMention(ROLES.WELCOME_WAGON)}, ${roleMention(ROLES.CAFE_MANAGERS)}, and ${roleMention(ROLES.CAFE_CAREGIVERS)}
            `,
            color: '#F7A8B8',
        }],
    });
}

export function setup(client: Client) {
    client.on('guildMemberAdd', onGuildMemberAdd);
}