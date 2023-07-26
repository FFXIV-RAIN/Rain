import {FlarieCommand, FlarieInteraction, Logger} from '@flarie/core';
import {ScheduledMessagesService} from '../services/ScheduledMessagesService';
// import {convertMessageTemplateToMessage} from '../utils/message';
import {GuildMessageTemplateService} from '../services/GuildMessageTemplateService';

export const BumpCommand = new FlarieCommand({
  name: 'bump',
  allowDMs: false,
  description: 'Bump the next scheduled message out to the next occurance for the current day',
  disabled: true
}, async (interaction: FlarieInteraction) => {
    const message = await ScheduledMessagesService.findNextMessageByGuildID(interaction.context.serverId);

    if (message === null) {
        return interaction.reply({
            content: 'There are no pending messages!',
            ephemeral: true
        });
    }

    Logger.silly('Message found, bumping out the next occurance...');

    // scheduledMessagesModule.clear(message);

    const messageTemplate = await GuildMessageTemplateService.findById(message.messageTemplateId);

    if (messageTemplate === null) {
        return interaction.reply({
            content: 'Bumped out the next scheduled message',
            ephemeral: true
        });
    }

    // await interaction.reply({
    //     ...convertMessageTemplateToMessage(messageTemplate, {
    //         guild: {
    //             name: (interaction.guild as Guild).name,
    //         },
    //         user: {
    //             id: null,
    //         }
    //     }),
    //     content: 'Bumped out the next occurance of the following message:',
    //     ephemeral: true
    // } as InteractionReplyOptions);
});
