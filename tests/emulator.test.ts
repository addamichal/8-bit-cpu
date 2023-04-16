import { getInitState, nextStep } from '../emulator';
import { AddInstruction, HltInstruction, JcInstruction, JmpInstruction, JzInstruction, LdaInstruction, LdiInstruction, OutInstruction, StaInstruction, SubInstruction } from '../instructions';

describe('emulator tests', () => {
    test('init state', () => {
        let state = getInitState();

        expect(state.halted).toBe(0);
        expect(state.counter).toBe(0);
        expect(state.aRegister).toBe(0);
        expect(state.bRegister).toBe(0);
        expect(state.sumRegister).toBe(0);
        expect(state.outRegister).toBe(0);
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
        expected.memoryAddress = 1;

        expect(expected).toEqual(actual);
    });

    test('counter should reset back to 0', () => {
        let initState = getInitState();
        initState.counter = 15;

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.memoryAddress = 15;
        expected.counter = 0;

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
        expected.instructionRegister = 1;
        expected.memoryContent = 0x1f;

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
        expected.instructionRegister = 4;
        expected.memoryContent = 0x4e;

        expect(expected).toEqual(actual);
    });

    test('ldi instruction', () => {
        let initState = getInitState();
        initState.aRegister = 9;
        initState.ram[0] = new LdiInstruction(14).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 14;
        expected.instructionRegister = 5;
        expected.memoryContent = 0x5e;

        expect(expected).toEqual(actual);
    });

    test('hlt instruction', () => {
        let initState = getInitState();
        initState.aRegister = 9;
        initState.ram[0] = new HltInstruction().toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.halted = 1;
        expected.instructionRegister = 15;
        expected.memoryContent = 0xf0;

        expect(expected).toEqual(actual);
    });

    test('add instruction simple adition', () => {
        let initState = getInitState();
        initState.aRegister = 9;
        initState.ram[15] = 3;
        initState.ram[0] = new AddInstruction(15).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 12;
        expected.bRegister = 3;
        expected.sumRegister = 12;
        expected.instructionRegister = 2;
        expected.memoryContent = 0x2f;

        expect(expected).toEqual(actual);
    });

    test('add instruction results to 255', () => {
        let initState = getInitState();
        initState.aRegister = 254;
        initState.ram[15] = 1;
        initState.ram[0] = new AddInstruction(15).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 255;
        expected.bRegister = 1;
        expected.sumRegister = 255;
        expected.instructionRegister = 2;
        expected.memoryContent = 0x2f;

        expect(expected).toEqual(actual);
    });

    test('add instruction zero flag', () => {
        let initState = getInitState();
        initState.aRegister = 0;
        initState.ram[0] = new AddInstruction(15).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 0;
        expected.bRegister = 0;
        expected.sumRegister = 0;
        expected.zeroFlag = 1;
        expected.instructionRegister = 2;
        expected.memoryContent = 0x2f;

        expect(expected).toEqual(actual);
    });

    test('add instruction carry and zero flags', () => {
        let initState = getInitState();
        initState.aRegister = 255;
        initState.ram[15] = 1;
        initState.ram[0] = new AddInstruction(15).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 0;
        expected.bRegister = 1;
        expected.sumRegister = 0;
        expected.carryFlag = 1;
        expected.zeroFlag = 1;
        expected.instructionRegister = 2;
        expected.memoryContent = 0x2f;

        expect(expected).toEqual(actual);
    });

    test('add instruction carry flag test 1', () => {
        let initState = getInitState();
        initState.aRegister = 255;
        initState.ram[15] = 2;
        initState.ram[0] = new AddInstruction(15).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 1;
        expected.bRegister = 2;
        expected.sumRegister = 1;
        expected.carryFlag = 1;
        expected.instructionRegister = 2;
        expected.memoryContent = 0x2f;

        expect(expected).toEqual(actual);
    });

    test('add instruction carry flag test 2', () => {
        let initState = getInitState();
        initState.aRegister = 255;
        initState.ram[15] = 3;
        initState.ram[0] = new AddInstruction(15).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 2;
        expected.bRegister = 3;
        expected.sumRegister = 2;
        expected.carryFlag = 1;
        expected.instructionRegister = 2;
        expected.memoryContent = 0x2f;

        expect(expected).toEqual(actual);
    });

    test('sub instruction positive result', () => {
        let initState = getInitState();
        initState.aRegister = 9;
        initState.ram[15] = 3;
        initState.ram[0] = new SubInstruction(15).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 6;
        expected.bRegister = 3;
        expected.sumRegister = 6;
        expected.carryFlag = 1;
        expected.instructionRegister = 3;
        expected.memoryContent = 0x3f;

        expect(expected).toEqual(actual);
    });

    test('sub instruction negative result', () => {
        let initState = getInitState();
        initState.aRegister = 13;
        initState.ram[15] = 15;
        initState.ram[0] = new SubInstruction(15).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 254;
        expected.bRegister = 15;
        expected.sumRegister = 254;
        expected.instructionRegister = 3;
        expected.memoryContent = 0x3f;

        expect(expected).toEqual(actual);
    });

    test('sub instruction zero flag', () => {
        let initState = getInitState();
        initState.aRegister = 0;
        initState.ram[0] = new SubInstruction(15).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 0;
        expected.bRegister = 0;
        expected.sumRegister = 0;
        expected.zeroFlag = 1;
        expected.instructionRegister = 3;
        expected.memoryContent = 0x3f;

        expect(expected).toEqual(actual);
    });

    test('sub instruction no flags', () => {
        let initState = getInitState();
        initState.aRegister = 0;
        initState.ram[0] = new SubInstruction(15).toNumber();
        initState.ram[15] = 1;

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 255;
        expected.bRegister = 1;
        expected.sumRegister = 255;
        expected.instructionRegister = 3;
        expected.memoryContent = 0x3f;

        expect(expected).toEqual(actual);
    });

    test('sub instruction results to 0', () => {
        let initState = getInitState();
        initState.aRegister = 8;
        initState.ram[15] = 8;
        initState.ram[0] = new SubInstruction(15).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.aRegister = 0;
        expected.bRegister = 8;
        expected.sumRegister = 0;
        expected.zeroFlag = 1;
        expected.carryFlag = 1;
        expected.instructionRegister = 3;
        expected.memoryContent = 0x3f;

        expect(expected).toEqual(actual);
    });

    test('jmp instruction', () => {
        let initState = getInitState();
        initState.ram[0] = new JmpInstruction(7).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 7;
        expected.instructionRegister = 6;
        expected.memoryContent = 0x67;

        expect(expected).toEqual(actual);
    });

    test('jc instruction no carry flag', () => {
        let initState = getInitState();
        initState.ram[0] = new JcInstruction(7).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.instructionRegister = 7;
        expected.memoryContent = 0x77;

        expect(expected).toEqual(actual);
    });

    test('jc instruction with carry flag', () => {
        let initState = getInitState();
        initState.carryFlag = 1;
        initState.ram[0] = new JcInstruction(7).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 7;
        expected.instructionRegister = 7;
        expected.memoryContent = 0x77;

        expect(expected).toEqual(actual);
    });

    test('jz instruction no zero flag', () => {
        let initState = getInitState();
        initState.ram[0] = new JzInstruction(7).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.instructionRegister = 8;
        expected.memoryContent = 0x87;

        expect(expected).toEqual(actual);
    });

    test('jz instruction with zero flag', () => {
        let initState = getInitState();
        initState.zeroFlag = 1;
        initState.ram[0] = new JzInstruction(7).toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 7;
        expected.instructionRegister = 8;
        expected.memoryContent = 0x87;

        expect(expected).toEqual(actual);
    });

    test('out instruction', () => {
        let initState = getInitState();
        initState.aRegister = 7;
        initState.ram[0] = new OutInstruction().toNumber();

        let actual = nextStep(initState);

        let expected = initState.copy();
        expected.counter = 1;
        expected.outRegister = 7;
        expected.instructionRegister = 14;
        expected.memoryContent = 0xe0;

        expect(expected).toEqual(actual);
    });
});