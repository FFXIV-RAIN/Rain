import { Client, Collection, Partials } from 'discord.js';
import { CONFIG } from '../config';
import { getRainCommands } from '../commands';
import { RainCommand } from '../@types/command';
import { CommandService } from '../services/CommandService';

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
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });

    await client.login(CONFIG.DISCORD_TOKEN);

    return client;
}