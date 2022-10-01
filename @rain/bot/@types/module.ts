import {CacheType, GuildMember, Interaction, PartialGuildMember} from 'discord.js';
import {RainBot} from '..';

export interface IModule {
    name: string;

    /**
     * Setup functionality for your module.
     */
    onInitialize?(bot: RainBot): void;

    /**
     * Fires off when a guild member is added to the server.
     * @param member - The guild member added
     */
    onGuildMemberAdd?(bot: RainBot, member: GuildMember | PartialGuildMember): void;

    /**
     * Fires off when a guild member is updated on the server.
     * @param oldMember - The guild member before the update
     * @param newMember - The guild member after the update
     */
    onGuildMemberUpdate?(bot: RainBot, oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember): void;

    /**
     * Fires off when any interactions occur.
     * @param interaction - the interaction that occurred
     */
    onInteractionCreate?(bot: RainBot, interaction: Interaction<CacheType>): void;
}