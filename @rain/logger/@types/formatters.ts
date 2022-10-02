import chalk from 'chalk';
import {LOG_LEVEL} from '../@types';

export const Formatters = {
    [LOG_LEVEL.SILLY]: chalk.cyanBright,
    [LOG_LEVEL.TRACE]: chalk.greenBright,
    [LOG_LEVEL.INFO]: chalk.blueBright,
    [LOG_LEVEL.WARN]: chalk.yellow,
    [LOG_LEVEL.ERROR]: chalk.red
};