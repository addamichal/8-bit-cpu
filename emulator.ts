// TODO emulate memory address, memory content and instruction register?
// TODO unify vocabulary?
// TODO rewrite using opcodes
// TODO add instruction parser
// TODO add UI
// TODO add used resources
// TODO add readme
// TODO more sample programs?
// todo snake or game of life?

import { InstructionCodes } from "./instructions";
import { State } from "./state";

export function run(initState: State): State {
    let currentState = initState;
    while (currentState.halted !== 1) {
        let nextState = nextStep(currentState);
        currentState = nextState;
    }

    return currentState;
}

export function nextStep(currentState: State): State {
    let newState: State = currentState.copy();

    // MI | CO
    newState.memoryAddress = newState.counter;
    newState.memoryContent = newState.ram[newState.memoryAddress];

    // RO | II | CE
    newState.instructionRegister = newState.memoryContent >> 4;
    newState.counter++;
    newState.counter = newState.counter & 15;

    // IO
    let value = newState.memoryContent & 15;

    switch (newState.instructionRegister) {
        case InstructionCodes.NOP:
            break;
        case InstructionCodes.LDA:
            newState.aRegister = newState.ram[value];
            break;
        case InstructionCodes.ADD:
            newState.bRegister = newState.ram[value];

            let add = newState.aRegister + newState.bRegister;
            if (add >= 256) {
                newState.carryFlag = 1;
            } else {
                newState.carryFlag = 0;
            }

            newState.sumRegister = add & 255;

            newState.zeroFlag = newState.sumRegister === 0 ? 1 : 0;
            newState.aRegister = newState.sumRegister;
            break;
        case InstructionCodes.SUB:
            newState.bRegister = newState.ram[value];

            let twoComplement = ((~newState.bRegister & 255) + 1) & 255;

            let sub = newState.aRegister + twoComplement;
            if (sub >= 256) {
                newState.carryFlag = 1;
            } else {
                newState.carryFlag = 0;
            }

            newState.sumRegister = sub & 255;

            newState.zeroFlag = newState.sumRegister === 0 ? 1 : 0;
            newState.aRegister = newState.sumRegister;
            break;
        case InstructionCodes.STA:
            newState.ram[value] = newState.aRegister;
            break;
        case InstructionCodes.LDI:
            newState.aRegister = value;
            break;
        case InstructionCodes.JMP:
            newState.counter = value;
            break;
        case InstructionCodes.JC:
            if (newState.carryFlag) {
                newState.counter = value;
            }
            break;
        case InstructionCodes.JZ:
            if (newState.zeroFlag) {
                newState.counter = value;
            }
            break;
        case InstructionCodes.OUT:
            newState.outRegister = newState.aRegister;
            break;
        case InstructionCodes.HLT:
            newState.halted = 1;
            break;
        default:
            throw new Error('Unknown instruction: ' + newState.instructionRegister);
    }

    return newState;
}

export function getInitState() {
    let state: State = {
        halted: 0,
        memoryAddress: 0,
        memoryContent: 0,
        ram: [],
        instructionRegister: 0,
        counter: 0,
        aRegister: 0,
        bRegister: 0,
        sumRegister: 0,
        outRegister: 0,
        carryFlag: 0,
        zeroFlag: 0,
        copy: function () {
            return { ...this, ram: [...this.ram] };
        },
    };

    for (let i = 0; i < 16; i++) {
        state.ram[i] = 0;
    }

    return state;
}