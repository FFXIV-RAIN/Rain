import chalk from 'chalk';
import { LOG_LEVEL } from '../types/logger';
import { CONFIG } from '../config';

const formatters = {
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

    log(level: LOG_LEVEL, message: any): void {
        if (this._options.level >= level) {
            console.log(`[${formatters[level](LOG_LEVEL[level])}]:`, message);
        }
    }

    trace(message: any): void {
        this.log(LOG_LEVEL.TRACE, message);
    }

    info(message: any): void {
        this.log(LOG_LEVEL.INFO, message);
    }

    warn(message: any): void {
        this.log(LOG_LEVEL.WARN, message);
    }

    error(message: any): void {
        this.log(LOG_LEVEL.ERROR, message);
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