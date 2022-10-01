import chalk from 'chalk';
import {LOG_LEVEL} from '../@types';
import {StringifySafe} from './json';
export * from '../@types';

const formatters = {
    [LOG_LEVEL.SILLY]: chalk.cyanBright,
    [LOG_LEVEL.TRACE]: chalk.greenBright,
    [LOG_LEVEL.INFO]: chalk.blueBright,
    [LOG_LEVEL.WARN]: chalk.yellow,
    [LOG_LEVEL.ERROR]: chalk.red
}

export class Logger {
    private _options: Logger.Options;

    constructor(options: Logger.Options) {
        this._options = options;
   }

    log(level: LOG_LEVEL, ...messages: Logger.Messages): void {
        if (this._options.level >= level) {
            console.log(`[${formatters[level](LOG_LEVEL[level])}]:`, messages.map((message) => typeof (message) === 'string' ? message : StringifySafe(message)).join(', '));
       }
   }

    silly(...messages: Logger.Messages): void {
        this.log(LOG_LEVEL.SILLY, ...messages);
   }

    trace(...messages: Logger.Messages): void {
        this.log(LOG_LEVEL.TRACE, ...messages);
   }

    info(...messages: Logger.Messages): void {
        this.log(LOG_LEVEL.INFO, ...messages);
   }

    warn(...messages: Logger.Messages): void {
        this.log(LOG_LEVEL.WARN, ...messages);
   }

    error(...messages: Logger.Messages): void {
        this.log(LOG_LEVEL.ERROR, ...messages);
   }
}

export namespace Logger {
    export interface Options {
        level: LOG_LEVEL;
   }

   export type Messages = (undefined|null|number|string|boolean|object)[];
}

export const logger = new Logger({
    level: process.env.LOG_LEVEL as unknown as LOG_LEVEL || LOG_LEVEL.INFO
});