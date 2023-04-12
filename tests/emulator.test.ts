import { getInitState, nextStep } from '../emulator';
import { LdaInstruction, StaInstruction } from '../instructions';

describe('emulator tests', () => {
    test('init state', () => {
        let state = getInitState();

        expect(state.halted).toBe(0);
        expect(state.counter).toBe(0);
        expect(state.aRegister).toBe(0);
        expect(state.bRegister).toBe(0);
        expect(state.sumRegister).toBe(0);
        expect(state.carryFlag).toBe(0);
        expect(state.zeroFlag).toBe(0);
    });

    test('next state noop instructions only', () => {
        let initState = getInitState();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;

        expect(expected).toEqual(actual);
    });

    test('second state noop instructions only', () => {
        let initState = getInitState();

        let actual = nextStep(initState);
        actual = nextStep(actual);

        let expected = initState.copy();
        expected.counter = 2;

        expect(expected).toEqual(actual);
    });

    test('lda instruction', () => {
        let initState = getInitState();
        initState.ram[0] = new LdaInstruction(15).toNumber();
        initState.ram[15] = 9;

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 9;

        expect(expected).toEqual(actual);
    });

    test('sta instruction', () => {
        let initState = getInitState();
        initState.aRegister = 9;
        initState.ram[0] = new StaInstruction(14).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 9;
        expected.ram[14] = 9;

        expect(expected).toEqual(actual);
    });
});