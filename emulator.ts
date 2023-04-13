// TODO finish tests for all instructions
// TODO unify vocabulary?
// TODO rewrite using opcodes
// TODO add instruction parser
// TODO add UI

import { InstructionCodes } from "./instructions";
import { State } from "./state";

let state: State = getInitState();

export function run() {
    state.ram[0] = 0x51;
    state.ram[1] = 0x4e;
    state.ram[2] = 0x50;
    state.ram[3] = 0x4f;
    state.ram[4] = 0xe0;
    state.ram[5] = 0x1e;
    state.ram[6] = 0x2f;
    state.ram[7] = 0x4e;
    state.ram[8] = 0xe0;
    state.ram[9] = 0x1f;
    state.ram[10] = 0x2e;
    // state.ram[11] = 0x70; // to loop
    state.ram[11] = 0x7d;
    state.ram[12] = 0x63;
    state.ram[13] = 0xf0;
    state.ram[14] = 0x00;
    state.ram[15] = 0x00;

    while (state.halted !== 1) {
        state = nextStep(state);
    }
}

export function nextStep(currentState: State): State {
    let newState: State = currentState.copy();

    let bus = newState.ram[newState.counter];
    let instruction = bus >> 4;

    newState.counter++;

    if (newState.counter > newState.ram.length - 1) {
        newState.counter = 0;
    }

    let value = bus & 15;

    switch (instruction) {
        case InstructionCodes.NOP:
            break;
        case InstructionCodes.LDA:
            newState.aRegister = newState.ram[value];
            break;
        case InstructionCodes.ADD:
            newState.bRegister = newState.ram[value];
            newState.sumRegister = newState.aRegister + newState.bRegister;

            if (newState.sumRegister >= 255) {
                newState.sumRegister -= 256;
                newState.carryFlag = 1;
            } else {
                newState.carryFlag = 0;
            }

            newState.zeroFlag = newState.sumRegister === 0 ? 1 : 0;
            newState.aRegister = newState.sumRegister;
            break;
        case InstructionCodes.SUB:
            newState.bRegister = newState.ram[value];
            newState.sumRegister = newState.aRegister - newState.bRegister;

            if (newState.sumRegister < 0) {
                newState.sumRegister += 256;
                newState.carryFlag = 1;
            } else {
                newState.carryFlag = 0;
            }

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
            console.log('OUT ', newState.aRegister);
            break;
        case InstructionCodes.HLT:
            console.log('HLT');
            newState.halted = 1;
            break;
        default:
            //throw new Error('Unknown instruction: ' + instruction);
            console.log('uknown instruction: ' + instruction)
    }

    return newState;
}

export function getInitState() {
    let state: State = {
        halted: 0,
        counter: 0,
        aRegister: 0,
        bRegister: 0,
        sumRegister: 0,
        carryFlag: 0,
        zeroFlag: 0,
        ram: [],
        copy: function () {
            return { ...this, ram: [...this.ram] };
        }
    };

    for (let i = 0; i < 16; i++) {
        state.ram[i] = 0;
    }

    return state;
}