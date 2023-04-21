import { getInitState, run } from "../emulator";
import { AddInstruction, HltInstruction, JcInstruction, JmpInstruction, JzInstruction, LdaInstruction, LdiInstruction, OutInstruction, StaInstruction, SubInstruction } from "../instructions";

describe('testing instructions', () => {
    test('fibonacci sequence', () => {
        let state = getInitState();
        state.ram[0] = new LdiInstruction(1).toNumber();
        state.ram[1] = new StaInstruction(14).toNumber();
        state.ram[2] = new LdiInstruction(0).toNumber();
        state.ram[3] = new StaInstruction(15).toNumber();
        state.ram[4] = new OutInstruction().toNumber();
        state.ram[5] = new LdaInstruction(14).toNumber();
        state.ram[6] = new AddInstruction(15).toNumber();
        state.ram[7] = new StaInstruction(14).toNumber();
        state.ram[8] = new OutInstruction().toNumber();
        state.ram[9] = new LdaInstruction(15).toNumber();
        state.ram[10] = new AddInstruction(14).toNumber();
        state.ram[11] = new JcInstruction(13).toNumber();
        state.ram[12] = new JmpInstruction(3).toNumber();
        state.ram[13] = new HltInstruction().toNumber();

        let finalState = run(state);

        expect(finalState.outRegister).toBe(233);
    });

    test('multiplication', () => {
        let state = getInitState();
        state.ram[0] = new LdaInstruction(14).toNumber();
        state.ram[1] = new SubInstruction(12).toNumber();
        state.ram[2] = new JcInstruction(6).toNumber();
        state.ram[3] = new LdaInstruction(13).toNumber();
        state.ram[4] = new OutInstruction().toNumber();
        state.ram[5] = new HltInstruction().toNumber();
        state.ram[6] = new StaInstruction(14).toNumber();
        state.ram[7] = new LdaInstruction(13).toNumber();
        state.ram[8] = new AddInstruction(15).toNumber();
        state.ram[9] = new StaInstruction(13).toNumber();
        state.ram[10] = new JmpInstruction(0).toNumber();
        state.ram[12] = 1;
        state.ram[14] = 13;
        state.ram[15] = 15;

        let finalState = run(state);

        expect(finalState.outRegister).toBe(195);
    });
});