import { getInitState, nextStep } from '../emulator';

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
        let state = getInitState();
        state = nextStep(state);

        expect(state.halted).toBe(0);
        expect(state.counter).toBe(1);
        expect(state.aRegister).toBe(0);
        expect(state.bRegister).toBe(0);
        expect(state.sumRegister).toBe(0);
        expect(state.carryFlag).toBe(0);
        expect(state.zeroFlag).toBe(0);
    });

    test('second state noop instructions only', () => {
        let state = getInitState();
        state = nextStep(state);
        state = nextStep(state);

        expect(state.halted).toBe(0);
        expect(state.counter).toBe(2);
        expect(state.aRegister).toBe(0);
        expect(state.bRegister).toBe(0);
        expect(state.sumRegister).toBe(0);
        expect(state.carryFlag).toBe(0);
        expect(state.zeroFlag).toBe(0);
    });

    test('', () => {

    });
});