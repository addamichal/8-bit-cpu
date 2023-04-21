// TODO rename to next instruction, add subtract, add sumOverflow, sumZero, move logic to state
// TODO unify vocabulary?
// TODO rewrite using opcodes
// TODO add instruction parser
// TODO add UI
// TODO add used resources
// TODO add readme
// TODO more sample programs?
// todo snake or game of life?

import { InstructionCodes, Opcodes } from "./instructions";
import { State } from "./state";

export function run(initState: State): State {
    let currentState = initState;
    while (currentState.halted !== 1) {
        let nextState = nextInstruction(currentState);
        currentState = nextState;
    }

    return currentState;
}

export function handleOpcode(opcode: Opcodes, currentState: State): State {
    let newState = currentState.copy();
    switch(opcode) {
        case Opcodes.HLT:
            newState.halted = 1;
            return newState;
        case Opcodes.MI:
            newState.memoryAddress = newState.bus;
            return newState;
        case Opcodes.RI:
            newState.memoryContent = newState.bus;
            return newState;
        case Opcodes.RO:
            newState.bus = newState.memoryContent;
            return newState;
        case Opcodes.IO:
            newState.bus = newState.instructionRegister;
            return newState;
        case Opcodes.II:
            newState.instructionRegister = newState.bus;
            return newState;
        case Opcodes.AI:
            newState.aRegister = newState.bus;
            return newState;
        case Opcodes.AO:
            newState.bus = newState.aRegister;
            return newState;
        case Opcodes.EO:
            newState.bus = newState.sumRegister;
            return newState;
        case Opcodes.SU:
            newState.aluSubtract = 1;
            return newState;
        case Opcodes.BI:
            newState.bRegister = newState.bus;
            return newState;
        case Opcodes.OI:
            newState.outRegister = newState.bus;
            return newState;
        case Opcodes.CE:
            newState.counter++;
            newState.counter = newState.counter & 15;
            return newState;
        case Opcodes.CO:
            newState.bus = newState.counter;
            return newState;
    }
}

export function nextInstruction(currentState: State): State {
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

            // EO|AI|FI
            newState.aluSubtract = 0;
            newState.bus = newState.sumRegister;
            newState.zeroFlag = newState.sumRegisterZero;
            newState.carryFlag = newState.sumRegisterOverflow;
            newState.aRegister = newState.bus;
            break;
        case InstructionCodes.SUB:
            // IO|MI
            newState.bus = newState.instructionRegister & 15;
            newState.memoryAddress = newState.bus;

            // RO|BI
            newState.bus = newState.memoryContent;
            newState.bRegister = newState.bus;

            // EO|AI|SU|FI
            newState.aluSubtract = 1;
            newState.zeroFlag = newState.sumRegisterZero;
            newState.carryFlag = newState.sumRegisterOverflow;
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