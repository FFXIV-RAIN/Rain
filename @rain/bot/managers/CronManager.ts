import {Cron} from '../decorators';
import {schedule} from 'node-cron';
import {RainBot} from '..';

export class CronManager {
    private static listeners: {
        [key: string]: Cron.Listener[];
    } = {};

    public static cron(hook: Cron.Hook, bot: RainBot): void {
        if (!this.listeners[hook.cron]) {
            this.listeners[hook.cron] = [];

            schedule(hook.cron, () => CronManager.invoke(hook, bot));
        }

        this.listeners[hook.cron].push(hook.method);
        if (hook.allowInit) hook.method(bot);
    }

    private static invoke(hook: Cron.Hook, bot: RainBot) {
        for (const listener of CronManager.listeners[hook.cron]) {
            listener(bot);
        }
    }
}