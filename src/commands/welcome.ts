import {SlashCommandBuilder} from '@discordjs/builders';
import {InteractionReplyOptions} from 'discord.js';
import {RainCommand} from '../@types/command';
import {WelcomeMessageService} from '../services/WelcomeMessageService';
import {logger} from '../utils/logger';

export const command: RainCommand = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Let me welcome all of your new members! c:'),
    async execute(interaction) {
        const container = await WelcomeMessageService.createWelcomeMessage(interaction.guild, interaction.member);

        logger.trace(`Sending welcome message...`);
        
        await interaction.reply({
            ...container.message,
            ephemeral: true
        } as InteractionReplyOptions);
    }
};