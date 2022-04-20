import { Client, MessageActionRow, MessageButton, MessageOptions, TextChannel } from 'discord.js';
import { CUSTOM_IDS } from './constants/components';
import { redis } from './database';

export async function modMailSetup(client: Client) {
    const db = await redis();

    const [messageID, channel] = await Promise.all([
        db.get('modMailMessageID'),
        client.channels.cache.get('966361080559448074') as TextChannel
    ])
    
    const messageContents: MessageOptions = {
        embeds: [{
            color: '#F7A8B8',
            image: {
                url: 'https://i.imgur.com/FElNX4W.png'
            },
        }, {
            description: `In an attempt to provide you an easy method of contacting us we've implemented a simple modal that allows you to quickly get a message to one of our mods!`,
            color: '#F7A8B8',
            title: 'Mod Mail~',
            image: {
                url: 'https://imgur.com/1SjRXpE.png'
            },
        }],
        components: [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(CUSTOM_IDS.MOD_MAIL)
                    .setLabel('Mod Mail')
                    .setStyle('SECONDARY')
                    .setEmoji(':moogle_mail:966379588303355924')
            )
        ]
    };

    if (messageID) {
        const message = await channel.messages.fetch(messageID);

        await message.edit(messageContents);
    } else {
        const message = await channel.send(messageContents);

        await db.set('modMailMessageID', message.id);
    }
}