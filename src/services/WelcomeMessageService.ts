import { FlarieContext, FlarieError, FlarieMessage } from '@flarie/core';
import { Logger } from '@flarie/logger';
import { convertMessageTemplateToMessage } from '../utils/message';
import { GuildMessageTemplateService } from './GuildMessageTemplateService';
import { WelcomeConfigService } from './WelcomeConfigService';

export class WelcomeMessageService {
  static async createWelcomeMessage(context: FlarieContext): Promise<FlarieMessage> {
    if (!context.isServer()) {
      throw FlarieError.Builder.new()
        .message('Welcome messages are only supported in servers!')
        .error()
        .build();
    }

    const welcome = await WelcomeConfigService.findByGuildId(context.server.id);

    Logger.silly('WelcomeConfig:', welcome, 'Bot:', context.user.bot);

    if (!welcome) {
      throw FlarieError.Builder.new()
        .message('Failed to retrieve the welcome config!')
        .error()
        .build();
    }

    if (welcome.disabled) {
      throw FlarieError.Builder.new()
        .message('The welcome module is currently disabled :3')
        .info()
        .build();
    }

    if (!welcome.channelId) {
      throw FlarieError.Builder.new().message('Please provide a channel id! :3').warn().build();
    }

    if (!welcome.messageTemplateId) {
      throw FlarieError.Builder.new()
        .message(`How did this happen?!? There's no template!`)
        .error()
        .build();
    }

    if (welcome.ignoreBots && context.user.bot) {
      throw FlarieError.Builder.new().message(`Bot detected, ignoring!`).silly().build();
    }

    Logger.silly(`Getting Template...`);

    const messageTemplate = await GuildMessageTemplateService.findById(welcome.messageTemplateId);

    Logger.silly(`Template retrieved! (exists: ${Boolean(messageTemplate)})`);

    if (!messageTemplate) {
      throw FlarieError.Builder.new()
        .message(`You seem to have lost your template!`)
        .error()
        .build();
    }

    Logger.silly(`Returning welcome message...`);

    return convertMessageTemplateToMessage(messageTemplate, {
      guild: {
        name: context.server.name,
      },
      user: {
        id: context.user.id,
      },
    });
  }
}
