import {SlashCommandBuilder} from '@discordjs/builders';
import {Guild, InteractionReplyOptions} from 'discord.js';
import {RainCommand} from '@rain/bot';
import {logger} from '../utils/logger';
import {ScheduledMessagesService} from '../services/ScheduledMessagesService';
import {convertMessageTemplateToMessage} from '../utils/message';
import {GuildMessageTemplateService} from 'src/services/GuildMessageTemplateService';
import {scheduledMessagesModule} from 'src/modules/ScheduledMessagesModule';

export const command: RainCommand = {
    data: new SlashCommandBuilder()
        .setName('bump')
        .setDescription('Bump the next scheduled message out to the next occurance for the current day')
        .setDefaultMemberPermissions('0')
        .setDMPermission(false),
    async execute(interaction) {
        const message = await ScheduledMessagesService.findNextMessageByGuildID(interaction.guildId as string);

        if (message === null) {
            await interaction.reply({
                content: 'There are no pending messages!',
                ephemeral: true
            } as InteractionReplyOptions);
        } else {
            logger.trace(`Message found, bumping out the next occurance...`);

            scheduledMessagesModule.clear(message);
            
            const messageTemplate = await GuildMessageTemplateService.findById(message.messageTemplateId);

            if (messageTemplate === null) {
                await interaction.reply({
                    content: 'Bumped out the next scheduled message',
                    ephemeral: true
                } as InteractionReplyOptions);
            } else {
                await interaction.reply({
                    ...convertMessageTemplateToMessage(messageTemplate, {
                        guild: {
                            name: (interaction.guild as Guild).name,
                        },
                        user: {
                            id: null,
                        }
                    }),
                    content: 'Bumped out the next occurance of the following message:',
                    ephemeral: true
                } as InteractionReplyOptions);
            }
        }
    }
};