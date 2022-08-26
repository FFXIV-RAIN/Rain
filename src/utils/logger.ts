import chalk from 'chalk';
import {LOG_LEVEL} from '../../types/logger';
import {CONFIG} from '../config';
import {StringifySafe} from './json';

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

    log(level: LOG_LEVEL, ...messages: any[]): void {
        if (this._options.level >= level) {
            console.log(`[${formatters[level](LOG_LEVEL[level])}]:`, messages.map((message) => typeof (message) === 'string' ? message : StringifySafe(message)).join(', '));
       }
   }

    silly(...messages: any[]): void {
        this.log(LOG_LEVEL.SILLY, ...messages);
   }

    trace(...messages: any[]): void {
        this.log(LOG_LEVEL.TRACE, ...messages);
   }

    info(...messages: any[]): void {
        this.log(LOG_LEVEL.INFO, ...messages);
   }

    warn(...messages: any[]): void {
        this.log(LOG_LEVEL.WARN, ...messages);
   }

    error(...messages: any[]): void {
        this.log(LOG_LEVEL.ERROR, ...messages);
   }
}

export namespace Logger {
    export interface Options {
        level: LOG_LEVEL;
   }
}

export const logger = new Logger({
    level: CONFIG.LOG_LEVEL
})