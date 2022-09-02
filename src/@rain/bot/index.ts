import {Client} from 'discord.js';
import {Timestamp} from '../../utils/timestamp';
import {IModule} from '../../../types/module';
import {logger} from '../../utils/logger';
import {StringUtils} from '../../utils/string';

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
        if (module.onTick) this.hook(module, 'onTick');
        if (module.onGuildMemberAdd) this.hook(module, 'onGuildMemberAdd');
        if (module.onGuildMemberUpdate) this.hook(module, 'onGuildMemberUpdate');

        logger.trace(`Finished registering hooks for the "${module.name}" module!!`);
        logger.info(`"${module.name}" module setup successfully!~`);
    }

    private hook(module: IModule, eventFunction: 'onGuildMemberAdd' | 'onGuildMemberUpdate' | 'onTick') {
        const listener: any = module[eventFunction];
        const event: any = StringUtils.lowercaseChar(eventFunction.replace('on', ''), 0);

        if (!listener) return;

        logger.trace(`Detected "${event}" for "${module.name}"!!`);

        if (eventFunction === 'onTick') {
            this.on(event, listener.bind(module));
        } else {
            this.client.on(event, listener.bind(module, this.client));
        }
    }

    private on(event: 'tick', listener: RainBot.Listeners.Tick): void;
    private on(event: RainBot.ListenerTypes, listener: RainBot.Listeners.Unified): void {
        const listeners = this._listeners[event];

        if (!listeners) return;

        // TODO: Find a better way of doing this >.>
        if (event === 'tick' && listeners.length === 0) {
            listener(this.client, Timestamp.now().ms);
            setInterval(() => {
                const msOfLastUpdate = Timestamp.now().ms;
                this._listeners.tick.forEach((listener) => listener(this.client, msOfLastUpdate));
            }, Timestamp.UNIT_TYPE_TO_UNIT[Timestamp.UnitTypes.HOUR]);
        }

        listeners.push(listener);
    }

    private off(event: RainBot.ListenerTypes, listener: (client: Client) => void) {
        const listeners = this._listeners[event];

        if (!listeners) return;

        const index = listeners.indexOf(listener);

        if (index === -1) return;

        listeners.splice(index, 1);
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