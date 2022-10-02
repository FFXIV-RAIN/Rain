import {Logger, LOG_LEVEL} from '@rain/logger';
import {Formatters} from '@rain/logger/@types/formatters';
import {chance} from 'test/__utils__/chance';

describe('class(Logger)', () => {
    let logger: Logger;

    beforeEach(() => {
        logger = new Logger();
    });
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getter(level)', () => {
        it('should return the log level', () => {
            expect(logger.level).toEqual(LOG_LEVEL.INFO);
        });
    });

    describe('setter(level)', () => {
        it('should update the log level', () => {
            logger.level = LOG_LEVEL.ERROR;

            expect(logger.level).toEqual(LOG_LEVEL.ERROR);
        });
    });

    describe('func(prefix)', () => {
        // const levels = Object.keys(LOG_LEVEL).filter((key: any) => !isNaN(Number(LOG_LEVEL[key]))) as unknown as LOG_LEVEL[];

        const levelValues = Object.keys(LOG_LEVEL).map((value) => Number(value)).filter((value) => !isNaN(value)) as unknown as LOG_LEVEL[];

        for (const level of levelValues) {
            const levelName = LOG_LEVEL[level];

            it(`should return "[${levelName}]:" with color formatting`, () => {
                expect(logger.prefix(level)).toEqual(`[${Formatters[level](levelName)}]:`);
            });
        }

    });

    describe('func(log)', () => {
        beforeEach(() => {
            jest.spyOn(console, 'log');
        });

        it('should output a log if the log level is below the configured level', () => {
            const expectedMessage = chance.string();

            logger.log(LOG_LEVEL.WARN, expectedMessage);

            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith(logger.prefix(LOG_LEVEL.WARN), expectedMessage);
        });

        it('should output a log if the log level is at the configured level', () => {
            const expectedMessage = chance.string();

            logger.log(LOG_LEVEL.INFO, expectedMessage);

            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith(logger.prefix(LOG_LEVEL.INFO), expectedMessage);
        });

        it('should not output a log if the log level above the configured level', () => {
            logger.log(LOG_LEVEL.TRACE, chance.string());

            expect(console.log).toHaveBeenCalledTimes(0);
        });
    });

    describe('container(Logging Levels)', () => {
        beforeEach(() => {
            jest.spyOn(logger, 'log');
        });

        it('func(silly): should log with the logging level of SILLY', () => {
            const expectedMessage = chance.string();

            logger.silly(expectedMessage);

            expect(logger.log).toHaveBeenCalledTimes(1);
            expect(logger.log).toHaveBeenCalledWith(LOG_LEVEL.SILLY, expectedMessage);
        });

        it('func(trace): should log with the logging level of TRACE', () => {
            const expectedMessage = chance.string();

            logger.trace(expectedMessage);

            expect(logger.log).toHaveBeenCalledTimes(1);
            expect(logger.log).toHaveBeenCalledWith(LOG_LEVEL.TRACE, expectedMessage);
        });

        it('func(info): should log with the logging level of INFO', () => {
            const expectedMessage = chance.string();

            logger.info(expectedMessage);

            expect(logger.log).toHaveBeenCalledTimes(1);
            expect(logger.log).toHaveBeenCalledWith(LOG_LEVEL.INFO, expectedMessage);
        });

        it('func(warn): should log with the logging level of WARN', () => {
            const expectedMessage = chance.string();

            logger.warn(expectedMessage);

            expect(logger.log).toHaveBeenCalledTimes(1);
            expect(logger.log).toHaveBeenCalledWith(LOG_LEVEL.WARN, expectedMessage);
        });

        it('func(error): should log with the logging level of ERROR', () => {
            const expectedMessage = chance.string();

            logger.error(expectedMessage);

            expect(logger.log).toHaveBeenCalledTimes(1);
            expect(logger.log).toHaveBeenCalledWith(LOG_LEVEL.ERROR, expectedMessage);
        });
    });
});