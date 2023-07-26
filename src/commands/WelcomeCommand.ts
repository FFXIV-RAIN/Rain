import { WelcomeMessageService } from '../services/WelcomeMessageService';
import { FlarieCommand } from '@flarie/core';
import { Logger } from '@flarie/logger';

export const WelcomeCommand = new FlarieCommand(
  {
    name: 'welcome',
    description: 'Let me welcome all of your new members! c:',
    allowDMs: false,
    disabled: true,
  },
  async (interaction) => {
    const message = await WelcomeMessageService.createWelcomeMessage(interaction.context);

    Logger.silly(`Sending welcome message...`);

    await interaction.reply({
      ...message,
      ephemeral: true,
    });
  }
);
