import {LOG_LEVEL} from '../@types';
import {Formatters} from '../@types/formatters';
import {StringifySafe} from './json';
export * from '../@types';

export class Logger {
    private _options: Logger.Options;

    constructor(options?: Logger.Options) {
        this._options = {
            ...options,
            level: LOG_LEVEL.INFO
        };
    }

    get level() {
        return this._options.level;
    }

    set level(level: LOG_LEVEL) {
        this._options.level = level;
    }

    prefix(level: LOG_LEVEL): string {
        return `[${Formatters[level](LOG_LEVEL[level])}]:`;
    }

    log(level: LOG_LEVEL, ...messages: Logger.Messages): void {
        if (this._options.level >= level) {
            console.log(this.prefix(level), messages.map(StringifySafe).join(', '));
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

    export type Messages = (undefined | null | number | string | boolean | object)[];
}

export const logger = new Logger({
    level: process.env.LOG_LEVEL as unknown as LOG_LEVEL || LOG_LEVEL.INFO
});