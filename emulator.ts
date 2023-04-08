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
    // for (let i = 0; i < 100; i++) {
    //console.log('counter: ', counter);

    let bus = state.ram[state.counter];
    let instruction = bus >> 4;

    state.counter++;

    if (state.counter > state.ram.length - 1) {
        state.counter = 0;
    }

    let value = bus & 15;

    //console.log({ instruction: instructions.getInstructionName(instruction), value });

    //console.log('bus: ', bus);
    //console.log('aRegister: ', aRegister);
    //console.log('bRegister: ', bRegister);
    //console.log('');

    switch (instruction) {
        case instructions.LDA:
            state.aRegister = state.ram[value];
            break;
        case instructions.ADD:
            state.bRegister = state.ram[value];
            state.sumRegister = state.aRegister + state.bRegister;

            if (state.sumRegister >= 255) {
                state.sumRegister -= 256;
                state.carryFlag = 1;
            } else {
                state.carryFlag = 0;
            }

            state.zeroFlag = state.sumRegister === 0 ? 1 : 0;
            state.aRegister = state.sumRegister;
            break;
        case instructions.SUB:
            state.bRegister = state.ram[value];
            state.sumRegister = state.aRegister - state.bRegister;

            if (state.sumRegister < 0) {
                state.sumRegister += 256;
                state.carryFlag = 1;
            } else {
                state.carryFlag = 0;
            }

            state.zeroFlag = state.sumRegister === 0 ? 1 : 0;
            state.aRegister = state.sumRegister;
            break;
        case instructions.STA:
            state.ram[value] = state.aRegister;
            break;
        case instructions.LDI:
            let val = bus & 15;
            state.aRegister = val;
            break;
        case instructions.JMP:
            state.counter = value;
            break;
        case instructions.JC:
            if (state.carryFlag) {
                state.counter = value;
            }
            break;
        case instructions.JZ:
            if (state.zeroFlag) {
                state.counter = value;
            }
            break;
        case instructions.OUT:
            console.log('OUT ', state.aRegister);
            break;
        case instructions.HLT:
            console.log('HLT');
            state.halted = 1;
            break;
        default:
            //throw new Error('Unknown instruction: ' + instruction);
            console.log('uknown instruction: ' + instruction)
    }
}