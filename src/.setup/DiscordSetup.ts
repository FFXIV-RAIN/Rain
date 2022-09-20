import { Client, Collection, InteractionReplyOptions, Partials } from 'discord.js';
import { CONFIG } from '../config';
import { getRainCommands } from '../commands';
import { RainCommand } from '../@types/command';
import { CommandService } from '../services/CommandService';
import {RainError} from '../errors/RainError';
import {logger} from '../utils/logger';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, RainCommand>;
    }
}

export async function setup() {
    const client = new Client({
        partials: [
            Partials.GuildMember,
        ],
        intents: [
            'Guilds',
            'GuildMembers',
        ]
    });

    client.commands = new Collection();
    const commands = await getRainCommands();
    for (const command of commands) {
        client.commands.set(command.data.name, command)
    }

    await CommandService.deployCommands(commands);

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error: any) {
            if (error instanceof RainError) {
                logger.log(error.level, error.message);
                await interaction.reply({
                    ...error.toMessageOptions(),
                    ephemeral: true 
                } as InteractionReplyOptions);    
            } else {
                logger.error(error.toString());
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }

        if (!interaction.replied) {
            await interaction.reply({
                content: 'Your command completed, but you never told anyone about it! :<',
                ephemeral: true
            });
        }
    });

    await client.login(CONFIG.DISCORD_TOKEN);

    return client;
}