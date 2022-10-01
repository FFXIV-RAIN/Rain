import {BaseMessageOptions} from 'discord.js';
import {LOG_LEVEL} from '../../logger';

const DEFAULT_TITLES: {
    [key: string]: string;
} = {
    [LOG_LEVEL.ERROR]: '🚨 Internal Server Error 🚨',
    [LOG_LEVEL.WARN]: '⚠ Unhandled Error ⚠',
    [LOG_LEVEL.INFO]: 'ℹ Info ℹ'
};

export class RainError extends Error {
    private options: RainError.Options;

    constructor(options: RainError.Options) {
        super(options.message);
        this.options = {
            title: DEFAULT_TITLES[options.level],
            ...options,
        }
    }

    get level(): LOG_LEVEL {
        return this.options.level;
    }

    toMessageOptions(): BaseMessageOptions {
        return {
            embeds: [{
                image: {
                    url: 'https://imgur.com/1SjRXpE.png',
                },
                title: this.options.title,
                description: this.options.message,
                color: this.options.color ?? 15834299,
            }],
        };
    }
}


export namespace RainError {
    export type Options = {
        title?: string;
        message?: string;
        color?: number;
        level: LOG_LEVEL;
    }
    
    export class Builder {
        static new() {
            return new Builder();
        }
    
        private options: RainError.Options;
        constructor() {
            this.options = {
                level: LOG_LEVEL.WARN
            };        
        }
    
        title(value: string): Builder {
            this.options.title = value;
            return this;
        }
    
        message(value: string): Builder {
            this.options.message = value;
            return this;
        }
    
        color(value: string|number): Builder {
            this.options.color = typeof value === 'number' ? value : parseInt(value, 16);
            return this;
        }

        level(value: LOG_LEVEL): Builder {
            this.options.level = value;
            return this;
        }

        error(): Builder {
            return this.level(LOG_LEVEL.ERROR);
        }

        warn(): Builder {
            return this.level(LOG_LEVEL.WARN);
        }

        info(): Builder {
            return this.level(LOG_LEVEL.INFO);
        }

        trace(): Builder {
            return this.level(LOG_LEVEL.TRACE);
        }

        silly(): Builder {
            return this.level(LOG_LEVEL.SILLY);
        }
    
        build(): RainError {
            return new RainError(this.options);
        }
    }
}