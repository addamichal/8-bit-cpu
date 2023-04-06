// TODO rewrite to typescript
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

let halted = false;
let counter = 0;
let aRegister = 0;
let bRegister = 0;
let sumRegister = 0;
let carryFlag = 0;
let zeroFlag = 0;

let ram: number[] = [];

for (let i = 0; i < 16; i++) {
    ram[i] = 0;
}

ram[0] = 0x51;
ram[1] = 0x4e;
ram[2] = 0x50;
ram[3] = 0x4f;
ram[4] = 0xe0;
ram[5] = 0x1e;
ram[6] = 0x2f;
ram[7] = 0x4e;
ram[8] = 0xe0;
ram[9] = 0x1f;
ram[10] = 0x2e;
// ram[11] = 0x70; // to loop
ram[11] = 0x7d;
ram[12] = 0x63;
ram[13] = 0xf0;
ram[14] = 0x00;
ram[15] = 0x00;

while (!halted) {
    // for (let i = 0; i < 100; i++) {
    //console.log('counter: ', counter);

    let bus = ram[counter];
    let instruction = bus >> 4;

    counter++;

    if (counter > ram.length - 1) {
        counter = 0;
    }

    let value = bus & 15;

    //console.log({ instruction: instructions.getInstructionName(instruction), value });

    //console.log('bus: ', bus);
    //console.log('aRegister: ', aRegister);
    //console.log('bRegister: ', bRegister);
    //console.log('');

    switch (instruction) {
        case instructions.LDA:
            aRegister = ram[value];
            break;
        case instructions.ADD:
            bRegister = ram[value];
            sumRegister = aRegister + bRegister;

            if (sumRegister >= 255) {
                sumRegister -= 256;
                carryFlag = 1;
            } else {
                carryFlag = 0;
            }

            zeroFlag = sumRegister === 0 ? 1 : 0;
            aRegister = sumRegister;
            break;
        case instructions.SUB:
            bRegister = ram[value];
            sumRegister = aRegister - bRegister;

            if (sumRegister < 0) {
                sumRegister += 256;
                carryFlag = 1;
            } else {
                carryFlag = 0;
            }

            zeroFlag = sumRegister === 0 ? 1 : 0;
            aRegister = sumRegister;
            break;
        case instructions.STA:
            ram[value] = aRegister;
            break;
        case instructions.LDI:
            let val = bus & 15;
            aRegister = val;
            break;
        case instructions.JMP:
            counter = value;
            break;
        case instructions.JC:
            if (carryFlag) {
                counter = value;
            }
            break;
        case instructions.JZ:
            if (zeroFlag) {
                counter = value;
            }
            break;
        case instructions.OUT:
            console.log('OUT ', aRegister);
            break;
        case instructions.HLT:
            console.log('HLT');
            halted = true;
            break;
        default:
            //throw new Error('Unknown instruction: ' + instruction);
            console.log('uknown instruction: ' + instruction)
    }
}
