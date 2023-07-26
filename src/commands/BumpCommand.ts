import { FlarieCommand, FlarieError, FlarieInteraction } from '@flarie/core';
import { Logger } from '@flarie/logger';
import { ScheduledMessagesService } from '../services/ScheduledMessagesService';
import { GuildMessageTemplateService } from '../services/GuildMessageTemplateService';
import { scheduledMessagesModule } from '../modules/ScheduledMessagesModule';
import { convertMessageTemplateToMessage } from '../utils/message';

export const BumpCommand = new FlarieCommand(
  {
    name: 'bump',
    allowDMs: false,
    description: 'Bump the next scheduled message out to the next occurance for the current day',
    disabled: true,
  },
  async (interaction: FlarieInteraction) => {
    if (!interaction.context.isServer()) {
      throw FlarieError.Builder.new()
        .message('Welcome messages are only supported in servers!')
        .error()
        .build();
    }

    const message = await ScheduledMessagesService.findNextMessageByGuildID(
      interaction.context.server.id
    );

    if (message === null) {
      return interaction.reply({
        content: 'There are no pending messages!',
        ephemeral: true,
      });
    }

    Logger.silly('Message found, bumping out the next occurance...');

    scheduledMessagesModule.clear(message);

    const messageTemplate = await GuildMessageTemplateService.findById(message.messageTemplateId);

    if (messageTemplate === null) {
      return interaction.reply({
        content: 'Bumped out the next scheduled message',
        ephemeral: true,
      });
    }

    await interaction.reply({
      ...convertMessageTemplateToMessage(messageTemplate, {
        guild: {
          name: interaction.context.server.name,
        },
        user: {
          id: null,
        },
      }),
      content: 'Bumped out the next occurance of the following message:',
      ephemeral: true,
    });
  }
);
