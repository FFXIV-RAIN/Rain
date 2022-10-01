import {CacheType, Collection, Interaction, InteractionReplyOptions, REST, Routes} from 'discord.js';
import {Logger} from '@rain/logger';
import {IModule} from '../@types/module';
import {RainCommand, SanitizedRSConfig} from '../@types';
import {RainBot, RainError} from '..';

export class RainCommandModule implements IModule {
    name = 'Command';

    private config: SanitizedRSConfig;
    private logger: Logger;
    private commands: Collection<string, RainCommand>;

    constructor(config: SanitizedRSConfig) {
        this.config = config;
        this.logger = new Logger({
            level: this.config.logLevel
        });
        this.commands = new Collection();
    }

    async unpublish() {
        this.commands.clear();

        const rest = new REST({ version: '10' }).setToken(this.config.token);

        await rest.put(Routes.applicationCommands(this.config.clientId), { body: [] })

        this.logger.info('Successfully deleted all application commands.');
    }

    async publish(commands: RainCommand[]) {
        const rest = new REST({ version: '10' }).setToken(this.config.token);

        try {
            await this.unpublish();

            for (const command of commands) {
                this.commands.set(command.data.name, command);
            }

            await rest.put(Routes.applicationCommands(this.config.clientId), {
                body: this.commands.map(({ data }) => data.toJSON())
            });

            this.logger.info('Successfully registered application commands.');
        } catch (error) {
            console.error(error);
        }
    }

    async onInteractionCreate(_: RainBot, interaction: Interaction<CacheType>) {
        if (!interaction.isCommand()) return;

        const command = this.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error: any) {
            if (error instanceof RainError) {
                this.logger.log(error.level, error.message);
                await interaction.reply({
                    ...error.toMessageOptions(),
                    ephemeral: true 
                } as InteractionReplyOptions);    
            } else {
                this.logger.error(error?.stack || error.toString());
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }

        if (!interaction.replied) {
            await interaction.reply({
                content: 'Your command completed, but you never told anyone about it! :<',
                ephemeral: true
            });
        }
    }
}