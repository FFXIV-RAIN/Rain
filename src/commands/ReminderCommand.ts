import {SlashCommandBuilder} from '@discordjs/builders';
import {InteractionReplyOptions} from 'discord.js';
import {RainCommand} from '@rain/bot';
import {logger} from '../utils/logger';
import {ReminderService} from 'src/services/ReminderService';
import {reminderModule} from 'src/modules/ReminderModule';

export const command: RainCommand = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Set a reminder!')
        .setDefaultMemberPermissions('0')
        .setDMPermission(false)
        .addIntegerOption((option) => {
            return option.setName('minutes')
                .setRequired(true)
                .setDescription('The number of minutes to wait before sending a reminder');
        })
        .addStringOption((option) => {
            return option.setName('message')
                .setRequired(true)
                .setDescription(`The message you'd like the bot to send you!`);
        }),
    async execute(interaction) {
        const reminder = await ReminderService.createReminder(
            interaction.guild, 
            interaction.member,
            interaction.channel, 
            interaction.options.get('minutes', true).value as number,
            interaction.options.get('message', true).value as string
        );

        reminderModule.add(interaction.client, reminder);

        logger.trace(`Sending reminder response...`);
        
        await interaction.reply({
            content: 'Reminder saved successfully!',
            ephemeral: true
        } as InteractionReplyOptions);
    }
};