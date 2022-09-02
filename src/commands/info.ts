import {SlashCommandBuilder} from '@discordjs/builders';
import endent from 'endent';
import {RainCommand} from '../../types/command';
import {CONFIG} from '../config';
import {Formatters} from 'discord.js';
import {modules} from '../modules';

export const command: RainCommand = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Y-you want my number!?! >w<'),
    async execute(interaction) {
        await interaction.reply({
            content: endent`
                ${Formatters.bold('Environment:')} ${CONFIG.ENVIRONMENT}
                ${Formatters.bold('Version:')} ${CONFIG.VERSION}
                ${Formatters.bold('Available Modules:')} ${modules.map((module) => module.name).join(', ')}
            `,
            ephemeral: true
        });
    }
};