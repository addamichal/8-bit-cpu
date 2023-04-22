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

export function handleOpcode(opcode: Opcodes, opCodeValue: number, currentState: State): State {
    let newState = currentState.copy();
    switch (opcode) {
        case Opcodes.HLT:
            newState.halted = opCodeValue;
            return newState;
        case Opcodes.MI:
            if (opCodeValue) {
                newState.memoryAddress = newState.bus;
            }
            return newState;
        case Opcodes.RI:
            if (opCodeValue) {
                newState.memoryContent = newState.bus;
            }
            return newState;
        case Opcodes.RO:
            if (opCodeValue) {
                newState.bus = newState.memoryContent;
            }
            return newState;
        case Opcodes.IO:
            if (opCodeValue) {
                newState.bus = newState.instructionRegister & 15;
            }
            return newState;
        case Opcodes.II:
            if (opCodeValue) {
                newState.instructionRegister = newState.bus;
            }
            return newState;
        case Opcodes.AI:
            if (opCodeValue) {
                newState.aRegister = newState.bus;
            }
            return newState;
        case Opcodes.AO:
            if (opCodeValue) {
                newState.bus = newState.aRegister;
            }
            return newState;
        case Opcodes.EO:
            if (opCodeValue) {
                newState.bus = newState.sumRegister;
            }
            return newState;
        case Opcodes.SU:
            newState.aluSubtract = opCodeValue;
            return newState;
        case Opcodes.BI:
            if (opCodeValue) {
                newState.bRegister = newState.bus;
            }
            return newState;
        case Opcodes.OI:
            if (opCodeValue) {
                newState.outRegister = newState.bus;
            }
            return newState;
        case Opcodes.CE:
            if (opCodeValue) {
                newState.counter = (newState.counter + 1) & 15;
            }
            return newState;
        case Opcodes.CO:
            if (opCodeValue) {
                newState.bus = newState.counter;
            }
            return newState;
        case Opcodes.J:
            if (opCodeValue) {
                newState.counter = newState.bus;
            }
            return newState;
        case Opcodes.FI:
            if (opCodeValue) {
                newState.zeroFlag = newState.sumRegisterZero;
                newState.carryFlag = newState.sumRegisterOverflow;
            }
            return newState;
        default:
            throw new Error('Unknown opcode: ' + opcode);
    }
}

export function nextInstruction(currentState: State): State {
    let newState: State = currentState.copy();

    // MI|CO
    newState = handleOpcode(Opcodes.CO, 1, newState);
    newState = handleOpcode(Opcodes.MI, 1, newState);

    // RO|II|CE
    newState = handleOpcode(Opcodes.RO, 1, newState);
    newState = handleOpcode(Opcodes.II, 1, newState);
    newState = handleOpcode(Opcodes.CE, 1, newState);

    let instruction = newState.instructionRegister >> 4;
    switch (instruction) {
        case InstructionCodes.NOP:
            break;
        case InstructionCodes.LDA:
            // IO|MI
            newState = handleOpcode(Opcodes.IO, 1, newState);
            newState = handleOpcode(Opcodes.MI, 1, newState);

            // RO|AI
            newState = handleOpcode(Opcodes.RO, 1, newState);
            newState = handleOpcode(Opcodes.AI, 1, newState);
            break;
        case InstructionCodes.ADD:
            // IO|MI
            newState = handleOpcode(Opcodes.IO, 1, newState);
            newState = handleOpcode(Opcodes.MI, 1, newState);

            // RO|BI
            newState = handleOpcode(Opcodes.RO, 1, newState);
            newState = handleOpcode(Opcodes.BI, 1, newState);

            // EO|AI|FI
            newState = handleOpcode(Opcodes.SU, 0, newState);
            newState = handleOpcode(Opcodes.EO, 1, newState);
            newState = handleOpcode(Opcodes.FI, 1, newState);
            newState = handleOpcode(Opcodes.AI, 1, newState);
            break;
        case InstructionCodes.SUB:
            // IO|MI
            newState = handleOpcode(Opcodes.IO, 1, newState);
            newState = handleOpcode(Opcodes.MI, 1, newState);

            // RO|BI
            newState = handleOpcode(Opcodes.RO, 1, newState);
            newState = handleOpcode(Opcodes.BI, 1, newState);

            // EO|AI|SU|FI
            newState = handleOpcode(Opcodes.SU, 1, newState);
            newState = handleOpcode(Opcodes.EO, 1, newState);
            newState = handleOpcode(Opcodes.FI, 1, newState);
            newState = handleOpcode(Opcodes.AI, 1, newState);
            break;
        case InstructionCodes.STA:
            // IO|MI
            newState = handleOpcode(Opcodes.IO, 1, newState);
            newState = handleOpcode(Opcodes.MI, 1, newState);

            // AO|RI
            newState = handleOpcode(Opcodes.AO, 1, newState);
            newState = handleOpcode(Opcodes.RI, 1, newState);
            break;
        case InstructionCodes.LDI:
            // IO|AI
            newState = handleOpcode(Opcodes.IO, 1, newState);
            newState = handleOpcode(Opcodes.AI, 1, newState);
            break;
        case InstructionCodes.JMP:
            // IO|J
            newState = handleOpcode(Opcodes.IO, 1, newState);
            newState = handleOpcode(Opcodes.J, 1, newState);
            break;
        case InstructionCodes.JC:
            if (newState.carryFlag) {
                // IO|J
                newState = handleOpcode(Opcodes.IO, 1, newState);
                newState = handleOpcode(Opcodes.J, 1, newState);
            }
            break;
        case InstructionCodes.JZ:
            if (newState.zeroFlag) {
                // IO|J
                newState = handleOpcode(Opcodes.IO, 1, newState);
                newState = handleOpcode(Opcodes.J, 1, newState);
            }
            break;
        case InstructionCodes.OUT:
            // AO|OI
            newState = handleOpcode(Opcodes.AO, 1, newState);
            newState = handleOpcode(Opcodes.OI, 1, newState);
            break;
        case InstructionCodes.HLT:
            // HLT
            newState = handleOpcode(Opcodes.HLT, 1, newState);
            break;
        default:
            throw new Error('Unknown instruction: ' + newState.instructionRegister);
    }

    return newState;
}

export function getInitState() {
    return new State();
}