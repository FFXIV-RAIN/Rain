import {Client} from 'discord.js';
import {Cron} from '../decorators';
import {schedule} from 'node-cron';

export class CronManager {
    private static listeners: {
        [key: string]: Cron.Listener[];
    } = {};

    public static cron(hook: Cron.Hook, client: Client): void {
        if (!this.listeners[hook.cron]) {
            this.listeners[hook.cron] = [];

            schedule(hook.cron, () => CronManager.invoke(hook, client));
        }

        this.listeners[hook.cron].push(hook.method);
        if (hook.allowInit) hook.method(client);
    }

    private static invoke(hook: Cron.Hook, client: Client) {
        for (const listener of CronManager.listeners[hook.cron]) {
            listener(client);
        }
    }
}