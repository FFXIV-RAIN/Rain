import {Client} from 'discord.js';
import {Logger, LOG_LEVEL} from '@rain/logger';
import {RainError} from './errors/RainError';
import {StringUtils} from './utils/StringUtils';
import {getCronHooks} from './decorators';
import {CronManager} from './managers/CronManager';
import {RainCommandModule} from './modules/RainCommandModule';
import type {IModule, RSConfig, SanitizedRSConfig} from './@types';

export * from './decorators';
export * from './errors';
export * from './@types';

export class RainBot {
    private config: SanitizedRSConfig;
    
    public logger: Logger;
    public client: Client;
    public commands: RainCommandModule;

    public static async Initialize(config: RSConfig): Promise<RainBot> {
        const bot = new RainBot(config);

        await bot.client.login(config.token);

        return bot;
    }

    private constructor(config: RSConfig) {
        this.config = {
            logLevel: LOG_LEVEL.INFO,
            ...config,
        };

        this.logger = new Logger({
            level: this.config.logLevel
        });

        this.client = new Client({
            partials: this.config.partials,
            intents: this.config.intents
        });

        this.commands = new RainCommandModule(this.config);

        this.addModule(this.commands);
    }

    addModules(modules: IModule[]) {
        for (const module of modules) {
            this.addModule(module);
        }
    }

    addModule(module: IModule) {
        this.logger.trace(`Registering hooks for "${module.name}" module~`);

        if (module.onInitialize) module.onInitialize(this);
        if (module.onGuildMemberAdd) this.hook(module, 'onGuildMemberAdd');
        if (module.onGuildMemberUpdate) this.hook(module, 'onGuildMemberUpdate');
        if (module.onInteractionCreate) this.hook(module, 'onInteractionCreate');
        this.cron(module);

        this.logger.trace(`Finished registering hooks for the "${module.name}" module!!`);
        this.logger.info(`"${module.name}" module setup successfully!~`);
    }

    private hook(module: IModule, eventFunction: 'onGuildMemberAdd' | 'onGuildMemberUpdate' | 'onInteractionCreate') {
        const listener: any = module[eventFunction];
        const event: string = StringUtils.lowercaseChar(eventFunction.replace('on', ''), 0);

        if (!listener) return;

        this.logger.trace(`Detected "${event}" for "${module.name}"!!`);

        this.client.on(event, async (...args) => {
            try {
                await listener.bind(module)(this, ...args);
            } catch (error: any) {
                if (error instanceof RainError) {
                    this.logger.log(error.level, error.message);
                } else {
                    this.logger.error(error.toString());
                }
            }
        });
    }

    private cron(module: IModule): void {
        const hooks = getCronHooks(module);

        if (hooks.length === 0) return;

        for (const hook of hooks) {
            CronManager.cron(hook, this);
        }
    }
}

export namespace RainBot {
    export interface Listeners {
        tick: Listeners.Tick[];
    }

    export namespace Listeners {
        export type Unified = Tick;
        export type Tick = (client: Client, msOfLastUpdate: number) => void;
    }

    export type ListenerTypes = keyof Listeners;

}