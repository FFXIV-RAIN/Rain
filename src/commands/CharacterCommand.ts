import {ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder} from '@discordjs/builders';
import {RainCommand} from '@rain/bot';
import {TextInputStyle} from 'discord.js';

export const command: RainCommand = {
    data: new SlashCommandBuilder()
        .setName('character')
        .setDescription('Verify your character!')
        .setDefaultMemberPermissions(null)
        .setDMPermission(false),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setTitle('Verify your Character!')
            .setCustomId('verify-character');

        modal.addComponents([
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents([
                    new TextInputBuilder()
                        .setCustomId('verify-character.server')
                        .setLabel('Server')
                        .setPlaceholder('Famfrit')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                ]),
            new ActionRowBuilder<ModalActionRowComponentBuilder>()
                .addComponents([
                    new TextInputBuilder()
                        .setCustomId('verify-character.name')
                        .setLabel('Character Name')
                        .setPlaceholder('Rain Mi\'ru')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                ])
        ]);

        console.log(modal.toJSON());

        await interaction.showModal(modal);
    }
};