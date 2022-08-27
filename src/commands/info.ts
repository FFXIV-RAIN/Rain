import {SlashCommandBuilder} from '@discordjs/builders';
import endent from 'endent';
import {RainCommand} from '../../types/command';
import {CONFIG} from '../config';
import {Formatters} from 'discord.js';

export const command: RainCommand = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Y-you want my number!?! >w<'),
    async execute(interaction) {
        await interaction.reply(endent`
            ${Formatters.bold('Environment:')} ${CONFIG.ENVIRONMENT}
            ${Formatters.bold('Version:')} ${CONFIG.VERSION}
        `);
    }
};