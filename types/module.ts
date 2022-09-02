import {Client, GuildMember, PartialGuildMember} from 'discord.js';

export interface IModule {
    name: string;

    /**
     * Setup functionality for your module.
     */
    onInitialize?(client: Client): void;

    /**
     * Fires off every minute
     */
    onTick?(client: Client, msOfLastUpdate: number): void;

    /**
     * Fires off when a guild member is added to the server.
     * @param member - The guild member added
     */
    onGuildMemberAdd?(client: Client, member: GuildMember | PartialGuildMember): void;

    /**
     * Fires off when a guild member is updated on the server.
     * @param oldMember - The guild member before the update
     * @param newMember - The guild member after the update
     */
    onGuildMemberUpdate?(client: Client, oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember): void;
}