// TODO rewrite to functional style
// TODO add tests
// TODO rewrite using opcodes
// TODO add instruction parser
// TODO add UI

const instructions = {
    NOP: 0,     // 0000
    LDA: 1,     // 0001
    ADD: 2,     // 0010
    SUB: 3,     // 0011
    STA: 4,     // 0100
    LDI: 5,     // 0101
    JMP: 6,     // 0110
    JC: 7,      // 0111
    JZ: 8,      // 1000
    OUT: 14,    // 1110
    HLT: 15,     // 1111

    getInstructionName(value: number): string {
        return Object.keys(this).filter(key => this[key as keyof typeof instructions] === value)[0];
    }
}

interface State {
    halted: number;
    counter: number;
    aRegister: number;
    bRegister: number;
    sumRegister: number;
    carryFlag: number;
    zeroFlag: number;
    ram: number[]
}

let state: State = {
    halted: 0,
    counter: 0,
    aRegister: 0,
    bRegister: 0,
    sumRegister: 0,
    carryFlag: 0,
    zeroFlag: 0,
    ram: []
};

for (let i = 0; i < 16; i++) {
    state.ram[i] = 0;
}

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

function nextStep(currentState: State): State {
    let newState: State = { ...currentState, ram: [...currentState.ram], };

    let bus = newState.ram[newState.counter];
    let instruction = bus >> 4;

    newState.counter++;

    if (newState.counter > newState.ram.length - 1) {
        newState.counter = 0;
    }

    let value = bus & 15;

    switch (instruction) {
        case instructions.LDA:
            newState.aRegister = newState.ram[value];
            break;
        case instructions.ADD:
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
        case instructions.SUB:
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
        case instructions.STA:
            newState.ram[value] = newState.aRegister;
            break;
        case instructions.LDI:
            let val = bus & 15;
            newState.aRegister = val;
            break;
        case instructions.JMP:
            newState.counter = value;
            break;
        case instructions.JC:
            if (newState.carryFlag) {
                newState.counter = value;
            }
            break;
        case instructions.JZ:
            if (newState.zeroFlag) {
                newState.counter = value;
            }
            break;
        case instructions.OUT:
            console.log('OUT ', newState.aRegister);
            break;
        case instructions.HLT:
            console.log('HLT');
            newState.halted = 1;
            break;
        default:
            //throw new Error('Unknown instruction: ' + instruction);
            console.log('uknown instruction: ' + instruction)
    }

    return newState;
}