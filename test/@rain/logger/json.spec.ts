import {StringifySafe} from '@rain/logger/src/json';
import {chance} from 'test/__utils__/chance';

describe('utils(JSON)', () => {
    describe('func(StringifySafe)', () => {
        it('should stringify primitives', () => {
            const value = chance.string();

            expect(StringifySafe(value)).toEqual(value);
        });

        it('should remove circular dependencies', () => {
            const value = {
                hello: chance.string(),
                nestedObject: {
                    hello: chance.string()
                } as { [key: string]: any; }
            };

            const expectedValue = JSON.stringify({
                ...value,
                nestedObject: {
                    ...value.nestedObject,
                    reference: '<circular>'
                }
            });

            value.nestedObject.reference = value;

            expect(StringifySafe(value)).toEqual(expectedValue);
        });
    });
});