import { Client, Message, TextChannel, MessageOptions } from "discord.js";

export async function updateOrSave(client: Client, channelID: string, messageID: string | null, contents: MessageOptions) {
    const channel = client.channels.cache.get(channelID) as TextChannel;

    let message: Message | null = null;

    try {
        message = messageID ? await channel.messages.fetch(messageID) : null;
    } catch (error: any) {
        if (error.httpStatus !== 404) {
            throw error;
        }
    }

    if (message) {
        await message.edit(contents);
    } else {
        message = await channel.send(contents);
    }

    return message.id;
}