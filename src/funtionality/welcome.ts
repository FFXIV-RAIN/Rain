import { Client, GuildMember, PartialGuildMember } from 'discord.js';
import { userMention, roleMention } from '@discordjs/builders';
import endent from 'endent';
import { CONFIG } from '../config';

export async function onGuildMemberAdd(this: Client, member: GuildMember | PartialGuildMember) {
    const channel = await this.channels.cache.get(CONFIG.WELCOME_CHANNEL_ID);

    if (channel?.isText()) {
        channel.send({
            embeds: [{
                image: {
                    url: 'https://imgur.com/1SjRXpE.png'
                },
                description: endent`
                    **Welcome to Rainbow Café, ${userMention(member.user.id)}** <:wave:966058854519537775>
                    　
                    Please read and accept the rules below! Afterward, you'll be granted the \'Guest\' role. This role is for players that aren't part of the FC!
                    　
                    If you are part of the FC head on over to <#966194062329774141> after accepting the rules and type \`!verifyme\` and it'll setup your rank!
                    　
                    - ${roleMention('966056005886677052')}, ${roleMention('965769109461676053')}, and ${roleMention('965675644526690346')}
                `,
                color: '#F7A8B8',
            }],
        })
}
}

export function welcomeSetup(client: Client) {
    client.on('guildMemberAdd', onGuildMemberAdd);
}