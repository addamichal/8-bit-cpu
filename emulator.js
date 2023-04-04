// instructions
// 0000 - nop
// 0001 - lda
// 0010 - add
// 0011 - sub
// 0100 - sta
// 0101 - ldi
// 0110 - jmp
// 0111 - jc
// 1000 - jz
// 1110 - out
// 1111 - hlt

// opcodes

let counter = 0;
let aRegister = 0;
let bRegister = 0;
let sumRegister = 0;
let carryFlag = 0;
let zeroFlag = 0;

let ram = [];

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
ram[11] = 0x70; // to loop
// ram[11] = 0x7d;
ram[12] = 0x63;
ram[13] = 0xf0;
ram[14] = 0x00;
ram[15] = 0x00;

for (let i = 0; i < 200; i++) {
    //console.log('counter: ', counter);
    
    let bus = ram[counter];
    let instruction = bus >> 4;

    counter++;

    if (counter > ram.length - 1) {
        counter = 0;
    }

    let value = bus & 15;
    // console.log(instruction, value);

    //console.log('bus: ', bus);
    //console.log('aRegister: ', aRegister);
    //console.log('bRegister: ', bRegister);
    //console.log('');

    if (instruction == 1) {
        aRegister = ram[value];
    }

    if (instruction == 2) {
        bRegister = ram[value];
        sumRegister = aRegister + bRegister;

        if (sumRegister >= 255) {
            sumRegister -= 256;
            carryFlag = 1;
        } else {
            carryFlag = 0;
        }

        zeroFlag = sumRegister == 0;
        aRegister = sumRegister;
    }

    if (instruction == 3) {
        bRegister = ram[value];
        sumRegister = aRegister - bRegister;

        if (sumRegister < 0) {
            sumRegister += 256;
            carryFlag = 1;
        } else {
            carryFlag = 0;
        }

        zeroFlag = sumRegister == 0;
        aRegister = sumRegister;
    }

    if (instruction == 4) {
        ram[value] = aRegister;
    }

    if (instruction == 5) {
        let val = bus & 15;
        aRegister = val;
    }

    if (instruction == 6) {
        counter = value;
    }

    if (instruction == 7 && carryFlag) {
        counter = value;
    }

    if (instruction == 8 && zeroFlag) {
        counter = value;
    }

    if (instruction == 14) {
        console.log('OUT ', aRegister);
    }

    if (instruction == 15) {
        console.log('HLT');
        break;
    }
}
