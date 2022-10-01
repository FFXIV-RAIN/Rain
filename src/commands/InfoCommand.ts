import {SlashCommandBuilder} from '@discordjs/builders';
import endent from 'endent';
import {RainCommand} from '../@rain/bot';
import {CONFIG} from '../config';
import {bold} from 'discord.js';
import {modules} from '../modules';

export const command: RainCommand = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Y-you want my number!?! >w<')
        .setDefaultMemberPermissions('0')
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.reply({
            content: endent`
                ${bold('Environment:')} ${CONFIG.ENVIRONMENT}
                ${bold('Version:')} [${CONFIG.VERSION}](${CONFIG.VERSION_LINK})
                ${bold('Available Modules:')} ${modules.map((module) => module.name).join(', ')}
            `,
            ephemeral: true
        });
    }
};