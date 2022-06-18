import { chance } from '../__utils__/chance';
import { parseMessage } from '../../src/utils/message';

describe('utils(message)', () => {
    describe('func(parseMessage)', () => {
        it('should parse out values', () => {
            const data = {
                user: {
                    id: chance.string(),
                },
            };

            expect(parseMessage('Hello {user.id}!', data)).toEqual(`Hello ${data.user.id}!`);
        });

        it('should parse out multiple values', () => {
            const data = {
                user: {
                    id: chance.string(),
                },
            };

            expect(parseMessage('Hello {user.id} {user.id}!', data)).toEqual(`Hello ${data.user.id} ${data.user.id}!`);
        });

        it('should support values that do not exist', () => {
            const data = {};

            expect(parseMessage('Hello {user.id}!', data)).toEqual(`Hello !`);
        });
    });
});