import type {SlashCommandBuilder} from '@discordjs/builders';
import type {CacheType, CommandInteraction} from 'discord.js';

export interface RainCommand {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
}