import {SlashCommandBuilder} from '@discordjs/builders';
import {CacheType, CommandInteraction} from 'discord.js';

export interface RainCommand {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
}