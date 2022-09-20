import {Client} from 'discord.js';
import {IModule} from '../../@types/module';
import {RainError} from '../../errors/RainError';
import {logger} from '../../utils/logger';
import {StringUtils} from '../../utils/string';
import {getCronHooks} from './decorators';
import {CronManager} from './managers/cron.manager';
export * from './decorators';

export class RainBot {
    public client: Client;
    private _listeners: {
        tick: ((client: Client, msOfLastUpdate: number) => void)[];
    };

    constructor(client: Client) {
        this.client = client;
        this._listeners = {
            tick: [],
        };
    }

    addModules(modules: IModule[]) {
        for (const module of modules) {
            this.addModule(module);
        }
    }

    addModule(module: IModule) {
        logger.trace(`Registering hooks for "${module.name}" module~`);

        if (module.onInitialize) module.onInitialize(this.client);
        if (module.onGuildMemberAdd) this.hook(module, 'onGuildMemberAdd');
        if (module.onGuildMemberUpdate) this.hook(module, 'onGuildMemberUpdate');
        this.cron(module);

        logger.trace(`Finished registering hooks for the "${module.name}" module!!`);
        logger.info(`"${module.name}" module setup successfully!~`);
    }

    private hook(module: IModule, eventFunction: 'onGuildMemberAdd' | 'onGuildMemberUpdate') {
        const listener: any = module[eventFunction];
        const event: string = StringUtils.lowercaseChar(eventFunction.replace('on', ''), 0);

        if (!listener) return;

        logger.trace(`Detected "${event}" for "${module.name}"!!`);

        this.client.on(event, async (...args) => {
            try {
                await listener(this.client, ...args);
            } catch (error: any) {
                if (error instanceof RainError) {
                    logger.log(error.level, error.message);
                } else {
                    logger.error(error.toString());
                }
            }
        });
    }

    private cron(module: IModule): void {
        const hooks = getCronHooks(module);

        if (hooks.length === 0) return;

        for (const hook of hooks) {
            CronManager.cron(hook, this.client);
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