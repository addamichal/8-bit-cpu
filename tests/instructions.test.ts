import { LdaInstruction } from '../instructions';

describe('instruction tests', () => {
    test('lda instruction', () => {
        let ldaInstruction = new LdaInstruction(15);

        expect(ldaInstruction.toNumber()).toBe(31)
    });
});