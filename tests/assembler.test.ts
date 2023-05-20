import { getProgram } from '../src/program';
import { assemble } from '../src/assembler';
import { AddInstruction, HltInstruction, JcInstruction, JmpInstruction, LdaInstruction, LdiInstruction, OutInstruction, StaInstruction } from '../src/instructions';


describe('assember tests', () => {
    test('fibonacci program', () => {
        let expected: number[] = [];
        expected[0] = new LdiInstruction(1).toNumber();
        expected[1] = new StaInstruction(14).toNumber();
        expected[2] = new LdiInstruction(0).toNumber();
        expected[3] = new StaInstruction(15).toNumber();
        expected[4] = new OutInstruction().toNumber();
        expected[5] = new LdaInstruction(14).toNumber();
        expected[6] = new AddInstruction(15).toNumber();
        expected[7] = new StaInstruction(14).toNumber();
        expected[8] = new OutInstruction().toNumber();
        expected[9] = new LdaInstruction(15).toNumber();
        expected[10] = new AddInstruction(14).toNumber();
        expected[11] = new JcInstruction(13).toNumber();
        expected[12] = new JmpInstruction(3).toNumber();
        expected[13] = new HltInstruction().toNumber();

        let lines = getProgram('fibonacci');
        let actual = assemble(lines);

        expect(expected).toEqual(actual);
    })
})