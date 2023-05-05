import { InstructionCode, OpCode } from "./instructions";
import { State } from "./state";

export function run(initState: State): State {
    let currentState = initState;
    while (currentState.halted !== 1) {
        let nextState = nextInstruction(currentState);
        currentState = nextState;
    }

    return currentState;
}

export function handleOpcode(opcode: OpCode, opCodeValue: number, currentState: State): State {
    let newState = currentState.copy();
    newState.controlWord[opcode] = opCodeValue;

    switch (opcode) {
        case OpCode.HLT:
            newState.halted = opCodeValue;
            return newState;
        case OpCode.MI:
            if (opCodeValue && newState.clock) {
                newState.memoryAddress = newState.bus;
            }
            return newState;
        case OpCode.RI:
            if (opCodeValue && newState.clock) {
                newState.memoryContent = newState.bus;
            }
            return newState;
        case OpCode.RO:
            if (opCodeValue) {
                newState.bus = newState.memoryContent;
            }
            return newState;
        case OpCode.IO:
            if (opCodeValue) {
                newState.bus = newState.instructionRegister & 15;
            }
            return newState;
        case OpCode.II:
            if (opCodeValue && newState.clock) {
                newState.instructionRegister = newState.bus;
            }
            return newState;
        case OpCode.AI:
            if (opCodeValue && newState.clock) {
                newState.aRegister = newState.bus;
            }
            return newState;
        case OpCode.AO:
            if (opCodeValue) {
                newState.bus = newState.aRegister;
            }
            return newState;
        case OpCode.EO:
            if (opCodeValue) {
                newState.bus = newState.sumRegister;
            }
            return newState;
        case OpCode.SU:
            newState.aluSubtract = opCodeValue;
            return newState;
        case OpCode.BI:
            if (opCodeValue && newState.clock) {
                newState.bRegister = newState.bus;
            }
            return newState;
        case OpCode.OI:
            if (opCodeValue && newState.clock) {
                newState.outRegister = newState.bus;
            }
            return newState;
        case OpCode.CE:
            if (opCodeValue && newState.clock) {
                newState.counter = (newState.counter + 1) & 15;
            }
            return newState;
        case OpCode.CO:
            if (opCodeValue) {
                newState.bus = newState.counter;
            }
            return newState;
        case OpCode.J:
            if (opCodeValue && newState.clock) {
                newState.counter = newState.bus;
            }
            return newState;
        case OpCode.FI:
            if (opCodeValue && newState.clock) {
                newState.zeroFlag = newState.sumRegisterZero;
                newState.carryFlag = newState.sumRegisterOverflow;
            }
            return newState;
        default:
            throw new Error('Unknown opcode: ' + opcode);
    }
}

