import {Logger} from '@rain/logger';
import {logger} from '../../src/utils/logger';

describe('utils(logger)', () => {
    it('should exist', () => {
        expect(logger).toBeInstanceOf(Logger);
    });
});