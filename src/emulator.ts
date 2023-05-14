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

export function handleOpcode(opcode: OpCode, newState: State) {
    let opCodeValue = newState.controlWord[opcode];
    newState.controlWord[opcode] = opCodeValue;

    switch (opcode) {
        case OpCode.HLT:
            newState.halted = opCodeValue;
            break;
        case OpCode.MI:
            if (opCodeValue && newState.clock) {
                newState.memoryAddress = newState.bus;
            }
            break;
        case OpCode.RI:
            if (opCodeValue && newState.clock) {
                newState.memoryContent = newState.bus;
            }
            break;
        case OpCode.RO:
            if (opCodeValue) {
                newState.bus = newState.memoryContent;
            }
            break;
        case OpCode.IO:
            if (opCodeValue) {
                newState.bus = newState.instructionRegister & 15;
            }
            break;
        case OpCode.II:
            if (opCodeValue && newState.clock) {
                newState.instructionRegister = newState.bus;
            }
            break;
        case OpCode.AI:
            if (opCodeValue && newState.clock) {
                newState.aRegister = newState.bus;
            }
            break;
        case OpCode.AO:
            if (opCodeValue) {
                newState.bus = newState.aRegister;
            }
            break;
        case OpCode.EO:
            if (opCodeValue) {
                newState.bus = newState.sumRegister;
            }
            break;
        case OpCode.SU:
            newState.aluSubtract = opCodeValue;
            break;
        case OpCode.BI:
            if (opCodeValue && newState.clock) {
                newState.bRegister = newState.bus;
            }
            break;
        case OpCode.OI:
            if (opCodeValue && newState.clock) {
                newState.outRegister = newState.bus;
            }
            break;
        case OpCode.CE:
            if (opCodeValue && newState.clock) {
                newState.counter = (newState.counter + 1) & 15;
            }
            break;
        case OpCode.CO:
            if (opCodeValue) {
                newState.bus = newState.counter;
            }
            break;
        case OpCode.J:
            if (opCodeValue && newState.clock) {
                newState.counter = newState.bus;
            }
            break;
        case OpCode.FI:
            if (opCodeValue && newState.clock) {
                newState.zeroFlag = newState.sumRegisterZero;
                newState.carryFlag = newState.sumRegisterOverflow;
            }
            break;
        default:
            throw new Error('Unknown opcode: ' + opcode);
    }
}

export function handleOpcodes(currentState: State): State {
    let newState: State = currentState.copy();
    if (newState.halted) return newState;

    if (newState.clock === 1) {
        newState.opcodeCounter++;
    }

    newState.clock = newState.clock === 1 ? 0 : 1;
    newState.bus = 0;

    handleOpcode(OpCode.HLT, newState);
    handleOpcode(OpCode.SU, newState);
    handleOpcode(OpCode.RO, newState);
    handleOpcode(OpCode.IO, newState);
    handleOpcode(OpCode.AO, newState);
    handleOpcode(OpCode.EO, newState);
    handleOpcode(OpCode.CO, newState);
    handleOpcode(OpCode.FI, newState);
    handleOpcode(OpCode.MI, newState);
    handleOpcode(OpCode.RI, newState);
    handleOpcode(OpCode.II, newState);
    handleOpcode(OpCode.AI, newState);
    handleOpcode(OpCode.BI, newState);
    handleOpcode(OpCode.OI, newState);
    handleOpcode(OpCode.CE, newState);
    handleOpcode(OpCode.J, newState);
    return newState;
}

export function nextInstruction(currentState: State): State {
    let nextState = currentState;
    nextState.opcodeCounter = 0;

    for (let i = 0; i < 5; i++) {
        nextState = handleOpcodes(nextState); // 0 -> 1
        if (nextState.halted) break;

        nextState = handleOpcodes(nextState); // 1 -> 0
        if (nextState.halted) break;
    }

    return nextState;
}

export function getInitState(): State {
    return new State();
}