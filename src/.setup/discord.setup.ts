import { Client, Collection, Intents } from 'discord.js';
import { CONFIG } from '../config';
import { getRainCommands } from '../commands';
import { RainCommand } from '../@types/command';
import { Commands } from '../services/commands.service';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, RainCommand>;
    }
}

export async function setup() {
    const client = new Client({
        partials: [
            'GUILD_MEMBER',
        ],
        intents: [
            Intents.FLAGS.GUILDS, 
            Intents.FLAGS.GUILD_MEMBERS,
        ]
    });

    client.commands = new Collection();
    const commands = await getRainCommands();
    for (const command of commands) {
        client.commands.set(command.data.name, command)
    }

    await Commands.deployCommands(commands);

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