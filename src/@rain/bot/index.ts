import {Client} from 'discord.js';
import {IModule} from '../../../types/module';
import {logger} from '../../utils/logger';
import {StringUtils} from '../../utils/string';

export class RainBot {
    public client: Client;

    constructor(client: Client) {
        this.client = client;
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

        logger.trace(`Finished registering hooks for the "${module.name}" module!!`);
        logger.info(`"${module.name}" module setup successfully!~`);
    }

    private hook(module: IModule, eventFunction: 'onGuildMemberAdd' | 'onGuildMemberUpdate') {
        const listener: any = module[eventFunction];
        const event: any = StringUtils.lowercaseChar(eventFunction.replace('on', ''), 0);

        if (!listener) return;

        logger.trace(`Detected "${event}" for "${module.name}"!!`);

        this.client.on(event, listener.bind(module, this.client));
    }
}