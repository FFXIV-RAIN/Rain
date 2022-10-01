import {Logger} from '../@rain/logger';
import {CONFIG} from '../config';

export const logger = new Logger({
    level: CONFIG.LOG_LEVEL
});