export function handleOpcodes(currentState: State): State {
    let newState: State = currentState.copy();
    newState.clock = currentState.clock === 1 ? 0 : 1;

    if (currentState.clock === 1) {
        newState.opcodeCounter++;
        if (newState.opcodeCounter === 5) {
            newState.opcodeCounter = 0;
        }

        newState.clock = 0;
    }

    newState.bus = 0;

    // MI|CO
    if (newState.opcodeCounter === 0) {
        newState = handleOpcode(OpCode.CO, 1, newState);
        newState = handleOpcode(OpCode.MI, 1, newState);
    }

    // RO|II|CE
    if (newState.opcodeCounter === 1) {
        newState = handleOpcode(OpCode.RO, 1, newState);
        newState = handleOpcode(OpCode.II, 1, newState);
        newState = handleOpcode(OpCode.CE, 1, newState);
    }

    let instruction = newState.instructionRegister >> 4;
    switch (instruction) {
        case InstructionCode.NOP:
            break;
        case InstructionCode.LDA:
            // IO|MI
            if (newState.opcodeCounter === 2) {
                newState = handleOpcode(OpCode.IO, 1, newState);
                newState = handleOpcode(OpCode.MI, 1, newState);

                newState.controlWord.IO = 1;
                newState.controlWord.MI = 1;
            }

            // RO|AI
            if (newState.opcodeCounter === 3) {
                newState = handleOpcode(OpCode.RO, 1, newState);
                newState = handleOpcode(OpCode.AI, 1, newState);
            }
            break;
        case InstructionCode.ADD:
            // IO|MI
            if (newState.opcodeCounter === 2) {
                newState = handleOpcode(OpCode.IO, 1, newState);
                newState = handleOpcode(OpCode.MI, 1, newState);
            }

            // RO|BI
            if (newState.opcodeCounter === 3) {
                newState = handleOpcode(OpCode.RO, 1, newState);
                newState = handleOpcode(OpCode.BI, 1, newState);
            }

            // EO|AI|FI
            if (newState.opcodeCounter === 4) {
                newState = handleOpcode(OpCode.SU, 0, newState);
                newState = handleOpcode(OpCode.EO, 1, newState);
                newState = handleOpcode(OpCode.FI, 1, newState);
                newState = handleOpcode(OpCode.AI, 1, newState);
            }
            break;
        case InstructionCode.SUB:
            // IO|MI
            if (newState.opcodeCounter === 2) {
                newState = handleOpcode(OpCode.IO, 1, newState);
                newState = handleOpcode(OpCode.MI, 1, newState);
            }

            // RO|BI
            if (newState.opcodeCounter === 3) {
                newState = handleOpcode(OpCode.RO, 1, newState);
                newState = handleOpcode(OpCode.BI, 1, newState);
            }

            // EO|AI|SU|FI
            if (newState.opcodeCounter === 4) {
                newState = handleOpcode(OpCode.SU, 1, newState);
                newState = handleOpcode(OpCode.EO, 1, newState);
                newState = handleOpcode(OpCode.FI, 1, newState);
                newState = handleOpcode(OpCode.AI, 1, newState);
            }
            break;
        case InstructionCode.STA:
            // IO|MI
            if (newState.opcodeCounter === 2) {
                newState = handleOpcode(OpCode.IO, 1, newState);
                newState = handleOpcode(OpCode.MI, 1, newState);
            }

            // AO|RI
            if (newState.opcodeCounter === 3) {
                newState = handleOpcode(OpCode.AO, 1, newState);
                newState = handleOpcode(OpCode.RI, 1, newState);
            }
            break;
        case InstructionCode.LDI:
            // IO|AI
            if (newState.opcodeCounter === 2) {
                newState = handleOpcode(OpCode.IO, 1, newState);
                newState = handleOpcode(OpCode.AI, 1, newState);
            }
            break;
        case InstructionCode.JMP:
            // IO|J
            if (newState.opcodeCounter === 2) {
                newState = handleOpcode(OpCode.IO, 1, newState);
                newState = handleOpcode(OpCode.J, 1, newState);
            }
            break;
        case InstructionCode.JC:
            if (newState.carryFlag && newState.opcodeCounter === 2) {
                // IO|J
                newState = handleOpcode(OpCode.IO, 1, newState);
                newState = handleOpcode(OpCode.J, 1, newState);
            }
            break;
        case InstructionCode.JZ:
            if (newState.zeroFlag && newState.opcodeCounter === 2) {
                // IO|J
                newState = handleOpcode(OpCode.IO, 1, newState);
                newState = handleOpcode(OpCode.J, 1, newState);
            }
            break;
        case InstructionCode.OUT:
            // AO|OI
            if (newState.opcodeCounter === 2) {
                newState = handleOpcode(OpCode.AO, 1, newState);
                newState = handleOpcode(OpCode.OI, 1, newState);
            }
            break;
        case InstructionCode.HLT:
            // HLT
            if (newState.opcodeCounter === 2) {
                newState = handleOpcode(OpCode.HLT, 1, newState);
            }
            break;
        default:
            throw new Error('Unknown instruction: ' + newState.instructionRegister);
    }

    return newState;
}

export function nextInstruction(currentState: State): State {
    let nextState = currentState;
    nextState.opcodeCounter = 0;

    for (let i = 0; i < 5; i++) {
        nextState = handleOpcodes(nextState); // 0 -> 1
        nextState = handleOpcodes(nextState); // 1 -> 0
    }

    nextState.opcodeCounter = 1;

    return nextState;
}

export function getInitState(): State {
    return new State();
}