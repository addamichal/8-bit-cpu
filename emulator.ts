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

    // MI|CO
    newState.bus = newState.counter;
    newState.memoryAddress = newState.bus;

    // RO|II|CE
    newState.bus = newState.memoryContent;
    newState.instructionRegister = newState.bus;
    newState.counter = (newState.counter + 1) & 15;

    let instruction = newState.instructionRegister >> 4;
    switch (instruction) {
        case InstructionCodes.NOP:
            break;
        case InstructionCodes.LDA:
            // IO|MI
            newState.bus = newState.instructionRegister & 15;
            newState.memoryAddress = newState.bus;

            // RO|AI
            newState.bus = newState.memoryContent;
            newState.aRegister = newState.bus;
            break;
        case InstructionCodes.ADD:
            // IO|MI
            newState.bus = newState.instructionRegister & 15;
            newState.memoryAddress = newState.bus;

            // RO|BI
            newState.bus = newState.memoryContent;
            newState.bRegister = newState.bus;

            let add = newState.aRegister + newState.bRegister;
            if (add >= 256) {
                newState.carryFlag = 1;
            } else {
                newState.carryFlag = 0;
            }

            newState.sumRegister = add & 255;

            newState.zeroFlag = newState.sumRegister === 0 ? 1 : 0;

            //EO|AI
            newState.bus = newState.sumRegister;
            newState.aRegister = newState.bus;
            break;
        case InstructionCodes.SUB:
            // IO|MI
            newState.bus = newState.instructionRegister & 15;
            newState.memoryAddress = newState.bus;

            // RO|BI|SU
            newState.bus = newState.memoryContent;
            newState.bRegister = newState.bus;

            let twoComplement = ((~newState.bRegister & 255) + 1) & 255;

            let sub = newState.aRegister + twoComplement;
            if (sub >= 256) {
                newState.carryFlag = 1;
            } else {
                newState.carryFlag = 0;
            }

            newState.sumRegister = sub & 255;

            newState.zeroFlag = newState.sumRegister === 0 ? 1 : 0;

            //EO|AI
            newState.bus = newState.sumRegister;
            newState.aRegister = newState.bus;
            break;
        case InstructionCodes.STA:
            // IO|MI
            newState.bus = newState.instructionRegister & 15;
            newState.memoryAddress = newState.bus;

            // AO|RI
            newState.bus = newState.aRegister;
            newState.memoryContent = newState.bus;
            break;
        case InstructionCodes.LDI:
            // IO|AI
            newState.bus = newState.instructionRegister & 15;
            newState.aRegister = newState.bus;
            break;
        case InstructionCodes.JMP:
            // IO|J
            newState.bus = newState.instructionRegister & 15;
            newState.counter = newState.bus;
            break;
        case InstructionCodes.JC:
            if (newState.carryFlag) {
                // IO|J
                newState.bus = newState.instructionRegister & 15;
                newState.counter = newState.bus;
            }
            break;
        case InstructionCodes.JZ:
            if (newState.zeroFlag) {
                // IO|J
                newState.bus = newState.instructionRegister & 15;
                newState.counter = newState.bus;
            }
            break;
        case InstructionCodes.OUT:
            // AO|OI
            newState.bus = newState.aRegister;
            newState.outRegister = newState.bus;
            break;
        case InstructionCodes.HLT:
            // HLT
            newState.halted = 1;
            break;
        default:
            throw new Error('Unknown instruction: ' + newState.instructionRegister);
    }

    return newState;
}

export function getInitState() {
    return new State();
}